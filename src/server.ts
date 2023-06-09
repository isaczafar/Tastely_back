import express, { Request, Response } from "express"
import { Database } from "./database"
import { Recipe } from "../models/Recipe"
import { User } from "../models/User"
import { initializeUploadModel, Upload } from "../models/Upload"
import dotenv from "dotenv"
import { Sequelize } from "sequelize"
import cors from "cors"
import session from "express-session"
import multer from "multer"

declare module "express-session" {
  interface Session {
    user?: {
      username: string
    }
  }
}

dotenv.config()

const app = express()
const port = process.env.PORT || 8080

const database = new Database()

app.use(express.json())

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
)

app.get("/", (req, res) => {
  res.send("Hello, World!")
})

app.post("/login", (req, res) => {
  const { username, password } = req.body

  req.session.user = { username }

  res.send("Logged in successfully")
})

app.get("/check-login", (req, res) => {
  if (req.session.user) {
    res.send("User is logged in")
  } else {
    res.send("User is not logged in")
  }
})

app.post("/signup", async (req: Request, res: Response) => {
  const { username, password } = req.body

  res.json({ success: true })
})

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err)
      res.status(500).json({ error: "Failed to destroy session" })
    } else {
      res.send("Logged out successfully")
    }
  })
})

const sequelize = new Sequelize(process.env.DATABASEURL!, {
  dialect: "postgres",
  ssl: true,
})

initializeUploadModel(database)

database.connect()

app.use(express.json())
app.use(cors())

app.get("/", async (req, res) => {
  res.send("Hello, World!")
})

app.get("/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.findAll()
    res.json(recipes)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.post("/recipes", async (req, res) => {
  try {
    const {
      name,
      description,
      ingredients,
      instructions,
      cookTime,
      servings,
      image,
      creator,
    } = req.body

    const recipe = await Recipe.create({
      name,
      description,
      ingredients,
      instructions,
      cookTime,
      servings,
      image,
      creator,
    })

    res.json(recipe)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.get("/recipes/:id", async (req, res) => {
  try {
    const recipeId = req.params.id
    const recipe = await Recipe.findByPk(recipeId)

    if (!recipe) {
      res.status(404).json({ error: "Recipe not found" })
    } else {
      res.json(recipe)
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Register endpoint
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" })
    }

    // Create a new user
    const user = await User.create({ name, email, password })

    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/")
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

const upload = multer({ storage: storage })

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Ingen fil vald" })
  }

  // Use the Upload model here if needed
  const uploadInstance = new Upload({ fileName: req.file.filename })
  uploadInstance.save()

  return res.status(200).json({ message: "Filen har laddats upp" })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

database.connect()
console.log(`Server is running on port ${port}`)
