import { createContext, useContext, useState, type ReactNode } from "react";
import type { Member } from "@/lib/members-data";
import { mockMembers } from "@/lib/members-data";

interface MembersContextType {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  updateMember: (updated: Member) => void;
  /** Mark a member as inactive (sets fechaSalida to today) */
  deactivateMember: (id: string) => void;
  /** Remove a member entirely */
  removeMember: (id: string) => void;
}

const MembersContext = createContext<MembersContextType | null>(null);

export const MembersProvider = ({ children }: { children: ReactNode }) => {
  const [members, setMembers] = useState<Member[]>(mockMembers);

  const updateMember = (updated: Member) => {
    setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const deactivateMember = (id: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, fechaSalida: new Date().toISOString().slice(0, 10) }
          : m
      )
    );
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <MembersContext.Provider value={{ members, setMembers, updateMember, deactivateMember, removeMember }}>
      {children}
    </MembersContext.Provider>
  );
};

export const useMembers = () => {
  const ctx = useContext(MembersContext);
  if (!ctx) throw new Error("useMembers must be used within MembersProvider");
  return ctx;
};
