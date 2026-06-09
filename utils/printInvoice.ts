export function printInvoice(settings: any, invoice: any, opts: { type?: string, title?: string } = {}) {
  const title = opts.title || (opts.type === 'command' ? 'Bon de Commande' : 'Facture');
  const logo = settings?.logo || '';
  const storeName = settings?.storeName || 'Bijouterie';
  const slogan = settings?.slogan || '';
  const address = settings?.address || '';
  const phone = settings?.phone || '';
  const contact = settings?.contact || '';

  const items = invoice?.items || [];
  const total = invoice?.total ?? items.reduce((a: number, b: any) => a + (b.totalPrice || 0), 0);
  const amountPaid = invoice?.amountPaid ?? invoice?.paidAmount ?? 0;
  const remaining = invoice?.remaining ?? Math.max(0, total - amountPaid);

  const style = `
    body{font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#0f172a}
    .header{display:flex;align-items:center;gap:16px;margin-bottom:18px}
    .logo{width:72px;height:72px;border-radius:50%;overflow:hidden;background:#f8fafc;display:flex;align-items:center;justify-content:center}
    .brand{font-weight:800;font-size:20px}
    .slogan{color:#b91c1c;font-weight:700;letter-spacing:2px;font-size:12px}
    table{width:100%;border-collapse:collapse;margin-top:12px}
    th{background:#f8fafc;text-align:left;padding:10px;font-size:12px;color:#64748b}
    td{padding:10px;border-bottom:1px solid #f1f5f9}
    .totals{margin-top:12px;display:flex;justify-content:flex-end;gap:18px;flex-direction:column}
    .big{font-size:20px;font-weight:800}
    .muted{color:#64748b;font-weight:700;font-size:12px}
    @media print { body { -webkit-print-color-adjust: exact } }
  `;

  const itemsHtml = items.map((it: any, idx: number) => `
    <tr>
      <td>${(it.shape || it.typeName || '')}</td>
      <td style="text-align:right">${(it.weight ?? '')} ${it.weight ? 'g' : ''}</td>
      <td style="text-align:right">${(it.pricePerGram ?? '').toLocaleString ? (it.pricePerGram).toLocaleString() : (it.pricePerGram ?? '')}</td>
      <td style="text-align:right">${(it.totalPrice ?? '').toLocaleString ? (it.totalPrice).toLocaleString() : (it.totalPrice ?? '')} DZD</td>
    </tr>
  `).join('');

  const html = `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${title}</title>
      <style>${style}</style>
    </head>
    <body>
      <div class="header">
        <div class="logo">${logo ? `<img src="${logo}" style="width:100%;height:100%;object-fit:cover"/>` : ''}</div>
        <div>
          <div class="brand">${storeName}</div>
          <div class="slogan">${slogan}</div>
          <div style="margin-top:8px" class="muted">${address}</div>
          <div class="muted">Tél: ${phone} • ${contact}</div>
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;margin-top:8px">
        <div>
          <div style="font-weight:700">Facturé à</div>
          <div>${invoice?.clientName || invoice?.clientName || 'Client'}</div>
          <div class="muted">${invoice?.clientPhone || ''}</div>
        </div>
        <div style="text-align:right">
          <div class="muted">Date</div>
          <div style="font-weight:800">${new Date(invoice?.date || Date.now()).toLocaleString()}</div>
          <div class="muted">Réf: ${invoice?.id || ''}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr><th>Article</th><th style="text-align:right">Poids</th><th style="text-align:right">Prix/g</th><th style="text-align:right">Total</th></tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div class="totals">
        <div style="display:flex;justify-content:space-between"><div class="muted">Montant Payé</div><div class="big">${(amountPaid || 0).toLocaleString()} DZD</div></div>
        <div style="display:flex;justify-content:space-between"><div class="muted">Reste</div><div class="big">${(remaining || 0).toLocaleString()} DZD</div></div>
        <div style="display:flex;justify-content:space-between"><div class="muted">Total</div><div class="big">${(total || 0).toLocaleString()} DZD</div></div>
      </div>

      <div style="margin-top:28px;text-align:center;color:#94a3b8;font-weight:800">Merci pour votre confiance</div>
    </body>
  </html>
  `;

  const w = window.open('', '_blank', 'width=800,height=900');
  if (!w) return;
  w.document.open();
  w.document.write(html);
  w.document.close();
  setTimeout(() => { w.focus(); w.print(); /* w.close(); */ }, 300);
}

export default printInvoice;
