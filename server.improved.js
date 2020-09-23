const http = require("http"),
  fs = require("fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library used in the following line of code
  mime = require("mime"),
  https = require("https"),
  dir = "public/",
  port = 3000;

const fill_date = "05/25/2019";
const fill_time = "12:00:00";

const appdata = [
  {
    id: "WLM",
    cname: "Mercedes",
    dname: "Lewis Hamilton",
    pname: "W10 EQ Power+",
    ltime: 71.542,
    sdate: fill_date + " @ " + fill_time + " UTC",
  },
  {
    id: "MVB",
    cname: "Mercedes",
    dname: "Valtteri Bottas",
    pname: "W10 EQ Power+",
    ltime: 73.934,
    sdate: fill_date + " @ " + fill_time + " UTC",
  },
  {
    id: "RBMV",
    cname: "Red Bull Racing",
    dname: "Max Verstappen",
    pname: "RB15",
    ltime: 74.173,
    sdate: fill_date + " @ " + fill_time + " UTC",
  },
  {
    id: "FSV",
    cname: "Ferrari",
    dname: "Sebastian Vettel",
    pname: "SF90",
    ltime: 76.036,
    sdate: fill_date + " @ " + fill_time + " UTC",
  },
  {
    id: "RBPG",
    cname: "Red Bull Racing",
    dname: "Pierre Gasly",
    pname: "RB15",
    ltime: 78.284,
    sdate: fill_date + " @ " + fill_time + " UTC",
  },
];

appdata.sort((a, b) => (a.ltime > b.ltime ? 1 : -1));

const url =
  "https://api.openweathermap.org/data/2.5/weather?q=Monaco, MC&appid=aa0d005506ed7ef7670671f0b8508a21";

const tire_dict = {
  soft: 0.0,
  medium: 25.0,
  hard: 50.0,
  inter: 75.0,
  wet: 100.0,
};

const toe_dict = {
  pos: 1.0,
  zero: 0.0,
  neg: -1.0,
};

const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  }
});

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else if (request.url === "/data") {
    sendData(response);
  } else {
    sendFile(response, filename);
  }
};

const sendData = function (response) {
  let stringJSON = JSON.stringify(appdata);

  response.writeHeader(200, { "Content-Type": "json" });
  response.end(stringJSON);
};

const handlePost = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    let data = JSON.parse(dataString);

    if (request.url === "/submit") {
      // Calculate race results
      fetchWeather().then((weatherBody) => {
        let weatherJSON = JSON.parse(weatherBody);
        let result = calculateResult(data, weatherJSON);

        response.writeHead(200, "OK", { "Content-Type": "text/plain" });
        response.end(JSON.stringify(result));
      });
    } else if (request.url === "/remove") {
      let elementToRemove = appdata.find((element) => {
        return element.id === data.lapID;
      });
      if (elementToRemove) {
        appdata.splice(appdata.indexOf(elementToRemove), 1);
        console.log(elementToRemove);
      }
      response.writeHead(200, "OK", { "Content-Type": "text/plain" });
      response.end(JSON.stringify(appdata));
    }
  });
};

const removeEntry = function (lapID) {
  return appdata;
};

const fetchWeather = function () {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      res.setEncoding("utf8");
      let body = "";
      res.on("data", (data) => {
        body += data;
      });
      res.on("end", () => {
        resolve(body);
      });
    });
  });
};

const calculateResult = function (vehicle, weather) {
  let temp = weather.main.temp;
  let humidity = weather.main.humidity;

  let temp_min = weather.main.temp_min;
  let temp_max = weather.main.temp_max;

  let temp_range = temp_max - temp_min;

  let temp_per = (temp - temp_min) / temp_range;

  // avoid divide by zero
  temp_per = temp_per <= 0.0 ? 1.0 : temp_per;

  console.log(temp_per);

  temp_per *= 100.0;

  let tire_humidity_val = tire_dict[vehicle.ttype];
  let tire_traction_val = 100.0 - tire_dict[vehicle.ttype];
  let toe_val = toe_dict[vehicle.tangle];

  // Hurt values, from 0.0 to 1.0
  let humidity_hurt = Math.abs(humidity - tire_humidity_val) / 100.0;
  let toe_hurt = Math.abs(humidity * toe_val) / 100.0;
  let traction_hurt = Math.abs(temp_per - tire_traction_val) / 100.0;
  let drs_hurt = vehicle.drs ? 0.0 : 1.0;

  let base_time = 70.0;

  let final_time =
    base_time +
    8.0 * humidity_hurt +
    10.0 * traction_hurt +
    5.0 * toe_hurt +
    2.5 * drs_hurt +
    Math.random(1.0);

  let date = new Date().toISOString().replace(/T/, ' @ ').replace(/\..+/, '');

  let uniqueID = getUniqueID();

  let result = {
    id: uniqueID,
    cname: vehicle.cname,
    dname: vehicle.dname,
    pname: vehicle.pname,
    ltime: final_time,
    sdate: date + " UTC",
  };

  appdata.push(result);
  appdata.sort((a, b) => (a.ltime > b.ltime ? 1 : -1));
  console.log(appdata);

  let sendBack = {
    ltime: final_time,
    position: appdata.indexOf(result) + 1,
  };

  return sendBack;
};

const getUniqueID = function () {
  let ID = makeid(6);
  while (
    appdata.find((element) => {
      return element.id === ID;
    })
  ) {
    ID = makeid(6);
  }

  return ID;
};

const makeid = function (length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {
    // if the error = null, then we've loaded the file successfully
    if (err === null) {
      // status code: https://httpstatuses.com
      response.writeHeader(200, { "Content-Type": type });
      response.end(content);
    } else {
      // file not found, error code 404
      response.writeHeader(404);
      response.end("404 Error: File Not Found");
    }
  });
};

server.listen(process.env.PORT || port);
