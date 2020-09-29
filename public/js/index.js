"use strict";

let isItemBeingEdited = false;

const updateData = async () => {
	const res = await fetch("/api/items", {method: "GET"});
	const data = await res.json();
	formatDataAsTable(data);
}

window.addEventListener("load", updateData);
window.setInterval(() => {
	if (!isItemBeingEdited) {
		updateData();
	}
}, 10000);

document.getElementById("submit-button").addEventListener("click", async evt => {
	evt.preventDefault();
	addItem();
});

document.getElementById("logout-button").addEventListener("click", evt => {
	evt.preventDefault();
	window.location.href = "/logout";
});

const formatDataAsTable = data => {
	let keys = [];

	data.forEach(row => {
		for (let key in row) {
			if (!keys.includes(key)) {
				if (key === "_id" || key === "username" || key === "date" || key === "__v") {
					continue;
				}
				keys.push(key);
			}
		}
	});
	
	const table = document.createElement("table");
	table.className = "table";
	let tableRow = table.insertRow(-1);

	keys.forEach(key => {
		const tableHeader = document.createElement("th");
		tableHeader.innerHTML = key.slice(0, 1).toUpperCase() + key.slice(1);
		tableRow.appendChild(tableHeader);
	});

	if (keys.length > 0) {
		const editHeader = document.createElement("th");
		editHeader.innerHTML = "Edit";
		tableRow.appendChild(editHeader);

		const deleteHeader = document.createElement("th");
		deleteHeader.innerHTML = "Delete";
		tableRow.appendChild(deleteHeader);
	}

	data.forEach(row => {
		tableRow = table.insertRow(-1);
		keys.forEach(key => {
			const cell = tableRow.insertCell(-1);
			if (cell.cellIndex >= 0 && cell.cellIndex <= 2) {
				cell.className = "editable-cell";
			}
			let value = row[key];
			if (key === "price" || key === "total") {
				value = `$${parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}`;
			}
			cell.innerHTML = value;
		});
		
		if (keys.length > 0) {
			const editCell = tableRow.insertCell(-1);
			editCell.style="text-align: center"
			const editButton = document.createElement("input");
			editButton.type = "button";
			editButton.className = "btn btn-secondary";
			editButton.value = "Edit";
			editButton.style="border-radius: 8px";
			editCell.appendChild(editButton);
			editButton.onclick = () => handleItemEditing(data, editButton, editCell.parentNode);
			
			const deleteCell = tableRow.insertCell(-1);
			deleteCell.style="text-align: center"
			const deleteButton = document.createElement("input");
			deleteButton.type = "button";
			deleteButton.className = "btn btn-danger";
			deleteButton.value = "X";
			deleteButton.style="border-radius: 8px";
			deleteCell.appendChild(deleteButton);
			deleteButton.onclick = () => deleteItem(data[deleteCell.parentNode.rowIndex - 1]._id);
		}
	});

	const dataContainer = document.getElementById("data-container");
	if (keys.length > 0) {
		dataContainer.innerHTML = "";
		dataContainer.appendChild(table);
	} else {
		dataContainer.innerHTML = "Shopping list empty";
	}
}

const handleItemEditing = (data, editButton, row) => {
	isItemBeingEdited = !isItemBeingEdited;
	row.childNodes.forEach(childNode => {
		if (childNode.className === "editable-cell") {
			childNode.contentEditable = isItemBeingEdited;
		}
	});
	if (isItemBeingEdited) {
		editButton.value = "Submit";
	} else {
		editButton.value = "Edit";
		const currentItem = {...data[row.rowIndex - 1]};
		let editedFields = {};
		const newName = row.cells[0].innerHTML;
		let newPrice = row.cells[1].innerHTML;
		let newQty = row.cells[2].innerHTML;
		newPrice = parseFloat(newPrice.replace("$", "").replace(",", ""));
		newQty = parseInt(newQty);

		if (newName !== currentItem.name) {
			editedFields.name = newName
		}
		if (newPrice !== parseFloat(currentItem.price)) {
			editedFields.price = newPrice;
		}
		if (newQty !== parseInt(currentItem.quantity)) {
			editedFields.quantity = newQty;
		}

		console.log(editedFields);

		editItem(currentItem._id, editedFields);
	}
}

const addItem = async () => {
	const nameField = document.getElementById("name");
	const priceField = document.getElementById("price");
	const qtyField = document.getElementById("qty");

	if (nameField.value == "" || priceField.value == "" || qtyField.value == "") {
		alert("Please fill out the required fields!");
	} else {
		const body = JSON.stringify({name: nameField.value, price: priceField.value, quantity: qtyField.value});
		const res = await fetch("/api/items", {method: "POST", body, headers:{"Content-Type": "application/json"}});
		if (res) {
			updateData();
			nameField.value = "";
			priceField.value = "";
			qtyField.value = "";
		}
	}
}

const editItem = async (itemId, editedFields) => {
	const body = JSON.stringify(editedFields);
	console.log(body);
	const res = await fetch(`/api/items/${itemId}`, {
		method: "PATCH", body, headers: {"Content-Type": "application/json"}
	});
	if (res) {
		updateData();
	}
};

const deleteItem = async itemId => {
	const res = await fetch(`/api/items/${itemId}`, {method: "DELETE"});
	if (res) {
		updateData();
	}
}

const isPositiveFloat = (str) => {}