// utils/latexUtils/LatexDocumentRenderer.js
import React from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { parseLatex } from './LatexParser';

const config = {
  loader: { load: ['[tex]/ams'] },
  tex: {
    packages: ['base', 'ams'],
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
  },
};

export default function LatexDocumentRenderer({ latexScript }) {
  const blocks = parseLatex(latexScript);

  return (
    <MathJaxContext version={3} config={config}>
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
              return (
                <MathJax key={index} dynamic>
                  <div>{`\\[${block.content}\\]`}</div>
                </MathJax>
              );
            case 'inlineMath':
              return (
                <MathJax key={index} dynamic>
                  <span>{`\\(${block.content}\\)`}</span>
                </MathJax>
              );
            default:
              return null;
          }
        })}
      </div>
    </MathJaxContext>
  );
}
