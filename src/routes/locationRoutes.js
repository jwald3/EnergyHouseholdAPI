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
router.get("/:location_id", getLocationById);
router.post("/", createLocation);
router.put("/:location_id", updateLocation);
router.delete("/:location_id", deleteLocation);

export default router;
