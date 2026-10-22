import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SiteProvider } from "../../context/SiteContext.jsx";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import BackToTop from "./BackToTop.jsx";

export default function Layout() {
  const { pathname } = useLocation();

  // Start each new page at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <SiteProvider>
      <Header />
      <main id="content">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </SiteProvider>
  );
}
