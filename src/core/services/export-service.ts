/**
 * EXPORT SERVICE
 * ===============
 * Generates PDF and Excel exports for proposals.
 */

import { ProposalSummary, CalculatedLine, formatCurrency, formatNumber } from './calculation-service';

interface ProposalData {
    customer: string;
    month: string;
    lines: CalculatedLine[];
    summary: ProposalSummary;
    createdBy: string;
    createdAt: Date;
}

/**
 * Generate HTML template for PDF export
 */
export function generateProposalHTML(data: ProposalData): string {
    const lines = data.lines.filter(l => l.volumeCaixas > 0);

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; color: #333; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #00A857; }
    .logo { font-size: 28px; font-weight: bold; color: #00A857; }
    .proposal-info { text-align: right; color: #666; }
    .proposal-title { font-size: 24px; color: #333; margin-bottom: 20px; }
    .customer-box { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .customer-name { font-size: 20px; font-weight: bold; color: #00A857; }
    .customer-details { color: #666; margin-top: 8px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { background: #00A857; color: white; padding: 12px; text-align: left; font-size: 12px; }
    td { padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 11px; }
    tr:nth-child(even) { background: #f9f9f9; }
    .number { text-align: right; font-family: monospace; }
    .summary-box { background: linear-gradient(135deg, #00A857 0%, #006633 100%); color: white; padding: 25px; border-radius: 8px; }
    .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    .summary-item { text-align: center; }
    .summary-value { font-size: 24px; font-weight: bold; }
    .summary-label { font-size: 11px; opacity: 0.8; margin-top: 4px; }
    .footer { margin-top: 40px; text-align: center; color: #999; font-size: 10px; }
    .signature-box { margin-top: 60px; display: flex; justify-content: space-between; }
    .signature-line { width: 200px; border-top: 1px solid #333; padding-top: 8px; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">⭐ HEINEKEN</div>
    <div class="proposal-info">
      <div>Proposta Comercial</div>
      <div style="font-size: 12px;">${data.month}</div>
    </div>
  </div>

  <div class="customer-box">
    <div class="customer-name">${data.customer}</div>
    <div class="customer-details">
      Gerado em: ${data.createdAt.toLocaleDateString('pt-BR')} às ${data.createdAt.toLocaleTimeString('pt-BR')}<br>
      Responsável: ${data.createdBy}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Produto</th>
        <th class="number">Volume (Cxs)</th>
        <th class="number">Volume (HL)</th>
        <th class="number">Preço Promo</th>
        <th class="number">Desconto %</th>
        <th class="number">Investimento</th>
      </tr>
    </thead>
    <tbody>
      ${lines.map(line => `
        <tr>
          <td>${line.sku}</td>
          <td class="number">${line.volumeCaixas.toLocaleString('pt-BR')}</td>
          <td class="number">${formatNumber(line.volumeHL, 2)}</td>
          <td class="number">${formatCurrency(line.promoPrice)}</td>
          <td class="number">${formatNumber(line.discount, 1)}%</td>
          <td class="number"><strong>${formatCurrency(line.investmentGenerated)}</strong></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="summary-box">
    <div class="summary-grid">
      <div class="summary-item">
        <div class="summary-value">${data.summary.totalCaixas.toLocaleString('pt-BR')}</div>
        <div class="summary-label">CAIXAS TOTAIS</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${formatNumber(data.summary.totalHL, 2)}</div>
        <div class="summary-label">HECTOLITROS</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${formatCurrency(data.summary.totalInvestment)}</div>
        <div class="summary-label">INVESTIMENTO TOTAL</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${formatNumber(data.summary.totalPallets, 1)}</div>
        <div class="summary-label">PALETES</div>
      </div>
    </div>
  </div>

  <div class="signature-box">
    <div class="signature-line">Vendedor</div>
    <div class="signature-line">Cliente</div>
  </div>

  <div class="footer">
    Documento gerado automaticamente pelo Heineken OS • Este documento não tem valor fiscal
  </div>
</body>
</html>
  `;
}

/**
 * Generate CSV for Excel export
 */
export function generateProposalCSV(data: ProposalData): string {
    const lines = data.lines.filter(l => l.volumeCaixas > 0);

    const headers = [
        'Cliente',
        'Mês',
        'SKU',
        'Volume (Caixas)',
        'Volume (HL)',
        'Preço Lista',
        'Preço Promo',
        'Desconto %',
        'Investimento (R$)',
        'Margem %',
        'Paletes'
    ];

    const rows = lines.map(line => [
        data.customer,
        data.month,
        line.sku,
        line.volumeCaixas,
        line.volumeHL,
        '', // Price list not in CalculatedLine
        line.promoPrice,
        line.discount,
        line.investmentGenerated,
        line.margin,
        line.pallets
    ]);

    // Add totals row
    rows.push([
        'TOTAIS',
        '',
        '',
        data.summary.totalCaixas,
        data.summary.totalHL,
        '',
        '',
        data.summary.avgDiscount,
        data.summary.totalInvestment,
        data.summary.avgMargin,
        data.summary.totalPallets
    ]);

    const csvContent = [
        headers.join(';'),
        ...rows.map(row => row.join(';'))
    ].join('\n');

    return csvContent;
}

/**
 * Trigger download of a file
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Export proposal as PDF (HTML that can be printed as PDF)
 */
export function exportProposalPDF(data: ProposalData) {
    const html = generateProposalHTML(data);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
    }
}

/**
 * Export proposal as CSV/Excel
 */
export function exportProposalExcel(data: ProposalData) {
    const csv = generateProposalCSV(data);
    const filename = `proposta_${data.customer.replace(/\s/g, '_')}_${data.month.replace(/\s/g, '_')}.csv`;
    downloadFile(csv, filename, 'text/csv;charset=utf-8;');
}
