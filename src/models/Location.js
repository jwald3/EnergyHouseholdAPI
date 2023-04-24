import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database.js";

class Location extends Model {}

Location.init(
    {
        location_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        state_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        city: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        zip_code: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Location",
        tableName: "locations",
        timestamps: false,
    }
);

export default Location;
