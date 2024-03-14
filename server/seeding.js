const cors = require('cors');

const express = require('express')
const app = express()

app.use(express.json());
app.use(cors());

const axios = require('axios');

const db = require('./controller.js')

async function getPreprintsByDate() {
    let currentDate = new Date('2013-11-01');
    const endDate = new Date();
    while (currentDate < endDate) {
        const date = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        console.log(`${date}-${month}-${year}`);
        
        const url = `https://raw.githubusercontent.com/sunnydigital/biorxiv-API-metadata-scraper/main/dated_data/${year}/${String(month).padStart(2,'0')}/${year}-${String(month).padStart(2,'0')}-${String(date).padStart(2,'0')}.json`;
        try {
            const response = await axios.get(url);
            const data = response.data;
            const promises = [];
            for (let row of data) {
                if (!row || typeof row !== 'object' || !row.doi || !row.title) {
                    console.log('Invalid data:', row);
                    continue;
                }
                const { doi, title, authors, author_corresponding, author_corresponding_institution, date, version, type, license, category, jatsxml, abstract, published, server } = row;
                promises.push(db.insertIntoTable(
                    doi, title, authors, author_corresponding, author_corresponding_institution, date, version, type, license, category, jatsxml, abstract, published, server
                ));
            }
            await Promise.all(promises);
        } catch (error) {
            console.log(error);
            console.log(`No data for ${date}-${month}-${year}`);
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
}

db.createTable();
getPreprintsByDate();