//document.addEventListener('DOMContentLoaded', () => {
//    const urlParams = new URLSearchParams(window.location.search);
//    const lokalId = urlParams.get('id');
//    if (lokalId) {
//        console.log("Making reservation for Lokal ID:", lokalId);
//        // You can now use lokalId to fetch specific data about the lokal
//        // or set up the page according to the lokal details.
//        fetchLokalDetails(lokalId);
//    } else {
//        console.log("No Lokal ID provided in URL.");
//        // Handle cases where no ID is provided, perhaps redirect or show an error message
//    }
//});
//function fetchLokalDetails(lokalId) {
//    fetch(`/api/get-lokal-details?id=${lokalId}`)
//        .then(response => response.json())
//        .then(data => {
//            console.log(data);
//            // Here you can populate the details on the page, e.g., setting the lokal name, address, etc.
//        })
//        .catch(error => console.error('Failed to fetch lokal details:', error));
//}
//# sourceMappingURL=ReservationVreme.js.map