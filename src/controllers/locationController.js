import Location from "../models/Location.js";

export const getAllLocations = async (req, res) => {
    try {
        const locations = await Location.findAll();
        res.json(locations);
    } catch (error) {
        console.error("Error details:", error); // Log the error details
        res.status(500).json({ message: "Error retrieving locations" });
    }
};

export const getLocationById = async (req, res) => {
    try {
        const location = await Location.findByPk(req.params.location_id);
        console.log("Requested location_id:", req.params.location_id); // Log the requested location_id
        console.log("Location object:", location); // Log the entire location object
        if (!location) {
            return res.status(404).json({ message: "Location not found." });
        }
        res.json(location);
    } catch (error) {
        console.error("Error details:", error); // Log the error details
        res.status(500).json({ message: "Error retrieving location." });
    }
};

export const createLocation = async (req, res) => {
    try {
        const location = await Location.create(req.body);
        res.status(201).json(location);
    } catch (error) {
        console.error("Error details:", error); // Log the error details
        res.status(500).json({ message: "Error creating location." });
    }
};

export const updateLocation = async (req, res) => {
    try {
        const [updatedRows] = await Location.update(req.body, {
            where: { location_id: req.params.location_id },
        });

        if (!updatedRows)
            return res.status(404).json({ message: "Location not found." });
        res.json({ message: "Location updated." });
    } catch (error) {
        console.error("Error details:", error); // Log the error details
        res.status(500).json({ message: "Error updating location." });
    }
};

export const deleteLocation = async (req, res) => {
    try {
        const deletedRows = await Location.destroy({
            where: { location_id: req.params.location_id },
        });

        if (!deletedRows)
            return res.status(404).json({ message: "Location not found." });
        res.json({ message: "Location deleted." });
    } catch (error) {
        console.error("Error details:", error); // Log the error details
        res.status(500).json({ message: "Error deleting location." });
    }
};
