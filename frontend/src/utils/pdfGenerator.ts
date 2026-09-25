import { jsPDF } from 'jspdf';
import { AnalysisResponse } from '../types';

/**
 * Generates an institutional, government-styled PDF report of ManakSetu analysis results.
 * Fully client-side generation using jsPDF with safe Latin-1 / standard Helvetica fonts.
 * Uses dynamic cursor tracking to prevent awkward page splits and large blank gaps.
 */
export const generateAnalysisPDF = (data: AnalysisResponse): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182 mm
  const maxY = pageHeight - 18; // 279 mm (above footer)

  let currentY = 12;

  // Helper: Sanitize string to safe ASCII to avoid any font encoding corruption in jsPDF
  const cleanText = (str: string | undefined | null): string => {
    if (!str) return '';
    return str
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2013\u2014]/g, '-')
      .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, '-')
      .replace(/[\u0900-\u097F]/g, '') // Strip Devanagari Unicode to prevent garbage chars in standard Helvetica
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Helper: Add page and draw running header
  const addReportPage = () => {
    doc.addPage();
    currentY = 18;
    drawRunningHeader();
  };

  // Helper: Draw running header on page 2+
  const drawRunningHeader = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('MANAKSETU | AI Standards Decision Support System', margin, 10);
    doc.text(`Ref ID: ${data.id.slice(0, 8)}`, pageWidth - margin, 10, { align: 'right' });
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, 12, pageWidth - margin, 12);
  };

  // Helper: Check space and add page if needed
  const ensureSpace = (neededHeight: number) => {
    if (currentY + neededHeight > maxY) {
      addReportPage();
    }
  };

  // ==========================================
  // PAGE 1: HEADER & INSTITUTIONAL BRANDING
  // ==========================================

  // 1. Top Decorative Government Color Strips (Saffron, White, Green)
  doc.setFillColor(255, 153, 51); // India Saffron
  doc.rect(margin, currentY, contentWidth / 3, 2.5, 'F');
  doc.setFillColor(241, 245, 249); // Neutral Light
  doc.rect(margin + contentWidth / 3, currentY, contentWidth / 3, 2.5, 'F');
  doc.setFillColor(19, 136, 8); // India Green
  doc.rect(margin + (contentWidth * 2) / 3, currentY, contentWidth / 3, 2.5, 'F');
  currentY += 6;

  // 2. Main Title Banner
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(11, 25, 44); // Deep Navy (#0B192C)
  doc.text('MANAKSETU', margin, currentY + 4);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9.5);
  doc.setTextColor(0, 103, 197); // Institutional Blue (#0067C5)
  doc.text('From Requirement to the Right Standard', margin, currentY + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('AI Standards Decision Support System | Technical Recommendation Report', margin, currentY + 14);

  // Metadata Block (Top Right)
  const dateStr = new Date(data.created_at || Date.now()).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`Report ID: ${data.id.slice(0, 13)}`, pageWidth - margin, currentY + 4, { align: 'right' });
  doc.text(`Analysis Date: ${dateStr}`, pageWidth - margin, currentY + 8.5, { align: 'right' });
  doc.text('Decision Engine: 384-d MiniLM (L2-Norm)', pageWidth - margin, currentY + 13, { align: 'right' });

  currentY += 19;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 5;

  // ==========================================
  // SECTION 1: INPUT PROCUREMENT REQUIREMENT
  // ==========================================
  const reqTextClean = cleanText(data.original_requirement);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const wrappedReq = doc.splitTextToSize(reqTextClean, contentWidth - 8);
  const reqBoxHeight = Math.max(wrappedReq.length * 4 + 9, 16);

  ensureSpace(reqBoxHeight + 8);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, reqBoxHeight, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(11, 25, 44);
  doc.text('1. INPUT PROCUREMENT REQUIREMENT', margin + 4, currentY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text(wrappedReq, margin + 4, currentY + 9.5);
  currentY += reqBoxHeight + 5;

  // ==========================================
  // SECTION 2: EXTRACTED REQUIREMENT SUMMARY
  // ==========================================
  const req = data.structured_requirement || {};
  const specsObj = req.specifications || {};
  const specsStr = Object.keys(specsObj).length > 0
    ? Object.entries(specsObj).map(([k, v]) => `${k}: ${v}`).join(', ')
    : 'None detected';

  const summaryGrid = [
    { label: 'Product:', val: cleanText(req.product) || 'Not specified' },
    { label: 'Category:', val: cleanText(req.product_category) || 'General / Unclassified' },
    { label: 'Quantity:', val: req.quantity ? `${req.quantity} units` : 'Not specified' },
    { label: 'Application:', val: cleanText(req.application) || 'Not specified' },
    { label: 'Installation:', val: cleanText(req.installation) || 'Not specified' },
    { label: 'Procurement Context:', val: cleanText(req.procurement_context) || 'Public Procurement' },
  ];

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(11, 25, 44);
  doc.text('2. EXTRACTED REQUIREMENT SUMMARY', margin, currentY + 3);
  currentY += 5;

  // Two-column grid container
  const colWidth = (contentWidth - 4) / 2;
  const gridHeight = 25;
  ensureSpace(gridHeight + 10);

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, gridHeight, 1.5, 1.5, 'D');

  doc.setFontSize(7.5);
  for (let i = 0; i < summaryGrid.length; i++) {
    const item = summaryGrid[i];
    const isRightCol = i % 2 === 1;
    const rowIdx = Math.floor(i / 2);
    const itemX = margin + (isRightCol ? colWidth + 4 : 4);
    const itemY = currentY + 4.5 + rowIdx * 5.2;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(item.label, itemX, itemY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(cleanText(item.val), itemX + 32, itemY);
  }

  // Specifications row at the bottom of the grid
  const specsY = currentY + 20.5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Specifications:', margin + 4, specsY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  const wrappedSpecs = doc.splitTextToSize(cleanText(specsStr), contentWidth - 42);
  doc.text(wrappedSpecs[0] || 'None detected', margin + 36, specsY);

  currentY += gridHeight + 6;

  // ==========================================
  // SECTION 3: VERSION / REGULATORY ALERTS
  // ==========================================
  if (data.version_alerts && data.version_alerts.length > 0) {
    const alert = data.version_alerts[0];
    const alertMsg = cleanText(
      `Citation ${alert.explicit_standard} is superseded by active edition ${alert.superseding_standard}. ${alert.message}`
    );
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    const wrappedAlert = doc.splitTextToSize(alertMsg, contentWidth - 10);
    const alertHeight = wrappedAlert.length * 3.8 + 8;

    ensureSpace(alertHeight + 4);

    doc.setFillColor(254, 243, 199); // Amber-100
    doc.setDrawColor(245, 158, 11); // Amber-500
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, currentY, contentWidth, alertHeight, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(146, 64, 14); // Amber-800
    doc.text('! REGULATORY / VERSION DEPRECATION ALERT', margin + 4, currentY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 53, 15);
    doc.text(wrappedAlert, margin + 4, currentY + 8.5);

    currentY += alertHeight + 5;
  }

  // ==========================================
  // SECTION 4: RECOMMENDED INDIAN STANDARDS
  // ==========================================
  const recCount = data.recommendations ? data.recommendations.length : 0;
  ensureSpace(12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(11, 25, 44);
  doc.text(`3. RECOMMENDED INDIAN STANDARDS (${recCount})`, margin, currentY + 2);
  currentY += 5;

  if (recCount === 0) {
    ensureSpace(16);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, currentY, contentWidth, 14, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'No applicable standards matched the input requirement within the current knowledge slice.',
      margin + 4,
      currentY + 8
    );
    currentY += 18;
  } else {
    data.recommendations.forEach((item, idx) => {
      const std = item.standard;
      const stdNum = cleanText(std.standard_number);
      const title = cleanText(std.title);
      const classification = cleanText(std.classification) || 'Electrical & Electronics';
      const scheme = cleanText(item.certification_status || std.certification_status) || 'BIS Standard';
      const status = cleanText(std.status).toUpperCase() || 'ACTIVE';
      const confidence = (item.confidence || 'High').toUpperCase();
      const relevancePct = (item.relevance * 100).toFixed(1);

      // Pre-calculate wrapped lines to determine exact card height
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      const wrappedTitle = doc.splitTextToSize(title, contentWidth - 8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      const evidenceLines = item.evidence && item.evidence.length > 0
        ? item.evidence.map((ev) => `- ${cleanText(ev)}`)
        : [`- Direct technical alignment: ${cleanText(item.reason)}`];
      
      const allWrappedEvidence: string[] = [];
      evidenceLines.forEach((line) => {
        const split = doc.splitTextToSize(line, contentWidth - 12);
        allWrappedEvidence.push(...split);
      });

      // Card Height calculation
      // Top bar: 6mm
      // Title: wrappedTitle.length * 3.8mm
      // Metadata (class / scheme): 4.5mm
      // Evidence header: 4mm
      // Evidence lines: allWrappedEvidence.length * 3.4mm
      // Padding bottom: 4mm
      const cardHeight =
        6 +
        wrappedTitle.length * 3.8 +
        4.5 +
        4 +
        allWrappedEvidence.length * 3.4 +
        4;

      // Ensure the ENTIRE card fits on the page; if not, move whole card to next page
      ensureSpace(cardHeight + 4);

      // Draw Card Container
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.35);
      doc.roundedRect(margin, currentY, contentWidth, cardHeight, 1.5, 1.5, 'D');

      // Top Header Strip inside card
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin, currentY, contentWidth, 6, 1.5, 1.5, 'F');
      // Overwrite bottom rounded corners of strip
      doc.rect(margin, currentY + 3, contentWidth, 3, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(0, 103, 197);
      doc.text(`#${idx + 1}  ${stdNum}`, margin + 3.5, currentY + 4.2);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(15, 118, 110); // Teal
      const badgeText = `[ ${status} | ${confidence} CONFIDENCE | RELEVANCE: ${relevancePct}% ]`;
      doc.text(badgeText, pageWidth - margin - 3.5, currentY + 4.2, { align: 'right' });

      let cardCursorY = currentY + 9.5;

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(wrappedTitle, margin + 3.5, cardCursorY);
      cardCursorY += wrappedTitle.length * 3.8;

      // Classification & Scheme
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.setTextColor(71, 85, 105);
      doc.text(`Classification: ${classification}  |  Certification: ${scheme}`, margin + 3.5, cardCursorY);
      cardCursorY += 4.5;

      // Evidence Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text('Evidence & Technical Grounds:', margin + 3.5, cardCursorY);
      cardCursorY += 3.5;

      // Evidence Bullets
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.setTextColor(30, 41, 59);
      doc.text(allWrappedEvidence, margin + 5, cardCursorY);

      currentY += cardHeight + 4;
    });
  }

  // ==========================================
  // SECTION 5: CANDIDATE & NORMATIVE STANDARDS
  // ==========================================
  if (data.candidate_standards && data.candidate_standards.length > 0) {
    const candHeight = data.candidate_standards.length * 4.5 + 8;
    ensureSpace(Math.min(candHeight, 35));

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`4. NORMATIVELY REFERENCED & CANDIDATE STANDARDS (${data.candidate_standards.length})`, margin, currentY + 2);
    currentY += 5;

    data.candidate_standards.forEach((cand) => {
      ensureSpace(6);
      const cStd = cand.standard;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`- ${cleanText(cStd.standard_number)}`, margin + 2, currentY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      const cTitle = cleanText(cStd.title);
      const wrappedCTitle = doc.splitTextToSize(cTitle, contentWidth - 45);
      doc.text(wrappedCTitle[0] || '', margin + 42, currentY);
      currentY += 4.5;
    });
    currentY += 3;
  }

  // ==========================================
  // SECTION 6: OFFICIAL BIS VERIFICATION NOTICE
  // ==========================================
  const disclaimerText =
    'DISCLAIMER: Recommendations are provided as an AI-assisted decision-support reference and must be verified against current official publications, amendments, and Quality Control Orders (QCOs) issued by the Bureau of Indian Standards (BIS) and relevant ministries. ManakSetu is an AI decision-support prototype and does not issue legal compliance certificates or official certifications.';

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  const wrappedDisclaimer = doc.splitTextToSize(disclaimerText, contentWidth - 8);
  const discBoxHeight = wrappedDisclaimer.length * 3.2 + 8;

  ensureSpace(discBoxHeight + 4);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, discBoxHeight, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('OFFICIAL BIS VERIFICATION NOTICE & DISCLAIMER', margin + 4, currentY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text(wrappedDisclaimer, margin + 4, currentY + 8);
  currentY += discBoxHeight + 4;

  // ==========================================
  // RUNNING FOOTERS (ALL PAGES)
  // ==========================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);
    doc.text('MANAKSETU | Government / BIS-oriented AI recommendation prototype', margin, pageHeight - 7);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  }

  // Save the PDF with standardized filename
  const filename = `ManakSetu-Report-${data.id.slice(0, 8)}.pdf`;
  doc.save(filename);
};
