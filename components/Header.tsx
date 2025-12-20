import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-6 md:px-12 lg:px-24">
        <nav className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/LOGO.svg"
              alt="Hedwiq Logo"
              width={30}
              height={30}
              priority
            />
            <span className="text-md font-bold text-foreground">
              HEDWIQ
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button size="sm" className="rounded-full">
              Get Started
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
