import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

import { loginUser } from "../../services/authService"
import { useAuth } from "../../context/AuthContext"

const Login = () => {

  const navigate = useNavigate()

  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const response = await loginUser(formData)

      login(response.data)

      const role = response.data.role

      if (role === "ROLE_USER") {
        navigate("/user/dashboard")
      }

      else if (role === "ROLE_CA") {
        navigate("/ca/dashboard")
      }

      else if (role === "ROLE_ADMIN") {
        navigate("/admin/dashboard")
      }

    } catch (error) {

      console.log(error)
      alert("Login Failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-87.5 border p-6 rounded-lg"
      >

        <h1 className="text-2xl font-bold text-center">
          Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-black text-white p-2 rounded"
        >
          Login
        </button>

        <p className="text-center">
          Don't have an account?

          <Link
            to="/register"
            className="text-blue-500 ml-1"
          >
            Register
          </Link>
        </p>

      </form>

    </div>
  )
}

export default Login