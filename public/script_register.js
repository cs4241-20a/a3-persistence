const submit = function(event){
  event.preventDefault();
let newEntry = {
                  uname: document.getElementById('Uname').value,
                  password: document.getElementById('Pass').value,
      }
  let l = document.getElementById('reg_status')
 let body = JSON.stringify(newEntry);
fetch('/register',{
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json'
        }
})
  .then(response => response.json()) 
.then(entry=> {
  let result = JSON.stringify(entry)
  console.log(result)
  if(JSON.parse(result) == "Fail"){
    window.alert('Username already exists')
  }
  else{
  window.alert('Successfully Recorded,You can login now')
  window.location.href= "https://a3-peristance-jcybul.glitch.me/login"
  }
})
}
 window.onload = function() {
    const button = document.getElementById('reg_button')
    button.onclick = submit
 }