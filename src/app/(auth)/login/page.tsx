import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="museum-heading text-headline-lg text-primary mb-4">
            Welcome Back
          </h1>
          <p className="museum-body text-body-md text-muted-foreground">
            Sign in to access your Collector Archive
          </p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-surface-container border border-border/20",
            },
          }}
        />
      </div>
    </div>
  );
}
