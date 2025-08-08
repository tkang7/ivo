import React from 'react';

export function Clause({ node, depth, NodeRenderer }) {
  if (!node) return null;

  // If this clause is "Definitions", wrap its definition sub-clauses in an ordered list
  if (node.title === 'Definitions') {
    const definitionSubClauses = node.children?.filter(child =>
      child.type === 'clause' && child.title && child.title.toLowerCase().includes('definition')
    ) || [];

    const otherChildren = node.children?.filter(child =>
      !(child.type === 'clause' && child.title && child.title.toLowerCase().includes('definition'))
    ) || [];

    return (
      <div className="clause-container">
        {otherChildren.map((child, index) => (
          <NodeRenderer key={index} node={child} depth={depth + 1} />
        ))}
        {definitionSubClauses.length > 0 && (
          <ol className="mt-4 space-y-4 ml-6" style={{ listStyleType: 'none' }}>
            {definitionSubClauses.map((subClause, index) => (
              <li key={index} className="text-gray-700 mb-2 relative">
                <span className="absolute -left-6 font-normal">
                  ({String.fromCharCode(97 + index)})
                </span>
                <NodeRenderer node={subClause} depth={depth + 2} />
              </li>
            ))}
          </ol>
        )}
      </div>
    );
  }

  // For other clauses, render normally
  return (
    <div className="clause-container">
      {node.children?.map((child, index) => (
        <NodeRenderer key={index} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}