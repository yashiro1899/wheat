var Git = require('git-fs'),
    Data = require('./data'),
    Tools = require('./tools'),
    Buffer = require('buffer').Buffer,
    Crypto = require('crypto'),
    ChildProcess = require('child_process'),
    Step = require('step');
    QueryString = require('querystring');

var CodeMirror = require('../../../codemirror/addon/runmode/runmode.node.js');
    require('./loadmode.js')(CodeMirror);

var getMime = (function(defaultMime) {
  var types = {
    "3gp": "video/3gpp",
    a: "application/octet-stream",
    ai: "application/postscript",
    aif: "audio/x-aiff",
    aiff: "audio/x-aiff",
    asc: "application/pgp-signature",
    asf: "video/x-ms-asf",
    asm: "text/x-asm",
    asx: "video/x-ms-asf",
    atom: "application/atom+xml",
    au: "audio/basic",
    avi: "video/x-msvideo",
    bat: "application/x-msdownload",
    bin: "application/octet-stream",
    bmp: "image/bmp",
    bz2: "application/x-bzip2",
    c: "text/x-csrc",
    cab: "application/vnd.ms-cab-compressed",
    can: "application/candor",
    cc: "text/x-c++src",
    chm: "application/vnd.ms-htmlhelp",
    "class": "application/octet-stream",
    com: "application/x-msdownload",
    conf: "text/plain",
    cpp: "text/x-c",
    crt: "application/x-x509-ca-cert",
    css: "text/css",
    csv: "text/csv",
    cxx: "text/x-c",
    deb: "application/x-debian-package",
    der: "application/x-x509-ca-cert",
    diff: "text/x-diff",
    djv: "image/vnd.djvu",
    djvu: "image/vnd.djvu",
    dll: "application/x-msdownload",
    dmg: "application/octet-stream",
    doc: "application/msword",
    dot: "application/msword",
    dtd: "application/xml-dtd",
    dvi: "application/x-dvi",
    ear: "application/java-archive",
    eml: "message/rfc822",
    eps: "application/postscript",
    exe: "application/x-msdownload",
    f: "text/x-fortran",
    f77: "text/x-fortran",
    f90: "text/x-fortran",
    flv: "video/x-flv",
    "for": "text/x-fortran",
    gem: "application/octet-stream",
    gemspec: "text/x-ruby",
    gif: "image/gif",
    gyp: "text/x-python",
    gypi: "text/x-python",
    gz: "application/x-gzip",
    h: "text/x-chdr",
    hh: "text/x-c++hdr",
    htm: "text/html",
    html: "text/html",
    ico: "image/vnd.microsoft.icon",
    ics: "text/calendar",
    ifb: "text/calendar",
    iso: "application/octet-stream",
    jar: "application/java-archive",
    java: "text/x-java",
    jnlp: "application/x-java-jnlp-file",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    js: "text/javascript",
    json: "application/json",
    lisp: "text/x-common-lisp",
    less: "text/css",
    log: "text/plain",
    lua: "text/x-lua",
    luac: "application/x-bytecode.lua",
    makefile: "text/x-makefile",
    m3u: "audio/x-mpegurl",
    m4v: "video/mp4",
    man: "text/troff",
    manifest: "text/cache-manifest",
    markdown: "text/x-markdown",
    mathml: "application/mathml+xml",
    mbox: "application/mbox",
    mdoc: "text/troff",
    md: "text/x-markdown",
    me: "text/troff",
    mid: "audio/midi",
    midi: "audio/midi",
    mime: "message/rfc822",
    mml: "application/mathml+xml",
    mng: "video/x-mng",
    mov: "video/quicktime",
    mp3: "audio/mpeg",
    mp4: "video/mp4",
    mp4v: "video/mp4",
    mpeg: "video/mpeg",
    mpg: "video/mpeg",
    ms: "text/troff",
    msi: "application/x-msdownload",
    odp: "application/vnd.oasis.opendocument.presentation",
    ods: "application/vnd.oasis.opendocument.spreadsheet",
    odt: "application/vnd.oasis.opendocument.text",
    ogg: "application/ogg",
    p: "text/x-pascal",
    pas: "text/x-pascal",
    pbm: "image/x-portable-bitmap",
    pdf: "application/pdf",
    pem: "application/x-x509-ca-cert",
    pgm: "image/x-portable-graymap",
    pgp: "application/pgp-encrypted",
    php: "application/x-httpd-php",
    pkg: "application/octet-stream",
    pl: "text/x-perl",
    pm: "text/x-perl-module",
    png: "image/png",
    pnm: "image/x-portable-anymap",
    ppm: "image/x-portable-pixmap",
    pps: "application/vnd.ms-powerpoint",
    ppt: "application/vnd.ms-powerpoint",
    ps: "application/postscript",
    psd: "image/vnd.adobe.photoshop",
    py: "text/x-python",
    qt: "video/quicktime",
    ra: "audio/x-pn-realaudio",
    rake: "text/x-ruby",
    ram: "audio/x-pn-realaudio",
    rar: "application/x-rar-compressed",
    rb: "text/x-ruby",
    rdf: "application/rdf+xml",
    roff: "text/troff",
    rpm: "application/x-redhat-package-manager",
    rss: "application/rss+xml",
    rtf: "application/rtf",
    ru: "text/x-ruby",
    s: "text/x-asm",
    sgm: "text/sgml",
    sgml: "text/sgml",
    sh: "text/x-sh",
    sig: "application/pgp-signature",
    snd: "audio/basic",
    so: "application/octet-stream",
    sql: "text/x-sql",
    svg: "image/svg+xml",
    svgz: "image/svg+xml",
    swf: "application/x-shockwave-flash",
    t: "text/troff",
    tar: "application/x-tar",
    tbz: "application/x-bzip-compressed-tar",
    tci: "application/x-topcloud",
    tcl: "application/x-tcl",
    tex: "application/x-tex",
    texi: "application/x-texinfo",
    texinfo: "application/x-texinfo",
    text: "text/plain",
    tif: "image/tiff",
    tiff: "image/tiff",
    torrent: "application/x-bittorrent",
    tr: "text/troff",
    ttf: "application/x-font-ttf",
    txt: "text/plain",
    vcf: "text/x-vcard",
    vcs: "text/x-vcalendar",
    vrml: "model/vrml",
    war: "application/java-archive",
    wav: "audio/x-wav",
    webapp: "application/x-web-app-manifest+json",
    webm: "video/webm",
    wma: "audio/x-ms-wma",
    wmv: "video/x-ms-wmv",
    wmx: "video/x-ms-wmx",
    wrl: "model/vrml",
    wsdl: "application/wsdl+xml",
    xbm: "image/x-xbitmap",
    xhtml: "application/xhtml+xml",
    xls: "application/vnd.ms-excel",
    xml: "application/xml",
    xpm: "image/x-xpixmap",
    xsl: "application/xml",
    xslt: "application/xslt+xml",
    yaml: "text/yaml",
    yml: "text/yaml",
    zip: "application/zip"
  };
  return function getMime(path) {
    path = path.toLowerCase().trim();
    var index = path.lastIndexOf("/");
    if (index >= 0) {
      path = path.substr(index + 1);
    }
    index = path.lastIndexOf(".");
    if (index >= 0) {
      path = path.substr(index + 1);
    }
    return types[path] || defaultMime;
  };
})('application/octet-string');

function encode4html(str) {
  return str.replace(/[\W]/g, function(c) {
    return '&#' + c.charCodeAt(0) + ';';
  });
}

// Execute a child process, feed it a buffer and get a new buffer filtered.
function execPipe(command, args, data, callback) {
  var child = ChildProcess.spawn(command, args);
  var stdout = [], stderr = [], size = 0;
  child.stdout.on('data', function onStdout(buffer) {
    size += buffer.length;
    stdout[stdout.length] = buffer;
  });
  child.stderr.on('data', function onStderr(buffer) {
    stderr[stderr.length] = buffer;
  });
  child.on('error', function onExit(err) {
    callback(err);
  });
  var exitCode;
  child.on('exit', function onExit(code) {
    exitCode = code;
  });
  child.on('close', function () {
    if (exitCode > 0) {
      callback(new Error(stderr.join("")));
    } else {
      var buffer = new Buffer(size);
      var start = 0;
      for (var i = 0, l = stdout.length; i < l; i++) {
        var chunk = stdout[i];
        chunk.copy(buffer, start);
        start += chunk.length;
      }
      callback(null, buffer);
    }
  });
  if (typeof data === 'string') {
    child.stdin.write(data, "binary");
  } else {
    child.stdin.write(data);
  }
  child.stdin.end();
}

// This writes proper headers for caching and conditional gets
// Also gzips content if it's text based and stable.
function postProcess(headers, buffer, version, path, callback) {
  Step(
    function buildHeaders() {
      if (!headers["Content-Type"]) {
        headers["Content-Type"] = "text/html; charset=utf-8";
      }
      var date = new Date().toUTCString();
      headers["Date"] = date;
      headers["Server"] = "Wheat (node.js)";
      if (version === 'fs') {
        delete headers["Cache-Control"];
      } else {
        var hash = Crypto.createHash('md5')
        hash.update(version + ":" + path + ":" + date)
        headers["ETag"] = hash.digest('hex');
      }

      headers["Content-Length"] = buffer.length;

      return {
        headers: headers,
        buffer: buffer
      };
    },
    callback
  );
}

function insertSnippets(markdown, snippets, theme, callback) {
  Step(
    function () {
      Tools.compileTemplate('snippet', this);
    },
    function (err, snippetTemplate) {
      if (err) { callback(err); return; }
      snippets.forEach(function (snippet) {
        var mime = getMime(snippet.base);
        var col = 0,
            accum = [];
        var html;

        CodeMirror.runMode(snippet.code, mime, function(text, style) {
          if (text == "\n") {
            accum.push("<br>");
            col = 0;
            return;
          }
          var escaped = "";
          // HTML-escape and replace tabs
          for (var pos = 0;;) {
            var idx = text.indexOf("\t", pos);
            if (idx == -1) {
              escaped += encode4html(text.slice(pos));
              col += text.length - pos;
              break;
            } else {
              col += idx - pos;
              escaped += encode4html(text.slice(pos, idx));
              var size = 4 - col % 4;
              col += size;
              for (var i = 0; i < size; ++i) escaped += " ";
              pos = idx + 1;
            }
          }

          if (style) accum.push("<span class=\"cm-" + encode4html(style) + "\">" + escaped + "</span>");
          else accum.push(escaped);
        });

        theme = theme || 'default';
        snippet.code = "<code class=\"cm-s-" + theme + " CodeMirror\">" + accum.join("") + "</code>";
        html = snippetTemplate({
          snippet: snippet
        });
        markdown = markdown.replace(snippet.original, html);
      });
      return markdown;
    },
    callback
  )
}

var Renderers = module.exports = {
  index: Git.safe(function index(version, callback) {
    Step(
      function getHead() {
        Git.getHead(this);
      },
      function loadData(err, head) {
        if (err) { callback(err); return; }
        Data.articles(version, this.parallel());
        Git.readFile(head, "description.markdown", this.parallel());
        Data.tags(version, this.parallel());
      },
      function applyTemplate(err, articles, description, tags) {
        if (err) { callback(err); return; }
        Tools.render("index", {
          articles: articles,
          description: description,
            tags: tags
        }, this);
      },
      function callPostProcess(err, buffer) {
        if (err) { callback(err); return; }
        postProcess({
          "Cache-Control": "public, max-age=3600"
        }, buffer, version, "index", this);
      },
      callback
    );
  }),

  feed: Git.safe(function feed(version, callback) {
    var articles;
    Step(
      function loadData() {
        Data.fullArticles(version, this);
      },
      function (err, data) {
        if (err) { callback(err); return; }
        articles = data;
        var group = this.group();
        articles.forEach(function (article) {
          insertSnippets(article.markdown, article.snippets, article.theme, group());
        });
      },
      function applyTemplate(err, markdowns) {
        if (err) { callback(err); return; }
        markdowns.forEach(function (markdown, i) {
          articles[i].markdown = markdown;
        });
        Tools.render("feed.xml", {
          articles: articles
        }, this, true);
      },
      function finish(err, buffer) {
        if (err) { callback(err); return; }
        postProcess({
          "Content-Type":"application/rss+xml",
          "Cache-Control": "public, max-age=3600"
        }, buffer, version, "feed.xml", this);
      },
      callback
    );
  }),

  article: Git.safe(function renderArticle(version, name, callback) {
    var article, description;
    Step(
      function loadData() {
        Git.getHead(this.parallel());
        Data.fullArticle(version, name, this.parallel());
      },
      function (err, head, props) {
        if (err) { callback(err); return; }
        article = props;
        insertSnippets(article.markdown, article.snippets, article.theme, this.parallel());
        Git.readFile(head, "description.markdown", this.parallel());
      },
      function applyTemplate(err, markdown, description) {
        if (err) { callback(err); return; }
        article.markdown = markdown;
        Tools.render("article", {
          title: article.title,
          article: article,
          author: article.author,
          description: description
        }, this);
      },
      function finish(err, buffer) {
        if (err) { callback(err); return; }

        var theme = article.theme || 'default';
        buffer = Tools.stringToBuffer((buffer + "").replace(/<pre><code>([^<]+)<\/code><\/pre>/g,
        function addThemeClass(code, content) {
          return "<pre><code class=\"cm-s-" + theme + " CodeMirror\">" + content + "</code></pre>";
        }));

        postProcess({
          "Cache-Control": "public, max-age=3600"
        }, buffer, version, name, this);
      },
      callback
    );
  }),

  tagIndex: Git.safe(function index(version, tag, callback) {
    tag = QueryString.unescape(tag);
    Step(
      function getHead() {
        Git.getHead(this);
      },
      function loadData(err, head) {
        if (err) { callback(err); return; }
        Data.articles(version, this.parallel());
        Git.readFile(head, "description.markdown", this.parallel());
        Data.tags(version, this.parallel());
      },
      function applyTemplate(err, articles, description, tags) {
        if (err) { callback(err); return; }
				
        var articlesForTag = articles.reduce(function(start, element) {
          return element.tags && element.tags.indexOf(tag) >= 0 ? start.concat(element) : start;
        }, []);
								
        Tools.render("index", {
          title: "Tagged " + tag,
          articles: articlesForTag,
          description: description,
          tags: tags
        }, this);
      },
      function callPostProcess(err, buffer) {
        if (err) { callback(err); return; }
        postProcess({
          "Cache-Control": "public, max-age=3600"
        }, buffer, version, "index", this);
      },
      callback
    );
  }),

  staticFile: Git.safe(function staticFile(version, path, callback) {
    Step(
      function loadPublicFiles() {
        Git.readFile(version, "skin/public/" + path, this);
      },
      function loadArticleFiles(err, data) {
        if (err) {
          Git.readFile(version, "articles/" + path, this);
        }
        return data;
      },
      function processFile(err, data) {
        if (err) { callback(err); return; }
        var headers = {
          "Content-Type": getMime(path),
          "Cache-Control": "public, max-age=32000000"
        };
        postProcess(headers, data, version, path, this);
      },
      callback
    );
  }),

  dotFile: Git.safe(function dotFile(version, path, callback) {
    Step(
      function loadPublicFiles() {
        Git.readFile(version, "skin/public/" + path, this);
      },
      function loadArticleFiles(err, data) {
        if (err) {
          Git.readFile(version, "articles/" + path, this);
        }
        return data;
      },
      function processFile(err, data) {
        if (err) { callback(err); return; }
        execPipe("dot", ["-Tpng"], data, this);
      },
      function finish(err, buffer) {
        if (err) { callback(err); return; }
        postProcess({
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=32000000"
        }, buffer, version, path, this);
      },
      callback
    );
  })
}
