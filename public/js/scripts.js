const result_modal = document.getElementById("result_modal");
const result_text = document.getElementById("result_text");
const result_spin = document.getElementById("result_spin");

const login_button = document.getElementById("login_button");
const logout_button = document.getElementById("logout_button");

const welcome_user = document.getElementById("welcome_user");
const welcome_user_text = document.getElementById("welcome_user_text");

function checkField(field) {
  if (field.value.length == 0) {
    field.classList.add("is-danger");
    return false;
  } else {
    field.classList.remove("is-danger");
    return true;
  }
}

const submitLapTime = function () {
  // prevent default form action from being carried out;

  //   if (
  //     !checkField(cname_input) ||
  //     !checkField(dname_input) ||
  //     !checkField(pname_input)
  //   ) {
  //     return false;
  //   }

  //   const json = {
  //     cname: cname_input.value,
  //     dname: dname_input.value,
  //     pname: pname_input.value,
  //     pcolor: pcolor_input.value,
  //     ttype: ttype_input.value,
  //     tangle: tangle_input.value,
  //     drs: drs_input.checked,
  //   };

  //   result_modal.classList.add("is-active");
  //   result_text.innerHTML = "";
  //   result_spin.style.display = "inline-block";

  //   fetch("/submit", {
  //     method: "POST",
  //     body: JSON.stringify(json),
  //   })
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((data) => {
  //       let time_seconds = Number(data.ltime);

  //       let minutes = Math.floor(time_seconds / 60);
  //       let seconds = time_seconds - minutes * 60;

  //       result_spin.style.display = "none";

  //       result_text.innerHTML =
  //         "Your time was <b> " +
  //         minutes +
  //         ":" +
  //         seconds.toFixed(3) +
  //         "</b>, putting you in <b> P" +
  //         data.position;
  //     });

  const testData = JSON.stringify({ laptime: Math.random() * (50.0) + 50.0});

  fetch("/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: testData,
  })
    .then((response) => response.json())
    .then((json) => {
      createTable(json.results);
    });

  return false;
};

const handleLogin = (json) => {
  console.log(json);
  if (!json.username) return;

  logout_button.classList.remove("is-hidden");
  welcome_user.classList.remove("is-hidden");
  welcome_user_text.innerText = json.username;

  login_button.classList.add("is-hidden");
};

window.onload = function () {
  fetch("/auth/user")
    .then((response) => response.json())
    .then((json) => {
      if (json.failed) {
        console.log("user has not authenticated");
      } else {
        handleLogin(json);
      }
    });
};
