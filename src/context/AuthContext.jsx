import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const token = localStorage.getItem("token")
        const role = localStorage.getItem("role")
        const name = localStorage.getItem("name")
        const email = localStorage.getItem("email")

        if (token) {
            setUser({
                token,
                role,
                name,
                email
            })
        }

        setLoading(false)

    }, [])

    const login = (data) => {

        localStorage.setItem("token", data.token)
        localStorage.setItem("role", data.role)
        localStorage.setItem("name", data.name)
        localStorage.setItem("email", data.email)

        setUser(data)
    }

    const logout = () => {

        localStorage.removeItem("token")
        localStorage.removeItem("role")
        localStorage.removeItem("name")
        localStorage.removeItem("email")

        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)