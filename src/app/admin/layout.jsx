import ProtectedRoute from "../(auth)/ProtectedRoute";

export default function AdminLayout({ children }) {
  return (
    // Look here: we added the adminOnly prop!
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* ... your sidebar code ... */}
        <main className="flex-1 p-8">
            {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}