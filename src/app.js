import express from "express";
import householdRoutes from "./routes/householdRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import energyUsageRoutes from "./routes/energyUsageRoutes.js";
import './utils/associations.js'


const app = express();

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount the provider routes on the app
app.use("/households", householdRoutes);
app.use("/locations", locationRoutes);
app.use("/energy_usages", energyUsageRoutes);

const port = process.env.PORT || 3000;

export { app, port };
