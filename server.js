const express = require('express');
const path  = require('path');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const PORT = process.env.PORT || 3500;

//Cross Origin Resource Sharing
app.use(cors(corsOptions));

//built-in middleware for urlemcoded data that is form data
app.use(express.urlencoded({extended: false}))  ;

//built-in middleware for json  
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
// app.use('/subdir', express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/root'));
app.use('/fetch', require('./routes/fetch'));
app.use('/fetch-exam', require('./routes/fetch-exam'));
app.use('/fetch-datesheet', require('./routes/fetch-datesheet'));
app.use('/fetch-cgpa', require('./routes/fetch-cgpa'));
app.listen(PORT, () => console.log(`Server running on ${PORT}`));