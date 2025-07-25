import React from 'react';
import LatexDocumentRenderer from '../utils/latexUtils/LatexDocumentRenderer';

const rawLatex = String.raw`
\section*{Exercise 1: Part A}

We begin by writing down the balance equation:
\begin{gather*}
  \left\{
    \begin{matrix}
      \text{rate of change}\\
      \text{of mass}\\
      \text{within volume}
    \end{matrix}
  \right\}
  =
  \left\{
    \begin{matrix}
      \text{rate of mass}\\
      \text{flowing in at }r
    \end{matrix}
  \right\}
  -
  \left\{
    \begin{matrix}
      \text{rate of mass}\\
      \text{flowing out at }r+\Delta r
    \end{matrix}
  \right\}
  +
  \left\{
    \begin{matrix}
      \text{rate of mass}\\
      \text{production per unit volume}
    \end{matrix}
  \right\}
\end{gather*}

To find equations for each of these expressions, recall that a surface area element in spherical coordinates is given by:

\begin{gather*}
\Delta S = r^2 \sin \theta \Delta \theta \Delta \phi
\end{gather*}

Inline math example: $c = \sqrt{a^2 + b^2}$
`;

function SomePage() {
  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <h1>Latex Document Renderer Test</h1>
      <LatexDocumentRenderer latexScript={rawLatex} />
    </div>
  );
}

export default SomePage;
