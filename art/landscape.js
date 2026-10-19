// Generates assets/img/landscape-phase-moa.svg — illustrative Phase × MoA landscape slide (home "Our Approach").
// Run: osascript -l JavaScript art/landscape.js "$PWD"
ObjC.import('Foundation');

function run(argv) {
  const root = argv[0];
  const C = { navy: '#0D2746', navy2: '#12355E', teal: '#0E8A93', azure: '#2F6DB5', gold: '#D4912B',
    ink: '#1B2A3A', muted: '#5B6B7C', line: '#DCE3EA', card: '#F3F6F9', tan: '#FBF3E6' };
  const SANS = 'Inter, -apple-system, BlinkMacSystemFont, Helvetica Neue, Arial, sans-serif';
  const SERIF = 'Georgia, Times New Roman, serif';
  const mod = {
    mab: { label: 'Monoclonal Ab', color: C.navy },
    bsp: { label: 'Bispecific', color: C.azure },
    adc: { label: 'ADC', color: C.teal },
    sm: { label: 'Small molecule', color: '#7A8CA3' },
    cell: { label: 'Cell therapy', color: '#7B5EA7' },
  };
  const phases = ['Preclinical', 'Phase I', 'Phase II', 'Phase III', 'Approved'];
  // Illustrative counts only — not real pipeline data.
  const rows = [
    { moa: 'PD-1 / PD-L1 inhibitor', m: 'mab', n: [6, 9, 14, 18, 12] },
    { moa: 'CD3 × TAA T-cell engager', m: 'bsp', n: [22, 17, 9, 3, 2] },
    { moa: 'TROP2 ADC', m: 'adc', n: [8, 7, 6, 4, 2] },
    { moa: 'HER2 ADC', m: 'adc', n: [10, 8, 5, 4, 3] },
    { moa: 'Target X ADC', m: 'adc', n: [9, 6, 3, 0, 0], gap: 3 },
    { moa: 'KRAS G12C / pan-KRAS', m: 'sm', n: [16, 12, 7, 4, 2] },
    { moa: 'Solid-tumour CAR-T / TCR-T', m: 'cell', n: [19, 11, 3, 1, 1] },
  ];
  const W = 1200, H = 900, X0 = 300, CW = 172, Y0 = 196, RH = 74;
  const cx = i => X0 + CW * i + CW / 2;
  const cy = j => Y0 + RH * j + RH / 2;
  const r = n => 7 + 5.6 * Math.sqrt(n);
  const o = [];
  const t = (x, y, s, a) => o.push(`<text x="${x}" y="${y}" ${a}>${s}</text>`);

  o.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="${SANS}">`);
  o.push(`<rect width="${W}" height="${H}" fill="#fff"/>`);

  // Title bar
  o.push(`<rect width="${W}" height="112" fill="${C.navy}"/>`);
  o.push(`<rect y="112" width="${W}" height="4" fill="${C.gold}"/>`);
  t(40, 48, 'COMPETITIVE LANDSCAPE', `font-size="15" font-weight="700" letter-spacing="3" fill="#7FD3D9"`);
  t(40, 88, 'Solid Tumours: Phase × Mechanism of Action', `font-family="${SERIF}" font-size="33" font-weight="700" fill="#fff"`);
  o.push(`<rect x="1030" y="40" width="130" height="32" rx="16" fill="none" stroke="#ffffff" stroke-opacity=".45"/>`);
  t(1095, 61, 'Illustrative', `font-size="14" fill="#fff" text-anchor="middle"`);

  // Phase chevrons
  const fills = ['#E3ECF5', '#C5D6EA', '#8FB0D6', C.azure, C.navy];
  phases.forEach((p, i) => {
    const a = X0 + CW * i + 2, b = a + 154;
    o.push(`<polygon points="${a},140 ${b},140 ${b + 14},162 ${b},184 ${a},184 ${a + 14},162" fill="${fills[i]}"/>`);
    t(cx(i) + 7, 168, p, `font-size="16" font-weight="600" text-anchor="middle" fill="${i < 3 ? C.navy : '#fff'}"`);
  });
  t(40, 168, 'MECHANISM', `font-size="13" font-weight="700" letter-spacing="2" fill="${C.muted}"`);

  // Rows
  rows.forEach((row, j) => {
    if (j % 2 === 0) o.push(`<rect x="28" y="${Y0 + RH * j + 2}" width="1144" height="${RH - 4}" rx="6" fill="${C.card}"/>`);
    o.push(`<circle cx="46" cy="${cy(j) - 9}" r="6" fill="${mod[row.m].color}"/>`);
    t(60, cy(j) - 3, row.moa, `font-size="17" font-weight="700" fill="${C.navy}"`);
    t(60, cy(j) + 19, mod[row.m].label, `font-size="14" fill="${C.muted}"`);
  });
  for (let i = 1; i < 5; i++) {
    o.push(`<line x1="${X0 + CW * i}" y1="${Y0}" x2="${X0 + CW * i}" y2="${Y0 + RH * rows.length}" stroke="${C.line}" stroke-dasharray="3 5"/>`);
  }
  rows.forEach((row, j) => row.n.forEach((n, i) => {
    if (i === row.gap) {
      o.push(`<circle cx="${cx(i)}" cy="${cy(j)}" r="29" fill="${C.tan}" stroke="${C.gold}" stroke-width="2.5" stroke-dasharray="6 5"/>`);
      t(cx(i), cy(j) + 5, 'GAP', `font-size="14" font-weight="700" letter-spacing="1.5" fill="${C.gold}" text-anchor="middle"`);
      return;
    }
    if (!n) { t(cx(i), cy(j) + 5, '–', `font-size="16" fill="#B8C4D0" text-anchor="middle"`); return; }
    const rr = r(n);
    o.push(`<circle cx="${cx(i)}" cy="${cy(j)}" r="${rr.toFixed(1)}" fill="${mod[row.m].color}" fill-opacity=".92"/>`);
    t(cx(i), cy(j) + (rr < 17 ? 4.5 : 5.5), n, `font-size="${rr < 17 ? 13 : 15}" font-weight="700" fill="#fff" text-anchor="middle"`);
  }));

  // Legend
  const LY = Y0 + RH * rows.length + 22;
  o.push(`<line x1="28" y1="${LY}" x2="1172" y2="${LY}" stroke="${C.line}"/>`);
  t(40, LY + 36, 'MODALITY', `font-size="13" font-weight="700" letter-spacing="2" fill="${C.muted}"`);
  let x = 40;
  Object.keys(mod).forEach(k => {
    const w = { mab: 110, bsp: 82, adc: 32, sm: 116, cell: 96 }[k];
    o.push(`<circle cx="${x + 6}" cy="${LY + 62}" r="6" fill="${mod[k].color}"/>`);
    t(x + 18, LY + 67, mod[k].label, `font-size="15" fill="${C.ink}"`);
    x += 18 + w + 22;
  });
  t(40, LY + 124, 'Bubble size = number of assets', `font-size="15" fill="${C.ink}"`);
  [[1, 300], [5, 340], [15, 392]].forEach(([n, bx]) => {
    o.push(`<circle cx="${bx}" cy="${LY + 119}" r="${r(n).toFixed(1)}" fill="none" stroke="${C.muted}" stroke-width="1.5"/>`);
  });

  // So-what callout, linked to the gap
  const gx = cx(3), gy = cy(4);
  o.push(`<path d="M ${gx + 29} ${gy + 10} C ${gx + 110} ${gy + 60}, ${gx + 110} ${LY - 40}, ${gx + 70} ${LY + 22}" fill="none" stroke="${C.gold}" stroke-width="2"/>`);
  o.push(`<rect x="770" y="${LY + 22}" width="402" height="124" rx="8" fill="${C.tan}"/>`);
  o.push(`<rect x="770" y="${LY + 22}" width="6" height="124" rx="3" fill="${C.gold}"/>`);
  t(796, LY + 52, 'SO WHAT', `font-size="13" font-weight="700" letter-spacing="2" fill="${C.gold}"`);
  t(796, LY + 84, 'No Target X ADC in Phase III yet:', `font-size="17" font-weight="700" fill="${C.navy}"`);
  t(796, LY + 110, 'a first-mover window to in-license', `font-size="16" fill="${C.ink}"`);
  t(796, LY + 132, 'a late Phase II asset.', `font-size="16" fill="${C.ink}"`);

  o.push('</svg>');
  const out = root + '/assets/img/landscape-phase-moa.svg';
  $.NSString.alloc.initWithUTF8String(o.join('\n')).writeToFileAtomicallyEncodingError(out, true, $.NSUTF8StringEncoding, null);
  return out;
}
