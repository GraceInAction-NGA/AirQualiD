const AqiModel = require(process.cwd() + "/models/AqiModel");

const get = async (limit) => {
    try {
        const querySnapshot = await AqiModel.get(limit);
        const data = [];
        querySnapshot.forEach(doc => data.push(doc.data()));
        return data;
    } catch(err) {
        console.log('Failed to retrieve data', err);
        return null;
    }
}

const getLatest = async () => {
    try {
        const querySnapshot = await AqiModel.getLatest();
        const data = [];
        querySnapshot.forEach(doc => data.push(doc.data()));
        return data;
    } catch(err) {
        console.log('Failed to latest retrieve data', err);
        return null;
    }
}

module.exports = {
    getLatest,
    get
}