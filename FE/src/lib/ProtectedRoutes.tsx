import { useContext, FC } from "react"
import AuthContext, { useAuth } from "./AuthContext"
import {
    Route,
    Navigate,
    RouteProps,
    PathRouteProps,
    Outlet,
} from "react-router-dom"

interface ProtectedRouteProps extends PathRouteProps {
    component: FC<any>
}

const ProtectedRoute: FC<any & { role: string }> = ({
    component: Component,
    role,
    ...rest
}) => {
    const { getUser } = useAuth()
    const user = getUser()

    return user && user.ROLE == role ? <Outlet /> : <Navigate to='/login' />
}

export default ProtectedRoute
