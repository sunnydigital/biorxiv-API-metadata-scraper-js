require('dotenv').config();
const { CONNECTION_STRING } = process.env;

const Sequelize = require('sequelize');
const sequelize = new Sequelize(CONNECTION_STRING);

let nextEmp = 5

module.exports = {
    createTable: (req, res) => {
        sequelize.query(`
        CREATE TABLE preprints (
            id SERIAL PRIMARY KEY,
            doi VARCHAR(255),
            title VARCHAR(255),
            authors VARCHAR(255),
            author_corresponding VARCHAR(255),
            author_corresponding_institution VARCHAR(255),
            date DATE,
            version INTEGER,
            type VARCHAR(255),
            license VARCHAR(255),
            category VARCHAR(255),
            jatsxml TEXT,
            abstract TEXT,
            published VARCHAR(255),
            server VARCHAR(255),
        );
        `)
        .then(dbRes => res,status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },

    insertIntoTable: (req, res) => {
        const { doi, title, authors, author_corresponding, author_corresponding_institution, date, version, type, license, category, jatsxml, abstract, published, server } = req.body;
    
        sequelize.query(`
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
            )
        `)
        .then(dbRes => {
            res.status(200).send(dbRes[0]);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error inserting into preprints');
        })
    }
}