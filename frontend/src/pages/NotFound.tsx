import { Link } from "react-router-dom"
import { Home, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const NotFound = () => {
  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-16">
      <Card className="w-full max-w-md border-border/70 bg-card shadow-sm">
        <CardContent className="flex flex-col items-center px-8 py-10 text-center">
          <div className="mb-4 rounded-full bg-muted p-3 text-muted-foreground">
            <Compass size={24} />
          </div>
          <p className="text-6xl font-semibold text-primary">404</p>
          <h1 className="mt-3 text-xl font-semibold text-foreground">
            Page not found
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            The page you're looking for doesn't exist or may have been moved.
          </p>
          <Button asChild className="mt-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <Home size={16} />
              <span>Back to home</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default NotFound
