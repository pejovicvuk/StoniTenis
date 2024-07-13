fetch('https://localhost:44387/api/Reservation')
    .then(res => res.json())
    .then(data => console.log(data))