const SensorModel = require(process.cwd() + "/models/SensorModel");

const getAll = async () => {
    const snapshot = await SensorModel.getAll();
    return mapSensorID(snapshot);
};

const create = async (sensor) => {
    try {
        const ref = await SensorModel.create(sensor);
        console.log('Created document with ID: ', ref.id);
        return ref;
      } catch(err) {
        console.log('Failed to create document: ', err);
        return null;
      }
};

const search = async (sensor) => {
    try {
        const snapshot = await SensorModel.search(sensor);
        return mapSensorID(snapshot);
      } catch(err) {
        console.log('Failed to search for sensor: ', err);
        return null;
      }
};

const searchBy = async (value, key) => {
    try {
        const snapshot = await SensorModel.searchBy(value || '', key); 
        return mapSensorID(snapshot);
    } catch(e) {
        console.log(e)
        return null;
    };
};

const mapSensorID = (snapshot) => {
    return snapshot.docs.map(doc => {
        const data = doc.data();
        data['id'] = doc.id;
        return data;
    });
}

module.exports = {
    create,
    search,
    searchBy,
    getAll
}