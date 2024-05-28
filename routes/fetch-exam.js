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
    return fetch('https://webkiosk.juet.ac.in/StudentFiles/Exam/StudentEventMarksView.jsp?x=&exam=2024EVESEM', {
        method: 'GET',
        headers: headers,
    });
})
.then(response => response.text())
.then(data => {
    let $ = cheerio.load(data);
    console.log(data);
    const lastTable = $('table').last();
    const examMarks = [];
    lastTable.find('tr').each((i, row) => {
        if (i === 0) return; // Skip the header row
        const srNo = $(row).find('td').eq(0).text().trim();
        const subjectCode = $(row).find('td').eq(1).text().trim();
        let t1='', t2='', t3='', p1='', p2='';
    
        // Determine if the subject is a lab subject by checking if the subject name contains "LAB"
        const isLabSubject = subjectCode.includes('LAB'); // Convert to lowercase for case-insensitive comparison
    
        if (!isLabSubject) {
            // For non-lab subjects, parse T1, T2, T3 marks
            t1 = $(row).find('td').eq(3).text().trim() || '';
            t2 = $(row).find('td').eq(4).text().trim() || '';
            t3 = $(row).find('td').eq(5).text().trim() || '';
        } else {
            // For lab subjects, parse P1, P2 marks
            p1 = $(row).find('td').eq(2).text().trim() || '';
            p2 = $(row).find('td').eq(3).text().trim() || '';
        }
     
        // Push the parsed data into the examMarks array
        examMarks.push({
            srNo,
            subjectCode,
            t1,
            t2,
            t3,
            p1,
            p2
        });
    });
    
    console.log(examMarks)
    res.json(examMarks);
})
.catch(error => {console.error('Error:', error); res.sendStatus(404); });
})

module.exports = router;
