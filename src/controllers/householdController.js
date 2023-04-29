import Household from "../models/Household.js";

export const getAllHouseholds = async (req, res) => {
    try {
        const households = await Household.findAll();
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
        const household = await Household.create(req.body);
        res.status(201).json(household);
    } catch (error) {
        console.error("Error details:", error); // Log the error details
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
