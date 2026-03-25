import React, { createContext, useContext, useState } from 'react';

export interface MemberProfile {
  id: string;
  name: string;
  furigana: string;
  birthDate: string;
  cohort: string;
  email: string;
  registeredAt: string;
}

interface MemberProfileContextType {
  profiles: MemberProfile[];
  addProfile: (data: Omit<MemberProfile, 'id' | 'registeredAt'>) => void;
}

const MemberProfileContext = createContext<MemberProfileContextType>({
  profiles: [],
  addProfile: () => {},
});

export function MemberProfileProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<MemberProfile[]>([]);

  const addProfile = (data: Omit<MemberProfile, 'id' | 'registeredAt'>) => {
    const profile: MemberProfile = {
      ...data,
      id: Date.now().toString(),
      registeredAt: new Date().toLocaleDateString('ja-JP'),
    };
    setProfiles(prev => [...prev, profile]);
  };

  return (
    <MemberProfileContext.Provider value={{ profiles, addProfile }}>
      {children}
    </MemberProfileContext.Provider>
  );
}

export const useMemberProfiles = () => useContext(MemberProfileContext);
