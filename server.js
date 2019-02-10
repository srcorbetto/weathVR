require('dotenv').config({path: __dirname + '/.env'})

const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/' + '/index.html'));
});

app.get('/weather', (req, res) => {
    console.log('req:', req.query.id);
    axios.get(`http://api.openweathermap.org/data/2.5/weather?id=${req.query.id}&units=imperial&APPID=${process.env.API_KEY}`)
    .then(response => {
        console.log(response.data);

        res.send(response.data);
    })
    .catch(error => {
        console.log(error);
    });
});

app.listen(PORT, () => console.log(`WeathVR is listening on port ${PORT}`));