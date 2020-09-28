//client script

const loadTable = function (jsonData) {
  var table = document.getElementById("resultTableBody");
  table.innerHTML = "";
  for (var i = 0; i < jsonData.length; i++) {
    var tr = table.insertRow(-1);
    for (var j in jsonData[i]) {
      var tb = tr.insertCell(-1);
      tb.innerHTML = jsonData[i][j];
    }
  }
};

window.onload = function(){
  fetch("/load", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((json) => loadTable(json));
  const button = document.querySelector("button");
}
