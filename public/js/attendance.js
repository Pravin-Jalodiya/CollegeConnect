// const cheerio = require('cheerio');
const fetchWebpage = async () => {
  // const fetch = (await import('node-fetch')).default;
  const response  = await fetch('https://webkiosk.juet.ac.in/index.jsp', {
      method: 'GET',
  });
  console.log(response)
  const jsessionid = response.headers.get('set-cookie').split(';')[0].split('=')[1];
      
  const body = await response.text();
  
  // const $ = cheerio.load(body);
  
  // const captcha = $('.noselect').text().trim();
  
  console.log('JSESSIONID:', jsessionid);
  console.log('Captcha:', captcha);

  const payload = new URLSearchParams ({
      x: '',
      txtInst: 'Institute',
      InstCode: 'JUET',
      txtuType: 'Member Type',
      UserType: 'S',
      txtCode: 'Enrollment No',
      MemberCode: '211B418',
      DOB: 'DOB',
      DATE1: '01-11-2001',
      txtPin: 'Password/Pin',
      Password: 'Harish@123',
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
  return fetch('https://webkiosk.juet.ac.in/StudentFiles/Academic/StudentAttendanceList.jsp', {
      method: 'GET',
      headers: headers,
  });
})
.then(response => response.text())
.then(data => {
  // let $ = cheerio.load(data);
  console.log(data);
  // let subjects = [];
  //     $('table tbody tr').each((i, elem) => {
  //         if(i<=2) return;
  //         let subjectName = $(elem).find('td:nth-child(2)').text().trim();
  //         let lecturePlusTutorialAttendance = $(elem).find('td:nth-child(3) a').text().trim();
  //         let lectureAttendance = $(elem).find('td:nth-child(4) a').text().trim();
  //         let tutorialAttendance = $(elem).find('td:nth-child(5) a').text().trim();
  //         let practicalAttendance = $(elem).find('td:nth-child(6) a').text().trim();
          
  //         subjects.push({
  //             subjectName,
  //             lecturePlusTutorialAttendance,
  //             lectureAttendance,
  //             tutorialAttendance,
  //             practicalAttendance
  //         });
  //     });

  //     console.log(subjects);

      // subjects.forEach(subject => {
      //     console.log(`Subject: ${subject.subjectName}, Lecture+Tutorial Attendance: ${subject.lecturePlusTutorialAttendance}, Lecture Attendance: ${subject.lectureAttendance}, Tutorial Attendance: ${subject.tutorialAttendance}, Practical Attendance: ${subject.practicalAttendance}`);
      // });
})
.catch(error => console.error('Error:', error));


};

fetchWebpage();