import Location from "../models/Location";

export const getLocationId = async (city, state_id, zip_code) => {
    // Check if the location already exists.
    let location = await Location.findOne({ where: { city, state_id, zip_code } });

    // If location doesn't exist, return null or throw an error.
    if (!location) {
        return null;
        // Alternatively, you could throw an error:
        // throw new Error('Location not found.');
    }

    return location.location_id;
};
