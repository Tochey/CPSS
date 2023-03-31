import { useContext, FC } from "react"
import AuthContext, { useAuth } from "./AuthContext"
import { Route, Navigate, RouteProps, PathRouteProps, Outlet } from "react-router-dom"

interface ProtectedRouteProps extends PathRouteProps {
    component: FC<any>
}

const ProtectedRoute: FC<any> = ({ component: Component, ...rest }) => {
    const { getUser } = useAuth()
    const user = getUser()

    return user ? <Outlet /> : <Navigate to="/login" />;
  
}

export default ProtectedRoute
