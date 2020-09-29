function loadUserData() {
  fetch("/userdata").then(async function(response) {
    var body = await response.json();
    const welcomeText = document.getElementById("welcomeText");
    welcomeText.innerHTML = "Welcome, " + body.email;
    const listGroup = document.getElementById("userList");
    listGroup.innerHTML = "";
    body.tasks.forEach(element => {
      //console.log(element);
      var listItem = document.createElement("li");
      listItem.className = "list-group-item";
      listItem.innerHTML = 
        '<div class="d-flex justify-content-between">'+
          '<div class="align-self-center">' + element.taskText +'</div>'+
          '<div class = "d-flex align-items-center">'+
            '<form > <div class="noBottomMargin form-group">'+
            '<input type="text" class="form-control" id="updateTaskField" placeholder="Update task" onkeypress="return noenter()"/>' +
            '</div> </form>' +
            '<button class="btn btn-outline-primary btn-sm inlineButton" data_id = ' + element._id + ' onclick="updateData(this)">Update</button>'+
            '<button class="btn btn-outline-danger btn-sm inlineButton" data_id = ' + element._id + ' onclick="deleteData(this)">Delete</button>'+
          '</div>'+
        '</div>';
      listGroup.appendChild(listItem);
      
    });
  });
}

function deleteData(button){
  
  var body = {ID: button.getAttribute('data_id')}
  fetch( '/delete', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body)
  }).then(function (response){
    
    loadUserData();
  })
}

window.onload = function() {
  loadUserData();
  const logout = document.getElementById("logoutButton");
  const submitnewtask = document.getElementById("submitNewTask");
  submitnewtask.onclick = submitNewTask;
  logout.onclick = logOut;
};

function logOut(e) {
  e.preventDefault();
  fetch("/logout").then(async function(response) {
    console.log("Logging out");
    window.location.href = "/index.html";
    console.log(response);
  });
}

function submitNewTask(e){
  e.preventDefault();
  var taskSubmissionBox = document.getElementById("newtaskfield"); 
  var taskSubmissionText = taskSubmissionBox.value;
  console.log(taskSubmissionText)
  var body = {text: taskSubmissionText}
  
  fetch( '/add', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body)
  }).then(function (response){
    //console.log(response);
    loadUserData();
  })
    taskSubmissionBox.value = '';
}


function updateData(button){
  
  var id = button.getAttribute('data_id')
  var textfield = button.previousElementSibling.childNodes[1].childNodes[0];
  var text = textfield.value
  console.log("Updating", id, "with value", text);
  fetch( '/update', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({_id:id, newText: text})
  }).then(function (response){
    
    loadUserData();
  })
}


function noenter() {
  return !(window.event && window.event.keyCode == 13); }