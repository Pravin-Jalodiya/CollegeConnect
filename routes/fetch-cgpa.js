const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');

router.post('/', async(req, res) => {
    // console.log(req.body)
    const user = req.body.user;
    const dob = req.body.dob;
    const password = req.body.pass;
    // const fetch = (await import('node-fetch')).default;
    const response  = await fetch('https://webkiosk.juet.ac.in/index.jsp', {
        method: 'GET',
    });
    // console.log(response)
    const jsessionid = response.headers.get('set-cookie').split(';')[0].split('=')[1];
        
    const body = await response.text();
    
    const $ = cheerio.load(body);
    
    const captcha = $('.noselect').text().trim();
    
    console.log('JSESSIONID:', jsessionid);
    console.log('Captcha:', captcha);

    const payload = new URLSearchParams ({
        x: '',
        txtInst: 'Institute',
        InstCode: 'JUET',
        txtuType: 'Member Type',
        UserType: 'S',
        txtCode: 'Enrollment No',
        MemberCode: `${user}`,
        DOB: 'DOB',
        DATE1: `${dob}`,
        txtPin: 'Password/Pin',
        Password: `${password}`,
        txtCodecaptcha: 'Enter Captcha',
        txtcap: `${captcha}`,
        BTNSubmit: 'Submit'
    });
    const headers = {
        'Cookie': `switchmenu=; JSESSIONID=${jsessionid}`,
        'Host': 'webkiosk.juet.ac.in',
        'Origin': 'https://webkiosk.juet.ac.in',
    };
    fetch('https://webkiosk.juet.ac.in/CommonFiles/UserAction.jsp', {
    method: 'POST',
    headers: headers,
    body: payload
})
.then(response => response.text())
.then(data => {
    // console.log(data);
    return fetch('https://webkiosk.juet.ac.in/StudentFiles/Exam/StudCGPAReport.jsp', {
        method: 'GET',
        headers: headers,
    });
})
.then(response => response.text())
.then(data => {
    let $ = cheerio.load(data);
    
    const studentData = [];

    // Find the table containing the student data
    const table = $('table.sort-table');

    // Iterate over each row in the table body
    table.find('tbody tr').each(function(i, row) {
        // Extract the data from each cell in the row
        var semester = $(this).find('td').eq(0).text().trim();
        var gradePoint = $(this).find('td').eq(1).text().trim();
        var courseCredit = $(this).find('td').eq(2).text().trim();
        var earnedCredit = $(this).find('td').eq(3).text().trim();
        var pointsSecuredSGPA = $(this).find('td').eq(4).text().trim();
        var pointsSecuredCGPA = $(this).find('td').eq(5).text().trim();
        var sgpa = $(this).find('td').eq(6).text().trim();
        var cgpa = $(this).find('td').eq(7).text().trim();

        // Push the extracted data into the studentData array
        studentData.push({
            semester: semester,
            gradePoint: gradePoint,
            courseCredit: courseCredit,
            earnedCredit: earnedCredit,
            pointsSecuredSGPA: pointsSecuredSGPA,
            pointsSecuredCGPA: pointsSecuredCGPA,
            sgpa: sgpa,
            cgpa: cgpa
        });
    });

    // Log the parsed data to the console for verification
    console.log(studentData);
    res.json(studentData);
})
.catch(error => {console.error('Error:', error); res.sendStatus(404); });
})

module.exports = router;
