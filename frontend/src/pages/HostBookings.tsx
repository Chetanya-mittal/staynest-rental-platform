import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MapPin, Calendar, Compass } from "lucide-react"
import LoadingScreen from "@/components/custom/LoadingScreen"
import { getHostBookingsApi } from "@/api/bookingApi"
import type { Booking } from "@/types"
import { useAuthStore } from "@/stores/authStore"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  confirmed: "default",
  pending: "secondary",
  cancelled: "destructive",
}

const HostBookings = () => {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()

  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    const fetchBookings = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await getHostBookingsApi()
        setBookings(res.data!.bookings)
      } catch (err: unknown) {
        setError(getErrorMessage(err))
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [user, navigate])

  if (isLoading) return <LoadingScreen />

  return (
    <div className="container flex flex-col items-center">
      <div className="mb-6 space-y-1 flex flex-col items-center">
        <h1 className="text-2xl font-semibold text-foreground">Guests Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Bookings done by users on your properties
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 max-w-2xl">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {bookings.length === 0 ? (
        <Card className="w-full max-w-2xl border-dashed border-border/70 bg-background/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-3 text-muted-foreground">
              <Compass size={24} />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              No bookings yet
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              You haven't get any bookings yet
            </p>
            <Button asChild className="mt-6">
              <Link to="/host/listings/new">Create Listings</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex w-full max-w-3xl flex-col gap-4">
          {bookings.map((booking) => (
            <Card
              key={booking._id}
              className="overflow-hidden border-border/70"
            >
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start">
                <Link to={`/properties/${booking.property._id}`}>
                  <img
                    src={
                      booking.property.images[0] ||
                      "https://placehold.co/100x100?text=No+Image"
                    }
                    alt={booking.property.title}
                    className="h-24 w-full shrink-0 rounded-lg object-cover sm:w-24"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <Link to={`/properties/${booking.property._id}`}>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="truncate text-sm font-semibold text-foreground">
                        {booking.property.title}
                      </h3>
                      <Badge
                        variant={statusVariant[booking.status] || "secondary"}
                      >
                        {booking.status}
                      </Badge>
                    </div>

                    <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin size={14} className="shrink-0" />
                      {booking.property.location.city}
                    </p>

                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar size={14} className="shrink-0" />
                      {new Date(booking.checkIn).toLocaleDateString()} →{" "}
                      {new Date(booking.checkOut).toLocaleDateString()} ·{" "}
                      {booking.totalNights} nights
                    </p>
                  </Link>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-base font-semibold text-foreground">
                      ₹{booking.totalPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default HostBookings
