"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./database");
const Recipe_1 = require("../models/Recipe");
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
const database = new database_1.Database();
(async () => await database.connect())();
// await database.connect();
const sequelize = new sequelize_1.Sequelize(process.env.DATABASEURL, {
    dialect: 'postgres',
    ssl: true,
});
app.use(express_1.default.json());
app.get('/', async (req, res) => {
    // res.send('Hello, World!');
    res.send(await Recipe_1.Recipe.findAll());
});
app.get('/recipes', async (req, res) => {
    // res.send('Hello, World!');
    res.send(await Recipe_1.Recipe.findAll());
});
app.post('/recipes', async (req, res) => {
    try {
        console.log("test");
        const { name, description, ingredients, instructions } = req.body;
        console.log(req.body);
        // const RecipeModel: ModelCtor<any> = sequelize.models.Recipe; 
        const recipe = await Recipe_1.Recipe.create({
            name,
            description,
            ingredients,
            instructions,
        });
        res.json(recipe);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
