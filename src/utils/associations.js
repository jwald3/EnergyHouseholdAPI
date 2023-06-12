import Household from "../models/Household.js";
import Location from "../models/Location.js";


Household.belongsTo(Location, {
    foreignKey: 'location_id',
    as: 'location'
});

Location.hasMany(Household, {
    foreignKey: 'location_id',
    as: 'location'
});
