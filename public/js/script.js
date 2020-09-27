const isValidPassword = function(pw) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(pw)
}

const signUp = function(e) {
    e.preventDefault()
    const inputs = document.getElementsByClassName('signUpFields')
    if(inputs[2].value!=inputs[3].value) {
        alert('Error: passwords do not match')
        console.log('Error: passwords do not match')
        return false
    }
    if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(inputs[2].value))){
        alert('Error: password is too weak. Need 8 or more characters, at least 1 lowercase, uppercase, and number')
        console.log('ERROR: weak password')
        return false
    }
    fetch( '/signup', {
        method:'POST',
        body:JSON.stringify({email:inputs[0].value,username:inputs[1].value,password:inputs[2].value,isSubscribed:(inputs[4].checked)}),
        headers:{
            'Content-Type':'application/json'
        }
      })
      .then( response => response.json())
      .then(json => {
          if(json.status=="failure") {
              alert('error: user already exists!')
              Array.prototype.slice.call( inputs ).map(i=>i.value='') //did not really need this but it is a cool line of code.
          } else {
              alert('Successfully signed up. (you may now log in)')
              Array.prototype.slice.call( inputs ).map(i=>i.value='') 
              //clear fields
          }})
}

const logIn = function(e) {
    e.preventDefault()
    const inputs = document.getElementsByClassName("loginFields")
    fetch ('/login', {
        method:'POST',
        body:JSON.stringify({username:inputs[0].value, password:inputs[1].value}),
        headers:{
            'Content-type':'application/json'
        }

    }).then( response => response.json())
    .then(json => {
        Array.prototype.slice.call( inputs ).map(i=>i.value='')
        if(json.status=='success') {
            console.log("LOGIN succeeded")
            alert('Login successful')
            window.localStorage.setItem('username', json.username)
            window.location.assign('data.html')
            
        } else {
            console.log('LOGIN FAILED')
            alert('Login failed (check username/password)')
        }
    })

}

/*fetch('/add', {
    method:'POST',
    body:JSON.stringify({dream:1}),
    headers:{
        "Content-Type":"application/json"
    }
})*/

window.onload = function() {
    document.querySelector('#signup').onclick = signUp
    document.querySelector('#login').onclick = logIn
    if(window.localStorage.getItem('username')) window.location.assign('data.html')
}