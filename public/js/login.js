function formSubmit_login(event) {
  var url = "/login";
  var request = new XMLHttpRequest();
  request.open("POST", url, true);
  request.onload = function () {
    // request successful
    // we can use server response to our request now
    window.location.replace(request.responseURL);
  };
  request.onerror = function () {
    // request failed
  };

  let formData = new FormData(event.target);
  var object = {};
  formData.forEach(function (value, key) {
    object[key] = value;
  });
  var json = JSON.stringify(object);
  request.overrideMimeType("application/json");
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  request.send(json);
  event.preventDefault();
}

function formSubmit_register(event) {
  var url = "/local-reg";
  var request = new XMLHttpRequest();
  request.open("POST", url, true);
  request.onload = function () {
    // request successful
    // we can use server response to our request now
    window.location.reload();
  };
  request.onerror = function () {
    // request failed
  };

  let formData = new FormData(event.target);
  var object = {};
  formData.forEach(function (value, key) {
    object[key] = value;
  });
  var json = JSON.stringify(object);
  request.overrideMimeType("application/json");
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  request.send(json);
  event.preventDefault();
}

// and you can attach form submit event like this for example
function attachFormSubmitEvent(formId, fun) {
  document.getElementById(formId).addEventListener("submit", fun);
}

window.onload = function () {
  attachFormSubmitEvent("local-sign-in", formSubmit_login);
  attachFormSubmitEvent("local-reg", formSubmit_register);
};
