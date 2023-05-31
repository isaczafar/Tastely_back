import express, { Request, Response } from "express"
import { Database } from "./database"

const app = express()
const port = process.env.PORT || 8080

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello, World!")
})

app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body

  res.json({ success: true })
})

app.post("/signup", async (req: Request, res: Response) => {
  const { username, password } = req.body

  res.json({ success: true })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

const database = new Database()
database.connect()
