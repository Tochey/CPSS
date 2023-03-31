import { useContext, FC } from "react"
import AuthContext, { useAuth } from "./AuthContext"
import { Route, Navigate, RouteProps, PathRouteProps } from "react-router-dom"

interface ProtectedRouteProps extends PathRouteProps {
    component: FC<any>
}

const ProtectedRoute: FC<any> = ({ component: Component, ...rest }) => {
    const { user } = useAuth()

    return user ? <Route {...rest} /> : <Navigate to='/login' />
}

export default ProtectedRoute
