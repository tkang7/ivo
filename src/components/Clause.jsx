import { useRef } from 'react';
import { useClause } from './ClauseContext';

export function Clause({ children, isTopLevel = false, isSubClause = false }) {
  const { getNextClauseNumber, getNextSubClauseLetter } = useClause();
  const clauseNumberRef = useRef(null);
  const subClauseLetterRef = useRef(null);
  
  // Only number top-level clauses and only assign once
  if (isTopLevel && clauseNumberRef.current === null) {
    clauseNumberRef.current = getNextClauseNumber();
  }
  
  // Handle sub-clause lettering
  if (isSubClause && subClauseLetterRef.current === null) {
    subClauseLetterRef.current = getNextSubClauseLetter();
  }
  
  const clauseNumber = isTopLevel ? clauseNumberRef.current : null;
  const subClauseLetter = isSubClause ? subClauseLetterRef.current : null;
  
  return (
    <div className="clause-container mb-4">
      {(clauseNumber || subClauseLetter) && (
        <div className="flex">
          <div className="clause-number-prefix font-bold text-gray-800 mr-2">
            {clauseNumber && `${clauseNumber}.`}
            {subClauseLetter && `(${subClauseLetter})`}
          </div>
          <div className="clause-content flex-1">
            {children}
          </div>
        </div>
      )}
      {!(clauseNumber || subClauseLetter) && (
        <div className="clause-content">
          {children}
        </div>
      )}
    </div>
  );
}