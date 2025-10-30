import { useEffect, useState } from "react"
import { Menu, X, LogOut } from "lucide-react"
import Cookies from "js-cookie"
import { Link, useNavigate } from "react-router-dom"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const [isLogin, setIsLogin] = useState(false)
  const [user, setUser] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    try {
      const tokenCookie = Cookies.get("access_token")
      const userCookie = Cookies.get("user")

      if (tokenCookie && userCookie) {
        const decodedToken = atob(tokenCookie) // Decode Base64 token
        const decodedUser = atob(userCookie) // Decode Base64 user
        if (decodedToken) {
          setIsLogin(true)
          setUser(JSON.parse(decodedUser))
        }
      }
    } catch (error) {
      console.error("Error parsing cookies:", error)
    }
  }, [])

  const handleLogout = () => {
    Cookies.remove("access_token")
    Cookies.remove("user")
    setIsLogin(false)
    navigate("/login")
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#5B21B6] text-white px-6 py-6 flex items-center justify-between shadow-lg z-50">
      {/* Left Section - Logo + Links */}
      <div className="flex items-center space-x-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <h1 className="font-bold text-lg tracking-wide">TriviaGo</h1>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-6 font-medium ml-4">
          <li className="hover:text-[#FACC15] cursor-pointer transition">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:text-[#FACC15] cursor-pointer transition">
            Leaderboard
          </li>
          <li className="hover:text-[#FACC15] cursor-pointer transition">
            About
          </li>
        </ul>
      </div>

      <div className="relative flex items-center">
        {isLogin ? (
          <button
            className="font-semibold hover:text-[#FACC15] transition flex items-center space-x-1"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span>Hello, {user} 👋</span>
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-white text-[#5B21B6] px-4 py-2 rounded-lg font-semibold hover:bg-[#FACC15] hover:text-white transition"
          >
            Sign In
          </Link>
        )}

        {dropdownOpen && (
          <div className="absolute right-[-5px] top-10 mt-2 w-40 bg-white text-[#5B21B6] rounded-lg shadow-lg overflow-hidden z-50">
            <button className="w-full text-left px-4 py-2 hover:bg-[#F472B6]/10">
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-[#F472B6]/10 flex items-center space-x-2"
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>
        )}

        <button
          className="md:hidden text-white ml-3"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#5B21B6] text-white flex flex-col items-center py-4 space-y-3 md:hidden">
          <span className="hover:text-[#FACC15] cursor-pointer">Home</span>
          <span className="hover:text-[#FACC15] cursor-pointer">
            Leaderboard
          </span>
          <span className="hover:text-[#FACC15] cursor-pointer">About</span>
          <button
            onClick={handleLogout}
            className="hover:text-[#F472B6] cursor-pointer flex items-center space-x-2"
          >
            <LogOut size={16} />
            <span>Log out</span>
          </button>
        </div>
      )}
    </nav>
  )
}
