require('dotenv').config();
const { CONNECTION_STRING } = process.env;

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(CONNECTION_STRING);

module.exports = {
    getPreprints: (req, res) => {
        const { license, date, title, category, author, institution, limit } = req.query;
        let query = `SELECT * FROM preprints WHERE 1=1`;

        if (license) query += ` AND license = '${license}'`;
        if (date) query += ` AND date = '${date}'`;
        if (title) query += ` AND title = '${title}'`;
        if (category) query += ` AND category = '${category}'`;
        if (author) query += ` AND author = '${author}'`;
        if (institution) query += ` AND institution = '${institution}'`;

        query += ` LIMIT ${limit}`;

        sequelize.query(query)
        .then(preprints => {
            res.status(200).send(preprints);
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
        .then(results => {
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
        .then(results => {
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
            SELECT YEAR(date) as year, COUNT(*) as count
            FROM preprints
            GROUP BY YEAR(date) 
        `)
        .then(results => {
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
    }
}