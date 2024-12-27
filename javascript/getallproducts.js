const token = localStorage.getItem('token');
console.log("Token:", token);
function fetchData() {
    fetch('http://localhost:3500/api/v1/products/getallproduts-admin', {
            headers: {
                'Content-Type': 'application/json',
                'currency': 'KWD',
                'token':   `${token}`
            }
        })
        .then((response) => {
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

            // Initialize DataTable only once
            if ($.fn.DataTable.isDataTable("#example1")) {
                $("#example1").DataTable().clear().destroy(); // Destroy existing instance first
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
    const productId = $(this).data("product-id");
    console.log(productId);
    fetch(`http://localhost:3500/api/v1/products/${productId}`, {
            method: "DELETE",
            headers: {
                token: `${token}`
            },
        })
        .then((response) => response.json())
        .then(() => {
            alert("Product deleted successfully!");
            const row = $(this).closest('tr');
            row.fadeOut(100, function() {
                row.remove(); // Remove the row after fade out
            });
            // Refresh DataTable
            $("#example1").DataTable().draw();
        })
        .catch((error) => console.error("Error deleting product:", error));
});

function populateTable(data) {
    const tableBody = $("#example1 tbody");
    tableBody.empty();
    data.forEach((item) => {
        const categoryName = item.category ? item.category.englishname : "No Category";
        const subcategoryName = item.Subcategory ? item.Subcategory.englishname : "No SubCategory";
        const authorName = item.author ? item.author.name : "Unknown Author";
        tableBody.append(`
            <tr>
                <td>${item.title}</td>
                <td>${item.price}</td>
                <td>${item.quantity}</td>
                <td>${item.sold}</td>
                <td>${item.description}</td>
                <td>${item.papersnumber}</td>
                <td>${categoryName}</td>
                <td>${subcategoryName}</td>
                <td>${authorName}</td>
                <td><a href="edit-product.html?id=${item._id}" class="btn btn-info"><i class="fa fa-edit"></i></a></td>
                <td><button type="button" class="btn btn-danger mt-3" data-product-id="${item._id}">Delete product</button></td>
            </tr>
       ` );
    });
}

$(document).ready(function () {
    fetchData();
});