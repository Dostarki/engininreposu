const HTML_TAG_RE = /<\s*(\/)?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/;

export function seemsHtml(text: string): boolean {
  return HTML_TAG_RE.test(text);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function applyInline(s: string): string {
  // **bold**
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // __bold__
  s = s.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  // *italic* (tek yıldız; ama liste başlangıcı olmamalı)
  s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
  // _italic_
  s = s.replace(/(^|[^_])_([^_\n]+)_(?!_)/g, "$1<em>$2</em>");
  return s;
}

function lineIsHeading(line: string): { level: number; text: string } | null {
  const m = line.match(/^(#{1,4})\s+(.+?)\s*#*\s*$/);
  if (m) {
    const level = Math.min(6, Math.max(2, m[1].length + 1)); // # => h2, ## => h3 vs
    return { level, text: m[2] };
  }
  // Alternatif: tamamen büyük harfli ve kısa satır + sonunda : yoksa heading sayılabilir? - şimdilik dokunmuyorum
  return null;
}

function lineIsBullet(line: string): string | null {
  const m = line.match(/^\s*[-*+]\s+(.+?)\s*$/);
  return m ? m[1] : null;
}

function lineIsOrdered(line: string): { idx: number; text: string } | null {
  const m = line.match(/^\s*(\d+)[.)]\s+(.+?)\s*$/);
  if (m) return { idx: parseInt(m[1], 10), text: m[2] };
  return null;
}

function isBlank(line: string): boolean {
  return line.trim() === "";
}

export function formatRichText(raw: string | null | undefined): string {
  if (!raw) return "";
  // Eğer eski tarz HTML ile kaydedilmişse, doğrudan kullan (geriye dönük uyumluluk)
  if (seemsHtml(raw)) return raw;

  // Satırlara ayır (windows \r\n desteği)
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];

  let i = 0;

  // O an açık olan paragraf / liste
  let paragraphBuf: string[] = [];
  const flushPara = () => {
    if (paragraphBuf.length) {
      const joined = applyInline(escapeHtml(paragraphBuf.join(" ")));
      out.push(`<p>${joined}</p>`);
      paragraphBuf = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    // BOŞ SATIR -> paragraf kapama
    if (isBlank(line)) {
      flushPara();
      i++;
      continue;
    }

    // BAŞLIK (#### ### ## #)
    const h = lineIsHeading(line);
    if (h) {
      flushPara();
      out.push(`<h${h.level}>${applyInline(escapeHtml(h.text))}</h${h.level}>`);
      i++;
      continue;
    }

    // SIRASIZ LİSTE (- / * / + ile başlayan ardışık satırlar)
    const bulletFirst = lineIsBullet(line);
    if (bulletFirst) {
      flushPara();
      const items: string[] = [];
      while (i < lines.length) {
        const b = lineIsBullet(lines[i]);
        if (b) {
          items.push(`<li>${applyInline(escapeHtml(b))}</li>`);
          i++;
        } else if (isBlank(lines[i])) {
          i++;
          break;
        } else {
          break;
        }
      }
      out.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    // SIRALI LİSTE (1. 2. 3. vb)
    const ordFirst = lineIsOrdered(line);
    if (ordFirst) {
      flushPara();
      const items: string[] = [];
      let expect = ordFirst.idx;
      while (i < lines.length) {
        const o = lineIsOrdered(lines[i]);
        if (o) {
          items.push(`<li>${applyInline(escapeHtml(o.text))}</li>`);
          expect = o.idx + 1;
          i++;
        } else if (isBlank(lines[i])) {
          i++;
          break;
        } else {
          break;
        }
      }
      out.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    // Normal paragraf satırı
    paragraphBuf.push(line.trim());
    i++;
  }

  flushPara();
  return out.join("\n");
}
