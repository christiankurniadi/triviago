import axios, { type AxiosRequestConfig } from "axios"
import Cookies from "js-cookie"

interface CallAPIProps extends AxiosRequestConfig {
  token?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any> // Add this
}

export default async function callAPI({
  url,
  method,
  data,
  token,
  params,
}: CallAPIProps) {
  const headers: Record<string, string> = {}

  if (token) {
    const tokenCookies = Cookies.get("access_token")
    if (tokenCookies) {
      const decodedToken = atob(tokenCookies)
      headers.Authorization = `Bearer ${decodedToken}`
    }
  }

  try {
    const response = await axios({
      url,
      method,
      data,
      headers,
      params,
    })

    // ✅ Fix: use response.data if response.data.data doesn't exist
    const resultData = response.data.data ?? response.data

    return {
      error: false,
      message: "success",
      data: resultData,
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return {
      error: true,
      message: err.response?.data?.message || "Something went wrong",
      data: null,
    }
  }
}
