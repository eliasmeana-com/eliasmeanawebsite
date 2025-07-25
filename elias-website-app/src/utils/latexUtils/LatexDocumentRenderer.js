import React from 'react';
import { parseLatex } from './LatexParser';
import LatexWidget from './latexWidget'; // already built inline/block renderer

export default function LatexDocumentRenderer({ latexScript }) {
  const blocks = parseLatex(latexScript); // we'll write this

  return (
    <div className="latex-doc" style={{ padding: '20px' }}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'section':
            return <h2 key={index}>{block.content}</h2>;
          case 'subsection':
            return <h3 key={index}>{block.content}</h3>;
          case 'paragraph':
            return <p key={index}>{block.content}</p>;
          case 'blockMath':
            return <LatexWidget key={index} latex={block.content} displayMode />;
          case 'inlineMath':
            return <p key={index}><LatexWidget latex={block.content} /></p>;
          default:
            return null;
        }
      })}
    </div>
  );
}
