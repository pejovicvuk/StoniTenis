document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = 'http://localhost:3000/api/locations';  // Adjust this URL based on your actual API endpoint

    // Function to fetch locations from the server
    function fetchLocations() {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(locations => {
                updateLocationList(locations);
            })
            .catch(error => {
                console.error('Error fetching locations:', error);
                displayError('Failed to load locations.');
            });
    }

    // Function to update the HTML list with location data
    function updateLocationList(locations) {
        const list = document.getElementById('suggestions');
        list.innerHTML = ''; // Clear existing list items

        locations.forEach(location => {
            const listItem = document.createElement('li');
            listItem.className = 'suggestion-box';
            listItem.textContent = location.name; // Assuming each location has a 'name' property
            list.appendChild(listItem);
        });
    }

    // Function to display an error message to the user
    function displayError(message) {
        const list = document.getElementById('suggestions');
        list.innerHTML = ''; // Clear the list first
        const errorItem = document.createElement('li');
        errorItem.textContent = message;
        errorItem.style.color = 'red';
        list.appendChild(errorItem);
    }

    // Initialize fetching of locations
    fetchLocations();
});
