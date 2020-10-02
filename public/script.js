// client-side js, loaded by index.html
// run by the browser each time the page is loaded

const logoutBtn = document.getElementById("logout");
const bookTable = document.getElementById("booklist");
const bookForm = document.querySelector("form");
const title = document.getElementById("title");
const pages = document.getElementById("pages");

// listener for the logout button that checks logs
// the user out and brings them back to the login
// form
logoutBtn.addEventListener("click", event => {
  // stop our form submission from refreshing the page
  event.preventDefault();

  fetch("/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });

  window.location.href = "login.html";
});

// Function to add a new book that the user inputs
// into the table in a new row
function addBook(book) {
  let newRow = bookTable.insertRow(-1),
    newTitle = newRow.insertCell(0),
    newLength = newRow.insertCell(1),
    newTime = newRow.insertCell(2),
    newEdit = newRow.insertCell(3),
    editButton = document.createElement("button"),
    newDelete = newRow.insertCell(4);

  newTitle.innerHTML = book.title;
  newLength.innerHTML = book.pages;
  newTime.innerHTML = book.hours;

  newEdit.appendChild(editButton);
  editButton.innerHTML = "edit";
  editButton.style.cursor;
  editButton.className = "button-brown button-clear";
  newDelete.innerHTML = "x";
  newDelete.style.cursor;

  let id = book._id;

  // listener for the delete button to
  // remove a book
  newDelete.onclick = function() {
    fetch("/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        newRow.remove();
      });
  };

  // listener for the edit button to
  // edit a book
  editButton.onclick = function() {
    let updateButton = document.createElement("button");
    updateButton.innerHTML = "update";
    updateButton.className = "button-brown button-clear";
    newEdit.appendChild(updateButton);
    newEdit.removeChild(editButton);

    let titleInput = document.createElement("input"),
      pagesInput = document.createElement("input"),
      hoursInput = document.createElement("input");

    titleInput.value = newTitle.innerHTML;
    pagesInput.value = newLength.innerHTML;
    hoursInput.value = newTime.innerHTML;

    newTitle.innerHTML = "";
    newLength.innerHTML = "";
    newTime.innerHTML = "";

    newTitle.appendChild(titleInput);
    newLength.appendChild(pagesInput);
    newTime.appendChild(hoursInput);

    // listener for the update button to
    // update a book
    updateButton.onclick = function() {
      const json = {
          title: titleInput.value,
          pages: pagesInput.value,
          hours: hoursInput.value,
          _id: id
        },
        body = JSON.stringify(json);

      fetch("/update", {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(json => {
          newTitle.innerHTML = titleInput.value;
          newLength.innerHTML = pagesInput.value;
          newTime.innerHTML = hoursInput.value;

          newEdit.removeChild(updateButton);
          newEdit.appendChild(editButton);
        });
    };
  };
}

// a helper function that creates a
// row from a given book
function loadDB(item) {
  let newRow = bookTable.insertRow(-1),
    newTitle = newRow.insertCell(0),
    newLength = newRow.insertCell(1),
    newTime = newRow.insertCell(2),
    newEdit = newRow.insertCell(3),
    editButton = document.createElement("button"),
    newDelete = newRow.insertCell(4),
    id = item._id;

  newTitle.innerHTML = item.title;
  newLength.innerHTML = item.pages;
  newTime.innerHTML = item.hours;

  newEdit.appendChild(editButton);
  editButton.innerHTML = "edit";
  editButton.style.cursor;
  editButton.className = "button-brown button-clear";
  newDelete.innerHTML = "x";
  newDelete.style.cursor;

  // listener for the delete button to
  // remove a book
  newDelete.onclick = function() {
    fetch("/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        newRow.remove();
      });
  };

  // listener for the edit button to
  // edit a book
  editButton.onclick = function() {
    let updateButton = document.createElement("button");
    updateButton.innerHTML = "update";
    updateButton.className = "button-brown button-clear";
    newEdit.appendChild(updateButton);
    newEdit.removeChild(editButton);

    let titleInput = document.createElement("input"),
      pagesInput = document.createElement("input"),
      hoursInput = document.createElement("input");

    titleInput.value = newTitle.innerHTML;
    pagesInput.value = newLength.innerHTML;
    hoursInput.value = newTime.innerHTML;

    newTitle.innerHTML = "";
    newLength.innerHTML = "";
    newTime.innerHTML = "";

    newTitle.appendChild(titleInput);
    newLength.appendChild(pagesInput);
    newTime.appendChild(hoursInput);

    // listener for the update button to
    // update a book
    updateButton.onclick = function() {
      const json = {
          title: titleInput.value,
          pages: pagesInput.value,
          hours: hoursInput.value,
          _id: id
        },
        body = JSON.stringify(json);

      fetch("/update", {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(json => {
          newTitle.innerHTML = titleInput.value;
          newLength.innerHTML = pagesInput.value;
          newTime.innerHTML = hoursInput.value;

          newEdit.removeChild(updateButton);
          newEdit.appendChild(editButton);
        });
    };
  };
}

//fetch the initial list of books
fetch("/books")
  .then(response => response.json()) // parse the JSON from the server
  .then(books => {
    // iterate through every dream and add it to our page
    books.forEach(loadDB);
  });

// listen for the form to be submitted and add a new book when it is
bookForm.addEventListener("submit", event => {
  // stop our form submission from refreshing the page
  event.preventDefault();

  // Creates a new JSON entry with the title and pages user
  // input info
  const json = { title: title.value, pages: pages.value },
    body = JSON.stringify(json);

  fetch("/add", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      addBook(json);
    });

  // reset form
  bookForm.reset();
  bookForm.elements.title.focus();
});
