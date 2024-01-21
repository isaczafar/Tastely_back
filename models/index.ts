import { Sequelize } from "sequelize";
import RecipieModel from "./recipe.model";
import UserModel from "./user.model";
import ProfileModel from "./Profile.model";
import TokenModel from "./Token.model";
import UserTokenModel from "./Token.model";
import RoleModel from "./Role.model";
import IngredientModel from "./ingredients.model";
import RecipieIngredientModel from "./recipieIngredient.model";
import config from "../config/db.config";
const sequelize = new Sequelize(
    config.PGDATABASE!,
    config.PGUSER!,
    config.PGPASSWORD!,
    {
        dialect: "postgres",
        logging: false,
        host: config.PGHOST,
        port: parseInt(config.PGPORT!),
        ssl: true,
        dialectOptions: {
            ssl: true,
        },
    },
);

const Ingredient = IngredientModel(sequelize);
const Recipie = RecipieModel(sequelize);
const User = UserModel(sequelize);
const Profile = ProfileModel(sequelize);
const Token = TokenModel(sequelize);
const Role = RoleModel(sequelize);
const UserToken = UserTokenModel(sequelize);
const RecipieIngredient = RecipieIngredientModel(sequelize);

User.hasOne(Profile, { foreignKey: "user_id" });
Profile.belongsTo(User);

Profile.hasMany(Recipie, { foreignKey: "profile_id" });
Recipie.belongsTo(Profile, { foreignKey: "profile_id" });

Recipie.belongsToMany(Ingredient, {
    through: RecipieIngredient,
    foreignKey: "recipie_id",
    otherKey: "ingredient_id",
});
Ingredient.belongsToMany(Recipie, {
    through: RecipieIngredient,
    foreignKey: "ingredient_id",
    otherKey: "recipie_id",
});

User.hasMany(Token, {
    foreignKey: "user_id",
});
Token.belongsTo(User, { foreignKey: "user_id" });

Role.belongsToMany(User, {
    through: "user_roles",
});
User.belongsToMany(Role, {
    through: "user_roles",
});

export {
    User,
    Profile,
    Recipie,
    Ingredient,
    RecipieIngredient,
    Role,
    Token,
    UserToken,
    sequelize,
};
