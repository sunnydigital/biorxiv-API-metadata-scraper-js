require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const { SERVER_PORT } = process.env;
const { getPreprints, getPreprintsGroupByLicense, getPreprintsGroupByCategory, getPreprintsGroupByYear } = require('./controller');

app.use(express.json());
app.use(cors({
    origin: 'http://127.0.0.1:3000'
}));

// This assumes that the databse is already set up and the tables are created
app.get('/api/preprints', getPreprints);

app.get('/api/license', getPreprintsGroupByLicense);
app.get('/api/category', getPreprintsGroupByCategory);
app.get('/api/year', getPreprintsGroupByYear);

app.listen(SERVER_PORT, () => console.log(`Server running on ${SERVER_PORT}`));