"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Palette,
  FolderKanban,
  ShoppingBag,
  Users,
  BookOpen,
  Image as ImageIcon,
  Settings,
  CreditCard,
  FileCheck,
  Star,
  Mail,
  Menu,
  X,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  adminName?: string;
  adminEmail?: string;
}

const mainNavItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Artworks", href: "/admin/artworks", icon: Palette },
  { label: "Collections", href: "/admin/collections", icon: FolderKanban },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Collectors", href: "/admin/collectors", icon: Users },
  { label: "Journal", href: "/admin/journal", icon: BookOpen },
  { label: "Media", href: "/admin/media", icon: ImageIcon },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const secondaryNavItems = [
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Licenses", href: "/admin/licenses", icon: FileCheck },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
];

export function AdminHeader({ adminName, adminEmail }: AdminHeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === "/admin/dashboard" || pathname === "/admin";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/20 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            <Link
              href="/admin/dashboard"
              className="flex items-center space-x-2.5 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full border border-primary/40 flex items-center justify-center overflow-hidden bg-primary/5">
                <img
                  src="/onwa-logo.png"
                  alt="ONWA"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="museum-heading text-lg sm:text-xl text-primary font-bold tracking-tight">
                  ONWA
                </span>
                <span className="label-caps text-[10px] px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-semibold hidden xs:inline-block">
                  Curator
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-1.5 px-3 py-1.5 text-xs label-caps rounded-md transition-all duration-150",
                      active
                        ? "bg-primary/10 text-primary font-bold border border-primary/20 shadow-sm"
                        : "text-muted-foreground hover:text-primary hover:bg-muted/40"
                    )}
                  >
                    <Icon className={cn("w-3.5 h-3.5", active ? "text-primary" : "text-muted-foreground")} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* View Public Site (Desktop & Tablet) */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center space-x-1 text-xs text-muted-foreground hover:text-primary transition-colors px-2.5 py-1 rounded-md border border-border/20 hover:border-primary/30"
              title="Open Public Museum in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1" />
              <span>Public Site</span>
            </Link>

            <div className="h-4 w-px bg-border/40 hidden sm:block" />

            {/* Admin identity */}
            {(adminName || adminEmail) && (
              <span
                className="text-xs text-muted-foreground hidden xl:inline-block max-w-[160px] truncate"
                title={adminEmail || adminName}
              >
                {adminName || adminEmail}
              </span>
            )}

            {/* Clerk User Button */}
            <div className="flex items-center">
              <UserButton afterSignOutUrl="/" />
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted/30 transition-colors focus:outline-none focus:ring-1 focus:ring-primary/40"
              aria-label={mobileMenuOpen ? "Close admin menu" : "Open admin menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-primary" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Quick Navigation Bar (< lg) */}
      <div className="lg:hidden border-t border-border/10 bg-surface-container-low/30 backdrop-blur-sm overflow-x-auto hide-scrollbar py-2 px-3 flex items-center space-x-1.5 scroll-smooth">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-1.5 px-3 py-1.5 text-xs label-caps rounded-full whitespace-nowrap transition-colors shrink-0",
                active
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "bg-muted/30 text-muted-foreground hover:text-primary hover:bg-muted/50 border border-border/10"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border/20 bg-background/98 backdrop-blur-2xl animate-in fade-in max-h-[calc(100vh-7rem)] overflow-y-auto shadow-2xl">
          <div className="px-4 py-5 space-y-5">
            {/* Curator profile badge */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container border border-border/20">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    {adminName || "Head Curator"}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    {adminEmail || "chideraobia7@gmail.com"}
                  </p>
                </div>
              </div>
              <span className="label-caps text-[9px] px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                Super Admin
              </span>
            </div>

            {/* Main Sections */}
            <div className="space-y-1">
              <p className="text-[10px] label-caps text-muted-foreground/70 px-2 pb-1">
                Core Management
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {mainNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center space-x-2 px-3 py-2.5 text-xs rounded-md transition-colors",
                        active
                          ? "bg-primary/15 text-primary font-semibold border border-primary/30"
                          : "text-muted-foreground hover:text-primary hover:bg-muted/30 border border-transparent"
                      )}
                    >
                      <Icon className={cn("w-4 h-4 shrink-0", active ? "text-primary" : "text-muted-foreground")} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Extended Tools */}
            <div className="space-y-1 pt-2 border-t border-border/15">
              <p className="text-[10px] label-caps text-muted-foreground/70 px-2 pb-1">
                Curator Tools
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center space-x-2 px-3 py-2.5 text-xs rounded-md transition-colors",
                        active
                          ? "bg-primary/15 text-primary font-semibold border border-primary/30"
                          : "text-muted-foreground hover:text-primary hover:bg-muted/30 border border-transparent"
                      )}
                    >
                      <Icon className={cn("w-4 h-4 shrink-0", active ? "text-primary" : "text-muted-foreground")} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions / Public Site Link */}
            <div className="pt-3 border-t border-border/20 flex flex-col space-y-2">
              <Button
                variant="secondary"
                size="sm"
                asChild
                className="w-full justify-center text-xs h-10 border-border/40 hover:border-primary/40"
              >
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <ArrowLeft className="w-3.5 h-3.5 mr-2" />
                  <span>Exit to Public Museum</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
