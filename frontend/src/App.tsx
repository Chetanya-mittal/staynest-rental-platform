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
    <BrowserRouter>
    <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
