import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

import { registerUser } from "../../services/authService"

const Register = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
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

      await registerUser(formData)

      alert("Registration Successful")

      navigate("/login")

    } catch (error) {

      console.log(error)

      alert("Registration Failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-87.5 border p-6 rounded-lg"
      >

        <h1 className="text-2xl font-bold text-center">
          Register
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded"
        />

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

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >

          <option value="ROLE_USER">
            User
          </option>

          <option value="ROLE_CA">
            CA
          </option>

        </select>

        <button
          type="submit"
          className="bg-black text-white p-2 rounded"
        >
          Register
        </button>

        <p className="text-center">
          Already have an account?

          <Link
            to="/"
            className="text-blue-500 ml-1"
          >
            Login
          </Link>
        </p>

      </form>

    </div>
  )
}

export default Register