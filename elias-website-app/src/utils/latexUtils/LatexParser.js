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

    // Math block
    else if (/^\\begin{(equation\*?|gather\*?|align\*?)}/.test(trimmed)) {
      flushBuffer();
      mode = 'blockMath';
    }

    else if (/^\\end{(equation\*?|gather\*?|align\*?)}/.test(trimmed)) {
      blocks.push({ type: 'blockMath', content: buffer.trim() });
      buffer = '';
      mode = 'text';
    }

    // Inside a block math section
    else if (mode === 'blockMath') {
      buffer += line + '\n';
    }

    // General paragraph line (may contain inline math)
    else if (trimmed !== '') {
      const parts = trimmed.split(/(\$[^$]+\$)/); // captures $...$

      for (let part of parts) {
        if (part.startsWith('$') && part.endsWith('$')) {
          blocks.push({ type: 'inlineMath', content: part.slice(1, -1) });
        } else if (part.trim()) {
          blocks.push({ type: 'paragraph', content: part });
        }
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
