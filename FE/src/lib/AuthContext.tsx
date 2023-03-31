import { createContext, useState, useContext, ReactNode } from "react"
import api from "./api"

interface User {
    email: string
    canvasAccessToken: string
}

interface AuthContextType {
    user: User | null
    userLogin: (user: User) => void
    userLogout: () => void
}

interface Props {
    children: ReactNode
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userLogin: () => {},
    userLogout: () => {},
})

const AuthContextProvider: React.FC<Props> = ({ children }: Props) => {
    const [user, setUser] = useState<User | null>(null)

    const userLogin = async (user: User) => {
        return await api
            .post("/auth/login", user, {
                withCredentials: true,
            })
            .then((res) => {
                setUser(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const userLogout = () => setUser(null)

    const contextValue = { user, userLogin, userLogout }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider

export const useAuth = () => useContext(AuthContext)
