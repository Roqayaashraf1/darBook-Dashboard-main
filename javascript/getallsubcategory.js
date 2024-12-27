
const token = localStorage.getItem('token');
console.log("Token:", token);

function fetchData() {
    fetch(`http://localhost:3500/api/v1/subcategory/getallsubcategory-admin`, {
            headers: {
                'language': "arabic",
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
            console.log(data.result)
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
        .catch((error) => console.error("Error fetching data:", error));


}
$(document).on("click", ".btn-danger", function () {
    const subcategoryId = $(this).data("id");
    console.log(subcategoryId)
    fetch(`http://localhost:3500/api/v1/subcategory/${subcategoryId}`, {
            method: "DELETE",
            headers: {
                token: `${token}`
            },
        })
        .then((response) => response.json())
        .then(() => {
            alert("SubCategory deleted successfully!"); const row = $(this).closest('tr');
            row.fadeOut(100, function() {
                row.remove(); // Remove the row after fade out
            });
            // Refresh DataTable
            $("#example1").DataTable().draw();
        })
        .catch((error) => console.error("Error deleting Subcategory:", error));
});



function populateTable(data) {

    const tableBody = $("#example1 tbody");
    tableBody.empty();
    data.forEach((item) => {
        const categoryName = item.category ? item.category.englishname : "No Category";
        tableBody.append(`
          <tr>
                 <td>${item.arabicname}</td>
                 <td>${item.englishname}</td>
                  <td>${categoryName}</td>
                <td><a href="edit-subcategory.html?id=${item._id}" class="btn btn-info"><i class="fa fa-edit"></i></a></td>
                <td><button type="button" class="btn btn-danger mt-3" data-id="${item._id}">Delete Subcategory</button></td>
          </tr>
        `);
    });
}
$(document).ready(function () {
    fetchData();
});