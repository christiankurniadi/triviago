import callAPI from "../config/api"

interface LoginTypes {
  email: string
  password: string
}

interface RegisterTypes {
  name: string
  email: string
  password: string
}

const ROOT_API = import.meta.env.VITE_TRIVIAGO_API
const API_VERSION = "api/v1"

export async function setSignUp(data: RegisterTypes) {
  const url = `${ROOT_API}/${API_VERSION}/auth/register`

  return callAPI({
    url,
    method: "POST",
    data,
  })
}

export async function setLogin(data: LoginTypes) {
  const url = `${ROOT_API}/${API_VERSION}/auth/login`

  return callAPI({
    url,
    method: "POST",
    data,
  })
}
