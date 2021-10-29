const firebase = require(process.cwd() + '/services/FirebaseService');

// TODO Consider refactoring to limit the number of reads we make to FireStore
// Maybe a caching solution would be advisable or a listener/subscription FireStore model.
const getAll = async () => {
  return await firebase.database.collection('sensors').get();
};

const create = async (sensor) => {
  return await firebase.database.collection('sensors').add(sensor);
};

const search = async (sensor) => {
  return await firebase.database.collection('sensors')
    .where("sensorID", "==", sensor.sensorID)
    .where("sensorName", "==", sensor.sensorName)
    .where("sensorType", "==", sensor.sensorType)
    .get();
};

const searchBy = async (value, key) => {
  return await firebase.database.collection('sensors')
    .where(key, "==", value).get();
};

module.exports = {
    create,
    getAll,
    search,
    searchBy
}