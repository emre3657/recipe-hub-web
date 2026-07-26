import { createContext } from "react";
import type { User } from "../types/user";

export interface UserSessionValue {
  users: User[] | undefined;
  currentUser: User | null;
  currentUserId: string | null;
  isLoading: boolean;
  selectUser: (userId: string | null) => void;
}

export const UserSessionContext = createContext<UserSessionValue | undefined>(
  undefined,
);
