const firebase = require('../services/FirebaseService');

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

const getByDays = async (fromDaysAgo) => {
  const startOfToday = new Date();
  startOfToday.setDate(startOfToday.getDate() - (fromDaysAgo - 1)); 
  startOfToday.setHours(0, 0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  return await firebase.database.collection('aqis')
    .where('timestamp', '>=', startOfToday.getTime())
    .where('timestamp', '<=', endOfToday.getTime())
    .orderBy('timestamp', 'desc')
    .get();
};

const getToday = async () => {
  return await getByDays(1);
}

const getLatest = async () => {
  return await get(1);
}

module.exports = {
    getLatest,
    get,
    getAll,
    getByDays,
    getToday
}