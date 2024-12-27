const token = localStorage.getItem('token');
console.log("Token:", token);

function fetchOrders() {
    fetch(`http://localhost:3500/api/v1/orders/allorders`, {
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`
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
            if (data.message === "success") {
                populateTable(data.orders); 
            } else {
                console.error("Failed to fetch orders:", data.message);
            }

            console.log(data);

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
    const orderId = $(this).data("order-id");
    if (confirm("Are you sure you want to delete this order?")) {
        fetch(`http://localhost:3500/api/v1/orders/${orderId}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${token}`
                },
            })
            .then((response) => response.json())
            .then(() => {
                alert("Order deleted successfully!");
                const row = $(this).closest('tr');
                row.fadeOut(100, function() {
                    row.remove(); // Remove the row after fade out
                });
                $("#example1").DataTable().draw();
            })
            .catch((error) => console.error("Error deleting order:", error));
    }
});

function populateTable(orders) {
    const tableBody = $("#example1 tbody");
    tableBody.empty();
    orders.forEach((order, index) => {
        tableBody.append(`
          <tr>
                <td>${index + 1}</td>
                <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                <td>${order.isPaid ? 'SUCCESS' : 'PENDING'}</td>
                <td>${order.totalPriceExchanged} ${order.currency}</td>
                <td><a href="single-order.html?id=${order._id}" class="btn btn-info"><i class="fa fa-edit"></i></a></td>
                <td><button type="button" class="btn btn-danger mt-3" data-id="${order._id}">Delete Order</button></td>
          </tr>
        `);
    });
}



$(document).ready(function () {
    fetchOrders();
});
