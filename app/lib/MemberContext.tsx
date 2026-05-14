'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type MemberTier = 'none' | 'level1' | 'level2' | 'level3';

interface MemberContextType {
  tier: MemberTier;
  totalSpent: number;
  discountPercentage: number;
  hasEarlyAccess: boolean;
  setTier: (tier: MemberTier) => void;
  addSpent: (amount: number) => void;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export function MemberProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<MemberTier>('none');
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('riot_member');
    if (saved) {
      const { tier: savedTier, totalSpent: savedSpent } = JSON.parse(saved);
      setTier(savedTier);
      setTotalSpent(savedSpent);
    }
  }, []);

  const updateTier = (newTier: MemberTier) => {
    setTier(newTier);
    localStorage.setItem('riot_member', JSON.stringify({ tier: newTier, totalSpent }));
  };

  const addSpent = (amount: number) => {
    const newTotal = totalSpent + amount;
    setTotalSpent(newTotal);

    let newTier: MemberTier = 'none';
    if (newTotal >= 1500) newTier = 'level3';
    else if (newTotal >= 500) newTier = 'level2';
    else if (newTotal > 0) newTier = 'level1';

    updateTier(newTier);
  };

  const discountPercentage = {
    none: 0,
    level1: 5,
    level2: 10,
    level3: 15,
  }[tier];

  const hasEarlyAccess = tier === 'level2' || tier === 'level3';

  return (
    <MemberContext.Provider
      value={{
        tier,
        totalSpent,
        discountPercentage,
        hasEarlyAccess,
        setTier: updateTier,
        addSpent,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
}

export function useMember() {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error('useMember must be used within MemberProvider');
  }
  return context;
}
