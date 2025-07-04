import { useContext } from "react";
import { AuthContext } from "../Providers/AuthProviderNew";

const useAuth = () => {
  const auth = useContext(AuthContext);
  return auth;
};

export default useAuth;
