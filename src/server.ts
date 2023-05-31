import express, { Request, Response } from "express"
import { Database } from "./database"
import express from 'express';
import { Database } from './database';
import { Recipe } from '../models/Recipe';
import dotenv from 'dotenv';
import { Sequelize, ModelCtor } from 'sequelize';
import cors from 'cors';

dotenv.config();

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
const database = new Database();
(async () => await database.connect())();

const sequelize = new Sequelize(process.env.DATABASEURL!, {
  dialect: 'postgres',
  ssl: true,
});

app.use(express.json());
app.use(cors());

app.get('/', async (req, res) => {
  res.send('Hello, World!');
});

app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/recipes', async (req, res) => {
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
    } = req.body;

    const recipe = await Recipe.create({
      name,
      description,
      ingredients,
      instructions,
      cookTime,
      servings,
      image,
      creator,
    });

    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/recipes/:id', async (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findByPk(recipeId);

    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
    } else {
      res.json(recipe);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

const database = new Database()
database.connect()
  console.log(`Server is running on port ${port}`);
});
