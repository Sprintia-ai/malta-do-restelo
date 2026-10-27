import { Navigate } from "react-router-dom";

/** Keeps the old /almoco-2025 link working: every year now lives at /almoco/:year. */
export default function Event2025() {
  return <Navigate to="/almoco/2025" replace />;
}
