"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Moon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

function NavigationItems({ pathname }: { pathname: string }) {
  const navigation = [
    { name: "Museum", href: "/museum" },
    { name: "Gallery", href: "/gallery" },
    { name: "Collections", href: "/collections" },
    { name: "Journal", href: "/journal" },
    { name: "About", href: "/about" },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            "label-caps text-sm transition-colors relative",
            isActive(item.href) ? "text-primary" : "text-muted-foreground hover:text-primary"
          )}
        >
          {item.name}
          {isActive(item.href) && (
            <div className="absolute -top-2 left-0 right-0 h-px bg-primary" />
          )}
        </Link>
      ))}
    </>
  );
}

function MobileNavigation({ pathname, mobileMenuOpen, setMobileMenuOpen }: { pathname: string; mobileMenuOpen: boolean; setMobileMenuOpen: (open: boolean) => void }) {
  const navigation = [
    { name: "Museum", href: "/museum" },
    { name: "Gallery", href: "/gallery" },
    { name: "Collections", href: "/collections" },
    { name: "Journal", href: "/journal" },
    { name: "About", href: "/about" },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  if (!mobileMenuOpen) return null;

  return (
    <div className="md:hidden border-t border-border/20 bg-background">
      <nav className="container mx-auto px-4 py-8 space-y-6">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "block label-caps text-sm transition-colors",
              isActive(item.href) ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            {item.name}
          </Link>
        ))}
        <div className="pt-6 border-t border-border/20 flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" asChild>
            <Link href="/search">
              <Search className="w-5 h-5" />
            </Link>
          </Button>
          <SignedIn>
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="label-caps text-xs text-primary transition-colors block mb-3 px-3 py-1.5 rounded bg-primary/10 border border-primary/20 w-fit"
            >
              Curator's Office
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="default" className="label-caps text-sm">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full border-2 border-primary/40 flex items-center justify-center overflow-hidden">
              <img src="/onwa-logo.png" alt="ONWA Logo" className="w-full h-full object-cover" />
            </div>
            <span className="museum-heading text-2xl text-primary tracking-tight">ONWA</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavigationItems pathname={pathname} />
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" asChild>
              <Link href="/search">
                <Search className="w-5 h-5" />
              </Link>
            </Button>
            <SignedIn>
              <Link
                href="/admin/dashboard"
                className="label-caps text-xs text-muted-foreground hover:text-primary transition-colors px-2.5 py-1 rounded bg-muted/20 hover:bg-muted/40 border border-border/40"
              >
                Curator
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="default" className="label-caps text-sm">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileNavigation 
        pathname={pathname} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />
    </header>
  );
}
