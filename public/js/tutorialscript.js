let username = localStorage.getItem('username')
window.onload = function() {
    document.querySelector('#welcome').innerText = `Welcome back, ${username}`
}