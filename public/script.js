// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");


// var gologin = document.getElementById("goLogin")
// gologin.onclick = function(){
//   console.log("logged")
//   window.location.href="/loginto"
// }
// var gologout = document.getElementById("goLogout")
// gologout.onclick = function(){
//   console.log("logged out")
//   window.location.href="/loginout"
// }
//main
// var submitBtn = document.getElementById("submitBtn");
// var index = 0;
// submitBtn.onclick = function() {
//   var name = document.querySelector("#yourname");
//   var gender = document.querySelector("#select");
//   var currentYear = document.querySelector("#currentYear");
//   var e = "";
//   if (currentYear.value === "Freshman") {
//     e = "2024";
//   } else if (currentYear.value === "Sophomore") {
//     e = "2023";
//   } else if (currentYear.value === "Junior") {
//     e = "2022";
//   } else if (currentYear.value === "Senior") {
//     e = "2021";
//   }
//   console.log("btn clicked");
//   fetch("/add", {
//     method: "POST",
//     body: JSON.stringify({
//       yourname: name.value,
//       gender: gender.value,
//       currentYear: currentYear.value,
//       expectedYear: e
//     }),
//     headers: {
//       "Content-Type": "application/json"
//     }
//   })
//     .then(response => response.json())
//     .then(response => {
//       console.log(response);
//       var i = response;
//       var div = document.createElement("div");
//       div.setAttribute("id", i);
//       // div.setAttribute("style","display:flex; flex-direction:row")

//       var gdiv = document.createElement("div");
//       // gdiv.setAttribute("style", "display:flex; flex-direction:row");
//       gdiv.setAttribute("id", i);
//     gdiv.classList="row"

//       var deleteBtn = document.createElement("button");
//       deleteBtn.setAttribute("id", i);
//       deleteBtn.setAttribute("type", "button");
//       deleteBtn.setAttribute(
//         "style",
//         "width:100px; height:50px; font-size:24px; border-radius:6px; display:inline-block;margin-top:auto"
//       );
//     deleteBtn.classList="col-md-2"
//       deleteBtn.textContent = "delete";
//       deleteBtn.onclick = function() {
//         fetch("/delete", {
//           method: "POST",
//           body: JSON.stringify({ id: deleteBtn.id }),
//           headers: {
//             "Content-Type": "application/json"
//           }
//         });
//         console.log("deleted");
//       };
//       var modifyBtn = document.createElement("button");
//     modifyBtn.classList="col-md-2"
//       modifyBtn.textContent = "modify";
//       modifyBtn.setAttribute("id", i);
//       modifyBtn.setAttribute("type", "button");
//       modifyBtn.setAttribute(
//         "style",
//         "width:100px; height:50px; font-size:24px; border-radius:6px; display:inline-block;margin-top:auto"
//       );

//       // var ndiv = document.createElement("div");
//       // ndiv.setAttribute("style", "margin:auto");
//       // var cdiv = document.createElement("div");
//       // cdiv.setAttribute("style", "margin:auto");
//       // var ediv = document.createElement("div");
//       // ediv.setAttribute("style", "margin:auto");
//       var g = gender.value;
//       var n = name.value;
//       var c = currentYear.value;
//       var e = "";
//       if (c === "Freshman") {
//         e = "2024";
//       } else if (c === "Sophomore") {
//         e = "2023";
//       } else if (c === "Junior") {
//         e = "2022";
//       } else if (c === "Senior") {
//         e = "2021";
//       }
//       var gbox = document.createElement("input");
//       gbox.setAttribute(
//         "style",
//         "width:150px; height:50px; font-size:24px; border-radius:6px; display:inline-block;margin:auto"
//       );
//     gbox.classList="col-md-2"
//       var nbox = document.createElement("input");
//       nbox.setAttribute(
//         "style",
//         "width:150px; height:50px; font-size:24px; border-radius:6px; display:inline-block;margin:auto"
//       );
//     nbox.classList="col-md-2"
//       var cbox = document.createElement("input");
//       cbox.setAttribute(
//         "style",
//         "width:150px; height:50px; font-size:24px; border-radius:6px; display:inline-block;margin:auto"
//       );
//     cbox.classList="col-md-2"
//       var ebox = document.createElement("input");
//       ebox.setAttribute(
//         "style",
//         "width:150px; height:50px; font-size:24px; border-radius:6px; display:inline-block;margin:auto"
//       );
//     ebox.classList="col-md-2"
//       gbox.value = g;
//       nbox.value = n;
//       cbox.value = c;
//       ebox.value = e;

//       gdiv.appendChild(nbox);
//       gdiv.appendChild(gbox);
//       gdiv.appendChild(cbox);
//       gdiv.appendChild(ebox);
//       gdiv.appendChild(deleteBtn);
//       gdiv.appendChild(modifyBtn);
//       // div.appendChild(gdiv);

//       // div.appendChild(gdiv);
//       // div.appendChild(cdiv);
//       // div.appendChild(ediv);

//       div.setAttribute("style", "display:flex; flex-direction:row");

//       modifyBtn.onclick = function() {
//         console.log("modify clicked");
//         var thisdiv = document.getElementById(modifyBtn.id);
//         var inputs = thisdiv.getElementsByTagName("input");
//         fetch("/modify", {
//           method: "POST",
//           body: JSON.stringify({
//             id: modifyBtn.id,
//             yourname: inputs[0].value,
//             gender: inputs[1].value,
//             currentYear: inputs[2].value,
//             expectedYear: inputs[3].value
//           }),
//           headers: {
//             "Content-Type": "application/json"
//           }
//         })
//           .then(response => response.json())
//           .then(response => {
//             console.log(response.matchedCount);
//           });
//         console.log(inputs[0].value);
//       };
//       var container = document.getElementById("container");
//       container.appendChild(gdiv);
//       container.appendChild(document.createElement("br"));

//       index += 1;
//     });
//   // console.log(currentYear.value)
// };
