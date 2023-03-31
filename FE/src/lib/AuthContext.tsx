import {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect,
} from "react"
import api from "./api"
import Cookies from "js-cookie"
import jwt_decode from "jwt-decode"

interface User {
    email: string
    canvasAccessToken: string
}

interface AuthContextType {
    user: User | null
    userLogin: (user: User) => Promise<void | any>
    userLogout: () => void
    getUser: () => User | null
}

interface Props {
    children: ReactNode
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userLogin: async (user: User) => {},
    userLogout: () => {},
    getUser: () => null,
})

const AuthContextProvider: React.FC<Props> = ({ children }: Props) => {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const user = getUser()
        if (user) {
            setUser(user)
        }
    }, [])

    const userLogin = async (user: User) => {
        return await api
            .post("/iam/login", user, {
                withCredentials: true,
            })
            .then((res) => {
                setUser(res.data)
            })
            .catch((err) => {
                return err
            })
    }
    const userLogout = () => {
        setUser(null)
        Cookies.remove("cpss")
    }

    const getUser = (): User | null => {
        const user = Cookies.get("cpss")
        if (user) {
            return jwt_decode(user)
        } else {
            return null
        }
    }

    const contextValue = { user, userLogin, userLogout, getUser }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider

export const useAuth = () => useContext(AuthContext)
