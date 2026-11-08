import { Routes, Route, Link } from "react-router-dom";
import ListingsPage from "./pages/ListingsPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";

function NotFoundPage() {
  return (
    <main style={{ maxWidth: 600, margin: "80px auto", padding: "0 20px", textAlign: "center" }}>
      <h1>Page not found</h1>
      <p><Link to="/">Back to listings</Link></p>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ListingsPage />} />
      <Route path="/property/:id" element={<PropertyDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}