const firebase = require('../services/FirebaseService');
const AqiAdapter = require('../helpers/AqiAdapter');

const ONE_WEEK_MILLIS = 604800000;

const parse = (data) => {
    data.Stats = JSON.parse(data.Stats);
    return data;
}

const create = async (datas) => {
    datas.forEach(data => {
        const parsedData = parse(data);

        if (Date.now() - data.Stats.lastModified < ONE_WEEK_MILLIS) {
            firebase.database.collection("readings").add(parsedData);

            const aqi = AqiAdapter.fromPurpleAirAqi(parsedData);
            firebase.database.collection("aqis").add(aqi);
        }
    });
}

module.exports = {
    create
}