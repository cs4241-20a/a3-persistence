window.onload = function () {
    const button = document.querySelector('button')
    button.onclick = submit
}

// Form Submit + validation
const submit = function (e) {
    // Prevent default form action from being carried out
    e.preventDefault()
    validateForm()
    return false
}

// Validate form, block submission if missing fields
function validateForm() {
    // Check all fields are filled out 
    let errorMsg = ""
    if (document.forms["billForm"]["name"].value == "") {
        errorMsg = "Please enter a bill name"
    } else if (document.forms["billForm"]["amt"].value == "") {
        errorMsg = "Please enter a bill amount"
    } else if (document.forms["billForm"]["date"].value == "") {
        errorMsg = "Please enter a date"
    }
    document.getElementById("errorMsg").innerHTML = errorMsg
    if (!errorMsg) {
        submitForm()
    }
}

// Submit form data to server
function submitForm() {
    let status = ""
    json = {
        billName: document.getElementById("name").value,
        billAmt: document.getElementById("amt").value,
        billDate: document.getElementById("date").value,
        billPay: document.getElementById("paid").checked
    }

    console.log("in add : " + JSON.stringify(json))

    fetch('/add', {
            method: 'POST',
            body: JSON.stringify(json),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            status = response.statusText
            return response.json()
        })
        .then(json => {
            // Display error message if duplicate entry
            if (status == "DUPLICATE") {
                let paidStr = "paid"
                if (!json.billPay) {
                    paidStr = "unpaid"
                }
                document.getElementById("errorMsg").innerHTML = `Bill ${json.billName} issued on ${json.billDate} for $${json.billAmt} (${paidStr}) already exists. Please enter a unique bill.`

            }
            // Otherwise clear form 
            else if (status == "OK") {
                billForm.reset()
            }
        })

    // If 'all bills' section is expanded, update them
    if (document.getElementById("hidden").style.visibility == "visible") {
        getAllBills(true)
    }
}

// Retrieve all bills from server
function getAllBills(stayOpen) {

    // If div will remain open and be updated
    if (!stayOpen) {
        // Toggle button text and div visibility
        if (document.getElementById("hidden").style.visibility == "visible") {
            document.getElementById("allBillBtn").innerHTML = "Show all bills"
            document.getElementById("hidden").style.visibility = "hidden"
        } else {
            document.getElementById("allBillBtn").innerHTML = "Hide all bills"
            document.getElementById("hidden").style.visibility = "visible"
        }
    }

    // Retrieve all data from server
    fetch('/results', {
            method: 'GET'
        })
        .then(response => response.json())
        .then(json => displayBills(json))
}

// Display all bills in HTML
function displayBills(jsonArray) {
    let billDiv = document.getElementById('all_bills')

    // Clear table to avoid duplication
    var rows = billDiv.rows.length
    for (let i = rows - 1; i > 0; i--) {
        billDiv.deleteRow(i)
    }

    // Populate table
    for (obj in jsonArray) {
        var newRow = document.createElement('tr')
        newRow.innerHTML =
            `<td class="checkbox_col"><input onClick="showOptions(${obj})" id=${obj} type="checkbox"></td>
      <td class="editable" id="${obj}name">${jsonArray[obj].billName}</td>
      <td class="editable" id="${obj}amt">${jsonArray[obj].billAmt}</td>
      <td class="editable" id="${obj}date">${jsonArray[obj].billDate}</td>
      <td class="editable" id="${obj}pay">${jsonArray[obj].billPay}</td>
      <td class="editable" id="${obj}priority">${jsonArray[obj].priority}</td>`
        billDiv.appendChild(newRow)
    }
    // Color based on prioirty number
    colorPrioritization()
}

// Edit entries in all bills section
function editEntry() {
    let rows = document.getElementById('all_bills').rows.length
    let editRows = []
    let temp = []

    // Toggle btns
    document.getElementById("saveBtn").style.visibility = "visible"
    document.getElementById("editRowBtn").disabled = true
    document.getElementById("deleteRowBtn").disabled = true
    document.getElementById("allBillBtn").disabled = true
    document.getElementsByClassName("submit")[0].disabled = true

    // Disable other checkboxes
    for (let i = 0; i < rows - 1; i++) {
        document.getElementById(i).disabled = true
    }

    // Ok, buckle up 
    // Get the rows to be edited
    for (let i = 0; i < rows - 1; i++) {
        if (document.getElementById(i).checked) {
            editRows.push(i)
        }
    }
    // Get children of the row
    for (row in editRows) {
        let elt = document.getElementById(editRows[row])
        temp.push(elt.parentNode.parentNode.children)
    }
    // FINALLY get the actual editable elements in the row 
    for (tr in temp) {
        for (elt in temp[tr]) {
            // Preserve id, class, and value, but change to textbox
            if (temp[tr][elt].className == "editable") {
                temp[tr][elt].innerHTML =
                    `<input type="text" class="editable" id=${temp[tr][elt].id} value=${temp[tr][elt].innerText}>`
            }
        }
    }
}

// Save edited elements
function saveChanges() {

    // Get elements that were possibly edited 
    let changedElts = []
    let inputs = document.getElementsByTagName("input")
    for (input in inputs) {
        if (inputs[input].className == "editable") {
            changedElts.push(inputs[input])
        }
    }

    // Change elements back to have innerText with id, class in <td> parent elt 
    for (elt in changedElts) {
        let parent = changedElts[elt].parentNode
        parent.className = changedElts[elt].className
        parent.id = changedElts[elt].id
        parent.innerText = changedElts[elt].value
    }

    // Uncheck and re-enable all checkboxes
    let rows = document.getElementById('all_bills').rows.length
    for (let i = 0; i < rows - 1; i++) {
        if (document.getElementById(i).checked) {
            document.getElementById(i).checked = false
        }
        document.getElementById(i).disabled = false
    }

    // Toggle buttons
    document.getElementById("saveBtn").style.visibility = "hidden"
    document.getElementById("editRowBtn").style.visibility = "hidden"
    document.getElementById("deleteRowBtn").style.visibility = "hidden"
    document.getElementById("editRowBtn").disabled = false
    document.getElementById("deleteRowBtn").disabled = false
    document.getElementById("allBillBtn").disabled = false
    document.getElementsByClassName("submit")[0].disabled = false


    // Update changes on server 
    editOnServer()

    // Color based on prioirty number
    colorPrioritization()
}


// Overwrite all server data with updated client data
function editOnServer() {
    let jsonObjs = []
    let allElts = []
    let rows = document.getElementById('all_bills').rows.length

    // Iterate through rows and get all elements
    for (let i = 0; i < rows - 1; i++) {
        allElts.push(i)
    }

    // Create JSON object to send to server
    for (obj in allElts) {
        let payBool = false
        if (document.getElementById(allElts[obj] + 'pay').innerText == 'true') {
            payBool = true
        }
        jsonObjs.push({
            billName: document.getElementById(allElts[obj] + 'name').innerText,
            billAmt: document.getElementById(allElts[obj] + 'amt').innerText,
            billDate: document.getElementById(allElts[obj] + 'date').innerText,
            billPay: payBool,
            priority: document.getElementById(allElts[obj] + 'priority').innerText
        })
    }

    // POST to server
    fetch('/edit', {
            method: 'POST',
            body: JSON.stringify(jsonObjs),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(function (response) {
            console.log(response)
        })
}

// Delete selected entry(ies) from server and update HTML
function deleteEntry() {
    let rows = document.getElementById('all_bills').rows.length
    let doDelete = []

    // Iterate through rows and delete the checked row
    for (let i = 0; i < rows - 1; i++) {
        if (document.getElementById(i).checked) {
            doDelete.push(i)
        }
    }

    deleteFromServer(doDelete)
    getAllBills(true)

    document.getElementById("editRowBtn").style.visibility = "hidden"
    document.getElementById("deleteRowBtn").style.visibility = "hidden"

}


function deleteFromServer(deleteArr) {
    let jsonObjs = []

    // Create JSON object to send to server
    for (obj in deleteArr) {
        let payBool = false
        if (document.getElementById(deleteArr[obj] + 'pay').innerText == 'true') {
            payBool = true
        }
        jsonObjs.push({
            billName: document.getElementById(deleteArr[obj] + 'name').innerText,
            billAmt: document.getElementById(deleteArr[obj] + 'amt').innerText,
            billDate: document.getElementById(deleteArr[obj] + 'date').innerText,
            billPay: payBool
        })
    }

    // POST to server
    fetch('/delete', {
            method: 'POST',
            body: JSON.stringify(jsonObjs),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(function (response) {
            console.log(response)
        })
}



// Color based on prioirty number
function colorPrioritization() {

    // For each row get prioritization value 
    let rows = document.getElementById('all_bills').rows.length
    for (let i = 0; i < rows - 1; i++) {
        let pri = document.getElementById(i + "priority")
        // Color based on level
        switch (pri.innerText) {
            case "1":
                pri.parentNode.style.backgroundColor = '#C6EBAD'
                break
            case "2":
                pri.parentNode.style.backgroundColor = '#FBDA9D'
                break
            case "3":
                pri.parentNode.style.backgroundColor = '#F2BABA'
                break
            default:
                break
        }
    }

}

// Show buttons if an element is selected
function showOptions(eltId) {
    let rows = document.getElementById('all_bills').rows.length
    let clear = true

    // If element was unchecked
    if (!document.getElementById(eltId).checked) {

        // Check if any other elements are currently checked 
        for (let i = 0; i < rows - 1; i++) {
            if (document.getElementById(i).checked) {
                clear = false
            }
        }
        // If nothing is checked, hide buttons
        if (clear) {
            document.getElementById("editRowBtn").style.visibility = "hidden"
            document.getElementById("deleteRowBtn").style.visibility = "hidden"
        }
    }
    // Show buttons on checkbox check
    else {
        document.getElementById("editRowBtn").style.visibility = "visible"
        document.getElementById("deleteRowBtn").style.visibility = "visible"
    }
}