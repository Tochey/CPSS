import {
    Navigate,
    Route,
    BrowserRouter as Router,
    Routes,
} from "react-router-dom"
import { LandingPage } from "./components/LandingPage"
import { StudentDashboard } from "./components/student/StudentDashboard"
import { StudentLogin } from "./components/student/StudentLogin"
import { Navbar } from "./components/student/StudentNavbar"
import { useAuth } from "./lib/AuthContext"
import ProtectedRoute from "./lib/ProtectedRoutes"
import AdminLogin from "./components/admin/AdminLogin"

function App() {
    const { user } = useAuth()
    
    return (
        <>
            <Router>
                <Navbar />
                <Routes>
                    <Route
                        path='/'
                        element={
                            user ? (
                                <Navigate to={"/dashboard"} />
                            ) : (
                                <LandingPage />
                            )
                        }
                    />
                    <Route
                        path='/login'
                        element={
                            user ? <Navigate to={"/dashboard"} /> : <StudentLogin />
                        }
                    />
                    <Route
                        path='/admin/login'
                        element={
                            <AdminLogin />
                        }
                    />
                    <Route path='/' element={<ProtectedRoute  role="STUDENT"/>}>
                        <Route path='/dashboard' element={<StudentDashboard />} />
                    </Route>
                </Routes>
            </Router>
        </>
    )
}

export default App
