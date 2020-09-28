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

    // fetch('/register', {
    //     method: 'POST',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify(userInfo)
    // }).then((res => res.json()))
    // .then((res) => console.log(res))
    fetch('/login', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({username: "ACAffT", password:"BaaAFBA"})
    })

    // fetch('/logout', {
    //     method: "POST",
    //     headers: {'Content-Type': 'application/json'},
    //     credentials: 'include',
    // })
}


window.onload = () => {
    const submitButton = document.querySelector("#submit")
    submitButton.onclick = register
}