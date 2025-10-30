import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { getQuestions, getCategories } from "../services/opentdb"
import { toast } from "react-toastify"
import Cookies from "js-cookie"

export default function StartQuiz() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  )
  const [category, setCategory] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [questions, setQuestions] = useState(5)
  const [loading, setLoading] = useState(false)
  const [showResumeModal, setShowResumeModal] = useState(false)

  useEffect(() => {
    const token = Cookies.get("access_token")

    if (token) {
      const savedQuizState = localStorage.getItem("quizState")

      if (savedQuizState) {
        try {
          const parsedState = JSON.parse(savedQuizState)
          const savedUserEmail = parsedState.userEmail

          const encodedUserEmail = Cookies.get("userEmail")
          const currentUserEmail = encodedUserEmail
            ? JSON.parse(atob(encodedUserEmail))
            : null

          if (
            savedUserEmail &&
            currentUserEmail &&
            savedUserEmail === currentUserEmail
          ) {
            setShowResumeModal(true)
          } else {
            clearQuizData()
          }
        } catch (error) {
          console.error("Error parsing saved quiz state:", error)
          clearQuizData()
        }
      }
    }
  }, [])

  const clearQuizData = () => {
    localStorage.removeItem("quizState")
    for (let i = 0; i < 50; i++) {
      localStorage.removeItem(`answer-${i}`)
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories()
        setCategories(response.data.trivia_categories)
      } catch (err) {
        console.error("Failed to load categories:", err)
      }
    }
    fetchCategories()
  }, [])

  const handleResumeQuiz = () => {
    setShowResumeModal(false)
    navigate("/quiz")
  }

  const handleStartFresh = () => {
    clearQuizData()
    setShowResumeModal(false)
    toast.info("Previous quiz cleared. Start a new one!")
  }

  const handleStart = async () => {
    const token = Cookies.get("access_token")

    if (!token) {
      toast.error("You need to log in first!")
      return
    }
    if (!category || !difficulty || !questions) {
      toast.error("Please fill all fields")
      return
    }

    setLoading(true)
    try {
      const data = await getQuestions({
        amount: questions,
        category: parseInt(category),
        difficulty: difficulty as "easy" | "medium" | "hard",
      })

      navigate("/quiz", { state: { questions: data } })
    } catch (err) {
      console.error("Error fetching questions:", err)
      alert("Failed to start quiz, please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#3c127f] relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#5B21B6"
              fillOpacity="1"
              d="M0,96L12.6,117.3C25.3,139,51,181,76,181.3C101.1,181,126,139,152,133.3C176.8,128,202,160,227,149.3C252.6,139,278,85,303,69.3C328.4,53,354,75,379,69.3C404.2,64,429,32,455,16C480,0,505,0,531,10.7C555.8,21,581,43,606,48C631.6,53,657,43,682,37.3C707.4,32,733,32,758,26.7C783.2,21,808,11,834,21.3C858.9,32,884,64,909,69.3C934.7,75,960,53,985,85.3C1010.5,117,1036,203,1061,202.7C1086.3,203,1112,117,1137,85.3C1162.1,53,1187,75,1213,112C1237.9,149,1263,203,1288,213.3C1313.7,224,1339,192,1364,154.7C1389.5,117,1415,75,1427,53.3L1440,32L1440,320L1427.4,320C1414.7,320,1389,320,1364,320C1338.9,320,1314,320,1288,320C1263.2,320,1238,320,1213,320C1187.4,320,1162,320,1137,320C1111.6,320,1086,320,1061,320C1035.8,320,1011,320,985,320C960,320,935,320,909,320C884.2,320,859,320,834,320C808.4,320,783,320,758,320C732.6,320,707,320,682,320C656.8,320,632,320,606,320C581.1,320,556,320,531,320C505.3,320,480,320,455,320C429.5,320,404,320,379,320C353.7,320,328,320,303,320C277.9,320,253,320,227,320C202.1,320,177,320,152,320C126.3,320,101,320,76,320C50.5,320,25,320,13,320L0,320Z"
            ></path>
          </svg>
        </div>

        <div className="text-center mb-8 z-10">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            🎯 Ready to Start Your Quiz?
          </h1>
          <p className="text-pink-100">Choose your preferences and let's go!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-11/12 sm:w-[700px] z-10">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-lg text-white">
            <label className="block mb-2 font-semibold">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 rounded-lg bg-white/20 text-white focus:bg-white/30 outline-none"
            >
              <option value="" className="text-black bg-white/20">
                Select Category
              </option>
              {categories.map((cat) => (
                <option
                  key={cat.id}
                  value={cat.id}
                  className="text-black bg-white/20"
                >
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-lg text-white">
            <label className="block mb-2 font-semibold">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-2 rounded-lg bg-white/20 focus:bg-white/30 outline-none"
            >
              <option className="text-black" value="">
                Select Difficulty
              </option>
              <option className="text-black" value="easy">
                Easy
              </option>
              <option className="text-black" value="medium">
                Medium
              </option>
              <option className="text-black" value="hard">
                Hard
              </option>
            </select>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-lg text-white">
            <label className="block mb-2 font-semibold">
              Number of Questions
            </label>
            <select
              value={questions}
              onChange={(e) => setQuestions(parseInt(e.target.value))}
              className="w-full p-2 rounded-lg bg-white/20 focus:bg-white/30 outline-none"
            >
              <option className="text-black" value="">
                Select Amount
              </option>
              <option className="text-black" value="3">
                3
              </option>
              <option className="text-black" value="5">
                5
              </option>
              <option className="text-black" value="10">
                10
              </option>
            </select>
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={loading}
          className={`mt-8 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#FACC15] hover:bg-yellow-400"
          } text-[#5B21B6] font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-all z-10`}
        >
          🚀 Start Quiz
        </button>

        {showResumeModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <h2 className="text-2xl font-bold text-[#5B21B6] mb-4">
                🎮 Ongoing Quiz Detected!
              </h2>
              <p className="text-gray-700 mb-6">
                You have an unfinished quiz. Would you like to continue where
                you left off, or start a new quiz?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleResumeQuiz}
                  className="flex-1 bg-[#FACC15] hover:bg-yellow-400 text-[#5B21B6] font-bold py-3 px-6 rounded-full shadow-lg hover:scale-105 transition-all"
                >
                  Continue Quiz
                </button>
                <button
                  onClick={handleStartFresh}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-full shadow-lg hover:scale-105 transition-all"
                >
                  Start Fresh
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
