function fetchAndDisplayData(){
    const resultsContainer = document.getElementById("result-container");
    while (resultsContainer.firstChild) {
    resultsContainer.removeChild(resultsContainer.firstChild);
    }
    const user = document.getElementById("enrollmentNumber").value.trim().toUpperCase();
    const pass = document.getElementById("password").value.trim();
    let userInput2 = document.getElementById("dob").value.trim();
    let date = new Date(userInput2);
    if (!isNaN(date.getTime())) {
        date = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
    }
    const dob = date;
    sessionStorage.setItem('username', user);
    sessionStorage.setItem('password', pass);
    sessionStorage.setItem('dob', dob);
    // console.log(user, dob, pass)
    const requestBody = new URLSearchParams({
        user: `${user}`,
        dob: `${dob}`,
        pass: `${pass}`
    }).toString();
fetch('/fetch', {
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
                    <td>${item.subjectName}</td>
                    <td>${item.lecturePlusTutorialAttendance}</td>
                    <td>${item.lectureAttendance}</td>
                    <td>${item.tutorialAttendance}</td>
                    <td>${item.practicalAttendance}</td>
                `;
                tr.innerHTML = trContent;
                document.getElementById("result-container").appendChild(tr);
        });
    })
    .catch(error => console.error('Error fetching data:', error));
}
