import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppState } from "../context/AppState";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const { toast } = useAppState();
  const isHome = pathname === "/";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="site">
      <a className="skip" href="#content">
        Skip to content
      </a>
      <Navbar />
      <div id="content" tabIndex={-1} className={isHome ? "site-home" : "site-main"}>
        {children}
      </div>
      <Footer />
      {toast ? (
        <div className="toast" role="status" key={toast.id}>
          {toast.message}
        </div>
      ) : null}
    </div>
  );
}
