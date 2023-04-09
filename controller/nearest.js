import getDistance from "geolib/es/getDistance";
import database from "../database/databaseConfig";
import { fetchHospitalLocation } from "../database/queries";

export const nearestHosp = async (req, res) => {
  try {
    const { longitude, latitude } = req.body;
    const userLocation = {
      latitude: latitude,
      longitude: longitude,
    };

    const maxDistance = 500000;

    const hospitals = await database.query(fetchHospitalLocation);

    const hospitalsWithDistance = hospitals.rows.map((row) => {
      const hospitalLocation = {
        latitude: row.latitude,
        longitude: row.longitude,
      };
      const distance = getDistance(userLocation, hospitalLocation);
      return { ...row, distance };
    });

    const nearbyHospitals = hospitalsWithDistance.filter(
      (hospital) => hospital.distance <= maxDistance
    );

    const nearestHospital = nearbyHospitals.sort(
      (a, b) => a.distance - b.distance
    )[0];

    console.log("nearest hospital", nearestHospital);

    const { latitude: hospLatitude, longitude: hospLongitude, name: hospName, email_id: email_id} =
      nearestHospital;
    return res
      .status(200)
      .send({
        latitude: hospLatitude,
        longitude: hospLongitude,
        name: hospName,
        email_id: email_id
      });
  } catch (err) {
    res.send(err);
  }
};