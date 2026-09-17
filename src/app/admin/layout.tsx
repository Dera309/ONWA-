import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { SignIn, UserButton } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClaimAdminButton } from "@/components/admin/ClaimAdminButton";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, sessionClaims } = await auth();
  let userEmail = (sessionClaims?.email as string | undefined) || "";
  let userName = "";

  try {
    const user = await currentUser();
    if (user) {
      if (!userEmail) userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase() || "";
      userName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    }
  } catch (err) {
    console.warn("[AdminLayout] currentUser fetch notice:", err);
  }

  // 1. Not signed in: show embedded curator sign in
  if (!userId) {
    return (
      <main className="min-h-screen bg-background pt-20 pb-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-2">
              <ShieldAlert className="w-7 h-7 text-primary" />
            </div>
            <p className="label-caps text-xs text-muted-foreground">Curator's Office</p>
            <h1 className="museum-heading text-2xl text-primary font-bold">Museum Administrator Access</h1>
            <p className="museum-body text-xs text-muted-foreground">
              Sign in with your curator administrator account (<span className="text-primary font-mono">chideraobia7@gmail.com</span>).
            </p>
          </div>

          <SignIn
            appearance={{
              elements: {
                rootBox: "mx-auto w-full",
                card: "bg-surface-container border border-border/20 shadow-xl",
              },
            }}
            forceRedirectUrl="/admin/dashboard"
          />

          <div className="text-center pt-2">
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-primary text-xs">
              <Link href="/">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Public Museum
              </Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // 2. Check Admin role in database
  let adminRecord = null;
  const PRIMARY_ADMIN_EMAIL = "chideraobia7@gmail.com";
  const isPrimaryAdmin =
    userEmail && userEmail.toLowerCase() === PRIMARY_ADMIN_EMAIL;

  try {
    if (isPrimaryAdmin) {
      // Find or create admin for chideraobia7@gmail.com
      adminRecord = await prisma.admin.findFirst({
        where: { email: { equals: PRIMARY_ADMIN_EMAIL, mode: "insensitive" } },
      });

      if (adminRecord) {
        if (adminRecord.clerkId !== userId) {
          adminRecord = await prisma.admin.update({
            where: { id: adminRecord.id },
            data: { clerkId: userId, name: "chidera" },
          });
        }
      } else {
        adminRecord = await prisma.admin.create({
          data: {
            clerkId: userId,
            email: PRIMARY_ADMIN_EMAIL,
            name: "chidera",
            role: "SUPER_ADMIN",
            permissions: ["all"],
          },
        });
      }
    } else if (userId) {
      // Check if user is registered in admin table
      adminRecord = await prisma.admin.findFirst({
        where: { clerkId: userId },
      });
    }
  } catch (err) {
    console.error("[AdminLayout] Error verifying admin:", err);
  }

  // 3. If user signed in but not authorized
  if (!adminRecord) {
    return (
      <main className="min-h-screen bg-background pt-24 pb-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full artwork-mat p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <p className="label-caps text-red-400 mb-2">Access Denied</p>
            <h1 className="museum-heading text-2xl text-primary mb-2">Curator's Office Restricted</h1>
            <p className="museum-body text-sm text-muted-foreground mb-4">
              Access to this museum management portal is restricted exclusively to the head curator (<span className="text-primary font-mono font-medium">chideraobia7@gmail.com</span>).
            </p>
            <p className="text-xs text-muted-foreground/80 bg-background/50 p-3 rounded border border-border/20">
              You are currently signed in as <span className="font-mono text-foreground font-semibold">{userEmail || userId}</span>.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-4">
            <UserButton afterSignOutUrl="/" />
            <Button variant="secondary" asChild className="text-sm">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Museum
              </Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // 4. Authorized Admin: Render complete admin layout with navigation
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Responsive Curator Admin Header */}
      <AdminHeader
        adminName={adminRecord.name || ""}
        adminEmail={adminRecord.email || userEmail || ""}
      />

      {/* Main Admin Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}