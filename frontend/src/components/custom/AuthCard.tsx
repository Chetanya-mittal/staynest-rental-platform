import { type ReactNode } from "react"
import { Link } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface AuthCardProps {
  title: string
  subtitle: string
  children: ReactNode
  footerText: string
  footerLinkText: string
  footerLinkTo: string
}

const AuthCard = ({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}: AuthCardProps) => {

  return (
    <div className="flex min-h-screen justify-center px-4">
      <div className="w-full max-w-md">
        {/* Auth Card */}
        <Card className="border border-border bg-card">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="text-sm">{subtitle}</CardDescription>
          </CardHeader>
          <div className="px-6 pb-6">
            {children}
          </div>
        </Card>

        {/* Footer Link */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {footerText}{" "}
          <Link
            to={footerLinkTo}
            className="font-semibold text-primary transition-colors hover:text-primary/90 hover:underline"
          >
            {footerLinkText}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthCard
