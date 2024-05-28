const express = require('express');
const router = express.Router();
const path = require('path');

router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
})
router.get('^/css/style(.css)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'css', 'style.css'));
})
router.get('^/$|/examMarks(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'examMarks.html'));
})
router.get('^/$|/dateSheet(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'dateSheet.html'));
})
router.get('^/$|/cgpa(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'cgpa.html'));
})
module.exports = router;
