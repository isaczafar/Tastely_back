import type {
    Model,
    ModelStatic,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    ForeignKey,
    AssociationOptions,
} from "sequelize";

interface TokenModel
    extends Model<
        InferAttributes<TokenModel>,
        InferCreationAttributes<TokenModel>
    > {
    id: CreationOptional<TokenModel>;
    createToken: (user: UserModel) => string | Promise<string>;
    verifyExp: (token: TokenModel) => boolean;
    token: string;
    expDate: Date;
    user_id: CreationOptional<number>;
    addUser: (user: UserModel) => Promise<UserModel>;
    getUser: () => Promise<UserModel>;
    hasUser: (user: UserModel) => Promise<boolean>;
    removeUser: (user: UserModel) => Promise<any>;
    createUser: (user: UserModel) => Promise<UserModel>;
}

interface UserModel
    extends Model<
        InferAttributes<UserModel>,
        InferCreationAttributes<UserModel>
    > {
    id: CreationOptional<number>;
    username: string;
    password: string;
    email: string;
    setRoles: (roles: RoleModel[] | number[]) => Promise<any>;
    getRoles: () => Promise<RoleModel[]>;
    addToken: (t: TokenModel) => Promise<TokenModel>;
    addTokens: (t: TokenModel[]) => Promise<TokenModel[]>;
    getToken: (t?: TokenModel) => Promise<TokenModel>;
    getTokens: () => Promise<TokenModel[]>;
    hasToken: (t: TokenModel) => Promise<TokenModel>;
    removeToken: (t: TokenModel) => Promise<TokenModel>;
    createToken: (t: TokenModel | any) => Promise<TokenModel>;
    setProfile: (x?: any) => Promise<any>;
    getProfile: (x?: any) => Promise<any>;
    createProfile: (x?: any) => Promise<any>;
    removeProfile: (x?: any) => Promise<any>;
}
interface RecipieIngredientModel
    extends Model<
        InferAttributes<RecipieIngredientModel>,
        InferCreationAttributes<RecipieIngredientModel>
    > {
    recipie_id?: CreationOptional<number>;
    ingredient_id?: CreationOptional<number>;
    unit: string;
    amount: number;
}
interface UserTokenModel
    extends Model<
        InferAttributes<UserTokenModel>,
        InferCreationAttributes<UserTokenModel>
    > {
    user_id: ForeignKey<number>;
    token_id: ForeignKey<number>;
}

interface RoleModel
    extends Model<
        InferAttributes<RoleModel>,
        InferCreationAttributes<RoleModel>
    > {
    id: CreationOptional<number>;
    name: string;
}
interface RecipeModel
    extends Model<
        InferAttributes<RecipeModel>,
        InferCreationAttributes<RecipeModel>
    > {
    id: CreationOptional<number>;
    name: string;
    description: CreationOptional<string>;
    instructions: CreationOptional<string[]>;
    image_url: CreationOptional<string>;
    dificulty: CreationOptional<number>;
    time: CreationOptional<number>;
    profile_id?: CreationOptional<ForeignKey<number>>;
    ingredients?: any;
    addIngredient: (
        x: IngredientModel,
        options?: { through: { unit: string; amount: number } },
    ) => Promise<RecipieIngredientModel>;
    getIngredients: () => Promise<IngredientModel>;
}
interface ProfileModel
    extends Model<
        InferAttributes<ProfileModel>,
        InferCreationAttributes<ProfileModel>
    > {
    id: CreationOptional<number>;
    avatar: CreationOptional<string>;
    first_name: CreationOptional<string>;
    last_name: CreationOptional<string>;
    bd_year: CreationOptional<string>;
    bd_month: CreationOptional<string>;
    bd_day: CreationOptional<string>;
    info_text: CreationOptional<string>;
    user_id: CreationOptional<ForeignKey<number>>;
}
interface IngredientModel
    extends Model<
        InferAttributes<IngredientModel>,
        InferCreationAttributes<IngredientModel>
    > {
    id: CreationOptional<number>;
    name: string;
    unit: string;
    getRecipies: () => Promise<RecipeModel>[];
    addRecipie: (
        x: RecipeModel,
        options?: { through: { unit: string; amount: number } },
    ) => Promise<RecipieIngredientModel>;
}
