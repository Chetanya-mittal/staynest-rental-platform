import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ScrollToTop from "./components/ScrollToTop"
import { useAuthStore } from "./stores/authStore"
import { refreshTokenApi, getMeApi } from "./api/authApi"
import Layout from "./components/custom/Layout"
import LoadingScreen from "./components/custom/LoadingScreen"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import PropertyDetail from "./pages/PropertyDetail"
import HostDashboard from "./pages/HostDashboard"
import CreateListing from "./pages/CreateListing"
import EditListing from "./pages/EditListing"
import MyBookings from "./pages/MyBookings"
import HostBookings from "./pages/HostBookings"
import ProtectedRoute from "./components/ProtectedRoute"
import NotFound from "./pages/NotFound"
import ErrorBoundary from "./components/ErrorBoundary"

const App = () => {
  const [initializing, setInitializing] = useState(true)
  const setAccessToken = useAuthStore((state) => state.setAccessToken)
  const setUser = useAuthStore((state) => state.setUser)
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const refreshRes = await refreshTokenApi()
        setAccessToken(refreshRes.data!.accessToken)

        const meRes = await getMeApi()
        setUser(meRes.data!)
      } catch {
        // No valid refresh token — user simply isn't logged in. Not an error.
        logout()
      } finally {
        setInitializing(false)
      }
    }

    restoreSession()
  }, [setAccessToken, setUser, logout])

  if (initializing) {
    return <LoadingScreen />
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/host/dashboard" element={<HostDashboard />} />
              <Route path="/host/listings/new" element={<CreateListing />} />
              <Route path="/host/listings/:id/edit" element={<EditListing />} />
              <Route path="/bookings/my" element={<MyBookings />} />
              <Route path="/bookings/host" element={<HostBookings />} />
            </Route>

            {/* Catch-all — must be last */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
