import { DataTypes, Model, Sequelize } from "sequelize"
import { Database } from "../src/database"

export class Upload extends Model {
  public filename!: string
  public path!: string
  // Lägg till fler attribut för uppladdningstabellen
}

export function initializeUploadModel(database: Database): void {
  const sequelize = database.getSequelizeInstance()

  Upload.init(
    {
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // Lägg till fler attribut för uppladdningstabellen
    },
    {
      sequelize,
      modelName: "Upload",
    }
  )
}
