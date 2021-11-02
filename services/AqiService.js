const AqiModel = require("../models/AqiModel");
const AggregationService = require("./AggregationService");

const get = async (limit) => {
    try {
        const querySnapshot = await AqiModel.get(limit);
        const data = [];
        querySnapshot.forEach(doc => data.push(doc.data()));
        return data;
    } catch (err) {
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
    } catch (err) {
        console.log('Failed to latest retrieve data', err);
        return null;
    }
}

const getByDays = async (limit) => {
    try {
        const querySnapshot = await AqiModel.getByDays(limit);
        const data = [];
        querySnapshot.forEach(doc => data.push(doc.data()));

        return AggregationService.aggregatedData(data);
    } catch (err) {
        console.log('Failed to retrieve data', err);
        return null;
    }
}


const getToday = async () => {
    try {
        const data = await getByDays(2);
        return data[0];
    } catch (err) {
        console.log('Failed to latest retrieve data', err);
        return null;
    }
}

module.exports = {
    getLatest,
    get,
    getToday,
    getByDays
}