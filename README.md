# Quiz App 🎯

A simple and interactive quiz web application built with **React** and **TypeScript**, featuring user authentication, a countdown timer, and the ability to resume unfinished quizzes using local storage.

---

## 🚀 Features

- 🧠 **Dynamic Quiz System** — Questions are fetched from the [OpenTDB API](https://opentdb.com/).
- 🔐 **Authentication** — Simple login and registration using an Express.js API.
- 🕒 **Timer Logic** — Time limit is dynamically adjusted based on question difficulty and total questions.
- 💾 **Resume Quiz** — Progress is saved in local storage so users can continue where they left off.
- 📊 **Result Page** — Displays the user’s score after the quiz ends.
- 🎨 **Responsive UI** — Clean and minimal layout for both desktop and mobile.

---

## ⚙️ Tech Stack

**Frontend:**

- React (TypeScript)
- React Router
- CSS / Tailwind

**Backend:**

- Node.js
- Express.js

**Data Storage:**

- Cookies → for user session (token, name, email)
- LocalStorage → for quiz progress (resume feature)

## Attribution

- Illustration from [Iconscout](https://iconscout.com/contributors/woobrodesign)
