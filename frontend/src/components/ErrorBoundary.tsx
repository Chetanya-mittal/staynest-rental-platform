import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  // React calls this when a child throws during render
  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  // Good place to log to a monitoring service later (e.g. Sentry)
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  handleReload = () => {
    window.location.href = "/"
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center px-4 py-16">
          <Card className="w-full max-w-md border-destructive/20 bg-card shadow-sm">
            <CardContent className="flex flex-col items-center px-8 py-10 text-center">
              <div className="mb-4 rounded-full bg-destructive/10 p-3 text-destructive">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Something went wrong
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                We hit an unexpected error. Try reloading the page — if this keeps happening, please let us know.
              </p>
              <Button onClick={this.handleReload} className="mt-6">
                Reload StayNest
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
