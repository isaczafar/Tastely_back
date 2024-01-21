import type { Sequelize } from "sequelize";
import config from "../config/db.config";
import { sequelize } from "../models";
class Database {
    private sequelize: Sequelize;
    private database: string;
    private username: string;
    private password: string;
    private host: string;
    private port: number;
    private url: URL;
    public roles: string[];

    constructor(sequelize: Sequelize) {
        this.url = new URL(config.DATABASEURL!);
        this.database = config.PGDATABASE!;
        this.username = config.PGUSER!;
        this.password = config.PGPASSWORD!;
        this.host = config.PGHOST!;
        this.port = parseInt(config.PGPORT!);
        this.roles = ["user", "admin", "mod"];
        this.sequelize = sequelize;
    }
    get getSequelize() {
        return this.sequelize;
    }
    model(name: string) {
        try {
            let model = this.getSequelize.model(name);
            return model;
        } catch (err) {
            console.error(err);
            throw new Error("NO SUCH model");
        }
    }
    async connect() {
        try {
            await this.sequelize.authenticate();
            console.log("Connected to the database");
            await this.sequelize.sync();
            console.log("Models synced with the database");
        } catch (error) {
            console.error("Error connecting to the database", error);
        }
    }
}
const database = new Database(sequelize);
export default database;
