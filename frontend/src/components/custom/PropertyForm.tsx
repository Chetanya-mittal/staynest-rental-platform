import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { propertySchema, type PropertyFormData } from "@/validations/propertyValidation"
import type { Property, PropertyPayload } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface PropertyFormProps {
  initialData?: Property
  onSubmit: (payload: PropertyPayload) => Promise<void>
  isSubmitting: boolean
  submitLabel: string
}

const PropertyForm = ({ initialData, onSubmit, isSubmitting, submitLabel }: PropertyFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          city: initialData.location.city,
          state: initialData.location.state,
          country: initialData.location.country,
          pricePerNight: initialData.pricePerNight,
          maxGuests: initialData.maxGuests,
          bedrooms: initialData.bedrooms,
          bathrooms: initialData.bathrooms,
          amenities: initialData.amenities.join(", "),
          images: initialData.images.join(", "),
        }
      : {
        },
  })

  const handleFormSubmit = async (data: PropertyFormData) => {
    const payload: PropertyPayload = {
      title: data.title,
      description: data.description,
      location: { city: data.city, state: data.state, country: data.country },
      pricePerNight: data.pricePerNight,
      maxGuests: data.maxGuests,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      amenities: data.amenities
        ? data.amenities.split(",").map((a) => a.trim()).filter(Boolean)
        : [],
      images: data.images
        ? data.images.split(",").map((i) => i.trim()).filter(Boolean)
        : [],
    }

    await onSubmit(payload)
  }

  return (
    <Card className="w-full max-w-3xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle>Property details</CardTitle>
        <CardDescription>
          Share the essentials so your listing is clear and ready to book.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Title</label>
            <Input placeholder="Cozy apartment in Bandra" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
              placeholder="Describe your property..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">City</label>
              <Input placeholder="Mumbai" {...register("city")} />
              {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">State</label>
              <Input placeholder="Maharashtra" {...register("state")} />
              {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Country</label>
              <Input placeholder="India" {...register("country")} />
              {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Price / night (₹)</label>
              <Input type="number" placeholder="5000" {...register("pricePerNight")} />
              {errors.pricePerNight && (
                <p className="text-sm text-destructive">{errors.pricePerNight.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Max guests</label>
              <Input type="number" placeholder="5" {...register("maxGuests")} />
              {errors.maxGuests && (
                <p className="text-sm text-destructive">{errors.maxGuests.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Bedrooms</label>
              <Input type="number" placeholder="2" {...register("bedrooms")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Bathrooms</label>
              <Input type="number" placeholder="1" {...register("bathrooms")} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Amenities <span className="text-muted-foreground">(comma separated)</span>
            </label>
            <Input placeholder="WiFi, AC, Parking" {...register("amenities")} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Image URLs <span className="text-muted-foreground">(comma separated)</span>
            </label>
            <Input
              placeholder="https://images.unsplash.com/..., https://..."
              {...register("images")}
            />
            <p className="text-sm text-muted-foreground">
              Direct image upload is not wired up yet — paste image URLs for now.
            </p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="min-w-40">
              {isSubmitting ? "Saving..." : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default PropertyForm
