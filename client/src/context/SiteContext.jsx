import { createContext, useContext } from "react";
import useFetch from "../hooks/useFetch.js";
import { api } from "../services/api.js";

const SiteContext = createContext(null);

// Loads global site settings (menu, socials, addresses) once for the whole app.
export function SiteProvider({ children }) {
  const { data } = useFetch(api.getSite);
  return <SiteContext.Provider value={data}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);
