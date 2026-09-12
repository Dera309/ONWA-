export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 border-2 border-border/20 rounded-full" />
        <div className="absolute inset-0 border-2 border-primary rounded-full border-t-transparent animate-spin" />
      </div>
    </div>
  );
}
