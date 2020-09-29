let postTitles = [];
async function loadDB() {
    let posts = document.getElementById("post-container");
    posts.innerHTML = "";
    await fetch('/loadData').then(result => result.json().then(result => {
        result.forEach((post) => {
            postTitles.push(post.title);
            posts.innerHTML += `
        <div align="center" class="post">
        <h3>${post.title}</h3>
        <img height = "400px" width = "400px" src="${post.image}">
        <div class="buyinginfo"><p>This item hasn't been sold yet</p> <div></div>
        <p>${post.price}</p></div>
        <div style="margin-top: 20px;" id="${post.title}commentsection"><button id="viewcomments${post.title}">View comments</button></div>
        <div class="addcomment"><div></div><input type="text" id="${post.title}commentbox" placeholder="Add a comment..."><button id="${post.title}commentbutton">Submit</button> <div></div></div>
        </div>
        `
        })
    }));

}
window.onload = () => loadDB().then(result => {
    let commentButtons = [];
    let postCommentButtons = [];
    let commentTextBoxes = [];
    for (let i = 0; i < postTitles.length; i++) {
        commentButtons[i] = document.getElementById('viewcomments' + postTitles[i]);
        postCommentButtons[i] = document.getElementById(postTitles[i] + 'commentbutton');
        commentTextBoxes[i] = document.getElementById(postTitles[i] + 'commentbox');
        // submitting comment
        postCommentButtons[i].addEventListener('click', function () {
            fetch('/addcomment', {
                method: "POST",
                body: JSON.stringify({title: postTitles[i], text: commentTextBoxes[i].value}),
                headers: {'Content-Type': 'application/json'}
            })
        });
        // the show comments button
        commentButtons[i].addEventListener('click', function () {
            let commentSection = document.getElementById(postTitles[i] + 'commentsection');
            commentSection.innerHTML = "";
            fetch('/loadcomments', {
                method: "POST",
                body: JSON.stringify({title: postTitles[i]}),
                headers: {'Content-Type': 'application/json'}
            }).then(result => result.json()).then(result => {
                result.forEach((comment) => {
                    let pElement = document.createElement("p");
                    pElement.innerText = comment.text;
                    commentSection.appendChild(pElement);
                })
            })
        })
    }
});

fetch("/getusername", {
    method: "GET"
}).then((result) => {
    document.getElementById("username").innerHTML = result.username;
});
const register = document.getElementById("register");
const login = document.getElementById("login");
let user = document.getElementById("user");
const pass = document.getElementById("pass");
register.addEventListener("click", function () {
    fetch("/register", {
        method: "POST",
        body: JSON.stringify({username: user.value, password: pass.value}),
        headers: {'Content-Type': 'application/json'}
    })
});
login.addEventListener("click", function () {
    fetch("/login", {
        method: "POST",
        body: JSON.stringify({username: user.value, password: pass.value}),
        headers: {'Content-Type': 'application/json'}
    }).then((result) => {
        fetch('/getusername')
            .then(response => response.json())
            .then(json => document.getElementById("username").innerHTML = json.username);
    })
});