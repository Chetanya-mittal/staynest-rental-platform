import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import PropertyForm from "@/components/custom/PropertyForm"
import LoadingScreen from "@/components/custom/LoadingScreen"
import { getPropertyByIdApi, updatePropertyApi } from "@/api/propertyApi"
import type { PropertyPayload, Property } from "@/types"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { Alert, AlertDescription } from "@/components/ui/alert"

const EditListing = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchProperty = async () => {
      try {
        const res = await getPropertyByIdApi(id)
        setProperty(res.data!.property)
      } catch (err: unknown) {
        setError(getErrorMessage(err))
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperty()
  }, [id])

  const handleSubmit = async (payload: PropertyPayload) => {
    if (!id) return
    setError(null)
    setIsSubmitting(true)
    try {
      await updatePropertyApi(id, payload)
      navigate("/host/dashboard")
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <LoadingScreen />

  if (error || !property) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-16">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error || "Property not found"}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container flex flex-col items-center">
      <div className="mb-6 max-w-3xl space-y-2 flex flex-col items-center">
        <h1 className="text-2xl font-semibold text-foreground">Edit listing</h1>
        <p className="text-sm text-muted-foreground">
          Update your property details below.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 max-w-3xl">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <PropertyForm
        initialData={property}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Save changes"
      />
    </div>
  )
}

export default EditListing
