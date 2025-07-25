// utils/parseLatex.js
export function parseLatex(latex) {
  const lines = latex.split('\n');
  const blocks = [];

  let buffer = '';
  let mode = 'text';

  for (let line of lines) {
    const trimmed = line.trim();

    // Section
    if (/^\\section\*?{/.test(trimmed)) {
      flushBuffer();
      blocks.push({ type: 'section', content: extractBraces(trimmed) });
    }
    // Subsection
    else if (/^\\subsection\*?{/.test(trimmed)) {
      flushBuffer();
      blocks.push({ type: 'subsection', content: extractBraces(trimmed) });
    }
    // Math block (gather*, align*, equation*)
    else if (/^\\begin{(equation\*?|gather\*?|align\*?)}/.test(trimmed)) {
      flushBuffer();
      mode = 'blockMath';
    }
    else if (/^\\end{(equation\*?|gather\*?|align\*?)}/.test(trimmed)) {
      blocks.push({ type: 'blockMath', content: buffer.trim() });
      buffer = '';
      mode = 'text';
    }
    // Inline math: basic $...$ handling (could expand)
    else if (/^\$.*\$/.test(trimmed)) {
      blocks.push({ type: 'inlineMath', content: trimmed.slice(1, -1) });
    }
    // Paragraph / body text
    else {
      if (mode === 'blockMath') {
        buffer += line + '\n';
      } else if (trimmed !== '') {
        blocks.push({ type: 'paragraph', content: trimmed });
      }
    }
  }

  function flushBuffer() {
    if (buffer.trim()) {
      blocks.push({ type: 'paragraph', content: buffer.trim() });
      buffer = '';
    }
  }

  function extractBraces(line) {
    const match = line.match(/{(.*)}/);
    return match ? match[1] : line;
  }

  return blocks;
}
