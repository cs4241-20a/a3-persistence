const register = (e) => {
    e.preventDefault()

    const email = document.querySelector("#email").value
    const username = document.querySelector("#username").value
    const password = document.querySelector("#password").value

    const userInfo = {
        username,
        password,
        email
    }

    fetch('/register', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(userInfo)
    })
    .then((res) => res.json())
    .then((res) => {
        if(res.errorCode === 400){
            const toastHTML = `<span>Invalid Form: ${res.error}</span>`
            M.toast({html: toastHTML, classes: "rounded white-text red darken-2"})
        }
        else if(res.errorCode === 500){
            const toastHTML = `<span>: Server Error: ${res.error}</span>`
            M.toast({html: toastHTML, classes: "rounded white-text red darken-2"})
        }
        else{
            const toastHTML = `<span>Registration Successful</span>`
            M.toast({html: toastHTML, classes: "rounded white-text teal darken-2"})
            window.location.pathname = '/'
        }
    })
}

window.onload = () => {
    const submitButton = document.querySelector("#submit")
    submitButton.onclick = register
}