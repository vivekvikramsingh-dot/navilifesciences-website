// Build navilifesciences.com: wraps each src/*.html body in the shared layout -> docs/ (served by GitHub Pages)
// Usage (macOS, no installs needed):  osascript -l JavaScript build.js "$PWD"
// Each src file starts with a meta line:
// <!--meta {"title": "...", "desc": "...", "nav": "home"} -->
ObjC.import('Foundation');

const DOMAIN = 'https://www.navilifesciences.com';
const EMAIL = 'vivek.singh@navilifesciences.com';
const PHONE = '+971 52 107 9931', TEL = '+971521079931';
const LINKEDIN = 'https://www.linkedin.com/in/dr-vivek-vikram-singh/';

const NAV = [
  ['home', 'index.html', 'Home'],
  ['capabilities', null, 'Capabilities'],
  ['engage', 'engage.html', 'How We Engage'],
  ['about', 'about.html', 'About'],
  ['insights', 'insights.html', 'Insights'],
];
const CAPS = [
  ['advisory.html', 'CI &amp; BD Advisory', 'Competitive intelligence, BD &amp; GTM'],
  ['clinical-trials-intelligence.html', 'Clinical Trials Intelligence', 'Decision-grade trial analytics platform'],
  ['ai-life-sciences.html', 'AI &times; Life Sciences', 'Pilot-ready AI use cases for the GCC'],
];
const CAP_NAVS = ['advisory', 'cti', 'ai'];

const ICON = {
  MAIL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  PHONE: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
  PIN: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  WA: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.5A8.4 8.4 0 1 1 21 11.5z"/></svg>',
  LI: '<svg viewBox="0 0 24 24"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9z"/></svg>',
};

const ORBITS = `<svg class="orbits" viewBox="0 0 760 760" aria-hidden="true">
  <circle cx="380" cy="380" r="370" stroke="#0E8A93"/><circle cx="380" cy="380" r="290" stroke="#D4912B" stroke-dasharray="3 9"/>
  <circle cx="380" cy="380" r="210" stroke="#0E8A93"/><circle cx="380" cy="380" r="130" stroke="#D4912B"/>
  <circle cx="730" cy="260" r="7" fill="#D4912B" stroke="none"/><circle cx="160" cy="590" r="5" fill="#0E8A93" stroke="none"/>
  <circle cx="545" cy="170" r="5" fill="#F2C477" stroke="none"/><circle cx="380" cy="510" r="6" fill="#7FD3D9" stroke="none"/>
</svg>`;

const SCHEMA = `<script type="application/ld+json">
{"@context":"https://schema.org","@type":"ProfessionalService","name":"Navi Lifesciences Advisory Limited",
"alternateName":"Navi Lifesciences","url":"${DOMAIN}/","logo":"${DOMAIN}/assets/img/navi-logo.png","image":"${DOMAIN}/assets/img/og-image.jpg",
"description":"Life sciences advisory: competitive intelligence, business development, go-to-market, clinical trials intelligence and AI for pharma, biotech, health systems and AI companies in the GCC and beyond.",
"email":"${EMAIL}","telephone":"${PHONE}","areaServed":["United Arab Emirates","Saudi Arabia","GCC","Global"],
"address":{"@type":"PostalAddress","streetAddress":"FD, First Floor, Incubator Building, Masdar City","addressLocality":"Abu Dhabi","addressCountry":"AE"},
"founder":{"@type":"Person","name":"Dr. Vivek Vikram Singh","jobTitle":"Founder & Managing Director","sameAs":["${LINKEDIN}"]},
"slogan":"Where Science Meets Strategy, Where Innovation Finds Its Market"}
</script>`;

function head(m, url, ver, schema, navitems) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${m.title}</title>
<meta name="description" content="${m.desc}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Navi Lifesciences Advisory">
<meta property="og:title" content="${m.title}">
<meta property="og:description" content="${m.desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${DOMAIN}/assets/img/og-image.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0D2746">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/site.css?v=${ver}">
${schema}
</head>
<body class="pg-{pg}">
<a class="skip" href="#main">Skip to content</a>
<div class="topbar"></div>
<header class="site">
  <div class="wrap nav">
    <a class="brand" href="index.html" aria-label="Navi Lifesciences home"><img src="assets/img/navi-logo.png" alt="Navi Lifesciences" width="112" height="60"></a>
    <button class="menu-toggle" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
    <ul>
${navitems}
      <li><a class="btn" href="contact.html">Contact Us</a></li>
    </ul>
  </div>
</header>
<main id="main">
`;
}

function foot(ver) {
  return `</main>
<footer class="site">
  <div class="wrap">
    <div class="fgrid">
      <div>
        <div class="flogo"><img src="assets/img/navi-logo.png" alt="Navi Lifesciences" width="120" height="64"></div>
        <p class="ftag">Where Science Meets Strategy,<br>Where Innovation Finds Its Market.</p>
        <p>Navi Lifesciences Advisory Limited<br>Licence MC 14498 &middot; Masdar City Free Zone</p>
        <div class="social"><a href="${LINKEDIN}" target="_blank" rel="noopener" aria-label="LinkedIn">${ICON.LI}</a></div>
      </div>
      <div>
        <h4>Capabilities</h4>
        <ul>
          <li><a href="advisory.html">CI &amp; BD Advisory</a></li>
          <li><a href="clinical-trials-intelligence.html">Clinical Trials Intelligence</a></li>
          <li><a href="ai-life-sciences.html">AI &times; Life Sciences</a></li>
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="about.html">About the Founder</a></li>
          <li><a href="engage.html">How We Engage</a></li>
          <li><a href="insights.html">Insights</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4>Get in Touch</h4>
        <ul>
          <li><a href="mailto:${EMAIL}">${EMAIL}</a></li>
          <li><a href="tel:${TEL}">${PHONE}</a></li>
          <li>FD, First Floor, Incubator Building,<br>Masdar City, Abu Dhabi, UAE</li>
        </ul>
      </div>
    </div>
    <div class="fbottom">
      <span>&copy; <span id="year">2026</span> Navi Lifesciences Advisory Limited. All rights reserved.</span>
      <span>Navigating Advanced Ventures &amp; Innovation</span>
    </div>
  </div>
</footer>
<script src="assets/js/site.js?v=${ver}"></script>
</body>
</html>
`;
}

function navHtml(active) {
  return NAV.map(([key, href, label]) => {
    if (key === 'capabilities') {
      const cls = CAP_NAVS.indexOf(active) >= 0 ? 'l active' : 'l';
      const subs = CAPS.map(([h, t, d]) => `          <a href="${h}">${t}<small>${d}</small></a>`).join('\n');
      return `      <li class="has-sub"><a class="${cls}" href="advisory.html">Capabilities &#9662;</a>\n        <div class="sub">\n${subs}\n        </div></li>`;
    }
    return `      <li><a class="${key === active ? 'l active' : 'l'}" href="${href}">${label}</a></li>`;
  }).join('\n');
}

const fm = $.NSFileManager.defaultManager;
function read(p) { return ObjC.unwrap($.NSString.stringWithContentsOfFileEncodingError(p, $.NSUTF8StringEncoding, null)); }
function write(p, s) { $(s).writeToFileAtomicallyEncodingError(p, true, $.NSUTF8StringEncoding, null); }
function ls(d) { return ObjC.deepUnwrap(fm.contentsOfDirectoryAtPathError(d, null)) || []; }
function exists(p) { return fm.fileExistsAtPath(p); }
function copy(a, b) { fm.copyItemAtPathToPathError(a, b, null); }

function run(argv) {
  const ROOT = argv[0], SRC = ROOT + '/src', OUT = ROOT + '/docs';
  if (exists(OUT)) fm.removeItemAtPathError(OUT, null);
  fm.createDirectoryAtPathWithIntermediateDirectoriesAttributesError(OUT, true, $(), null);
  copy(ROOT + '/assets', OUT + '/assets');
  const ver = String(Math.floor(Date.now() / 1000));
  const pages = [];
  ls(SRC).filter(f => /\.html$/.test(f)).sort().forEach(name => {
    const raw = read(SRC + '/' + name);
    const m = raw.match(/^<!--meta (\{[\s\S]*?\}) -->\n/);
    if (!m) throw new Error('Missing meta line in ' + name);
    const meta = JSON.parse(m[1]);
    let body = raw.slice(m[0].length)
      .split('{{ORBITS}}').join(ORBITS).split('{{EMAIL}}').join(EMAIL).split('{{PHONE}}').join(PHONE)
      .split('{{TEL}}').join(TEL).split('{{LINKEDIN}}').join(LINKEDIN);
    Object.keys(ICON).forEach(k => { body = body.split('{{ICON_' + k + '}}').join(ICON[k]); });
    const url = name === 'index.html' ? DOMAIN + '/' : DOMAIN + '/' + name;
    let page = head(meta, url, ver, name === 'index.html' ? SCHEMA : '', navHtml(meta.nav || '')).replace('{pg}', name.replace('.html', '')) + body + foot(ver);
    if (name === '404.html') page = page.replace('<head>\n', '<head>\n<base href="/">\n');
    write(OUT + '/' + name, page);
    if (name !== '404.html') pages.push(url);
  });
  ['CNAME', 'robots.txt', '.nojekyll'].forEach(f => { if (exists(ROOT + '/' + f)) copy(ROOT + '/' + f, OUT + '/' + f); });
  const sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    .concat(pages.map(u => `  <url><loc>${u}</loc></url>`), ['</urlset>']);
  write(OUT + '/sitemap.xml', sm.join('\n') + '\n');
  return 'Built ' + (pages.length + 1) + ' pages -> ' + OUT;
}
