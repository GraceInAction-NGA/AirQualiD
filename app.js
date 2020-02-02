const SensorPollingService = require('./services/SensorPollingService');
const SensorService = require('./services/SensorService')
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
var _ = require('lodash');

const app = express();
dotenv.config();

const PORT = process.env.PORT || 80;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  //Auth Each API Request created by user.
  next();
});

app.use(express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js',  express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/jquery',  express.static(__dirname + '/node_modules/jquery/dist'));

app.get('/latest', async (req, res) => {
  const latestDoc = await SensorService.getLatest();

  if (_.isNull(latestDoc)) {
    res.sendStatus(400);
    return;
  }

  res.send(latestDoc[0]);
});

app.get('/sensor', async (req, res) => {
  const sensorIDDocs = await SensorService.searchBy(req.query.sensorID, "sensorID");
  const sensorTypeDocs = await SensorService.searchBy(req.query.sensorType, "sensorType");
  const sensorNameDocs = await SensorService.searchBy(req.query.sensorName, "sensorName");

  if (_.isNull(sensorIDDocs) || _.isNull(sensorTypeDocs) || _.isNull(sensorNameDocs)) {
    res.sendStatus(400);
    return;
  }

  const docs = sensorIDDocs.concat(sensorTypeDocs, sensorNameDocs);
  const uniqueDocs = [...new Set(docs)];

  res.send(uniqueDocs);
});

app.post('/sensor', async (req, res) => {
  const searchRes = await SensorService.search(req.body);

  if (searchRes === null) {
    res.sendStatus(400);
    return;
  } else if (searchRes.length > 0) {
    // TODO Should not be 404 (Not Found) the search did find it
    // TODO Check status code on front end to determine what error message to display
    console.log('Sensor already exists.');
    res.sendStatus(403);
    return;
  }

  const createRes = await SensorService.create(req.body);

  if (createRes === null) {
    res.sendStatus(400);
    return;
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
  // SensorPollingService.run();
});