require('dotenv').config();
const { CONNECTION_STRING } = process.env;

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(CONNECTION_STRING);

module.exports = {
    getPreprints: (req, res) => {
        const { license, date, interval, title, category, author, institution, limit } = req.query;
        let query = `SELECT * FROM preprints WHERE 1=1`;
        
        if (license) query += ` AND license LIKE '%${license}%'`;
        if (date && interval) query += ` AND date BETWEEN DATE_SUB('${date}', INTERVAL ${interval} DAY) AND DATE_ADD('${date}', INTERVAL ${interval} DAY)`;
        if (date && !interval) query += ` AND date BETWEEN DATE_SUB('${date}', INTERVAL 7 DAY) AND DATE_ADD('${date}', INTERVAL 7 DAY)`;
        if (title) query += ` AND title LIKE '%${title}%'`;
        if (category) query += ` AND category LIKE '%${category}%'`;
        if (author) query += ` AND authors LIKE '%${author}%'`;
        if (institution) query += ` AND author_corresponding_institution LIKE '%${institution}%'`;

        query += `${limit ? ` LIMIT ${limit}` : ` LIMIT 10`}`;

        sequelize.query(query)
        .then(([results, metadata]) => {
            res.status(200).send(results);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error getting preprints');
        });
    },
    getPreprintsGroupByLicense: (req, res) => {
        sequelize.query(`
            SELECT license, COUNT(*) as count
            FROM preprints
            GROUP BY license
        `)
        .then(([results, metadata]) => {
            console.log(results)

            const countsByLicense = results.reduce((obj, row) => {
                obj[row.license] = row.count;
                return obj;
            }, {});

            res.status(200).send(countsByLicense);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error getting preprints grouped by license');
        });
    },
    getPreprintsGroupByCategory: (req, res) => {
        sequelize.query(`
            SELECT category, COUNT(*) as count
            FROM preprints
            GROUP BY category
        `)
        .then(([results, metadata]) => {
            console.log(results)
    
            const countsByCategory = results.reduce((obj, row) => {
                obj[row.category] = row.count;
                return obj;
            }, {});

            res.status(200).send(countsByCategory);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error getting preprints grouped by category');
        });
    },
    getPreprintsGroupByYear: (req, res) => {
        sequelize.query(`
            SELECT EXTRACT(YEAR FROM date) AS year, COUNT(*) as count
            FROM preprints
            GROUP BY EXTRACT(YEAR FROM date);
        `)
        .then(([results, metadata]) => {
            console.log(results)

            const countsByYear = results.reduce((obj, row) => {
                obj[row.year] = row.count;
                return obj;
            }, {});

            res.status(200).send(countsByYear);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error getting preprints grouped by year');
        });
    },
    createTable: (req, res) => {
        sequelize.query(`
        DROP TABLE IF EXISTS preprints;

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
            server VARCHAR(255)
        );
        `)
        .then(dbRes => console.log(dbRes[0]))
        .catch(err => console.log(err))
    },
    insertIntoTable: (doi, title, authors, author_corresponding, author_corresponding_institution, date, version, type, license, category, jatsxml, abstract, published, server) => {    
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
                '${doi}', 
                '${title}', 
                '${authors}', 
                '${author_corresponding}', 
                '${author_corresponding_institution}', 
                '${date}', 
                '${version}', 
                '${type}', 
                '${license}', 
                '${category}', 
                '${jatsxml}', 
                '${abstract}', 
                '${published}', 
                '${server}'
            )
        `)
        .then(dbRes => {
            console.log(dbRes[0]);
        })
        .catch(err => {
            console.log(err);
        })
    }
}