function fetchAndDisplayCGPA(){
    const resultsContainer = document.getElementById("cgpa-container");
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

fetch('/fetch-cgpa ', {
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
                    <td>${item.semester}</td>
                    <td>${item.gradePoint}</td>
                    <td>${item.courseCredit}</td>
                    <td>${item.earnedCredit}</td>
                    <td>${item.pointsSecuredSGPA}</td>
                    <td>${item.pointsSecuredCGPA}</td>
                    <td>${item.sgpa}</td>
                    <td>${item.cgpa}</td>
                `;
                tr.innerHTML = trContent;
                document.getElementById("cgpa-container").appendChild(tr);
        });

    })
    .catch(error => console.error('Error fetching data:', error));
}
fetchAndDisplayCGPA();