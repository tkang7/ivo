import { createContext, useContext, useState, useCallback } from 'react';

const ClauseContext = createContext();

export function ClauseProvider({ children }) {
  const [clauseCount, setClauseCount] = useState(0);
  const [subClauseCounters, setSubClauseCounters] = useState({});
  const [currentMainClause, setCurrentMainClause] = useState(null);
  
  const getNextClauseNumber = useCallback(() => {
    const nextNumber = clauseCount + 1;
    console.log(`Getting next clause number: ${clauseCount} → ${nextNumber}`);
    setClauseCount(nextNumber);
    setCurrentMainClause(nextNumber);
    // Initialize sub-clause counter for this main clause
    setSubClauseCounters(prev => ({ ...prev, [nextNumber]: 0 }));
    return nextNumber;
  }, [clauseCount]);
  
  const getNextSubClauseLetter = useCallback(() => {
    if (currentMainClause === null) {
      console.log('No current main clause, returning "a"');
      return 'a';
    }
    
    const currentCount = subClauseCounters[currentMainClause] || 0;
    const nextLetter = String.fromCharCode(97 + currentCount); // 97 = 'a'
    
    console.log(`Getting sub-clause letter for main clause ${currentMainClause}: ${currentCount} → ${nextLetter}`);
    
    setSubClauseCounters(prev => ({
      ...prev,
      [currentMainClause]: currentCount + 1
    }));
    
    return nextLetter;
  }, [currentMainClause, subClauseCounters]);
  
  return (
    <ClauseContext.Provider value={{ getNextClauseNumber, getNextSubClauseLetter }}>
      {children}
    </ClauseContext.Provider>
  );
}

export function useClause() {
  const context = useContext(ClauseContext);
  if (!context) {
    throw new Error('useClause must be used within a ClauseProvider');
  }
  return context;
}