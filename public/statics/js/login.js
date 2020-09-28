window.onload = () => {
    const loginButton = document.querySelector("#login")
    loginButton.onclick = login
}

const login = (e) => {
    e.preventDefault()

    const username = document.querySelector("#username").value
    const password = document.querySelector("#password").value

    const userInfo = {
        username,
        password
    }

    fetch('/login', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(userInfo)
    })
    .then((res) => res.json())
    .then((res) => {
        if(res.errorCode === 400){
            console.log(res.error)
            const toastHTML = `<span>${res.errorMessage}: ${res.error}</span>`
            M.toast({html: toastHTML, classes: "rounded white-text red darken-2"})
        }
        else if(res.errorCode === 500){
            const toastHTML = `<span> ${res.errorMessage}: ${res.error}</span>`
            M.toast({html: toastHTML, classes: "rounded white-text red darken-2"})
        }
        else{
            const toastHTML = `<span>Login Successful</span>`
            M.toast({html: toastHTML, classes: "rounded white-text teal darken-2"})

            //Used For Redirecting bc Node is Being Weird
            window.location.pathname = '/'
        }
    })
}