import express from 'express';
import { Database } from './database';
import { Recipe } from '../models/Recipe';
import dotenv from 'dotenv';
import { Sequelize, ModelCtor } from 'sequelize';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

const database = new Database();
(async() => await database.connect())();
// await database.connect();

const sequelize = new Sequelize(process.env.DATABASEURL!, {
  dialect: 'postgres',
  ssl: true, 
});

app.use(express.json());

app.get('/', async(req, res) => {
  // res.send('Hello, World!');
  res.send(await Recipe.findAll());
});

app.get('/recipes', async(req, res) => {
  // res.send('Hello, World!');
  res.send(await Recipe.findAll());
});

app.post('/recipes', async (req, res) => {
  try {
    console.log("test");
    const { name, description, ingredients, instructions } = req.body;
    console.log(req.body)

    // const RecipeModel: ModelCtor<any> = sequelize.models.Recipe; 

    const recipe = await Recipe.create({
      name,
      description,
      ingredients,
      instructions,
    });

    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
