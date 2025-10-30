import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Quiz from "./pages/Quiz"
import Register from "./pages/Register"
import StartQuiz from "./pages/StartQuiz"
import Result from "./pages/Result"
import { ToastContainer } from "react-toastify"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartQuiz />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer closeOnClick autoClose={2000} theme="dark" />
    </>
  )
}

export default App
