import EnergyUsage from "../models/EnergyUsage.js";
import { Op } from 'sequelize';

export const getAllEnergyUsages = async (req, res) => {
    try {
        const { household_id, date } = req.query;

        let whereClause = {};

        if (household_id) {
            whereClause.household_id = household_id;
        }

        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
        
            whereClause.reading_time = {
                [Op.between]: [startDate, endDate]
            };
        }
        

        const energyUsages = await EnergyUsage.findAll({ where: whereClause});
        
        const processedData = energyUsages.map(usage => ({
            ...usage.get(),
            usage_id: Number(usage.get().usage_id),
            energy_usage: Number(usage.get().energy_usage)
        }));

        res.json(processedData);
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
