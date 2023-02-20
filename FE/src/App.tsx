import { useState } from "react"
import { LandingPage } from "./components/LandingPage"
import { Navbar } from "./components/Navbar"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { Login } from "./components/Login"
import { Dashboard } from "./components/Dashboard"

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <Router>
                <Navbar />
                <Routes>
                    <Route path='/' element={<LandingPage />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/dashboard' element={<Dashboard />} />
                </Routes>
            </Router>
        </>
    )
}

export default App
