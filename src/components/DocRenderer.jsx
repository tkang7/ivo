import { Mention } from './Mention';
import { Clause } from './Clause'; // <-- Add this import

function NodeRenderer({ node, depth = 0 }) {
  if (!node) return null;
  
  // Handle text nodes
  if (typeof node === 'string') {
    return node;
  }
  
  // Handle text nodes with formatting
  if (node.text !== undefined) {
    let content = node.text;
    let className = '';
    
    if (node.bold) className += ' font-bold';
    if (node.underline) className += ' underline';
    
    // Handle newlines by splitting and creating proper line breaks
    const parts = content.split('\n');
    if (parts.length > 1) {
      const elements = parts.map((part, index) => (
        <span key={index}>
          {index > 0 && <br />}
          {part}
        </span>
      ));
      return className ? <span className={className.trim()}>{elements}</span> : elements;
    }
    
    return className ? <span className={className.trim()}>{content}</span> : content;
  }
  
  // Handle different node types
  switch (node.type) {
    case 'block':
      // Don't increment depth for blocks - they're just containers
      return (
        <div className="block">
          {node.children?.map((child, index) => (
            <NodeRenderer key={index} node={child} depth={depth} />
          ))}
        </div>
      );
      
    case 'h1':
      return (
        <h1 className="text-4xl font-bold mb-6 text-gray-900">
          {node.children?.map((child, index) => (
            <NodeRenderer key={index} node={child} depth={depth} />
          ))}
        </h1>
      );
      
    case 'h4':
      return (
        <h4 className="text-lg mb-3 text-gray-800">
          {node.children?.map((child, index) => (
            <NodeRenderer key={index} node={child} depth={depth} />
          ))}
        </h4>
      );
      
    case 'p':
      return (
        <p className="mb-4 text-gray-700 leading-relaxed">
          {node.children?.map((child, index) => (
            <NodeRenderer key={index} node={child} depth={depth} />
          ))}
        </p>
      );
      
    case 'ul':
      return (
        <ul className="list-disc ml-6 mb-4 space-y-1">
          {node.children?.map((child, index) => (
            <NodeRenderer key={index} node={child} depth={depth} />
          ))}
        </ul>
      );
      
    case 'li':
      return (
        <li className="text-gray-700">
          {node.children?.map((child, index) => (
            <NodeRenderer key={index} node={child} depth={depth} />
          ))}
        </li>
      );
      
    case 'lic':
      return (
        <div className="lic mb-2">
          {node.children?.map((child, index) => (
            <NodeRenderer key={index} node={child} depth={depth} />
          ))}
        </div>
      );
      
    case 'clause':
      return <Clause node={node} depth={depth} NodeRenderer={NodeRenderer} />;
      
    case 'mention':
      return <Mention node={node} />;
      
    default:
      // Fallback for unknown types
      return (
        <div className="unknown-node">
          {node.children?.map((child, index) => (
            <NodeRenderer key={index} node={child} depth={depth} />
          ))}
        </div>
      );
  }
}

export function DocRenderer({ node }) {
  if (!node) return null;
  
  // Extract main clauses and wrap them in an ordered list
  const renderMainContent = (node) => {
    if (!node || !node.children) return <NodeRenderer node={node} depth={0} />;
    
    const mainClauses = [];
    const otherContent = [];
    
    node.children.forEach((child, index) => {
      if (child.type === 'clause' && (
        child.title === 'Key Details' || 
        child.title === 'Definitions'
      )) {
        mainClauses.push(child);
      } else if (child.type === 'p' && child.children?.some(grandChild => 
        grandChild.type === 'clause' && grandChild.children?.some(ggChild =>
          ggChild.type === 'h4' && ggChild.title === 'Agreement to Provide Services'
        )
      )) {
        // Extract the Agreement clause from the paragraph
        const agreementClause = child.children.find(grandChild => 
          grandChild.type === 'clause' && grandChild.children?.some(ggChild =>
            ggChild.type === 'h4' && ggChild.title === 'Agreement to Provide Services'
          )
        );
        if (agreementClause) {
          mainClauses.push(agreementClause);
        }
      } else {
        otherContent.push(<NodeRenderer key={index} node={child} depth={0} />);
      }
    });
    
    return (
      <>
        {otherContent}
        {mainClauses.length > 0 && (
          <ol className="space-y-6 list-decimal ml-6">
            {mainClauses.map((clause, index) => (
              <li key={index} className="text-gray-700 mb-4">
                <NodeRenderer node={clause} depth={1} />
              </li>
            ))}
          </ol>
        )}
      </>
    );
  };
  
  return (
    <div className="doc-renderer w-full max-w-none">
      {renderMainContent(node)}
    </div>
  );
}