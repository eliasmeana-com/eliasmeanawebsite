// utils/LatexDocumentRenderer.js
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
              return (
                <p key={index}>
                  {block.content.map((part, i) => {
                    if (part.type === 'text') return <span key={i}>{part.content}</span>;
                    if (part.type === 'textbf') return <strong key={i}>{part.content}</strong>;
                    if (part.type === 'inlineMath') {
                      return (
                        <MathJax key={i} dynamic inline>
                          {`\\(${part.content}\\)`}
                        </MathJax>
                      );
                    }
                    return null;
                  })}
                </p>
              );

            case 'blockMath':
              return (
                <MathJax key={index} dynamic>
                  <div>{`\\[${block.content}\\]`}</div>
                </MathJax>
              );

            case 'itemize':
            case 'enumerate':
              const ListTag = block.type === 'itemize' ? 'ul' : 'ol';
              return (
                <ListTag key={index}>
                  {block.items.map((item, i) => (
                    <li key={i}>
                      {item.map((part, j) => {
                        if (part.type === 'text') return <span key={j}>{part.content}</span>;
                        if (part.type === 'textbf') return <strong key={j}>{part.content}</strong>;
                        if (part.type === 'inlineMath') {
                          return (
                            <MathJax key={j} dynamic inline>
                              {`\\(${part.content}\\)`}
                            </MathJax>
                          );
                        }
                        if (part.type === 'blockMath') {
                          return (
                            <MathJax key={j} dynamic>
                              <div>{`\\[${part.content}\\]`}</div>
                            </MathJax>
                          );
                        }
                        return null;
                      })}
                    </li>
                  ))}
                </ListTag>
              );

            default:
              return null;
          }
        })}
      </div>
    </MathJaxContext>
  );
}
