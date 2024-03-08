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

let licensePieChart;
let categoryPieChart;
let yearBarChart;

const getPreprints = (license, date, title, category, author, institution, limit) => {
    axios.get(`http://localhost:4000/api/preprints?license=${license}&date=${date}&title=${title}&category=${category}&author=${author}&institution=${institution}&limit=${limit}`)
      .then(res => {
        const preprints = res.data;
        const table = document.getElementById('preprints-table');
        const tableBody = document.createElement('tbody');
  
        preprints.forEach(preprint => {
          const row = document.createElement('tr');
  
          const doiCell = document.createElement('td');
          doiCell.textContent = preprint.doi;
          row.appendChild(doiCell);
  
          const titleCell = document.createElement('td');
          titleCell.textContent = preprint.title;
          row.appendChild(titleCell);
  
          const authorCell = document.createElement('td');
          authorCell.textContent = preprint.author_corresponding;
          row.appendChild(authorCell);
  
          const institutionCell = document.createElement('td');
          institutionCell.textContent = preprint.author_corresponding_institution;
          row.appendChild(institutionCell);
  
          const dateCell = document.createElement('td');
          dateCell.textContent = preprint.date;
          row.appendChild(dateCell);
  
          const licenseCell = document.createElement('td');
          licenseCell.textContent = preprint.license;
          row.appendChild(licenseCell);
  
          const jatsxmlCell = document.createElement('td');
          jatsxmlCell.textContent = preprint.jatsxml;
          row.appendChild(jatsxmlCell);
  
          const abstractCell = document.createElement('td');
          abstractCell.textContent = preprint.abstract;
          row.appendChild(abstractCell);
  
          tableBody.appendChild(row);
        });
  
        table.innerHTML = '';
  
        const tableHeader = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headerCells = ['DOI', 'Title', 'Corresponding Author', 'Corresponding Author Institution', 'Date', 'License', 'JATSXML', 'Abstract'];
        headerCells.forEach(headerText => {
          const th = document.createElement('th');
          th.textContent = headerText;
          headerRow.appendChild(th);
        });
        tableHeader.appendChild(headerRow);
        table.appendChild(tableHeader);
  
        table.appendChild(tableBody);
      })
      .catch(error => console.log(error));
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

        const backgroundColors = Object.keys(data).map((_, i) => `hsla(${i / Object.keys(data).length * 360}, 100%, 75%, 1)`);
        const borderColors = Object.keys(data).map((_, i) => `hsla(${i / Object.keys(data).length * 360}, 100%, 75%, 1)`);
        
        if (licensePieChart) {
          licensePieChart.destroy();
        }

        licensePieChart = new Chart(ctx, {
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
        const ctx = document.getElementById('category-pie-chart').getContext('2d');

        const backgroundColors = Object.keys(data).map((_, i) => `hsla(${i / Object.keys(data).length * 360}, 100%, 75%, 1)`);
        const borderColors = Object.keys(data).map((_, i) => `hsla(${i / Object.keys(data).length * 360}, 100%, 75%, 1)`);
  
        if(categoryPieChart) {
          categoryPieChart.destroy();
        }

        categoryPieChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: Object.keys(data),
            datasets: [
              {
                label: 'Preprints by Category',
                data: Object.values(data),
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
              }
            ]
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
        const backgroundColors = Object.keys(data).map((_, i) => `hsla(${i / Object.keys(data).length * 360}, 100%, 75%, 1)`);
        const borderColors = Object.keys(data).map((_, i) => `hsla(${i / Object.keys(data).length * 360}, 100%, 75%, 1)`);
  
        if(yearBarChart) {
          yearBarChart.destroy();
        }

        yearBarChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: Object.keys(data),
            datasets: [
              {
                label: 'Preprints by Year',
                data: Object.values(data),
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
              }
            ]
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
    const title = document.getElementById('title-input').value;
    const category = document.getElementById('category-input').value;
    const author = document.getElementById('author-input').value;
    const institution = document.getElementById('institution-input').value;
    const limit = document.getElementById('limit-input').value;
    getPreprints(license, date, title, category, author, institution, limit);
});