import { BrowserRouter, Routes, Route } from "react-router-dom"

// Pages — we'll create these from Day 9 onwards
const Home = () => (
  <div className="container py-8">
    <h1>Home — coming Day 9</h1>
  </div>
)
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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
