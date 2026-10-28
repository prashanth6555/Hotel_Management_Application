import { Link } from "react-router-dom";
import { useTitle } from "../hooks/useTitle";

export default function NotFound() {
  useTitle("Page not found · Velora");

  return (
    <main className="page empty page-inline">
      <p className="eyebrow">404</p>
      <h1>That page has moved on.</h1>
      <p>The stay you want is probably still in the collection.</p>
      <Link to="/" className="btn">
        Back home
      </Link>
    </main>
  );
}
