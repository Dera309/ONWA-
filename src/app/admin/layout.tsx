import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { SignIn, SignInButton, UserButton } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { ShieldAlert, ArrowLeft, LayoutDashboard, Palette, FolderKanban, ShoppingBag, Users, BookOpen, Image, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClaimAdminButton } from "@/components/admin/ClaimAdminButton";

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
    (userEmail && userEmail.toLowerCase() === PRIMARY_ADMIN_EMAIL) ||
    (userEmail && userEmail.toLowerCase().includes("chideraobia7"));

  try {
    // Check by clerkId first
    adminRecord = await prisma.admin.findFirst({
      where: { clerkId: userId },
    });

    // If not found by clerkId, check by email and auto-link clerkId
    if (!adminRecord && userEmail) {
      const adminByEmail = await prisma.admin.findFirst({
        where: { email: { equals: userEmail, mode: "insensitive" } },
      });

      if (adminByEmail) {
        adminRecord = await prisma.admin.update({
          where: { id: adminByEmail.id },
          data: { clerkId: userId, name: userName || "chidera" },
        });
      }
    }

    // Auto-grant for chideraobia7@gmail.com
    if (!adminRecord && (isPrimaryAdmin || userEmail)) {
      const targetEmail = isPrimaryAdmin ? PRIMARY_ADMIN_EMAIL : userEmail;
      const existingAdmin = await prisma.admin.findFirst({
        where: {
          OR: [
            { email: { equals: targetEmail, mode: "insensitive" } },
            { email: "admin@onwa.art" },
          ],
        },
      });

      if (existingAdmin) {
        adminRecord = await prisma.admin.update({
          where: { id: existingAdmin.id },
          data: {
            clerkId: userId,
            email: targetEmail,
            name: "chidera",
            role: "SUPER_ADMIN",
            permissions: ["all"],
          },
        });
      } else {
        adminRecord = await prisma.admin.create({
          data: {
            clerkId: userId,
            email: targetEmail,
            name: "chidera",
            role: "SUPER_ADMIN",
            permissions: ["all"],
          },
        });
      }
    }
  } catch (err) {
    console.error("[AdminLayout] Error verifying admin:", err);
  }

  // 3. If user signed in but not an authorized admin
  if (!adminRecord) {
    return (
      <main className="min-h-screen bg-background pt-24 pb-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full artwork-mat p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="label-caps text-muted-foreground mb-2">Curator Setup</p>
            <h1 className="museum-heading text-2xl text-primary mb-2">Activate Curator Office</h1>
            <p className="museum-body text-sm text-muted-foreground mb-4">
              You are signed in as <span className="text-foreground font-mono font-medium">{userEmail || userId}</span>. Click below to activate full curator administrative privileges for this account.
            </p>
          </div>
          <div className="pt-2 space-y-3">
            <ClaimAdminButton />
            <div className="flex items-center justify-center gap-4 pt-2">
              <UserButton afterSignOutUrl="/" />
              <Button variant="secondary" asChild className="text-sm">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Museum
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // 4. Authorized Admin: Render complete admin layout with navigation
  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Artworks", href: "/admin/artworks", icon: Palette },
    { label: "Collections", href: "/admin/collections", icon: FolderKanban },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Collectors", href: "/admin/collectors", icon: Users },
    { label: "Journal", href: "/admin/journal", icon: BookOpen },
    { label: "Media", href: "/admin/media", icon: Image },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border/20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-6">
              <Link href="/admin/dashboard" className="flex items-center space-x-3">
                <span className="museum-heading text-xl text-primary tracking-tight font-bold">ONWA</span>
                <span className="label-caps text-xs px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary">Curator</span>
              </Link>

              {/* Navigation Links */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-1.5 px-3 py-1.5 text-xs label-caps rounded-md text-muted-foreground hover:text-primary hover:bg-muted/30 transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="hidden sm:flex items-center text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> View Public Site
              </Link>
              <div className="h-4 w-px bg-border/40 hidden sm:block" />
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground hidden md:inline-block">
                  {adminRecord.name || adminRecord.email}
                </span>
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Navigation Scroll */}
        <div className="lg:hidden border-t border-border/10 overflow-x-auto py-2 px-4 flex space-x-2 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-1.5 px-3 py-1 text-xs label-caps rounded-md bg-muted/20 text-muted-foreground hover:text-primary whitespace-nowrap"
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Admin Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}