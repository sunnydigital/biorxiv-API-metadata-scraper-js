const getPreprintsBtn = document.getElementById('get-preprints-btn');
const getPreprintsLicensePieChartBtn = document.getElementById('get-license-btn');
const getPreprintsCategoryPieChartBtn = document.getElementById('get-category-btn');
const getPreprintsYearBarChartBtn = document.getElementById('get-year-btn');

const viewGetPreprints = () => {
    document.getElementById('search-preprints').style.display = 'block';
    document.getElementById('preprints-table').style.display = 'block';
    document.getElementById('license-pie-chart').style.display = 'none';
    document.getElementById('category-pie-chart').style.display = 'none';
    document.getElementById('year-bar-chart').style.display = 'none';
};

const getPreprints = (license, date, interval, title, category, author, institution, limit) => {
    
    axios.get(`http://localhost:4000/api/preprints?license=${license}&date=${date}&interval=${interval}&title=${title}&category=${category}&author=${author}&institution=${institution}&limit=${limit}`)    
    .then(res => {
        const preprints = res.data;
        const table = document.getElementById('preprints-table');
        table.innerHTML = `
            <tr>
                <th>DOI</th>
                <th>Title</th>
                <th>Authors</th>
                <th>Corresponding Author</th>
                <th>Corresponding Author Institution</th>
                <th>Date</th>
                <th>Version</th>
                <th>Type</th>
                <th>License</th>
                <th>Category</th>
                <th>JATSXML</th>
                <th>Abstract</th>
                <th>Published</th>
                <th>Server</th>
            </tr>
        `;
        preprints.forEach(preprint => {
            table.innerHTML += `
                <tr>
                    <td>${preprint.doi}</td>
                    <td>${preprint.title}</td>
                    <td>${preprint.authors}</td>
                    <td>${preprint.author_corresponding}</td>
                    <td>${preprint.author_corresponding_institution}</td>
                    <td>${preprint.date}</td>
                    <td>${preprint.version}</td>
                    <td>${preprint.type}</td>
                    <td>${preprint.license}</td>
                    <td>${preprint.category}</td>
                    <td>${preprint.jatsxml}</td>
                    <td>${preprint.abstract}</td>
                    <td>${preprint.published}</td>
                    <td>${preprint.server}</td>
                </tr>
            `;
        });
    });
};

const getPreprintsLicensePieChart = () => {

    document.getElementById('search-preprints').style.display = 'none';
    document.getElementById('preprints-table').style.display = 'none';
    document.getElementById('license-pie-chart').style.display = 'block';
    document.getElementById('category-pie-chart').style.display = 'none';
    document.getElementById('year-bar-chart').style.display = 'none';

    axios.get('http://localhost:4000/api/license')
    .then(res => {
        const data = res.data;
        const ctx = document.getElementById('license-pie-chart').getContext('2d');

        const backgroundColors = Object.keys(data).map((_, i) => `hsla(${i / data.length * 360}, 100%, 75%, 0.5)`);
        const borderColors = Object.keys(data).map((_, i) => `hsla(${i / data.length * 360}, 100%, 75%, 0.5)`);
        
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    label: 'Preprints by License',
                    data: Object.values(data),
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    })
    .catch(error => console.log(error));
};

const getPreprintsCategoryPieChart = () => {

    document.getElementById('search-preprints').style.display = 'none';
    document.getElementById('preprints-table').style.display = 'none';
    document.getElementById('license-pie-chart').style.display = 'none';
    document.getElementById('category-pie-chart').style.display = 'block';
    document.getElementById('year-bar-chart').style.display = 'none';

    axios.get('http://localhost:4000/api/category')
    .then(res => {
        const data = res.data;
        const ctx = document.getzElementById('category-pie-chart').getContext('2d');
        
        const backgroundColors = Object.keys(data).map((_, i) => `hsla(${i / data.length * 360}, 100%, 75%, 0.5)`);
        const borderColors = Object.keys(data).map((_, i) => `hsla(${i / data.length * 360}, 100%, 75%, 0.5)`);
        
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    label: 'Preprints by Category',
                    data: Object.values(data),
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    })
    .catch(error => console.log(error));
};

const getPreprintsYearBarChart = () => {

    document.getElementById('search-preprints').style.display = 'none';
    document.getElementById('preprints-table').style.display = 'none';
    document.getElementById('license-pie-chart').style.display = 'none';
    document.getElementById('category-pie-chart').style.display = 'none';
    document.getElementById('year-bar-chart').style.display = 'block';

    axios.get('http://localhost:4000/api/year')
    .then(res => {
        const data = res.data;
        const ctx = document.getElementById('year-bar-chart').getContext('2d');
        
        const backgroundColors = Object.keys(data).map((_, i) => `hsla(${i / data.length * 360}, 100%, 75%, 0.5)`);
        const borderColors = Object.keys(data).map((_, i) => `hsla(${i / data.length * 360}, 100%, 75%, 0.5)`);
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    label: 'Preprints by Year',
                    data: Object.values(data),
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    })
    .catch(error => console.log(error));
};

getPreprintsBtn.addEventListener('click', viewGetPreprints);
getPreprintsLicensePieChartBtn.addEventListener('click', getPreprintsLicensePieChart);
getPreprintsCategoryPieChartBtn.addEventListener('click', getPreprintsCategoryPieChart);
getPreprintsYearBarChartBtn.addEventListener('click', getPreprintsYearBarChart);

document.getElementById('search-btn').addEventListener('click', () => {
    const license = document.getElementById('license-input').value;
    const date = document.getElementById('date-input').value;
    const interval = document.getElementById('interval-input').value;
    const title = document.getElementById('title-input').value;
    const category = document.getElementById('category-input').value;
    const author = document.getElementById('author-input').value;
    const institution = document.getElementById('institution-input').value;
    const limit = document.getElementById('limit-input').value;
    getPreprints(license, date, interval, title, category, author, institution, limit);
});