import {    BrowserRouter, Route, Routes, Navigate} from "react-router-dom"
import './index.css';
import Home from './pages/home';
import Login from './pages/login';

function App(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App