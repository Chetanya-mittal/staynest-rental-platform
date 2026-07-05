import { useState } from "react"
import { Link } from "react-router-dom"
import { User, Menu, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { useTheme } from "@/components/theme-provider"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { resolvedTheme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background px-5">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-primary transition-colors hover:opacity-90"
        >
          <img src="/logo.png" alt="Logo" className="h-7"/>
          StayNest
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Explore
          </Link>
          <Link
            to="/host/dashboard"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Become a host
          </Link>
        </nav>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title="Toggle theme (D)"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4 text-foreground" />
            ) : (
              <Moon className="h-4 w-4 text-foreground" />
            )}
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Sign up</Link>
          </Button>
        </div>

        {/* Mobile Nav (Slide-out Sheet) */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Toggle menu">
                <Menu className="h-5 w-5 text-foreground" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="flex flex-col justify-between"
            >
              {/* Visually hidden title for screen reader accessibility */}
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

              <div className="mt-10 flex flex-col gap-4 p-5">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Explore
                </Link>
                <Link
                  to="/host/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Become a host
                </Link>
              </div>

              <div className="flex flex-col gap-3 p-5 pb-6">
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    toggleTheme()
                    setIsOpen(false)
                  }}
                >
                  {resolvedTheme === "dark" ? (
                    <span className="flex items-center justify-center gap-2">
                      <Sun className="h-4 w-4" /> Light mode
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Moon className="h-4 w-4" /> Dark mode
                    </span>
                  )}
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <User className="h-4 w-4" /> Log in
                  </Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    Sign up
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Navbar
