require('dotenv').config();
const cors = require('cors');
const { CONNECTION_STRING } = process.env;

app.use(express.json());
app.use(cors());

const axios = require('axios');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(CONNECTION_STRING);

const fs = require('fs');
const { DATE } = require('sequelize');
const dateTxtContents = fs.readFileSync('./latest-date.txt', 'utf8');

// Obtain the logged date of the last preprint
let DATE_EXISTS;
try {
    const leftOffDate = new Date(dateTxtContents)
    DATE_EXISTS = true;
} catch (error) {
    DATE_EXISTS = false;
}

async function getPreprintsByDate() {
    if (DATE_EXISTS) {
        const startDate = leftOffDate;
    }
    else {
        const startDate = new Date('2013-11-01');
    }

    let currentDate = startDate;
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    while (currentDate < endDate) {
        const date = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        const url = `https://github.com/sunnydigital/biorxiv-API-metadata-scraper/blob/main/dated_data/${year}/${month}/${year}-${month}-${date}.json`;

        try {
            const response = await axios.get(url);
            const data = response.data;
            
            for ( let row of data ) {
                const { doi, title, authors, author_corresponding, author_corresponding_institution, date, version, type, license, category, jatsxml, abstract, published, server } = row;
                await sequelize.query (`
                INSERT INTO preprints (
                    doi, 
                    title, 
                    authors, 
                    author_corresponding, 
                    author_corresponding_institution, 
                    date, 
                    version, 
                    type, 
                    license, 
                    category, 
                    jatsxml, 
                    abstract, 
                    published, 
                    server
                )
                VALUES (
                    ${doi}, 
                    ${title}, 
                    ${authors}, 
                    ${author_corresponding}, 
                    ${author_corresponding_institution}, 
                    ${date}, 
                    ${version}, 
                    ${type}, 
                    ${license}, 
                    ${category}, 
                    ${jatsxml}, 
                    ${abstract}, 
                    ${published}, 
                    ${server}
                )`)
            }
        } 
        catch (error) {
            console.log(error);
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    fs.writeFileSync('latest-date.txt', currentDate);
}