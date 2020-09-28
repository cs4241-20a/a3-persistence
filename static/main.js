function htmlDecode(input) {
    let doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}

function showAddModal() {
    document.getElementById('modalTitle').innerHTML = "Add Movie";
    document.getElementById('modalButton').innerHTML = "Add";

    document.getElementById('name').value = "";
    document.getElementById('ps').value = "";
    document.getElementById('ms').value = "";
    document.getElementById('ss').value = "";
    document.getElementById('es').value = "";
    document.getElementById("date").value = "";
    document.modalForm.action = "/add";
    document.getElementById("modal").classList.add("is-active");
}

function showEditModal(id) {
    fetch('/list/')
        .then(response => response.json())
        .then(result => {
            const data = result;

            for (let i = 0; i < data.length; i++) {
                if (data[i].id === id) {
                    document.getElementById('modalTitle').innerHTML = "Edit Movie";
                    document.getElementById('modalButton').innerHTML = "Edit";

                    document.getElementById('name').value = htmlDecode(data[i].name);
                    document.getElementById('ps').value = data[i].ps;
                    document.getElementById('ms').value = data[i].ms;
                    document.getElementById('ss').value = data[i].ss;
                    document.getElementById('es').value = data[i].es;
                    document.getElementById("date").value = htmlDecode(data[i].date);
                    document.modalForm.action = "/edit/" + id;
                    document.getElementById("modal").classList.add("is-active");
                }
            }

        });
}

function closeModal() {
    document.getElementById("modal").classList.remove("is-active");
}

function fetchAndRender() {

    fetch('/list')
        .then(response => response.json())
        .then(result => {
            // render

            const data = result;

            let content = "";
            let sum = 0;

            for (let i = 0; i < data.length; i++) {
                content += `<tr>
                          <td class="mdl-data-table__cell--non-numeric">${i+1}</td>
                          <td>${data[i].name}</td>
                          <td>${data[i].score}</td>
                          <td>${data[i].date}</td>
                          <td><a href="javascript:showEditModal('${data[i].id}')" class="button is-small">Edit</a></td>
                          <td><a href="javascript:if(confirm('Are you sure?'))location='/del/${data[i].id}'" class="button is-small">Delete</a></td>
                        </tr>`;
                sum += parseFloat(data[i].score);
            }
            console.log(data);

            document.getElementById('table-container').innerHTML = content;
            document.getElementById('mean-score').innerHTML = "Mean = " + (sum / data.length).toFixed(2);

        });

}

$(function() {

    fetchAndRender();

});
