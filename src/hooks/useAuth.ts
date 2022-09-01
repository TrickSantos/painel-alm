import { useContext } from "react";
import { AuthenticationContext } from "../contexts/Authtentication";

export function useAuth() {
  return useContext(AuthenticationContext);
}
