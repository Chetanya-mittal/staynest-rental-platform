import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Users, BedDouble, Bath, MapPin, ArrowLeft } from "lucide-react"
import type { Property } from "@/types"
import { getPropertyByIdApi } from "@/api/propertyApi"
import {
  getPropertyBookingsApi,
  type PropertyBookingDates,
} from "@/api/bookingApi"
import ImageGallery from "@/components/custom/ImageGallery"
import BookingForm from "@/components/custom/BookingForm"
import LoadingScreen from "@/components/custom/LoadingScreen"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [property, setProperty] = useState<Property | null>(null)
  const [bookings, setBookings] = useState<PropertyBookingDates[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch property and its bookings in parallel — they don't depend on each other
        const [propertyRes, bookingsRes] = await Promise.all([
          getPropertyByIdApi(id),
          getPropertyBookingsApi(id),
        ])

        setProperty(propertyRes.data!.property)
        setBookings(bookingsRes.data!.bookings)
      } catch (err: unknown) {
        setError(getErrorMessage(err))
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (isLoading) return <LoadingScreen />

  if (error || !property) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-16">
        <div className="w-full max-w-md space-y-4 text-center">
          <Alert variant="destructive">
            <AlertDescription>{error || "Property not found"}</AlertDescription>
          </Alert>
          <Button asChild variant="outline">
            <Link to="/" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 shrink-0" />
              <span>Back to listings</span>
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          <span>Back to listings</span>
        </Link>
      </div>

      <div className="space-y-6">
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
          <ImageGallery images={property.images} title={property.title} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <Card className="border-border/70">
              <CardHeader className="pb-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-semibold text-foreground">
                      {property.title}
                    </CardTitle>
                    <CardDescription className="mt-2 flex items-center gap-2">
                      <MapPin size={16} className="shrink-0 self-start" />
                      {property.location.city}, {property.location.state},{" "}
                      {property.location.country}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
                  <Users size={14} />
                  {property.maxGuests} guest
                  {property.maxGuests !== 1 ? "s" : ""}
                </Badge>
                <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
                  <BedDouble size={14} />
                  {property.bedrooms} bedroom
                  {property.bedrooms !== 1 ? "s" : ""}
                </Badge>
                <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
                  <Bath size={14} />
                  {property.bathrooms} bathroom
                  {property.bathrooms !== 1 ? "s" : ""}
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-border/70">
              <CardHeader>
                <CardTitle>About this place</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {property.description}
                </p>
              </CardContent>
            </Card>

            {property.amenities.length > 0 && (
              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary">
                      {amenity}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card className="border-border/70">
              <CardHeader>
                <CardTitle>Hosted by</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-foreground">
                  {property.host.name}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Email: {property.host.email}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:sticky lg:top-24">
            <BookingForm property={property} existingBookings={bookings} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetail
