const token = localStorage.getItem('token');
console.log("Token:", token);

function fetchData() {
    fetch('http://localhost:3500/api/v1/popup/getallpopups-admin', {
        headers: {
            'Content-Type': 'application/json',
            'token': `${token}`
        }
    }).then((response) => {
        if (response.status === 401) {
            alert('Session expired. Please log in again.');
            localStorage.removeItem('token'); 
            window.location.href = './login.html'; 
            return null;
        }
        return response.json(); 
    })
        .then((data) => {
            populateTable(data.result);
            console.log(data.result);
            if ($.fn.DataTable.isDataTable("#example1")) {
                $("#example1").DataTable().destroy();
            }
            $("#example1")
                .DataTable({
                    responsive: true,
                    lengthChange: false,
                    autoWidth: false,
                    buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"],
                })
                .buttons()
                .container()
                .appendTo("#example1_wrapper .col-md-6:eq(0)");
        })
        .catch((error) => console.error("Error fetching popups:", error));
}

$(document).on("click", ".btn-danger", function () {
    const popupId = $(this).data("id");
    console.log(popupId);
    fetch(`http://localhost:3500/api/v1/popup/${popupId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'token': `${token}`
        },
    })
        .then((response) => response.json())
        .then(() => {
            alert("Popup deleted successfully!");
            const row = $(this).closest('tr');
            row.fadeOut(100, function () {
                row.remove(); // Remove the row after fade out
            });
            // Refresh DataTable
            $("#example").DataTable().draw();
        })
        .catch((error) => console.error("Error deleting popup:", error));
});

function populateTable(data) {
    const tableBody = $("#example1 tbody");
    tableBody.empty();
    data.forEach((item) => {
        tableBody.append(`
                   <tr>
                <td>${item.title || 'No Title'}</td>
                <td>${item.image ? `<img src="http://localhost:3500/uploads/${item.image}" style="width: 200px; height: 70px">` : 'No Image'}</td>
                <td>${item.product?.title || 'No Product'}</td>
                <td><button type="button" class="btn btn-danger mt-3" data-id="${item._id}">Delete</button></td>
            </tr>
        `);
    });
}

$(document).ready(function () {
    fetchData();
});
