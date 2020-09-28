
window.onload = () => {
    const logoutButton = document.getElementById('logoutButton')
    logoutButton.onclick = logout
    fetch('/authStatus', {
        method: "GET",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => res.json())
    .then(res => {
        if(res.authStatus){
            const preloginElems = document.querySelectorAll(".preLogin")
            preloginElems.forEach((elem) => {
                elem.style = "display: none"
            })
        }
        else{
            const postLoginElems = document.querySelectorAll(".postLogin")
            postLoginElems.forEach((elem) => {
                elem.style = "display: none"
            })
        }
    })
}

const logout = () => {
    fetch("/logout", {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        if(res.status === 200){
            //We logged out
            console.log("Bree")
            const preLoginElems = document.querySelectorAll(".preLogin")
            preLoginElems.forEach((elem) => {
                elem.style = "display: block"
            })
            const postLoginElems = document.querySelectorAll(".postLogin")
            postLoginElems.forEach((elem) => {
                elem.style = "display: none"
            })
            window.location.pathname = '/login'
        }
    })
}