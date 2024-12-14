document.addEventListener('DOMContentLoaded', () => {
    const orderTableBody = document.getElementById('order-list');
    const paginationControls = document.getElementById('paginationControls');
    const token = localStorage.getItem('token');
    let currentPage = 1;

    async function fetchOrders(page = 1) {
        try {
            const url = `http://localhost:3500/api/v1/orders/allorders?page=${page}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            populateTable(data.orders || []);
            setupPagination(data.totalPages, page);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }

    function populateTable(orders) {
        orderTableBody.innerHTML = '';
        orders.forEach((order, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1 + (currentPage - 1) * 20}</td>
                <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                <td>${order.isPaid ? 'SUCCESS' : 'PENDING'}</td>
                <td>${order.totalPriceExchanged} ${order.currency}</td>
                <td><a href="single-order.html?id=${order._id}" class="btn btn-info"><i class="fa fa-edit"></i></a></td>
                <td><button type="button" class="btn btn-danger mt-3" data-order-id="${order._id}">Delete Order</button></td>
            `;
            orderTableBody.appendChild(row);
        });

        orderTableBody.querySelectorAll('.btn-danger').forEach(button => {
            button.addEventListener('click', async (event) => {
                const orderId = event.target.getAttribute('data-order-id');
                if (confirm('Are you sure you want to delete this order?')) {
                    await deleteOrder(orderId);
                }
            });
        });
    }
    function setupPagination(totalPages, currentPage) {
        paginationControls.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.classList.add('pagination-btn');
            if (i === currentPage) {
                button.classList.add('active');
            }
            button.addEventListener('click', () => {
                fetchOrders(i, currentSearchKeyword); 
            });
            paginationControls.appendChild(button);
        }
    }

    async function deleteOrder(id) {
        try {
            const response = await fetch(`http://localhost:3500/api/v1/orders/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${token}`,
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete order');
            }
            fetchOrders(currentPage); 
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('Failed to delete order. Please try again.');
        }
    }


    fetchOrders(); 
});
