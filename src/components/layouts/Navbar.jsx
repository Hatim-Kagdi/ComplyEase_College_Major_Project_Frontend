import { useAuth } from "../../context/AuthContext"
const Navbar = () => {
    const { user } = useAuth()
    return (
        <div className="h-16 border-b flex items-center justify-between px-6 bg-white">
            <h1 className="text-xl font-semibold">
                Dashboard
            </h1>
            <div>
                <p className="font-medium">
                    {user?.name}
                </p>
                <p className="text-sm text-gray-500">
                    {user?.role}
                </p>
            </div>
        </div>
    )
}
export default Navbar