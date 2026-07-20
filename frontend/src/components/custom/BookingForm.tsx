import { useState, useMemo } from "react"
import { type DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import { useNavigate } from "react-router-dom"
import type { Property } from "@/types"
import { type PropertyBookingDates, createBookingApi } from "@/api/bookingApi"
import {
  calculateNights,
  formatDateForApi,
  formatDate,
} from "@/utils/dateHelpers"
import { addMonths } from "date-fns"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { useAuthStore } from "@/stores/authStore"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { CheckCircle2, Minus, Plus } from "lucide-react"

interface BookingFormProps {
  property: Property
  existingBookings: PropertyBookingDates[]
}

const BookingForm = ({ property, existingBookings }: BookingFormProps) => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  const [range, setRange] = useState<DateRange | undefined>()
  const [guestsCount, setGuestsCount] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Convert existing bookings into date ranges react-day-picker understands
  const disabledRanges = useMemo(
    () =>
      existingBookings.map((b) => ({
        from: new Date(b.checkIn),
        to: new Date(b.checkOut),
      })),
    [existingBookings]
  )

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const disabledMatchers = [
    { before: today }, // past dates are disabled
    { after: addMonths(today, 2) }, // future dates after 2 months are disabled
    ...disabledRanges, // dates that are booked are disabled
  ]

  const nights =
    range?.from && range?.to ? calculateNights(range.from, range.to) : 0
  const totalPrice = nights * property.pricePerNight

  const handleBook = async () => {
    setError(null)

    if (!user) {
      navigate("/login")
      return
    }

    if (!range?.from || !range?.to) {
      setError("Please select check-in and check-out dates")
      return
    }

    if (range.from >= range.to) {
      setError("Check-out date must be after the check-in date")
      return
    }

    const oneMonthLater = new Date(range.from)
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1)

    if (range.to > oneMonthLater) {
      setError("Booking duration cannot exceed 1 month")
      return
    }

    if (guestsCount > property.maxGuests) {
      setError(`This property allows a maximum of ${property.maxGuests} guests`)
      return
    }

    setIsSubmitting(true)
    try {
      await createBookingApi({
        propertyId: property._id,
        checkIn: formatDateForApi(range.from),
        checkOut: formatDateForApi(range.to),
        guestsCount,
      })
      setSuccess(true)
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <Dialog open={success} onOpenChange={setSuccess}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center space-y-4 py-6">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
              <p className="text-sm text-muted-foreground">
                Your reservation at{" "}
                <span className="font-semibold">{property.title}</span> has been
                confirmed.
              </p>
            </div>
            <div className="w-full space-y-3 rounded-lg bg-muted p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Check-in:</span>
                <span className="font-medium">{formatDate(range?.from)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Check-out:</span>
                <span className="font-medium">{formatDate(range?.to)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Guests:</span>
                <span className="font-medium">{guestsCount}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-semibold">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
            <Button onClick={() => navigate("/bookings/my")} className="w-full">
              View My Bookings
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full"
            >
              Continue Browsing
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="border-b pb-5">
        <CardTitle className="text-xl font-semibold">
          Book This Property
        </CardTitle>

        <CardDescription className="space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-foreground">
              ₹{property.pricePerNight.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">/ night</span>
          </div>

          <p className="text-xs text-muted-foreground">
            Dates marked as unavailable cannot be selected for booking.
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Date Selection Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Select Dates</h3>
            <div className="flex justify-center rounded-lg border bg-card p-4 align-middle">
              <Calendar
                mode="range"
                selected={range}
                onSelect={setRange}
                disabled={disabledMatchers}
                numberOfMonths={1}
              />
            </div>
            {range?.from && range?.to && (
              <div className="flex items-center justify-between rounded-md bg-muted p-3 text-sm">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-semibold">
                  {nights} night{nights !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          {/* Guests Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Guests</h3>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">Number of Guests</p>
                <p className="text-xs text-muted-foreground">
                  Maximum {property.maxGuests} guest
                  {property.maxGuests > 1 ? "s" : ""} allowed
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setGuestsCount((prev) => Math.max(1, prev - 1))
                  }
                  disabled={guestsCount <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <span className="w-8 text-center text-lg font-semibold">
                  {guestsCount}
                </span>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setGuestsCount((prev) =>
                      Math.min(property.maxGuests, prev + 1)
                    )
                  }
                  disabled={guestsCount >= property.maxGuests}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Price Breakdown Section */}
          {nights > 0 && (
            <div className="space-y-3 border-t pt-6">
              <h3 className="text-sm font-semibold">Price Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    ₹{property.pricePerNight.toLocaleString()} &times; {nights}{" "}
                    night{nights !== 1 ? "s" : ""}
                  </span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex justify-between border-t pt-3 text-base font-semibold">
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Error Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!property.isAvailable && (
            <Alert variant="destructive">
              <AlertDescription>
                This property is currently not available for booking
              </AlertDescription>
            </Alert>
          )}

          {/* Book Button */}
          <Button
            onClick={handleBook}
            disabled={!property.isAvailable || isSubmitting || nights === 0}
            size="lg"
            className="w-full"
          >
            {!property.isAvailable
              ? "Property Not Available"
              : isSubmitting
                ? "Processing..."
                : user
                  ? "Confirm Booking"
                  : "Sign In to Book"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default BookingForm
