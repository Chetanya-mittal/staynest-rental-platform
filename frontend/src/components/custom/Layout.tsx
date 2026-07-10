import { Outlet } from "react-router-dom"
import { Copyright, ShieldCheck, Sparkles } from "lucide-react"
import Navbar from "./Navbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 container mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8">
          <Outlet />
        </div>
      </main>

      <footer className="border-border bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <Card className="border-border/60 bg-card/70 shadow-none">
            <CardContent className="flex flex-col gap-6 px-5 py-6 md:flex-row md:items-start md:justify-between md:px-6">
              <div className="max-w-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <img src="/logo.svg" alt="StayNest Logo" className="h-7" />
                  </div>
                  <div>
                    <p className="font-semibold tracking-tight text-foreground">StayNest</p>
                    <p className="text-sm text-muted-foreground">
                      Discover handpicked stays and book with confidence.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Badge variant="secondary" className="gap-1">
                    <Sparkles className="size-3" />
                    Curated stays
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <ShieldCheck className="size-3" />
                    Verified hosts
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col gap-4 md:items-end">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    About
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Support
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Terms
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Copyright className="h-4 w-4" />
                  <span>
                    {new Date().getFullYear()} StayNest. Built for modern travel learning.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </footer>
    </div>
  )
}

export default Layout
