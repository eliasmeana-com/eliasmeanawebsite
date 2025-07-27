// utils/LatexParser.js

export function parseLatex(latex) {
  const lines = latex.split('\n');
  const blocks = [];

  let mode = 'text';        // text, blockMath, list
  let listMode = null;      // null or 'listBlockMath' for block math inside list item
  let buffer = '';
  let listBlockBuffer = '';
  let currentList = null;

  const flushParagraph = () => {
    if (buffer.trim()) {
      const parts = parseInline(buffer.trim());
      blocks.push({ type: 'paragraph', content: parts });
      buffer = '';
    }
  };

  for (let line of lines) {
    const trimmed = line.trim();

    // Section
    if (/^\\section\*?{/.test(trimmed)) {
      flushParagraph();
      blocks.push({ type: 'section', content: extractBraces(trimmed) });
    }

    // Subsection
    else if (/^\\subsection\*?{/.test(trimmed)) {
      flushParagraph();
      blocks.push({ type: 'subsection', content: extractBraces(trimmed) });
    }

    // Block math (outside lists)
    else if (/^\\begin{(equation\*?|align\*?|gather\*?)}/.test(trimmed) && mode !== 'list') {
      flushParagraph();
      mode = 'blockMath';
      buffer = line + '\n';
    }

    else if (/^\\end{(equation\*?|align\*?|gather\*?)}/.test(trimmed) && mode === 'blockMath') {
      buffer += line + '\n';
      blocks.push({ type: 'blockMath', content: buffer.trim() });
      buffer = '';
      mode = 'text';
    }

    else if (mode === 'blockMath') {
      buffer += line + '\n';
    }

    // Begin list
    else if (/^\\begin{(itemize|enumerate|parts)}/.test(trimmed)) {
      flushParagraph();
      currentList = {
        type: trimmed.includes('enumerate') ? 'enumerate' : 'itemize',
        items: [],
      };
      mode = 'list';
      listMode = null;
      listBlockBuffer = '';
    }

    // End list
    else if (/^\\end{(itemize|enumerate|parts)}/.test(trimmed) && mode === 'list') {
      if (listBlockBuffer) {
        // flush any block math still open in list item
        currentList.items.push([{ type: 'blockMath', content: listBlockBuffer.trim() }]);
        listBlockBuffer = '';
        listMode = null;
      }
      if (currentList) blocks.push(currentList);
      currentList = null;
      mode = 'text';
    }

    // Inside list mode
    else if (mode === 'list') {
      if (/^\\item/.test(trimmed) && listMode === null) {
        // New list item, flush previous block math if any
        if (listBlockBuffer) {
          currentList.items.push([{ type: 'blockMath', content: listBlockBuffer.trim() }]);
          listBlockBuffer = '';
        }
        // parse inline from the remainder of the \item line
        const itemText = trimmed.replace(/^\\item/, '').trim();
        currentList.items.push(parseInline(itemText));
      }
      else if (/^\\begin{(equation\*?|align\*?|gather\*?)}/.test(trimmed) && listMode === null) {
        // block math starts inside list item
        listMode = 'listBlockMath';
        listBlockBuffer = line + '\n';
      }
      else if (/^\\end{(equation\*?|align\*?|gather\*?)}/.test(trimmed) && listMode === 'listBlockMath') {
        // block math ends inside list item
        listBlockBuffer += line + '\n';
        listMode = null;
        currentList.items.push([{ type: 'blockMath', content: listBlockBuffer.trim() }]);
        listBlockBuffer = '';
      }
      else if (listMode === 'listBlockMath') {
        // accumulate block math lines inside list item
        listBlockBuffer += line + '\n';
      }
      else if (trimmed === '') {
        // blank line inside list, ignore
      }
      else {
        // additional text lines inside the current last list item
        if (currentList.items.length > 0) {
          // append parsed inline parts to last list item (which is an array of parts)
          const lastItem = currentList.items[currentList.items.length - 1];

          // If lastItem is array of parts (normal), append parseInline parts
          // If lastItem is [{type:'blockMath'}], convert lastItem to array of parts and append
          if (Array.isArray(lastItem)) {
            lastItem.push(...parseInline(line));
          } else {
            // edge case fallback: just push new inline parts as new array
            currentList.items.push(parseInline(line));
          }
        }
      }
    }

    // Normal paragraph text
    else if (trimmed !== '') {
      buffer += line + ' ';
    }

    // Empty line outside list flushes paragraph
    else {
      flushParagraph();
    }
  }

  flushParagraph();
  return blocks;
}

function parseInline(text) {
  const parts = [];
  const regex = /\\textbf{([^}]+)}|(\$[^$]+\$)|([^\$\\]+)/g;

  let match;
  while ((match = regex.exec(text))) {
    if (match[1]) {
      parts.push({ type: 'textbf', content: match[1] });
    } else if (match[2]) {
      parts.push({ type: 'inlineMath', content: match[2].slice(1, -1) });
    } else if (match[3]) {
      parts.push({ type: 'text', content: match[3] });
    }
  }

  return parts;
}

function extractBraces(line) {
  const match = line.match(/{(.*)}/);
  return match ? match[1] : line;
}
