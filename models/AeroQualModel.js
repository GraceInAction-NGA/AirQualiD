const firebase = require(process.cwd() + '/services/FirebaseService');
const AqiAdapter = require(process.cwd() + '/helpers/AqiAdapter');


const create = async (data) => {
    // await firebase.database.collection("aeroqual").add(data);
    
    const aqi = AqiAdapter.fromAeroQual(data);
    // await firebase.database.collection("aqis").add(aqi);
}

module.exports = {
    create,
}