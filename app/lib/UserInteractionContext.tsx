import { createContext, useContext, useState, ReactNode } from 'react';

interface UserInteractionContextType {
  isUserInteracting: boolean;
  setIsUserInteracting: (value: boolean) => void;
}

const UserInteractionContext = createContext<UserInteractionContextType | undefined>(undefined);

export function UserInteractionProvider({ children }: { children: ReactNode }) {
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  return (
    <UserInteractionContext.Provider value={{ isUserInteracting, setIsUserInteracting }}>
      {children}
    </UserInteractionContext.Provider>
  );
}

export function useUserInteraction() {
  const context = useContext(UserInteractionContext);
  if (!context) {
    throw new Error('useUserInteraction must be used within UserInteractionProvider');
  }
  return context;
}
