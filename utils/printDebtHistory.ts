// Printable debt-payment reports for the Fournisseurs / Clients screens.
// Renders a standalone document in a popup and sends it straight to print.

export interface PrintablePayment {
  id: string;
  date: string;
  amount: number;
  methodLabel: string;
  details?: string;
  note?: string;
}

export interface PrintSummaryRow {
  label: string;
  value: number;
}

interface PrintOptions {
  title: string;
  partyLabel: string;
  partyName: string;
  partyPhone?: string;
  partyAddress?: string;
  summary: PrintSummaryRow[];
  payments: PrintablePayment[];
  language?: 'fr' | 'ar';
}

const esc = (v: any) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const money = (n: number) => `${(Number(n) || 0).toLocaleString('fr-FR')} DZD`;

const fmtDate = (d: string) => {
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? '—' : dt.toLocaleDateString('fr-FR');
};

const BASE_STYLE = `
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Inter, system-ui, -apple-system, Roboto, Arial, sans-serif; color:#0f172a; margin:0; padding:32px 36px; }
  .head { display:flex; align-items:center; gap:18px; padding-bottom:18px; border-bottom:2px solid #0f172a; }
  .logo { width:70px; height:70px; border-radius:50%; overflow:hidden; background:#f1f5f9; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .logo img { width:100%; height:100%; object-fit:cover; }
  .brand { font-weight:800; font-size:21px; letter-spacing:-0.02em; }
  .slogan { color:#b45309; font-weight:700; letter-spacing:2px; font-size:11px; text-transform:uppercase; }
  .muted { color:#64748b; font-weight:600; font-size:11px; }
  .doc-title { margin:22px 0 4px; font-size:17px; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; }
  .doc-sub { color:#64748b; font-size:11px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; }
  .party { margin-top:18px; display:flex; justify-content:space-between; gap:24px; padding:14px 16px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; }
  .party .label { font-size:9px; font-weight:800; letter-spacing:0.12em; text-transform:uppercase; color:#94a3b8; }
  .party .value { font-size:14px; font-weight:800; margin-top:3px; }
  .cards { display:flex; gap:12px; margin-top:16px; }
  .card { flex:1; border:1px solid #e2e8f0; border-radius:10px; padding:12px 14px; }
  .card .label { font-size:9px; font-weight:800; letter-spacing:0.12em; text-transform:uppercase; color:#94a3b8; }
  .card .value { font-size:16px; font-weight:900; margin-top:5px; }
  table { width:100%; border-collapse:collapse; margin-top:20px; }
  th { background:#0f172a; color:#fff; text-align:left; padding:9px 10px; font-size:10px; font-weight:800; letter-spacing:0.08em; text-transform:uppercase; }
  td { padding:9px 10px; border-bottom:1px solid #e2e8f0; font-size:12px; }
  tbody tr:nth-child(even) { background:#f8fafc; }
  .right { text-align:right; }
  tfoot td { font-weight:900; font-size:13px; border-top:2px solid #0f172a; border-bottom:none; padding-top:12px; }
  .empty { padding:36px 0; text-align:center; color:#94a3b8; font-weight:700; font-size:12px; text-transform:uppercase; letter-spacing:0.1em; }
  .sign { margin-top:44px; display:flex; justify-content:space-between; gap:40px; }
  .sign div { flex:1; border-top:1px solid #cbd5e1; padding-top:6px; font-size:10px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.08em; }
  .foot { margin-top:26px; text-align:center; color:#94a3b8; font-size:10px; font-weight:700; }
  @media print { body { padding:0 } @page { margin:14mm } }
`;

const storeHeader = (settings: any) => {
  const logo = settings?.logo || '';
  return `
  <div class="head">
    <div class="logo">${logo ? `<img src="${esc(logo)}" />` : ''}</div>
    <div style="flex:1">
      <div class="brand">${esc(settings?.storeName || 'Bijouterie')}</div>
      <div class="slogan">${esc(settings?.slogan || '')}</div>
      <div class="muted" style="margin-top:6px">${esc(settings?.address || '')}</div>
      <div class="muted">${settings?.phone ? 'Tél: ' + esc(settings.phone) : ''}${settings?.contact ? ' • ' + esc(settings.contact) : ''}</div>
    </div>
    <div style="text-align:right">
      <div class="muted">Imprimé le</div>
      <div style="font-weight:800;font-size:12px">${new Date().toLocaleString('fr-FR')}</div>
    </div>
  </div>`;
};

const openAndPrint = (html: string) => {
  const w = window.open('', '_blank', 'width=900,height=1000');
  if (!w) {
    alert("Impossible d'ouvrir la fenêtre d'impression. Autorisez les pop-ups pour ce site.");
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
  setTimeout(() => { w.focus(); w.print(); }, 350);
};

/** Full payment history for one supplier or client. */
export function printDebtHistory(settings: any, opts: PrintOptions) {
  const rows = opts.payments.length
    ? opts.payments.map((p, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${fmtDate(p.date)}</td>
        <td>${esc(p.methodLabel)}</td>
        <td>${esc(p.details || '—')}</td>
        <td>${esc(p.note || '—')}</td>
        <td class="right" style="font-weight:800">${money(p.amount)}</td>
      </tr>`).join('')
    : `<tr><td colspan="6"><div class="empty">Aucun paiement enregistré</div></td></tr>`;

  const totalPaid = opts.payments.reduce((a, b) => a + (Number(b.amount) || 0), 0);

  const cards = opts.summary.map(sr => `
    <div class="card">
      <div class="label">${esc(sr.label)}</div>
      <div class="value">${money(sr.value)}</div>
    </div>`).join('');

  const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8" /><title>${esc(opts.title)} — ${esc(opts.partyName)}</title>
<style>${BASE_STYLE}</style></head>
<body>
  ${storeHeader(settings)}
  <div class="doc-title">${esc(opts.title)}</div>
  <div class="doc-sub">Historique des paiements de dettes</div>

  <div class="party">
    <div>
      <div class="label">${esc(opts.partyLabel)}</div>
      <div class="value">${esc(opts.partyName)}</div>
    </div>
    <div>
      <div class="label">Téléphone</div>
      <div class="value">${esc(opts.partyPhone || '—')}</div>
    </div>
    <div style="flex:1">
      <div class="label">Adresse</div>
      <div class="value" style="font-weight:600;font-size:12px">${esc(opts.partyAddress || '—')}</div>
    </div>
    <div>
      <div class="label">Paiements</div>
      <div class="value">${opts.payments.length}</div>
    </div>
  </div>

  <div class="cards">${cards}</div>

  <table>
    <thead>
      <tr><th style="width:34px">#</th><th style="width:88px">Date</th><th style="width:110px">Méthode</th><th>Détails</th><th>Note</th><th class="right" style="width:130px">Montant</th></tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr><td colspan="5" class="right">Total des paiements</td><td class="right">${money(totalPaid)}</td></tr>
    </tfoot>
  </table>

  <div class="sign">
    <div>Signature du responsable</div>
    <div style="text-align:right">Cachet</div>
  </div>
  <div class="foot">Document généré automatiquement — ${esc(settings?.storeName || 'Bijouterie')}</div>
</body></html>`;

  openAndPrint(html);
}

/** Single-payment receipt. */
export function printDebtReceipt(settings: any, opts: {
  partyLabel: string;
  partyName: string;
  partyPhone?: string;
  payment: PrintablePayment;
  remainingAfter?: number;
}) {
  const p = opts.payment;
  const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8" /><title>Reçu de paiement — ${esc(opts.partyName)}</title>
<style>${BASE_STYLE}</style></head>
<body>
  ${storeHeader(settings)}
  <div class="doc-title">Reçu de paiement de dette</div>
  <div class="doc-sub">Réf: ${esc(p.id)}</div>

  <div class="party">
    <div><div class="label">${esc(opts.partyLabel)}</div><div class="value">${esc(opts.partyName)}</div></div>
    <div><div class="label">Téléphone</div><div class="value">${esc(opts.partyPhone || '—')}</div></div>
    <div><div class="label">Date</div><div class="value">${fmtDate(p.date)}</div></div>
  </div>

  <table>
    <thead><tr><th>Désignation</th><th class="right" style="width:180px">Valeur</th></tr></thead>
    <tbody>
      <tr><td>Méthode de paiement</td><td class="right" style="font-weight:800">${esc(p.methodLabel)}</td></tr>
      ${p.details ? `<tr><td>Détails</td><td class="right">${esc(p.details)}</td></tr>` : ''}
      ${p.note ? `<tr><td>Note</td><td class="right">${esc(p.note)}</td></tr>` : ''}
      ${opts.remainingAfter !== undefined ? `<tr><td>Reste après paiement</td><td class="right" style="font-weight:800">${money(opts.remainingAfter)}</td></tr>` : ''}
    </tbody>
    <tfoot><tr><td class="right">Montant réglé</td><td class="right">${money(p.amount)}</td></tr></tfoot>
  </table>

  <div class="sign">
    <div>Signature du bénéficiaire</div>
    <div style="text-align:right">Cachet de la maison</div>
  </div>
  <div class="foot">Merci pour votre confiance — ${esc(settings?.storeName || 'Bijouterie')}</div>
</body></html>`;

  openAndPrint(html);
}

export default printDebtHistory;
