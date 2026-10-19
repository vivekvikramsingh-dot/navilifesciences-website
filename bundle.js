// Bundle the built site (docs/) into ONE self-contained, shareable HTML file.
// Usage: osascript -l JavaScript bundle.js "$PWD" "<output.html>"
// All pages become in-file sections (switched by #hash); images, CSS and JS are inlined.
ObjC.import('Foundation');

const PAGES = ['index', 'advisory', 'clinical-trials-intelligence', 'ai-life-sciences', 'engage', 'about', 'insights', 'contact'];

function read(p) { return ObjC.unwrap($.NSString.stringWithContentsOfFileEncodingError(p, $.NSUTF8StringEncoding, null)); }
function write(p, s) { $(s).writeToFileAtomicallyEncodingError(p, true, $.NSUTF8StringEncoding, null); }
function dataUri(p) {
  const ext = p.split('.').pop().toLowerCase();
  const mime = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', svg: 'image/svg+xml', webp: 'image/webp' }[ext];
  const b64 = ObjC.unwrap($.NSData.dataWithContentsOfFile(p).base64EncodedStringWithOptions(0));
  return `data:${mime};base64,${b64}`;
}

function run(argv) {
  const ROOT = argv[0], DOCS = ROOT + '/docs', OUT = argv[1];
  const cache = {};
  const img = rel => (cache[rel] = cache[rel] || dataUri(DOCS + '/assets/img/' + rel));

  let css = read(DOCS + '/assets/css/site.css').replace(/url\("\.\.\/img\/([^"]+)"\)/g, (m, f) => `url("${img(f)}")`);
  css += `
.page { display: none; } .page.on { display: block; }
.share-note { background: #FBF3E6; color: #5B6B7C; font-size: .8rem; text-align: center; padding: 6px 16px; }`;
  const js = read(DOCS + '/assets/js/site.js');

  const index = read(DOCS + '/index.html');
  const headTop = index.slice(0, index.indexOf('<link rel="stylesheet"'));
  const schema = (index.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/) || [''])[0];
  const bodyTag = index.match(/<body[^>]*>/)[0];
  const header = index.slice(index.indexOf(bodyTag) + bodyTag.length, index.indexOf('<main id="main">'));
  const footer = index.slice(index.indexOf('</main>') + 7, index.indexOf('<script src='));

  const sections = PAGES.map(p => {
    const html = read(DOCS + '/' + p + '.html');
    const main = html.slice(html.indexOf('<main id="main">') + 16, html.indexOf('</main>'));
    const title = (html.match(/<title>([^<]*)<\/title>/) || [, ''])[1];
    return `<div class="page" id="page-${p}" data-title="${title}">${main}</div>`;
  }).join('\n');

  const fix = s => s
    .replace(/(src|href)="assets\/img\/([^"]+)"/g, (m, a, f) => `${a}="${img(f)}"`)
    .replace(/href="([a-z0-9-]+)\.html(#[a-z0-9-]+)?"/g, (m, p, h) => `href="#${h ? h.slice(1) : 'page-' + p}"`)
    .replace(/href="\/"/g, 'href="#page-index"');

  const router = `
(function () {
  var pages = [].slice.call(document.querySelectorAll('.page'));
  var map = { index: 'home', advisory: 'advisory', 'clinical-trials-intelligence': 'cti', 'ai-life-sciences': 'ai', engage: 'engage', about: 'about', insights: 'insights', contact: 'contact' };
  function show() {
    var h = (location.hash || '#page-index').slice(1), target = document.getElementById(h), page;
    if (!target) { target = document.getElementById('page-index'); h = 'page-index'; }
    page = target.classList.contains('page') ? target : target.closest('.page');
    pages.forEach(function (p) { p.classList.toggle('on', p === page); });
    document.title = page.getAttribute('data-title');
    var key = map[page.id.replace('page-', '')];
    document.querySelectorAll('.nav a.l').forEach(function (a) {
      var href = a.getAttribute('href').replace('#page-', '');
      var cap = a.parentNode.classList.contains('has-sub') && ['advisory', 'cti', 'ai'].indexOf(key) >= 0;
      a.classList.toggle('active', cap || (map[href] === key && !a.parentNode.classList.contains('has-sub')));
    });
    var menu = document.querySelector('.nav ul'); if (menu) menu.classList.remove('open');
    if (target === page) window.scrollTo(0, 0); else target.scrollIntoView();
  }
  window.addEventListener('hashchange', show); show();
})();`;

  const out = `${fix(headTop)}<style>${css}</style>
${schema}
</head>
<body class="pg-bundle">
<div class="share-note">Preview of www.navilifesciences.com &middot; Navi Lifesciences Advisory Limited</div>
${fix(header)}<main id="main">
${fix(sections)}
</main>
${fix(footer)}<script>${js}
${router}</script>
</body>
</html>
`;
  write(OUT, out);
  return 'Wrote ' + OUT + ' (' + Math.round(out.length / 1024) + ' KB, ' + Object.keys(cache).length + ' images inlined)';
}
