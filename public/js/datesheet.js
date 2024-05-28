function fetchAndDispplayDatesheet(){
    const resultsContainer = document.getElementById("datesheet-container");
    while (resultsContainer.firstChild) {
    resultsContainer.removeChild(resultsContainer.firstChild);
    }
    const user = sessionStorage.getItem('username');
    const pass = sessionStorage.getItem('password');
    const dob =  sessionStorage.getItem('dob');
    const requestBody = new URLSearchParams({
        user: `${user}`,
        dob: `${dob}`,
        pass: `${pass}`
    }).toString();

fetch('/fetch-datesheet ', {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: requestBody,
})
    .then(response => response.json()) 
    .then(data => {
        // Iterate over the parsed data
        data.forEach(item => {

                const tr = document.createElement('tr');
                const trContent = `
                    <td>${item.subject}</td>
                    <td>${item.date}</td>
                    <td>${item.time}</td>
                `;
                tr.innerHTML = trContent;
                document.getElementById("datesheet-container").appendChild(tr);
        });

    })
    .catch(error => console.error('Error fetching data:', error));
}
fetchAndDispplayDatesheet();