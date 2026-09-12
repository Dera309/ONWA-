export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-muted-foreground mb-8">Admin page not found</p>
        <a href="/admin/dashboard" className="text-primary hover:underline">
          Return to Admin Dashboard
        </a>
      </div>
    </div>
  );
}
