import { beginLoading, getLapTime } from "./render.js";

const login_button = document.getElementById("login_button");
const logout_button = document.getElementById("logout_button");

const welcome_user = document.getElementById("welcome_user");
const welcome_user_text = document.getElementById("welcome_user_text");

const submitResult = document.getElementById("submit_result");

const fullname_input = document.getElementById("fullname");
const teamname_input = document.getElementById("teamname");

const submitButton = document.getElementById("submit_button");

submitButton.addEventListener("click", () => {
  if (checkField(fullname_input) && checkField(teamname_input)) {
    const lapTime = getLapTime();
    const lapData = JSON.stringify({
      laptime: lapTime,
      fullname: fullname_input.value,
      teamname: teamname_input.value,
    });
    submitResult.classList.remove("is-active");
    scrollToTable();

    startLoad();

    fetch("/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: lapData,
    })
      .then((response) => response.json())
      .then((json) => {
        createTable(json.results);
      });
  }
});

const checkLogin = function () {
  fetch("/auth/user")
    .then((response) => response.json())
    .then((json) => {
      if (json.failed) {
      } else {
        handleLogin(json);
      }
    });
};

const handleLogin = (json) => {
  if (!json.username) {
  } else {
    logout_button.classList.remove("is-hidden");
    welcome_user.classList.remove("is-hidden");
    welcome_user_text.textContent = json.username;

    login_button.classList.add("is-hidden");

    beginLoading();
  }
};

window.onload = function () {
  fetch("/auth/user")
    .then((response) => response.json())
    .then((json) => {
      if (!json.failed) {
        handleLogin(json);
      }
    });
};
