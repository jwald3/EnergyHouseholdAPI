import EnergyUsage from "../models/EnergyUsage.js";

export const getAllEnergyUsages = async (req, res) => {
    try {
        const energyUsages = await EnergyUsage.findAll();
        res.json(energyUsages);
    } catch (error) {
        console.error("Error details:", error); // Log the error details
        res.status(500).json({ message: "Error retrieving EnergyUsages" });
    }
};

export const getEnergyUsageById = async (req, res) => {
    try {
        const energyUsage = await EnergyUsage.findByPk(req.params.usage_id);
        if (!energyUsage)
            return res.status(404).json({ message: "EnergyUsage not found." });
        res.json(energyUsage);
    } catch (error) {
        console.error("Error details:", error); // Log the error details
        res.status(500).json({ message: "Error retrieving EnergyUsage." });
    }
};

export const createEnergyUsage = async (req, res) => {
    try {
        const energyUsage = await EnergyUsage.create(req.body);
        res.status(201).json(energyUsage);
    } catch (error) {
        console.error("Error details:", error); // Log the error details
        res.status(500).json({ message: "Error creating EnergyUsage." });
    }
};

export const updateEnergyUsage = async (req, res) => {
    try {
        const [updatedRows] = await EnergyUsage.update(req.body, {
            where: { usage_id: req.params.usage_id },
        });

        if (!updatedRows)
            return res.status(404).json({ message: "EnergyUsage not found." });
        res.json({ message: "EnergyUsage updated." });
    } catch (error) {
        console.error("Error details:", error); // Log the error details
        res.status(500).json({ message: "Error updating EnergyUsage." });
    }
};

export const deleteEnergyUsage = async (req, res) => {
    try {
        const deletedRows = await EnergyUsage.destroy({
            where: { usage_id: req.params.usage_id },
        });

        if (!deletedRows)
            return res.status(404).json({ message: "EnergyUsage not found." });
        res.json({ message: "EnergyUsage deleted." });
    } catch (error) {
        console.error("Error details:", error); // Log the error details
        res.status(500).json({ message: "Error deleting EnergyUsage." });
    }
};
