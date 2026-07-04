import { useState, useMemo } from "react"
import PropertyCard from "@/components/custom/PropertyCard"
import SearchFilters from "@/components/custom/SearchFilters"
import { mockProperties } from "../data/mockProperties"
import { Badge } from "@/components/ui/badge"
import type { Filters } from "@/types"

const Home = () => {
  const [filters, setFilters] = useState<Filters>({
    city: "",
    minPrice: "",
    maxPrice: "",
    guests: "",
  })

  const filteredProperties = useMemo(() => {
    return mockProperties.filter((property) => {
      if (
        filters.city &&
        !property.location.city
          .toLowerCase()
          .includes(filters.city.toLowerCase())
      ) {
        return false
      }
      if (
        filters.minPrice &&
        property.pricePerNight < Number(filters.minPrice)
      ) {
        return false
      }
      if (
        filters.maxPrice &&
        property.pricePerNight > Number(filters.maxPrice)
      ) {
        return false
      }
      if (filters.guests && property.maxGuests < Number(filters.guests)) {
        return false
      }
      return true
    })
  }, [filters])

  return (
    <div>
      {/* Hero */}
      <header className="mb-8">
        <h1 className="text-2xl font-heading font-semibold text-foreground md:text-3xl">
          Find your perfect stay
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Discover unique places to stay across India
        </p>
      </header>

      {/* Filters */}
      <div className="mb-8">
        <SearchFilters onSearch={setFilters} />
      </div>

      {/* Results count */}
      <div className="mb-4 flex items-center gap-3">
        <Badge variant="outline">{filteredProperties.length}</Badge>
        <p className="text-sm text-muted-foreground">
          {filteredProperties.length === 1 ? "Property" : "Properties"} found
        </p>
      </div>

      {/* Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProperties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-sm text-muted-foreground">
          No properties match your search. Try adjusting your filters.
        </div>
      )}
    </div>
  )
}

export default Home
