import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
const Sidebar = () => {
    const { logout, user } = useAuth()
    const navigate = useNavigate()
    const handleLogout = () => {
        logout()
        navigate("/login")
    }
    return (
        <div className="w-64 min-h-screen bg-black text-white p-6">
            <h1 className="text-2xl font-bold mb-10">
                ComplyEase
            </h1>
            <div className="flex flex-col gap-4">
                {
                    user?.role === "ROLE_USER" &&
                    <>
                        <Link to="/user/dashboard">
                            Dashboard
                        </Link>
                        <Link to="/business">
                            Businesses
                        </Link>
                        <Link to="/compliance">
                            Compliance
                        </Link>
                        <Link to="/document">
                            Documents
                        </Link>
                    </>
                }
                {
                    user?.role === "ROLE_CA" &&
                    <>
                        <Link to="/ca/dashboard">
                            Dashboard
                        </Link>
                        <Link to="/ca/businesses">
                            Assigned Businesses
                        </Link>
                        <Link to="/ca/compliances">
                            Client Compliances
                        </Link>
                        <Link to="/ca/documents">
                            Client Documents
                        </Link>
                    </>
                }
                {
                    user?.role === "ROLE_ADMIN" &&
                    <>
                        <Link to="/admin/dashboard">
                            Dashboard
                        </Link>

                        <Link to="/admin/assign-ca">
                            Assign CA
                        </Link>
                        <Link to="/admin/users">
                            User Management
                        </Link>
                        <Link to="/admin/ca-management">
                            CA Management
                        </Link>
                        <Link to="/admin/business-oversight">
                            Business Oversight
                        </Link>
                    </>
                }
                <button
                    onClick={handleLogout}
                    className="bg-red-500 mt-10 p-2 rounded"
                >
                    Logout
                </button>
            </div>
        </div>
    )
}
export default Sidebar