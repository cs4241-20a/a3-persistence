var meetings = [];
var account = "";

const meetingList = document.getElementById("meetings");
const form = document.querySelector("form");
const accountDisplay = document.getElementById("account");

function addMeeting(id, user, title, start, end) {
  const newMeeting = document.createElement("tr");
  const meetingDel = document.createElement("button");
  const meetingMod = document.createElement("button");
  
  meetingDel.className = "btn btn-sm btn-danger";
  meetingMod.className = "btn btn-sm btn-success";
  
  newMeeting.innerHTML = "<td>"+title+"</td> <td>"+start+"</td> <td>"+end+"</td>";
  meetingDel.innerText = "Delete";
  meetingMod.innerText = "Update";
  
  meetingDel.onclick = function() {
    
    fetch("/deleteMeeting", {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(json => {
        for(var i = 0; i < meetings.length; i++)
          if(meetings[i].id.localeCompare(id) === 0)
            meetings.splice(i, 1);
      
        newMeeting.remove()
      });
    form.reset();
    form.elements.title.focus();
  }
  
  meetingMod.onclick = function() {
    let user = account;
    let title = form.elements.title.value;
    let start = form.elements.start.value;
    let end = form.elements.end.value;

    fetch("/modifyMeeting", {
      method: "POST",
      body: JSON.stringify({ id, user, title, start, end }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(json => {
      
        for(var i = 0; i < meetings.length; i++)
          if(meetings[i].id.localeCompare(id) === 0)
            meetings.splice(i, 1);
      
        addMeeting(id, user, title, start, end)
        newMeeting.remove()
      });
    form.reset();
    form.elements.title.focus();
  }
  
  newMeeting.appendChild(meetingMod);
  newMeeting.appendChild(meetingDel);
  
  meetings.push({id, user, title, start, end, tr: newMeeting});
  meetings.sort((a, b) => (a.start > b.start) ? 1 : -1)
  
  meetingList.innerHTML = "";
  
  meetings.forEach(meeting => {
    meetingList.appendChild(meeting.tr);
  })
}

form.addEventListener("submit", event => {
  event.preventDefault();

  let user = account;
  let title = form.elements.title.value;
  let start = form.elements.start.value;
  let end = form.elements.end.value;
  
  //let createMeeting = true;
    
  fetch("/addMeeting", {
    method: "POST",
    body: JSON.stringify({ user, title, start, end }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(json => {
      addMeeting(json._id, json.user, json.title, json.start, json.end);
    });

  form.reset();
  form.elements.title.focus();
});

function getAccount() {
  
  fetch("/githubAccount")
    .then(res => res.json())
    .then(json => {
      account = json;
    })
  
}

window.onload = function() {
  
  account = localStorage.getItem("account");
  accountDisplay.innerText = "Account: " + account;
  
  if(account.localeCompare("github") === 0) {
    getAccount();
  }
  
  fetch("/meetings", {
    method: "POST",
    body: JSON.stringify({account}),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(json => {
      Array.from(json).forEach(meeting => addMeeting(meeting._id, meeting.user, meeting.title, meeting.start, meeting.end))
    })
}