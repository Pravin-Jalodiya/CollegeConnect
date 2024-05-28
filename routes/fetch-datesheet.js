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
    return fetch('https://webkiosk.juet.ac.in/StudentFiles/Exam/StudViewDateSheet.jsp', {
        method: 'GET',
        headers: headers,
    });
})
.then(response => response.text())
.then(data => {
    let $ = cheerio.load(data);

    const lastTable = $('table').last();
    
    const schedule = [];
    
    let lastValidDate = '';
    
    lastTable.find('tr').each((i, row) => {
        // Skip the header row
        if (i ===  0) return;
        const sno = $(row).find('td').eq(0).text().trim();
        let date = $(row).find('td').eq(1).text().trim();
        const time = $(row).find('td').eq(2).text().trim();
        const subject = $(row).find('td').eq(3).text().trim();
    
        if (date === '') {
            date = lastValidDate;
        } else {
            lastValidDate = date; 
        }
    
        schedule.push({
            sno,
            date,
            time,
            subject
        });
    });
    
    console.log(schedule);
    res.json(schedule);
})
.catch(error => {console.error('Error:', error); res.sendStatus(404); });
})

module.exports = router;
