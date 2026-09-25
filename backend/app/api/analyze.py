import io
import re
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.requirement import RequirementRequest, PDFExtractResponse
from app.schemas.recommendation import AnalysisResponse
from app.services.recommendation_engine import get_recommendation_engine

router = APIRouter(prefix="/api", tags=["Analyze"])

MAX_PDF_SIZE = 10 * 1024 * 1024  # 10 MB limit


@router.post("/extract-pdf", response_model=PDFExtractResponse)
async def extract_pdf(file: UploadFile = File(...)):
    """
    Extracts selectable natural-language procurement requirements from an uploaded PDF.
    Validates file type, size, and integrity.
    Returns clear guidance if the document is scanned/image-only.
    """
    filename = file.filename or "uploaded.pdf"
    if not filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only PDF documents (.pdf) are supported.",
        )

    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read uploaded file: {str(e)}")

    if not content:
        raise HTTPException(status_code=400, detail="The uploaded PDF file is empty.")

    if len(content) > MAX_PDF_SIZE:
        raise HTTPException(
            status_code=400,
            detail="PDF file size exceeds the maximum limit of 10 MB.",
        )

    # Validate PDF magic header
    if not content.startswith(b"%PDF"):
        raise HTTPException(
            status_code=400,
            detail="Invalid or corrupted PDF file. The document does not have a valid PDF header.",
        )

    try:
        from pypdf import PdfReader
        from pypdf.errors import PdfReadError

        pdf_stream = io.BytesIO(content)
        reader = PdfReader(pdf_stream)

        if reader.is_encrypted:
            try:
                decrypted = reader.decrypt("")
                if decrypted == 0:
                    raise HTTPException(
                        status_code=400,
                        detail="The uploaded PDF is password-protected. Please provide an unencrypted document.",
                    )
            except Exception:
                raise HTTPException(
                    status_code=400,
                    detail="The uploaded PDF is password-protected. Please provide an unencrypted document.",
                )

        pages_count = len(reader.pages)
        if pages_count == 0:
            raise HTTPException(
                status_code=400,
                detail="This PDF contains no pages.",
            )

        extracted_pages = []
        for page_idx, page in enumerate(reader.pages):
            try:
                text = page.extract_text() or ""
                if text.strip():
                    extracted_pages.append(text.strip())
            except Exception:
                # Continue extracting remaining pages if a single page has font extraction quirks
                continue

        full_text = "\n\n".join(extracted_pages).strip()
        # Normalize redundant blank lines
        full_text = re.sub(r"\n{3,}", "\n\n", full_text)

        if not full_text:
            raise HTTPException(
                status_code=400,
                detail="This PDF contains no selectable text. Please upload a text-based PDF or paste the requirement manually.",
            )

        return PDFExtractResponse(
            text=full_text,
            filename=filename,
            pages_count=pages_count,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Unable to process PDF: {str(e)}. Please ensure the file is a valid, uncorrupted PDF document.",
        )


@router.post("/analyze", response_model=AnalysisResponse)
def analyze_requirement(
    payload: RequirementRequest,
    db: Session = Depends(get_db),
):
    text = payload.requirement.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Requirement text cannot be empty.")

    engine = get_recommendation_engine()
    try:
        response = engine.analyze(db, text, provider=payload.llm_provider)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

