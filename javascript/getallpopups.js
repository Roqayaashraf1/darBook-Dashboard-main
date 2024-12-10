document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
  
    async function fetchPopups() {
      try {
        const response = await fetch('http://localhost:3500/api/v1/popup');
        if (!response.ok) throw new Error('Failed to fetch popups');
        
        const { result: popups } = await response.json();
        displayPopups(popups);
      } catch (error) {
        console.error('Error fetching popups:', error);
      }
    }
    function displayPopups(popups) {
      const tableBody = document.querySelector('#example tbody');
      tableBody.innerHTML = ''; 
  
      popups.forEach(({ _id, title, image, product }) => {
        const row = document.createElement('tr');
        row.dataset.id = _id;
  
        row.innerHTML = `
          <td>${title || 'No Title'}</td>
          <td>${image ? `<img src="http://localhost:3500/uploads/${image}" style="width: 200px; height:70px">` : 'No Image'}</td>
          <td>${product?.title || 'No Product'}</td>
          <td><button class="btn btn-danger mt-3 delete-btn">Delete</button></td>
        `;
  
        const deleteButton = row.querySelector('.delete-btn');
        deleteButton.addEventListener('click', () => {
          if (confirm('Are you sure you want to delete this popup?')) {
            deletePopup(_id, row);
          }
        });
  
        tableBody.appendChild(row);
      });
    }
    async function deletePopup(id, row) {
      try {
        const response = await fetch(`http://localhost:3500/api/v1/popup/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', token },
        });
  
        if (!response.ok) throw new Error('Failed to delete popup');
        
        alert('Popup deleted successfully');
        row.remove(); 
      } catch (error) {
        console.error('Error deleting popup:', error);
        alert('Failed to delete popup. Please try again.');
      }
    }
  
    fetchPopups();
  });
  