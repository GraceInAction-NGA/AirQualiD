const firebase = require(process.cwd() + '/services/FirebaseService');
const AqiAdapter = require(process.cwd() + '/helpers/AqiAdapter');

//TODO save airnow data to firebase
const create = async (data) => {
    //await firebase.database.collection("airnow").add(data);
    const aqi = AqiAdapter.fromAirNow(data);
    //await firebase.database.collection("aqis").add(aqi);
};

module.exports = {
    create,
}