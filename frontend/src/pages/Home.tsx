import { useEffect, useState } from "react"
import PropertyCard from "@/components/custom/PropertyCard"
import PropertyCardSkeleton from "@/components/custom/PropertyCardSkeleton"
import SearchFilters from "@/components/custom/SearchFilters"
import Pagination from "@/components/custom/Pagination"
import { getAllPropertiesApi, type PropertyFilters } from "@/api/propertyApi"
import { usePropertyStore } from "@/stores/propertyStore"
import { getErrorMessage } from "@/utils/getErrorMessage"

const Home = () => {
  const {
    properties,
    currentPage,
    totalPages,
    totalProperties,
    setProperties,
  } = usePropertyStore((state) => state)

  const [filters, setFilters] = useState<PropertyFilters>({
    city: "",
    state: "",
    country: "",
    minPrice: "",
    maxPrice: "",
    guests: "",
    page: 1,
    limit: 8,
  })
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await getAllPropertiesApi(filters)
        setProperties({
          properties: res.data!.properties,
          currentPage: res.data!.currentPage,
          totalPages: res.data!.totalPages,
          totalProperties: res.data!.totalProperties,
          hasNextPage: res.data!.hasNextPage,
        })
      } catch (err: unknown) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [filters, setProperties, setError, setLoading])

  const handleSearch = (newFilters: {
    city?: string
    state?: string
    country?: string
    minPrice?: string
    maxPrice?: string
    guests?: string
  }) => {
    // Any new search always resets back to page 1
    setFilters({ ...newFilters, page: 1, limit: 8 })
  }

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setTimeout(() => {
      setFilters((prev) => ({ ...prev, page }))
    }, 500)
  }

  return (
    <div className="container">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
          Find your perfect stay
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Discover unique places to stay
        </p>
      </div>

      <div className="mb-8">
        <SearchFilters onSearch={handleSearch} />
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {!error && (
        <p className="mb-4 text-sm text-muted-foreground">
          {isLoading
            ? "Searching..."
            : `${totalProperties} ${totalProperties === 1 ? "property" : "properties"} found`}
        </p>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      ) : properties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        !error && (
          <div className="rounded-lg border border-dashed border-border/70 bg-card/50 py-16 text-center text-sm text-muted-foreground">
            No properties match your search. Try adjusting your filters.
          </div>
        )
      )}
    </div>
  )
}

export default Home
