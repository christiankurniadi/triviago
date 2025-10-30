import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { setSignUp } from "../services/auth"
import { toast } from "react-toastify"
import Cookies from "js-cookie"

export default function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(false)

  useEffect(() => {
    const token = Cookies.get("access_token")
    if (token) navigate("/")
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading || cooldown) return

    if (!name || !email || !password) {
      toast.error("Please fill all fields")
      return
    }

    setLoading(true)
    setCooldown(true)
    const data = { name, email, password }

    try {
      const response = await setSignUp(data)

      if (response.error) {
        toast.error(response.message)
      } else {
        toast.success("Account created successfully!")
        navigate("/login")
      }
    } catch (err) {
      console.error("Register failed:", err)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
      setTimeout(() => setCooldown(false), 3000)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-[#3c127f]">
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none ">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#5B21B6"
            fillOpacity="1"
            d="M0,96L12.6,117.3C25.3,139,51,181,76,181.3C101.1,181,126,139,152,133.3C176.8,128,202,160,227,149.3C252.6,139,278,85,303,69.3C328.4,53,354,75,379,69.3C404.2,64,429,32,455,16C480,0,505,0,531,10.7C555.8,21,581,43,606,48C631.6,53,657,43,682,37.3C707.4,32,733,32,758,26.7C783.2,21,808,11,834,21.3C858.9,32,884,64,909,69.3C934.7,75,960,53,985,85.3C1010.5,117,1036,203,1061,202.7C1086.3,203,1112,117,1137,85.3C1162.1,53,1187,75,1213,112C1237.9,149,1263,203,1288,213.3C1313.7,224,1339,192,1364,154.7C1389.5,117,1415,75,1427,53.3L1440,32L1440,320L1427.4,320C1414.7,320,1389,320,1364,320C1338.9,320,1314,320,1288,320C1263.2,320,1238,320,1213,320C1187.4,320,1162,320,1137,320C1111.6,320,1086,320,1061,320C1035.8,320,1011,320,985,320C960,320,935,320,909,320C884.2,320,859,320,834,320C808.4,320,783,320,758,320C732.6,320,707,320,682,320C656.8,320,632,320,606,320C581.1,320,556,320,531,320C505.3,320,480,320,455,320C429.5,320,404,320,379,320C353.7,320,328,320,303,320C277.9,320,253,320,227,320C202.1,320,177,320,152,320C126.3,320,101,320,76,320C50.5,320,25,320,13,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="z-10 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        <div className="hidden md:flex flex-col justify-center items-center bg-[#5B21B6] text-white w-1/2 p-8">
          {/* Illustration from https://iconscout.com/contributors/woobrodesign */}
          <img
            src="/img/register.svg"
            alt="Quiz Illustration"
            className="w-100 mb-4"
          />
          <h2 className="text-2xl font-bold">Ready to test your mind?</h2>
          <p className="text-sm text-gray-200 mt-2 text-center px-4">
            Join TriviaGo and challenge your brain with fun questions!
          </p>
        </div>

        <div className="w-full md:w-1/2 p-8 bg-white flex flex-col justify-center">
          <h1 className="text-3xl font-extrabold text-[#5B21B6] mb-2 text-center">
            Trivia<span className="text-[#FACC15]">Go</span>
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Create your account or{" "}
            <Link
              to="/login"
              className="text-[#5B21B6] font-medium hover:underline"
            >
              Log in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]"
                placeholder="Jane Doe"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || cooldown}
              className={`w-full font-semibold py-2 rounded-lg transition-all duration-200 ${
                loading || cooldown
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#5B21B6] hover:bg-[#7C3AED] text-white"
              }`}
            >
              {loading
                ? "Creating Account..."
                : cooldown
                ? "Please wait..."
                : "Sign Up"}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-gray-500">
            By creating an account, you agree to our{" "}
            <span className="text-[#5B21B6] font-medium">Terms</span> &{" "}
            <span className="text-[#5B21B6] font-medium">Privacy Policy</span>.
          </div>
        </div>
      </div>
    </div>
  )
}
