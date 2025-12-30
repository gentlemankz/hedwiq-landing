"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

// ============================================================================
// App URL Configuration
// ============================================================================

/**
 * Get the app URL for auth redirects.
 * Falls back to production URL in production, localhost in development.
 */
function getAppUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl) return envUrl;

  if (process.env.NODE_ENV === "production") {
    return "https://app.luframe.com";
  }
  return "http://localhost:3000";
}

const APP_URL = getAppUrl();

// ============================================================================
// Navigation Configuration
// ============================================================================

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/#faq" },
];

// ============================================================================
// Mobile Menu Component
// ============================================================================

function MobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-40 md:hidden transition-opacity duration-300",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <nav
        className={cn(
          "absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-y-0" : "-translate-y-full"
        )}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="px-6 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="block py-3 text-base font-medium text-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 space-y-3 border-t border-border mt-4">
            <Button variant="outline" className="w-full" asChild>
              <a href={`${APP_URL}/sign-in`}>Sign In</a>
            </Button>
            <Button className="w-full rounded-full" asChild>
              <a href={`${APP_URL}/sign-up`}>Get Started</a>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
}

// ============================================================================
// Header Component
// ============================================================================

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-6 md:px-12 lg:px-24">
          <nav
            className="flex h-16 items-center justify-between"
            role="navigation"
            aria-label="Main navigation"
          >
            {/* Logo - Links to Home */}
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              aria-label="Luframe - Go to homepage"
            >
              <Image
                src="/luframe-logo.svg"
                alt=""
                width={30}
                height={30}
                priority
                aria-hidden="true"
              />
              <span className="text-md font-semibold text-foreground">
                Luframe
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <a href={`${APP_URL}/sign-in`}>Sign In</a>
              </Button>
              <Button size="sm" className="rounded-full" asChild>
                <a href={`${APP_URL}/sign-up`}>Get Started</a>
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </Button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
    </>
  );
}
