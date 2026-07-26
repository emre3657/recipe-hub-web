import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../database/db";
import { UserSessionContext } from "./UserSessionContext";

const STORAGE_KEY = "recipeHub.currentUserId";

interface UserSessionProviderProps {
  children: ReactNode;
}

function UserSessionProvider({ children }: UserSessionProviderProps) {
  const [storedUserId, setStoredUserId] = useState<string | null>(() =>
    window.localStorage.getItem(STORAGE_KEY),
  );

  const users = useLiveQuery(() => db.users.toArray(), []);

  const currentUser = users?.find((user) => user.id === storedUserId) ?? null;

  const currentUserId = currentUser?.id ?? null;

  const selectUser = useCallback(
    (userId: string | null) => {
      if (userId === null) {
        window.localStorage.removeItem(STORAGE_KEY);
        setStoredUserId(null);
        return;
      }

      const userExists = users?.some((user) => user.id === userId);

      if (!userExists) {
        window.localStorage.removeItem(STORAGE_KEY);
        setStoredUserId(null);
        return;
      }

      window.localStorage.setItem(STORAGE_KEY, userId);
      setStoredUserId(userId);
    },
    [users],
  );

  const value = useMemo(
    () => ({
      users,
      currentUser,
      currentUserId,
      isLoading: users === undefined,
      selectUser,
    }),
    [users, currentUser, currentUserId, selectUser],
  );

  return (
    <UserSessionContext.Provider value={value}>
      {children}
    </UserSessionContext.Provider>
  );
}

export default UserSessionProvider;
