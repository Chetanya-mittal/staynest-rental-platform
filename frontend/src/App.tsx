import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/custom/Layout"
import Home from "./pages/Home"

const Login = () => (
  <div className="container py-8">
    <h1>Login — coming Day 10</h1>
  </div>
)
const Register = () => (
  <div className="container py-8">
    <h1>Register — coming Day 10</h1>
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
