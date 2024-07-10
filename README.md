# BioRxiv Visualizer
Visualizer companion to the BioRxiv scraper to consolidate relevant metadata for all articles, and the metadata themselves from the publicly-available API on BioRxiv, particularly the licenses and URLs of all available preprints.

<p align="center">
    <img src="assets/biorxiv-visualizer-front-page.png" alt="app front page">
</p>

## Getting Started

- To get started with this project, clone the repository, making sure pgAdmin is installed, with a server named `preprints`. PLease then navigate to the `server` folder and open `.env`. Edit the `CONNECTION_STRING` to have the format `postgresql://postgres:{PASSWORD}@localhost:{PORT}/preprints`

- Make sure `axios`, `cors`, `dotenv`, `express`, `pg`, `pg-store`, and `sequelize` are installed.

- Replace `{PASSWORD}` and `{PORT}` with your own password and port.

- Next, run `nodemon seeding.js`, cloning all available metadata for preprints onto your machine using axios.

- From the same `server` folder, run `nodemon index.js`. This will boot up the server instance.

- Naviagate to `index.html` and open it, the title screen should be present.

## Search Functionality

<p align="center">
    <img src="assets/biorxiv-visualizer-preprints.png" alt="app front page">
</p>

The application offers a search functionality, allowing users to browse preprints, narrowing down by date, license, title, category, author, and institution.

## License Statistics

<p align="center">
    <img src="assets/biorxiv-visualizer-license.png" alt="app front page">
</p>

The application summarizes and displays a visual (pie chart) breaking down the number of preprints for each license, using the most recently available data.

## Category Statistics

<p align="center">
    <img src="assets/biorxiv-visualizer-category.png" alt="app front page">
</p>

The application summarizes and displays a visual (pie chart) breaking down the number of preprints for each license, using the most recently available data.

## Yearly Statistics

<p align="center">
    <img src="assets/biorxiv-visualizer-year.png" alt="app front page">
</p>

The application summarizes and displays a visual (bar chart) breaking down the number of preprints for each year, using the most recently available data.

## Monthly Statistics

<p align="center">
    <img src="assets/biorxiv-visualizer-month.png" alt="app front page">
</p>

The application summarizes and displays a visual (bar chart) breaking down the number of preprints for each month, using the most recently available data.
