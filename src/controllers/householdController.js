import Household from "../models/Household.js";
import Location from "../models/Location.js";
import { getLocationId } from "../services/locationService.js";
import '../utils/associations.js'

export const getAllHouseholds = async (req, res) => {
    try {
        const { provider_id, region_id } = req.query;

        let whereClause = {};
        let includeClause = [{
            model: Location,
            as: 'location', // Alias, it could be any name you prefer
        }];

        if (provider_id) {
            whereClause.provider_id = provider_id;
        }

        if (region_id) {
            includeClause[0].where = { region_id }; // Add the region_id filter
        }

        const households = await Household.findAll({
            where: whereClause,
            include: includeClause
        });
        res.json(households);
    } catch (error) {
        console.error("Error details:", error); // Log the error details
        res.status(500).json({ message: "Error retrieving households" });
    }
};



export const getHouseholdById = async (req, res) => {
    try {
        const household = await Household.findByPk(req.params.household_id);
        if (!household)
            return res.status(404).json({ message: "Household not found." });
        res.json(household);
    } catch (error) {
        console.error("Error details:", error); // Log the error details
        res.status(500).json({ message: "Error retrieving husehold." });
    }
};

export const createHousehold = async (req, res) => {
    try {
        const { city, state_id, zip_code, ...rest } = req.body;

        // Fetch the location_id
        const location_id = await getLocationId(city, state_id, zip_code);

        // If the location wasn't found, return an error response.
        if (!location_id) {
            return res.status(400).json({ message: "Invalid location." });
        }

        // Create a new household with the fetched location_id
        const household = await Household.create({ location_id, ...rest });

        res.status(201).json(household);
    } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ message: "Error creating Household." });
    }
};


export const updateHousehold = async (req, res) => {
    try {
        const [updatedRows] = await Household.update(req.body, {
            where: { household_id: req.params.household_id },
        });

        if (!updatedRows)
            return res.status(404).json({ message: "Household not found." });
        res.json({ message: "Household updated." });
    } catch (error) {
        console.error("Error details:", error); // Log the error details
        res.status(500).json({ message: "Error updating household." });
    }
};

export const deleteHousehold = async (req, res) => {
    try {
        const deletedRows = await Household.destroy({
            where: { household_id: req.params.household_id },
        });

        if (!deletedRows)
            return res.status(404).json({ message: "Household not found." });
        res.json({ message: "Household deleted." });
    } catch (error) {
        console.error("Error details:", error); // Log the error details
        res.status(500).json({ message: "Error deleting household." });
    }
};
