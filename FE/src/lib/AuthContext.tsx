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

interface StudentLoginParam {
    email: string
    canvasAccessToken: string
}

interface AdminLoginParam {
    email  : string
    password : string
}

interface UserCookieObject {
    id: string
    ROLE : "STUDENT" | "ADMIN"
}

interface AuthContextType {
    user: UserCookieObject | null
    studentLogin: (user: StudentLoginParam) => Promise<void | any>
    adminLogin: (user: AdminLoginParam) => Promise<void | any>
    studentLogout: () => void
    getUser: () => UserCookieObject | null
}

interface Props {
    children: ReactNode
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    studentLogin: async (user: StudentLoginParam) => {},
    adminLogin: async (user: AdminLoginParam) => {},
    studentLogout: () => {},
    getUser: () => null,
})

const AuthContextProvider: React.FC<Props> = ({ children }: Props) => {
    const [user, setUser] = useState<UserCookieObject | null>(null)

    useEffect(() => {
        const user = getUser()
        if (user) {
            setUser(user)
        }
    }, [])

    const studentLogin = async (student: StudentLoginParam) => {
        return await api
            .post("/iam/login", student, {
                withCredentials: true,
            })
            .then((res) => {
                setUser(res.data)
            })
            .catch((err) => {
                return err
            })
    }

    const studentLogout = () => {
        setUser(null)
        Cookies.remove("cpss")
    }

    const adminLogin = async (admin : AdminLoginParam) => {
        return await api
            .post("/iam/admin/login", admin, {
                withCredentials: true,
            })
            .then((res) => {
                setUser(res.data)
            })
            .catch((err) => {
                return err
            })
    }

    const getUser = (): UserCookieObject | null => {
        const user = Cookies.get("cpss")
        if (user) {
            return jwt_decode(user)
        } else {
            return null
        }
    }

    const contextValue = { user, studentLogin, adminLogin, studentLogout, getUser }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider

export const useAuth = () => useContext(AuthContext)
