
const token = localStorage.getItem('token');
console.log("Token:", token);

function fetchData() {
    fetch('http://localhost:3500/api/v1/offers/getalloffers-admin', {
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
            populateTable(data.offers);
            console.log(data.offers)
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
    const offerId = $(this).data("id");
    console.log(offerId)
    fetch(`http://localhost:3500/api/v1/offers/${offerId}`, {
            method: "DELETE",
            headers: {
                token: `${token}`
            },
        })
        .then((response) => response.json())
        .then(() => {
            alert("offer deleted successfully!");
            const row = $(this).closest('tr');
            row.fadeOut(100, function () {
                row.remove(); // Remove the row after fade out
            });
            // Refresh DataTable
            $("#example1").DataTable().draw();
        })
        .catch((error) => console.error("Error deleting offer:", error));
});



function populateTable(data) {

    const tableBody = $("#example1 tbody");
    tableBody.empty();
    data.forEach((offer,index) => {
        tableBody.append(`
           <tr>
                    <td>${index + 1}</td>
                    <td>${offer.discount}%</td>
                    <td>${new Date(offer.startDate).toLocaleDateString()}</td>
                    <td>${offer.product.title}</td>
                    <td>${offer.product.price}</td>
                    <td>${offer.product.priceAfterDiscount}</td>
                    <td>
                        <button type="button" class="btn btn-danger mt-3" data-offer-id="${offer._id}">Delete Offer</button>
                    </td>
                </tr>
        `);
    });
}
$(document).ready(function () {
    fetchData();
});