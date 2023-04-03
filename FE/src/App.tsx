import {
    Navigate,
    Route,
    BrowserRouter as Router,
    Routes,
} from "react-router-dom"
import { LandingPage } from "./components/LandingPage"
import AdminDashboard from "./components/admin/AdminDashboard"
import AdminLogin from "./components/admin/AdminLogin"
import { StudentDashboard } from "./components/student/StudentDashboard"
import { StudentLogin } from "./components/student/StudentLogin"
import { useAuth } from "./lib/AuthContext"
import ProtectedRoute from "./lib/ProtectedRoutes"
import { Navbar } from "./components/Navbar"
import Students from "./components/student/Students"
import ArchiveStudents from "./components/student/ArchiveStudents"

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
                            user ? (
                                <Navigate to={"/dashboard"} />
                            ) : (
                                <StudentLogin />
                            )
                        }
                    />
                    <Route path='/admin/login' element={<AdminLogin />} />
                    <Route path='/' element={<ProtectedRoute role='STUDENT' />}>
                        <Route
                            path='/dashboard'
                            element={<StudentDashboard />}
                        />
                    </Route>
                    <Route path='/' element={<ProtectedRoute role='ADMIN' />}>
                        <Route
                            path='/admin/dashboard'
                            element={<AdminDashboard />}
                        />
                        <Route path='/admin/students' element={<Students />} />
                        <Route path='/admin/archive' element={<ArchiveStudents />} />
                    </Route>
                </Routes>
            </Router>
        </>
    )
}

export default App
