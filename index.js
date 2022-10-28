//todo: check api
// Declare your secret API key as a constant using process.env
// const key = process.env['waterDataKey']
// A static server using Node and Express
const express = require('express');
const bodyParser = require('body-parser');
// Import node implementation of fetch API -- we do this so our server has the power to fetch!
// const fetch = require("node-fetch");
const fetch = require('cross-fetch');

const app = express();

app.use(bodyParser.json());

app.use(function (request, response, next) {
  console.log('got request', request.url);
  next();
});
// should be post or else you won't be able to get specified mon.
app.post('/query/getList', async function (request, response) {
  //req.body has the month
  console.log('getting resevoir data');
  console.log('reqbody:', request.body);
  let date = request.body;
  let mon = date['month'];
  let yr = date['year'];
  let reservoirmonlist = await lookupWaterData(mon, yr);
  // let reservoirnow = await lookupWaterDataNow();
  response.json(reservoirmonlist);
});

app.use(function (request, response) {
  // console.log("error");
  response.status(404);
  response.send('Backend does not show a Web page');
});

// listen for requests :)
const listener = app.listen(3000, () => {
  console.log(
    'The static server is listening on port ' + listener.address().port
  );
});

async function lookupWaterData(month, year) {
  console.log('inside lookupWaterData');
  //current month is set to 04 for testing, but switch to {month}
  const api_url = `https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=SHA,ORO,CLE,NML,LUS,DNP,BER&SensorNums=15&dur_code=M&Start=${year}-${month}&End=${year}-${month}`;
  // // send it off
  let fetch_response = await fetch(api_url);
  let resdata = await fetch_response.json();
  // console.log("resdata",resdata);
  return resdata;
}
