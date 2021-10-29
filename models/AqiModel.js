const firebase = require(process.cwd() + '/services/FirebaseService');

const getAll = async () => {
  return await firebase.database.collection('aqis')
    .orderBy('timestamp', 'desc')
    .get();
};

const get = async (limit) => {
    return await firebase.database.collection('aqis')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();
};

const getLatest = async () => {
  return await get(1);
}

module.exports = {
    getLatest,
    get,
    getAll
}