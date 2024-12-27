
function fetchData() {
    fetch('http://localhost:3500/api/v1/newsletter', {

        }).then((response) => response.json())
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

function populateTable(data) {

    const tableBody = $("#example1 tbody");
    tableBody.empty();
    data.forEach((item, index) => {
        tableBody.append(`
              <tr>
        <td>${index + 1}</td>
                    <td>${item.email}</td>
                    <td>${new Date(item.createdAt).toLocaleString()}</td>
              </tr>
            `);
    });
}
$(document).ready(function () {
    fetchData();
});