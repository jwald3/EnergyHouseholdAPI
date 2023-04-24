import { app, port } from "./app.js";
import sequelize from "./utils/database.js";

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connection has been established successfully.");

        app.listen(port, () => {
            console.log(`Households API is running on port ${port}`);
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
})();
