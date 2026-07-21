import { type ReactNode } from "react"
import { Link } from "react-router-dom"
import { Users, BedDouble, IndianRupee } from "lucide-react"
import type { PropertyWithoutPopulate } from "@/types"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface PropertyCardProps {
  property: PropertyWithoutPopulate
  actions?: ReactNode // optional — only host views pass this in
}

const PropertyCard = ({ property, actions }: PropertyCardProps) => {
  return (
    <Card className="group relative mx-auto w-full max-w-sm transform pt-0 transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-105 hover:border-primary/30 hover:shadow-xl">
      <Link to={`/properties/${property._id}`}>
        {/* Image section */}
        <div className="absolute inset-0 z-30 aspect-video from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <img
          src={
            property.images?.[0] || "https://placehold.co/400x300?text=No+Image"
          }
          alt={property.title}
          className="relative z-20 aspect-video w-full transform object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover price badge */}
        <div className="absolute top-3 right-3 z-40 flex items-center gap-1 rounded-md bg-white/90 px-2 py-1 text-sm font-semibold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <IndianRupee className="h-3 w-3" strokeWidth={2.5} />
          <span>{property.pricePerNight.toLocaleString()}</span>
        </div>

        {/* Header Info */}
        <CardHeader>
          <CardTitle className="line-clamp-1 pt-4">{property.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {" "}
            {property.location.city}, {property.location.state}
          </p>
        </CardHeader>

        <CardContent>
          {/* Amenities */}
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>{property.maxGuests} guests</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BedDouble className="h-4 w-4" />
              <span>{property.bedrooms} beds</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="mt-5 flex items-baseline font-medium">
            <span className="flex items-center text-lg text-primary">
              <IndianRupee className="mr-0.5 h-3 w-3" strokeWidth={2.5} />
              {property.pricePerNight.toLocaleString()}
            </span>
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              / night
            </span>
          </div>
        </CardContent>
      </Link>
      {actions && <div className="flex gap-2 px-4 pb-4">{actions}</div>}
    </Card>
  )
}

export default PropertyCard
