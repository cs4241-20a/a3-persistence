//checks if the password is 8> characters, has at least 1 capital, 1 lowercase, and 1 number.
const isValidPassword = function(pw) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(pw)
}
const isValidEmail = function(e) {
    const regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/
    return regex.test(e)
}
//function called when hit signup button. sends request to server!
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
//function called when hit login button. sends request to server!
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
//onload: handles setting a few important functions
window.onload = function() {
    document.querySelector('#signup').onclick = signUp
    document.querySelector('#login').onclick = logIn
    document.querySelector('#password').onfocusout = function() {
        if(!isValidPassword(document.querySelector('#password').value)) {
            alert('password is too weak. a strong password has 8 or more characters, at least 1 capital letter, lowercase letter, and number.')
        }
        checkValiditySignUp()
    }
    document.querySelector('#emailaddress').onfocusout = function() {
        if(!isValidEmail(document.querySelector('#emailaddress').value)) {
            alert('invalid email address. use the format example@domain.com')
        }
        checkValiditySignUp()
    }
    document.querySelector('#confirmpassword').onfocusout = function() {
        if(document.querySelector('#confirmpassword').value!=document.querySelector('#password').value) {
            alert('passwords do not match!')
        }
        checkValiditySignUp()
    }
    document.querySelector('#username').onfocusout = function() {
        checkValiditySignUp()
    }
    document.querySelector('#usernamelogin').onfocusout = function() {
        checkValidityLogIn()
    }
    document.querySelector('#passwordlogin').onfocusout = function() {
        checkValidityLogIn()
    }
    if(window.localStorage.getItem('username')) window.location.assign('data.html')
    
}
//signup starts disabled, is enabled when conditions are met.
const checkValiditySignUp = function() {
    const pw = document.querySelector('#password').value
    if(isValidPassword(pw) && pw==document.querySelector('#confirmpassword').value && isValidEmail(document.querySelector('#emailaddress').value)&&document.querySelector('#username')!='') {
        document.querySelector('#signup').disabled = false
        document.querySelector('#signup').setAttribute('aria-disabled', false)
    } else {
        document.querySelector('#signup').disabled = true
        document.querySelector('#signup').setAttribute('aria-disabled', true)
    }
}
//signin starts disabled, is enabled when conditions are met.
const checkValidityLogIn = function() {
    if(document.querySelector('#usernamelogin').value!=''&&document.querySelector('#passwordlogin').value!='') {
        document.querySelector('#login').disabled = false
        document.querySelector('#login').setAttribute('aria-disabled', false)
    } else {
        document.querySelector('#login').disabled = true
        document.querySelector('#login').setAttribute('aria-disabled', true)
    }
}