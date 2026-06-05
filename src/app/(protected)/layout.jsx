import ProtectedRoute from "../(auth)/ProtectedRoute";

export default function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      {/* We don't need Navbar or Footer here because the main RootLayout 
        already wraps this entire group and provides them globally!
      */}
      {children}
    </ProtectedRoute>
  );
}