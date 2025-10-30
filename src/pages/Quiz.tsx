import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Navbar from "../components/Navbar"
import Cookies from "js-cookie"

interface Question {
  category: string
  type: string
  difficulty: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

interface QuizState {
  currentQuestion: number
  selectedAnswer: string | null
  score: number
  timeLeft: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  questions?: any[]
  userEmail?: string
}

export default function Quiz() {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [questions, setQuestions] = useState<any[]>([])
  const [quizFinished, setQuizFinished] = useState(false)

  const decodeHTMLEntities = (text: string) => {
    const textarea = document.createElement("textarea")
    textarea.innerHTML = text
    return textarea.value
  }

  const shuffleArray = (array: string[]) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const saveQuizState = () => {
    const encodedUserEmail = Cookies.get("userEmail")
    const userEmail = encodedUserEmail
      ? JSON.parse(atob(encodedUserEmail))
      : null

    const quizState = {
      currentQuestion,
      selectedAnswer,
      score,
      timeLeft,
      questions,
      userEmail,
    }
    localStorage.setItem("quizState", JSON.stringify(quizState))
  }

  useEffect(() => {
    const fetchedQuestions = location.state?.questions?.data?.results

    const savedState = localStorage.getItem("quizState")

    if (savedState && !fetchedQuestions) {
      const parsed: QuizState = JSON.parse(savedState)
      if (parsed.questions && parsed.questions.length > 0) {
        setQuestions(parsed.questions)
        setCurrentQuestion(parsed.currentQuestion)
        setSelectedAnswer(parsed.selectedAnswer)
        setScore(parsed.score)
        setTimeLeft(parsed.timeLeft ?? 60)
      } else {
        localStorage.removeItem("quizState")
        navigate("/start-quiz")
      }
      return
    }

    if (!fetchedQuestions || fetchedQuestions.length === 0) {
      alert("No questions found. Redirecting to start page.")
      navigate("/start-quiz")
      return
    }

    const formattedQuestions = fetchedQuestions.map((q: Question) => ({
      question: decodeHTMLEntities(q.question),
      options: shuffleArray([
        ...q.incorrect_answers.map(decodeHTMLEntities),
        decodeHTMLEntities(q.correct_answer),
      ]),
      answer: decodeHTMLEntities(q.correct_answer),
      difficulty: q.difficulty,
    }))

    setQuestions(formattedQuestions)

    const difficulty = fetchedQuestions[0].difficulty
    let timePerQuestion = 20
    if (difficulty === "easy") timePerQuestion = 30
    else if (difficulty === "hard") timePerQuestion = 15
    const totalTime = timePerQuestion * fetchedQuestions.length

    if (savedState) {
      const parsed = JSON.parse(savedState)
      setCurrentQuestion(parsed.currentQuestion || 0)
      setSelectedAnswer(parsed.selectedAnswer || null)
      setScore(parsed.score || 0)
      setTimeLeft(parsed.timeLeft ?? totalTime)
    } else {
      setTimeLeft(totalTime)
    }
  }, [location.state, navigate])

  useEffect(() => {
    if (questions.length === 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1
        if (newTime <= 0) {
          clearInterval(timer)
          handleFinishWithTime(0)
          return 0
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions])

  useEffect(() => {
    if (questions.length > 0 && !quizFinished) {
      saveQuizState()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, selectedAnswer, score, timeLeft])

  const handleAnswer = (option: string) => {
    setSelectedAnswer(option)
    localStorage.setItem(`answer-${currentQuestion}`, option)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      if (selectedAnswer === questions[currentQuestion].answer) {
        setScore((prev) => prev + 1)
      }
      setCurrentQuestion(currentQuestion + 1)
      const nextAnswer = localStorage.getItem(`answer-${currentQuestion + 1}`)
      setSelectedAnswer(nextAnswer)
      saveQuizState()
    } else {
      handleFinishWithTime(timeLeft)
    }
  }

  const handleFinishWithTime = (finalTimeLeft: number) => {
    setQuizFinished(true)

    let totalCorrect = 0
    let totalAnswered = 0

    for (let i = 0; i <= currentQuestion; i++) {
      const answer = localStorage.getItem(`answer-${i}`)

      if (answer) {
        totalAnswered++

        if (answer === questions[i]?.answer) {
          totalCorrect++
        }
      }
    }

    if (selectedAnswer && !localStorage.getItem(`answer-${currentQuestion}`)) {
      totalAnswered++
      if (selectedAnswer === questions[currentQuestion]?.answer) {
        totalCorrect++
      }
    }

    const totalIncorrect = totalAnswered - totalCorrect

    localStorage.removeItem("quizState")
    questions.forEach((_, idx) => localStorage.removeItem(`answer-${idx}`))

    navigate("/result", {
      state: {
        totalQuestions: questions.length,
        totalCorrect,
        totalIncorrect,
        totalAnswered,
        score: totalCorrect,
        timeLeft: finalTimeLeft,
      },
    })
  }

  const formattedTime = `${Math.floor(timeLeft / 60)
    .toString()
    .padStart(1, "0")}:${(timeLeft % 60).toString().padStart(2, "0")}`

  if (questions.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-[#3c127f]">
          <p className="text-white text-xl">Loading questions...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#3c127f] relative overflow-hidden px-4 pt-20">
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#5B21B6"
              fillOpacity="1"
              d="M0,96L12.6,117.3C25.3,139,51,181,76,181.3C101.1,181,126,139,152,133.3C176.8,128,202,160,227,149.3C252.6,139,278,85,303,69.3C328.4,53,354,75,379,69.3C404.2,64,429,32,455,16C480,0,505,0,531,10.7C555.8,21,581,43,606,48C631.6,53,657,43,682,37.3C707.4,32,733,32,758,26.7C783.2,21,808,11,834,21.3C858.9,32,884,64,909,69.3C934.7,75,960,53,985,85.3C1010.5,117,1036,203,1061,202.7C1086.3,203,1112,117,1137,85.3C1162.1,53,1187,75,1213,112C1237.9,149,1263,203,1288,213.3C1313.7,224,1339,192,1364,154.7C1389.5,117,1415,75,1427,53.3L1440,32L1440,320L0,320Z"
            ></path>
          </svg>
        </div>

        <div className="bg-white/10 backdrop-blur-lg text-white p-8 rounded-3xl shadow-2xl w-full max-w-xl text-center z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
            Question {currentQuestion + 1} of {questions.length}
          </h2>
          <p className="text-lg sm:text-xl font-medium mb-6 text-pink-100">
            {questions[currentQuestion].question}
          </p>

          <div className="grid grid-cols-1 gap-3">
            {questions[currentQuestion].options.map(
              (option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={`py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-md ${
                    selectedAnswer === option
                      ? "bg-[#FACC15] text-[#5B21B6] scale-105"
                      : "bg-white/20 hover:bg-white/30"
                  }`}
                >
                  {option}
                </button>
              )
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className={`mt-8 ${
              !selectedAnswer
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#F472B6] hover:bg-[#F472B6]/80"
            } text-white font-bold py-3 px-10 rounded-full shadow-lg hover:scale-105 transition-all`}
          >
            {currentQuestion === questions.length - 1
              ? "End Quiz 🎉"
              : "Next ➡️"}
          </button>
        </div>

        <div className="absolute top-24 right-6 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md backdrop-blur-sm z-10">
          ⏱ {formattedTime}
        </div>
      </div>
    </>
  )
}
