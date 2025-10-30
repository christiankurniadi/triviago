import callAPI from "../config/api"

const ROOT_API = "https://opentdb.com"

export async function getCategories() {
  const url = `${ROOT_API}/api_category.php`

  return callAPI({
    url,
    method: "GET",
    token: false,
  })
}

export async function getQuestions(params: {
  amount: number
  category: number
  difficulty: "easy" | "medium" | "hard"
}) {
  const url = `${ROOT_API}/api.php`

  return callAPI({
    url,
    method: "GET",
    params: {
      amount: params.amount,
      category: params.category,
      difficulty: params.difficulty,
      type: "multiple",
    },
    token: false,
  })
}
