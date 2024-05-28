function fetchAndDisplayExam(){
    const resultsContainer = document.getElementById("exam-container");
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

fetch('/fetch-exam', {
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
                    <td>${item.subjectCode}</td>
                    <td>${item.t1}</td>
                    <td>${item.t2}</td>
                    <td>${item.t3}</td>
                    <td>${item.p1}</td>
                    <td>${item.p2}</td>
                `;
                tr.innerHTML = trContent;
                document.getElementById("exam-container").appendChild(tr);
        });

    })
    .catch(error => console.error('Error fetching data:', error));
}
fetchAndDisplayExam();