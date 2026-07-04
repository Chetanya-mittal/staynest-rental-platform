import { Link } from "react-router-dom"
import { Users, BedDouble, IndianRupee } from "lucide-react"
import type { Property } from "@/types"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface PropertyCardProps {
  property: Property
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Link to={`/properties/${property._id}`} className="group">
      <Card className="relative mx-auto w-full max-w-sm pt-0 transform transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-105 hover:border-primary/30 hover:shadow-xl">
        {/* Image section */}
        <div className="absolute inset-0 z-30 aspect-video from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <img
          src={
            property.images?.[0] || "https://placehold.co/400x300?text=No+Image"
          }
          alt={property.title}
          className="relative z-20 aspect-video w-full object-cover transform transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover price badge */}
        <div className="absolute right-3 top-3 z-40 rounded-md bg-white/90 px-2 py-1 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
          <IndianRupee className="h-3 w-3" strokeWidth={2.5} />
          <span>{property.pricePerNight.toLocaleString()}</span>
        </div>

        {/* Header Info */}
        <CardHeader>
          <CardTitle className="line-clamp-1">{property.title}</CardTitle>
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
      </Card>
    </Link>
  )
}

export default PropertyCard
