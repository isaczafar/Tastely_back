Object.defineProperty(Object.prototype, "getType", {
    get: function () {
        let string = /function\s([^(]{1,})\(/.exec(this.constructor.toString());
        return string && string.length > 1 ? string[1].trim() : "";
    },
    set: function (val) {},
});

import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Request, Response } from "express";
import database from "./database";
import cors from "cors";
import session from "express-session";
import multer from "multer";
import path from "path";
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { responseEncoding } from "axios";
import populate from "./populate";
import {
    recipieRouter,
    userRounter,
    authRouter,
    ingredientRouter,
    commonRouter,
} from "../Router";
import authController from "../Controllers/auth.controller";

declare module "express-session" {
    interface Session {
        user?: {
            username: string;
        };
        user_id: string;
    }
}

const app = express();
const port = 8080;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../frontend/public/uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept",
    );
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const upload = multer({ storage: storage });
app.use(cors());

async function getModel(req: Request, res: Response, next: NextFunction) {
    let modelParam = req.params.model;
    console.log(req);
    if (req.params && req.params.model) {
        let modelNames = Object.keys(database.getSequelize.models);

        res.locals.reqData.model = modelParam.toLowerCase();

        if (modelParam == "populate") {
            res.locals.reqData.model = modelParam.toLowerCase();
            next();
            return;
        } else {
        }
    } else {
        res.locals.reqData.model = req.baseUrl
            .split("/")
            .filter((e) => e.length > 0)[0];
    }
    next();
}
app.use(
    cookieSession({
        name: "session",
        maxAge: 5 * 60 * 1000,
        keys: ["user_id", "token"],
    }),
);
app.use((req, res, next) => {
    if (!res.locals.reqData) {
        res.locals.reqData = {};
    }
    if (!res.locals.cookies) {
        let { user_id, token } = req.body;
        res.locals.cookies = {};
        res.locals.cookies.user_id = user_id;
        res.locals.cookies.token = token;
    }

    next();
});

//app.use("/populate", populate);
//app.use("/auth", router.authenticate);
/* app.use("/:model", getModel, router, (req, res, next) => {
    console.log("BAJS");
    res.json(res.locals);
}); */

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({ welcome: "message" });
});

app.use("/recipie", getModel, authController.verifyToken, recipieRouter);
app.use("/user", getModel, authController.verifyToken, userRounter);
app.use("/auth", getModel, authRouter);
app.use("/ingredient", getModel, authController.verifyToken, ingredientRouter);
app.get("/populate", populate);
app.post("/populate", populate);
app.use("/:model", getModel, authController.verifyToken, commonRouter);
/*
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    req.session.user = { username };

    res.send("Logged in successfully");
});

app.get("/check-login", (req, res) => {
    if (req.session.user) {
        res.send("User is logged in");
    } else {
        res.send("User is not logged in");
    }
});
app.get("/populate", populate);

app.post("/signup", async (req: Request, res: Response) => {
    const { username, password } = req.body;

    res.json({ success: true });
});

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to destroy session" });
        } else {
            res.send("Logged out successfully");
        }
    });
});

app.get("/recipes", async (req, res) => {
    try {
        const recipes = await Recipe.findAll();
        res.json(recipes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

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
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/recipes/:id", async (req, res) => {
    try {
        const recipeId = req.params.id;
        const recipe = await Recipe.findByPk(recipeId);

        if (!recipe) {
            res.status(404).json({ error: "Recipe not found" });
        } else {
            res.json(recipe);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }

        const user = await User.create({ name, email, password });

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Ingen fil vald" });
    }
    let Upload = database.getSequelize.model("upload");
    const uploadInstance = await Upload.create({ fileName: req.file.filename });
    console.log("Filväg:", req.file.path);
    uploadInstance.save();

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
    }`;
    return res
        .status(200)
        .json({ fileName: req.file.filename, filePath: imageUrl });
});
*/
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    database.connect();
    console.log(database.getSequelize);
});
