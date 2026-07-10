import { Card, CardContent } from "@/components/ui/card"

const PropertyCardSkeleton = () => {
  return (
    <Card className="overflow-hidden border-border/60 bg-card shadow-sm p-0">
      <div className="aspect-4/3 animate-pulse bg-muted" />
      <CardContent className="flex flex-col gap-2.5 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        <div className="mt-1 h-3 w-2/3 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  )
}

export default PropertyCardSkeleton
