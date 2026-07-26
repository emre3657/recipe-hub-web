import { useContext } from "react";
import {
  UserSessionContext,
  type UserSessionValue,
} from "../app/UserSessionContext";

function useUserSession(): UserSessionValue {
  const context = useContext(UserSessionContext);

  if (!context) {
    throw new Error("useUserSession must be used within a UserSessionProvider");
  }

  return context;
}

export default useUserSession;
