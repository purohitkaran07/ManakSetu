import { jsPDF } from 'jspdf';
import { AnalysisResponse } from '../types';

/**
 * Generates an institutional, government-styled PDF report of the ManakSetu analysis results.
 * Completely client-side generation using jsPDF without external API calls or latency.
 */
export const generateAnalysisPDF = (data: AnalysisResponse): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let currentY = 15;

  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 20) {
      doc.addPage();
      currentY = 15;
      drawHeaderRunning();
    }
  };

  const drawHeaderRunning = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('MANAKSETU • AI Standards Decision Support System', margin, 10);
    doc.text(`Ref ID: ${data.id.slice(0, 8)}`, pageWidth - margin, 10, { align: 'right' });
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, 12, pageWidth - margin, 12);
  };

  // 1. Top Decorative Government Color Strips (Saffron, White, Green)
  doc.setFillColor(255, 153, 51); // Saffron
  doc.rect(margin, currentY, contentWidth / 3, 2, 'F');
  doc.setFillColor(241, 245, 249); // Neutral Light
  doc.rect(margin + contentWidth / 3, currentY, contentWidth / 3, 2, 'F');
  doc.setFillColor(19, 136, 8); // India Green
  doc.rect(margin + (contentWidth * 2) / 3, currentY, contentWidth / 3, 2, 'F');
  currentY += 5;

  // 2. Main Title Banner
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(11, 25, 44); // Deep Navy (#0B192C)
  doc.text('MANAKSETU (मानकसेतु)', margin, currentY + 5);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(0, 103, 197); // Institutional Blue (#0067C5)
  doc.text('From Requirement to the Right Standard', margin, currentY + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Government / BIS-Oriented AI Standards Decision Support Prototype', margin, currentY + 15);

  // Metadata Box on Top Right
  const dateStr = new Date(data.created_at || Date.now()).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(`Report ID: ${data.id.slice(0, 13)}`, pageWidth - margin, currentY + 5, { align: 'right' });
  doc.text(`Analysis Date: ${dateStr}`, pageWidth - margin, currentY + 10, { align: 'right' });
  doc.text(`Decision Model: 384-d MiniLM`, pageWidth - margin, currentY + 15, { align: 'right' });

  currentY += 21;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 6;

  // 3. Input Requirement Section
  checkPageBreak(30);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(11, 25, 44);
  doc.text('1. INPUT PROCUREMENT REQUIREMENT', margin + 4, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  const wrappedReq = doc.splitTextToSize(data.original_requirement, contentWidth - 8);
  doc.text(wrappedReq, margin + 4, currentY + 11);
  currentY += 28;

  // 4. Requirement Summary Entity Breakdown
  checkPageBreak(40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(11, 25, 44);
  doc.text('2. EXTRACTED REQUIREMENT SUMMARY', margin, currentY);
  currentY += 4;

  const req = data.structured_requirement || {};
  const specsStr =
    req.specifications && Object.keys(req.specifications).length > 0
      ? Object.entries(req.specifications)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ')
      : 'None detected';

  const summaryItems = [
    ['Product:', req.product || 'Not explicitly named'],
    ['Product Category:', req.product_category || 'General / Unclassified'],
    ['Quantity:', req.quantity ? `${req.quantity} units` : 'Not specified'],
    ['Application Domain:', req.application || 'Not specified'],
    ['Installation Type:', req.installation || 'Not specified'],
    ['Procurement Context:', req.procurement_context || 'Standard Public Procurement'],
    ['Technical Specifications:', specsStr],
  ];

  doc.setFontSize(8.5);
  summaryItems.forEach(([label, value]) => {
    checkPageBreak(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(label, margin + 2, currentY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    const wrappedVal = doc.splitTextToSize(value, contentWidth - 55);
    doc.text(wrappedVal, margin + 50, currentY);
    currentY += Math.max(wrappedVal.length * 4, 5);
  });
  currentY += 4;

  // 5. Version Alerts (if present)
  if (data.version_alerts && data.version_alerts.length > 0) {
    checkPageBreak(25);
    doc.setFillColor(254, 243, 199); // Amber-100
    doc.setDrawColor(245, 158, 11); // Amber-500
    doc.roundedRect(margin, currentY, contentWidth, 20, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(146, 64, 14); // Amber-800
    doc.text('3. REGULATORY / VERSION DEPRECATION ALERT', margin + 4, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    data.version_alerts.forEach((alert) => {
      const alertMsg = doc.splitTextToSize(
        `• ${alert.explicit_standard} is superseded by ${alert.superseding_standard}. ${alert.message}`,
        contentWidth - 8
      );
      doc.text(alertMsg, margin + 4, currentY + 11);
    });
    currentY += 25;
  }

  // 6. Recommended Indian Standards
  checkPageBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(11, 25, 44);
  doc.text(`3. RECOMMENDED INDIAN STANDARDS (${data.recommendations.length})`, margin, currentY);
  currentY += 5;

  if (data.recommendations.length === 0) {
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, currentY, contentWidth, 14, 2, 2, 'F');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'No applicable standards matched the input requirement within the current knowledge slice.',
      margin + 4,
      currentY + 8
    );
    currentY += 18;
  } else {
    data.recommendations.forEach((item, idx) => {
      checkPageBreak(45);
      const std = item.standard;

      // Card Container
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(margin, currentY, contentWidth, 38, 2, 2, 'D');

      // Top bar inside card
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin, currentY, contentWidth, 7, 2, 2, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(0, 103, 197);
      doc.text(`#${idx + 1}  ${std.standard_number}`, margin + 3, currentY + 5);

      const statusBadge = `[${std.status.toUpperCase()} • ${item.confidence.toUpperCase()} CONFIDENCE • RELEVANCE: ${(item.relevance * 100).toFixed(1)}%]`;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 118, 110); // Teal
      doc.text(statusBadge, pageWidth - margin - 3, currentY + 5, { align: 'right' });

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      const wrappedTitle = doc.splitTextToSize(std.title, contentWidth - 6);
      doc.text(wrappedTitle, margin + 3, currentY + 12);

      // Certification & Classification
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text(
        `Classification: ${std.classification || 'Electrical'}  |  Scheme: ${item.certification_status || std.certification_status || 'BIS Standard'}`,
        margin + 3,
        currentY + 18
      );

      // Evidence & Reason
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);
      const evidenceLines = item.evidence && item.evidence.length > 0
        ? `Evidence: ${item.evidence.join('; ')}`
        : `Rationale: ${item.reason}`;
      const wrappedEvidence = doc.splitTextToSize(evidenceLines, contentWidth - 6);
      doc.text(wrappedEvidence, margin + 3, currentY + 23);

      currentY += 42;
    });
  }

  // 7. Candidate / Normative Standards (if any)
  if (data.candidate_standards && data.candidate_standards.length > 0) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`4. NORMATIVELY REFERENCED & CANDIDATE STANDARDS (${data.candidate_standards.length})`, margin, currentY);
    currentY += 4;

    data.candidate_standards.forEach((cand) => {
      checkPageBreak(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(`• ${cand.standard.standard_number}`, margin + 2, currentY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      const shortTitle = doc.splitTextToSize(`- ${cand.standard.title}`, contentWidth - 50);
      doc.text(shortTitle, margin + 45, currentY);
      currentY += Math.max(shortTitle.length * 3.5, 5);
    });
    currentY += 4;
  }

  // 8. Official Verification Disclaimer Notice
  checkPageBreak(25);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 18, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('OFFICIAL BIS VERIFICATION NOTICE & DISCLAIMER', margin + 3, currentY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  const disclaimerText = doc.splitTextToSize(
    'Recommendations are provided as an AI-assisted decision-support reference and should be verified against the latest applicable Bureau of Indian Standards (BIS) publications, gazette notifications, and Quality Control Orders (QCOs). ManakSetu is an AI decision-support prototype and does not issue legal compliance certificates.',
    contentWidth - 6
  );
  doc.text(disclaimerText, margin + 3, currentY + 9);
  currentY += 22;

  // 9. Footers on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.text('ManakSetu • Government / BIS-oriented AI recommendation prototype', margin, pageHeight - 8);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  // Download the generated PDF
  const filename = `ManakSetu-Report-${data.id.slice(0, 8)}.pdf`;
  doc.save(filename);
};
