import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Plus, Pencil, Trash2, Home, Users } from "lucide-react"
import PropertyCard from "@/components/custom/PropertyCard"
import ConfirmDialog from "@/components/custom/ConfirmDialog"
import LoadingScreen from "@/components/custom/LoadingScreen"
import { getMyPropertiesApi, deletePropertyApi } from "../api/propertyApi"
import type { PropertyWithoutPopulate } from "@/types"
import { useAuthStore } from "@/stores/authStore"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"

const HostDashboard = () => {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()

  const [properties, setProperties] = useState<PropertyWithoutPopulate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    const fetchMyProperties = async () => {
      setIsLoading(true)
      try {
        const res = await getMyPropertiesApi()
        setProperties(res.data!.properties)
      } catch (err: unknown) {
        setError(getErrorMessage(err))
      } finally {
        setIsLoading(false)
      }
    }

    fetchMyProperties()
  }, [user, navigate])

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return
    setIsDeleting(true)
    try {
      await deletePropertyApi(deleteTargetId)
      setProperties((prev) => prev.filter((p) => p._id !== deleteTargetId))
    } catch (err:unknown) {
      setError(getErrorMessage(err))
    } finally {
      setIsDeleting(false)
      setDeleteTargetId(null)
    }
  }

  if (isLoading) return <LoadingScreen />

  return (
    <div className="container">
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">Your listings</h1>
          <p className="text-sm text-muted-foreground">
            Manage Your Properties & Guest Bookings
          </p>
        </div>
        <div className="flex gap-2">
        <Button asChild>
          <Link to="/bookings/host" className="inline-flex items-center gap-2">
            <Users size={16} />
            <span>Guest Bookings</span>
          </Link>
        </Button>
        <Button asChild>
          <Link to="/host/listings/new" className="inline-flex items-center gap-2">
            <Plus size={16} />
            <span>New listing</span>
          </Link>
        </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {properties.length === 0 ? (
        <Card className="border-dashed border-border/70 bg-background/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-3 text-muted-foreground">
              <Home size={24} />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              No listings yet
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              You haven't listed any properties yet. Create your first stay to start welcoming guests.
            </p>
            <Button asChild className="mt-6">
              <Link to="/host/listings/new" className="inline-flex items-center gap-2">
                <Plus size={16} />
                <span>Create your first listing</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {properties.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
              actions={
                <>
                  <Button asChild variant="outline" size="sm" className="flex-1 justify-center">
                    <Link to={`/host/listings/${property._id}/edit`} className="inline-flex items-center gap-1.5">
                      <Pencil size={14} />
                      <span>Edit</span>
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1 justify-center"
                    onClick={() => setDeleteTargetId(property._id)}
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </Button>
                </>
              }
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete this listing?"
        message="This action cannot be undone. Any future bookings tied to this listing may be affected."
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  )
}

export default HostDashboard
