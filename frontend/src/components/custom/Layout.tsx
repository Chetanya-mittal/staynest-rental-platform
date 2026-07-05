import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import { Copyright } from "lucide-react"

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 container py-8 px-5">
        <Outlet />
      </main>

      <footer className="mt-12 border-t border-border py-6 px-5">
        <div className="container flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Copyright className="h-4 w-4 text-muted-foreground" />
          <span>{new Date().getFullYear()} StayNest. Built for learning full-stack development.</span>
        </div>
      </footer>
    </div>
  )
}

export default Layout
