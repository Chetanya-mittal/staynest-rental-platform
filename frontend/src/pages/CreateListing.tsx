import { useState } from "react"
import { useNavigate } from "react-router-dom"
import PropertyForm from "@/components/custom/PropertyForm"
import { createPropertyApi } from "@/api/propertyApi"
import type { PropertyPayload } from "@/types"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { Alert, AlertDescription } from "@/components/ui/alert"

const CreateListing = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (payload: PropertyPayload) => {
    setError(null)
    setIsSubmitting(true)
    try {
      await createPropertyApi(payload)
      navigate("/host/dashboard")
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container flex flex-col items-center">
      <div className="mb-6 max-w-3xl space-y-2 flex flex-col items-center">
        <h1 className="text-2xl font-semibold text-foreground">
          List your property
        </h1>
        <p className="text-sm text-muted-foreground">
          Fill in the details below to create a new listing.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 max-w-3xl">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <PropertyForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Create listing"
      />
    </div>
  )
}

export default CreateListing
