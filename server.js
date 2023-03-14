import dotenv from "dotenv"
dotenv.config()
import express from "express"
const app = express()
import cors from "cors"
import morgan from "morgan"
import multer from "multer"
import mongoClient from "./src/config/db.js"

const PORT = process.env.PORT || 8000

// Connect DB
mongoClient()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// import routes
import authRouter from "./src/routers/authRouter.js"

// use routers
app.use("/api/auth", authRouter)

// Global error handler
app.use((error, req, res, next) => {
  const errorStatus = error.status || 500
  const errorMsg = error.message || "Something went wrong!"

  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMsg,
    stack: error.stack,
  })
})

app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`Backend server is running at http://localhost:${PORT}`)
})