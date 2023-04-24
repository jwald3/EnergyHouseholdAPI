import { Router } from "express";
import {
    getAllLocations,
    getLocationById,
    createLocation,
    updateLocation,
    deleteLocation,
} from "../controllers/locationController.js";

const router = Router();

router.get("/", getAllLocations);
router.get("/:Location_id", getLocationById);
router.post("/", createLocation);
router.put("/:Location_id", updateLocation);
router.delete("/:Location_id", deleteLocation);

export default router;
