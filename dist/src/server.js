"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./database");
const Recipe_1 = require("../models/Recipe");
const User_1 = require("../models/User");
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
const database = new database_1.Database();
(async () => await database.connect())();
const sequelize = new sequelize_1.Sequelize(process.env.DATABASEURL, {
    dialect: 'postgres',
    ssl: true,
});
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get('/', async (req, res) => {
    res.send('Hello, World!');
});
app.get('/recipe', async (req, res) => {
    try {
        const recipes = await Recipe_1.Recipe.findAll();
        res.json(recipes);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/recipe', async (req, res) => {
    try {
        const { name, description, ingredients, instructions, cookTime, servings, image, creator, } = req.body;
        const recipe = await Recipe_1.Recipe.create({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/recipe/:id', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const recipe = await Recipe_1.Recipe.findByPk(recipeId);
        if (!recipe) {
            res.status(404).json({ error: 'Recipe not found' });
        }
        else {
            res.json(recipe);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User_1.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }
        const user = await User_1.User.create({ name, email, password });
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.password !== password) {
            return res.status(401).json({ error: 'Incorrect password' });
        }
        res.json({ message: 'Login successful', user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
