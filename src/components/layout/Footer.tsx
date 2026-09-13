import Link from "next/link";
import { Moon, Instagram, Twitter, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/20 bg-surface-container-lowest">
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-primary/40 flex items-center justify-center overflow-hidden">
                <img src="/onwa-logo.png" alt="ONWA Logo" className="w-full h-full object-cover" />
              </div>
              <span className="museum-heading text-2xl text-primary tracking-tight">ONWA</span>
            </Link>
            <p className="museum-body text-body-md text-muted-foreground">
              Preserve, celebrate, and reimagine African culture through AI-assisted digital artwork.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${siteConfig.links.twitter}`}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="label-caps text-sm text-muted-foreground mb-6">Explore</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/museum" className="museum-body text-body-md text-muted-foreground hover:text-primary transition-colors">
                  Museum Mode
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="museum-body text-body-md text-muted-foreground hover:text-primary transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/collections" className="museum-body text-body-md text-muted-foreground hover:text-primary transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/journal" className="museum-body text-body-md text-muted-foreground hover:text-primary transition-colors">
                  Journal
                </Link>
              </li>
            </ul>
          </div>

          {/* Collector */}
          <div>
            <h3 className="label-caps text-sm text-muted-foreground mb-6">Collector</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/archive" className="museum-body text-body-md text-muted-foreground hover:text-primary transition-colors">
                  Collector Archive
                </Link>
              </li>
              <li>
                <Link href="/collected-works" className="museum-body text-body-md text-muted-foreground hover:text-primary transition-colors">
                  Collected Works
                </Link>
              </li>
              <li>
                <Link href="/future-collection" className="museum-body text-body-md text-muted-foreground hover:text-primary transition-colors">
                  Future Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="label-caps text-sm text-muted-foreground mb-6">Information</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="museum-body text-body-md text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="museum-body text-body-md text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="museum-body text-body-md text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="museum-body text-body-md text-muted-foreground hover:text-primary transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="museum-body text-body-md text-muted-foreground hover:text-primary transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/20 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="museum-body text-body-md text-muted-foreground">
            © {currentYear} ONWA. All rights reserved.
          </p>
          <p className="museum-body text-body-md text-muted-foreground">
            Built with reverence for African heritage.
          </p>
        </div>
      </div>
    </footer>
  );
}
