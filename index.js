const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();

app.get('/', (req, res) => {
    axios.get('http://ip-api.com/json/')
        .then(response => {
            fs.readFile('ipData.json', 'utf8', (err, data) => {
                let ipData = [];
                if (err) {
                    console.log("ipData.json does not exist. Creating a new file.");
                } else {
                    try {
                        ipData = JSON.parse(data);
                        if (!Array.isArray(ipData)) {
                            console.log("ipData.json content is not an array. Creating a new array.");
                            ipData = [];
                        }
                    } catch (e) {
                        console.error("Error reading file:", e);
                    }
                }

                if (ipData.some(item => item.lat === response.data.lat)) {
                    console.log('Data for this latitude already exists');
                } else {
                    ipData.push(response.data);
                    fs.writeFile('ipData.json', JSON.stringify(ipData, null, 2), (err) => {
                        if (err) throw err;
                        console.log('Data written to file');
                    });
                }

                res.sendFile(__dirname + '/index.html');
            });
        })
        .catch(error => {
            console.log(error);
        });
});

app.listen(3000, () => console.log('Server running on port 3000'));
