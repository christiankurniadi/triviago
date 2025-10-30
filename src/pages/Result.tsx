import { Link, useLocation, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useEffect } from "react"
import Cookies from "js-cookie"

export default function Result() {
  const navigate = useNavigate()
  useEffect(() => {
    const token = Cookies.get("access_token")
    if (!token) {
      navigate("/")
    }
  }, [navigate])
  const location = useLocation()

  const {
    totalQuestions = 0,
    totalCorrect = 0,
    totalIncorrect = 0,
    totalAnswered = 0,
    score = 0,
    timeLeft = 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = (location.state as any) || {}

  const formattedTime = `${Math.floor(timeLeft / 60)
    .toString()
    .padStart(1, "0")}:${(timeLeft % 60).toString().padStart(2, "0")}`

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#3c127f] relative overflow-hidden text-white px-4 pt-20">
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#5B21B6"
              fillOpacity="1"
              d="M0,96L12.6,117.3C25.3,139,51,181,76,181.3C101.1,181,126,139,152,133.3C176.8,128,202,160,227,149.3C252.6,139,278,85,303,69.3C328.4,53,354,75,379,69.3C404.2,64,429,32,455,16C480,0,505,0,531,10.7C555.8,21,581,43,606,48C631.6,53,657,43,682,37.3C707.4,32,733,32,758,26.7C783.2,21,808,11,834,21.3C858.9,32,884,64,909,69.3C934.7,75,960,53,985,85.3C1010.5,117,1036,203,1061,202.7C1086.3,203,1112,117,1137,85.3C1162.1,53,1187,75,1213,112C1237.9,149,1263,203,1288,213.3C1313.7,224,1339,192,1364,154.7C1389.5,117,1415,75,1427,53.3L1440,32L1440,320L1427.4,320C1414.7,320,1389,320,1364,320C1338.9,320,1314,320,1288,320C1263.2,320,1238,320,1213,320C1187.4,320,1162,320,1137,320C1111.6,320,1086,320,1061,320C1035.8,320,1011,320,985,320C960,320,935,320,909,320C884.2,320,859,320,834,320C808.4,320,783,320,758,320C732.6,320,707,320,682,320C656.8,320,632,320,606,320C581.1,320,556,320,531,320C505.3,320,480,320,455,320C429.5,320,404,320,379,320C353.7,320,328,320,303,320C277.9,320,253,320,227,320C202.1,320,177,320,152,320C126.3,320,101,320,76,320C50.5,320,25,320,13,320L0,320Z"
            ></path>
          </svg>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-2xl text-center z-10 w-full max-w-md">
          <h1 className="text-4xl font-extrabold mb-4 text-yellow-300">
            🎉 Quiz Complete!
          </h1>
          <p className="text-pink-100 mb-8">Great job! Here's how you did 👇</p>

          <div className="flex flex-col gap-4 text-lg">
            <div className="bg-white/20 rounded-xl py-3 font-semibold">
              ⏱ Time Left:{" "}
              <span className="text-yellow-300">{formattedTime}</span>
            </div>
            <div className="bg-white/20 rounded-xl py-3 font-semibold">
              🏆 Score:{" "}
              <span className="text-yellow-300">
                {score} / {totalQuestions}
              </span>
            </div>
            <div className="bg-white/20 rounded-xl py-3 font-semibold">
              ✅ Correct Answers:{" "}
              <span className="text-green-400">{totalCorrect}</span>
            </div>
            <div className="bg-white/20 rounded-xl py-3 font-semibold">
              ❌ Incorrect Answers:{" "}
              <span className="text-red-400">{totalIncorrect}</span>
            </div>
            <div className="bg-white/20 rounded-xl py-3 font-semibold">
              ✏️ Total Answered:{" "}
              <span className="text-yellow-300">{totalAnswered}</span>
            </div>
          </div>

          <Link
            to="/"
            className="mt-8 bg-[#F472B6] hover:bg-[#f58ac2] inline-block text-white font-bold py-3 px-10 rounded-full shadow-lg hover:scale-105 transition-all"
          >
            🔁 Play Again
          </Link>
        </div>
      </div>
    </>
  )
}
