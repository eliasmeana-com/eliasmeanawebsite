// latexWidget.js
import React from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

export default function LatexWidget({ latex, displayMode = false }) {
  if (!latex) return null;

  return (
    <>
      {displayMode ? (
        <BlockMath math={latex} />
      ) : (
        <InlineMath math={latex} />
      )}
    </>
  );
}
