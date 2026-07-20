import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"

interface Filters {
  city?: string
  state?: string
  country?: string
  minPrice?: string
  maxPrice?: string
  guests?: string
}

interface SearchFiltersProps {
  onSearch: (filters: Filters) => void
}

const SearchFilters = ({ onSearch }: SearchFiltersProps) => {
  const [city, setCity] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [guests, setGuests] = useState("")

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()
    onSearch({ city, minPrice, maxPrice, guests })
  }

  return (
    <Card className="w-full">
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 p-1 md:flex-row md:items-end"
        >
          <div className="flex-1">
            <label
              htmlFor="destination"
              className="block text-xs font-medium text-muted-foreground"
            >
              Destination
            </label>
            <input
              id="destination"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
              placeholder="e.g. Mumbai"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="flex-1">
            <label
              htmlFor="min"
              className="block text-xs font-medium text-muted-foreground"
            >
              Min price
            </label>
            <input
              id="min"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
              type="number"
              min={0}
              step={1}
              placeholder="₹0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>

          <div className="flex-1">
            <label
              htmlFor="max"
              className="block text-xs font-medium text-muted-foreground"
            >
              Max price
            </label>
            <input
              id="max"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
              type="number"
              min={0}
              step={1}
              placeholder="₹10000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <div className="flex-1">
            <label
              htmlFor="guests"
              className="block text-xs font-medium text-muted-foreground"
            >
              Guests
            </label>
            <input
              id="guests"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
              type="number"
              min={1}
              step={1}
              placeholder="1"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
          </div>

          <div className="flex items-center md:pl-2">
            <Button type="submit" size="default" className="w-full">
              <Search size={16} />
              <span>Search</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default SearchFilters
