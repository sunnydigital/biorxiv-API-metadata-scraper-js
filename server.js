const axios = require('axios');
const JSON = require('json5'); // For JSON serialization with indentation
const Rollbar = require('rollbar')
const rollbar = new Rollbar({
  accessToken: 'ac7359bdcf51421b9738b02013f1b18b',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

const day = 16;
const month = 3;
const year = 2014;

// Function to add leading zeros (similar to the Python lambda)
function lezoFx(x) {
  return String(x).padStart(2, '0');
}

const url = `https://api.biorxiv.org/details/biorxiv/${year}-${lezoFx(month)}-${lezoFx(day)}/${year}-${lezoFx(month)}-${lezoFx(day)}/0`;

axios.get(url)
  .then(response => {
    if (response.status !== 200) {
      console.error('Error fetching data:', response.status);
      return;
    }
    
    try {
      const parsedData = response.data;
      rollbar.log(parsedData);
      console.log(parsedData); // Access the parsed data
    } catch (error) {
        rollbar.log('Error parsing data:', error);
      console.error('Error parsing data:', error);
    }
  })
  .catch(error => {
    rollbar.error('Error making request:', error);
    console.error('Error making request:', error);
  });

rollbar.log(JSON.stringify(data, null, 2))
console.log(JSON.stringify(data, null, 2)); // Pretty-print with 2 spaces indentation

function updateReturnDict(articles, curDate) {
/*
    * Processes articles for a specific date, checking for existing DOIs and adding/updating license keys.
    * @param {Object} articles - The article data with a "collection" property.
    * @param {string} curDate - The current date as a string.
    */

curDate = String(curDate);
articles = articles.collection;

for (const article of articles) {
    // Update license counts (default to 0 if license key doesn't exist)
    return_dict.license[article.license] = (return_dict.license[article.license] || 0) + 1;

    // Add/update article content for the DOI
    return_dict.content[article.doi] = {
    date: article.date,
    license: article.license,
    jatsxml: article.jatsxml,
    };
}
}

function updateFullDictByDate(articles, curDate) {
/*
    * Updates a dictionary by adding a list of DOIs for a specific date as the value.
    * @param {Object} articles - The article data with a "collection" property.
    * @param {string} curDate - The current date as a string in YYYY-mm-dd format.
    */

curDate = String(curDate);
articles = articles.collection;

full_dict_by_date[curDate] = articles.map(item => ({
    doi: item.doi,
    license: item.license,
}));
}

const path = require('path');

function getDatedSubfolders(date) {
  /*
   * Creates subfolders for the day, month, and year of the given date.
   * @param {Date} date - The date object.
   * @returns {string} The full path to the created folder representing the current date.
   */

  const month = date.getMonth() + 1; // Months are 0-indexed in JS
  const year = date.getFullYear();

  const mainFolder = path.join(__dirname, 'full-dict');

  const yearFolder = path.join(mainFolder, String(year));
  try {
    fs.mkdirSync(yearFolder, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error; // Re-throw non-existence errors
    }
  }

  const monthFolder = path.join(yearFolder, String(month));
  try {
    fs.mkdirSync(monthFolder, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error; // Re-throw non-existence errors
    }
  }

  return monthFolder;
}

function splitDates(dates, numSplits = 1) {
    /*
     * Splits a list of dates into sub-lists with an optional number of splits.
     * @param {Date[]} dates - An array of date objects.
     * @param {number} [numSplits=1] - The desired number of sub-lists (default: 1).
     * @returns {Date[][] | Date[]} An array of sub-lists or individual dates.
     */
  
    if (numSplits < 1) {
      throw new Error('Number of splits must be a positive integer.');
    }
  
    if (numSplits > dates.length) {
      return dates; // Return individual dates if splits exceed list length
    }
  
    const sliceSize = Math.ceil(dates.length / numSplits); // Calculate slice size for equal distribution
    return Array.from({ length: numSplits }, (_, i) => dates.slice(i * sliceSize, (i + 1) * sliceSize));
  }

  const path = require('path');
  const fs = require('fs');
  
  function getSplitFolder(splitNum) {
    /*
     * Creates a folder for the given split number, ensuring parent directories exist.
     * @param {number} splitNum - The split number for the folder name.
     * @returns {string} The full path to the created or existing split folder.
     */
  
    const mainFolder = path.join(__dirname, 'output_dicts');
  
    try {
      fs.mkdirSync(mainFolder, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error; // Re-throw non-existence errors
      }
    }
  
    const splitFolder = path.join(mainFolder, String(splitNum));
    try {
      fs.mkdirSync(splitFolder, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error; // Re-throw non-existence errors
      }
    }
  
    return splitFolder;
  }

  const fs = require('fs');
  const path = require('path');
  const https = require('https'); // Assuming requests use HTTPS, adjust for HTTP if needed
  const { parse } = require('date-fns'); // For date parsing and manipulation
  
  function processBioRxiv(
    startDate = new Date(2013, 0, 1), // Default start date (Jan 1, 2013)
    endDate = new Date(), // Default end date (today)
    loadDicts = false,
    delay = 5,
    ...kwargs
  ) {
    /*
     * Processes BioRxiv data for a date range, handles loading/saving dictionaries, and sleeps between requests.
     * @param {Date} [startDate=new Date(2013, 0, 1)] - Beginning date (YYYY-MM-DD).
     * @param {Date} [endDate=new Date()] - End date (YYYY-MM-DD).
     * @param {boolean} [loadDicts=false] - Whether to load pre-existing dictionaries.
     * @param {number} [delay=5] - Delay (seconds) between API requests.
     * @returns {void}
     */
  
    // Global variables (adjusted for Node.js scope)
    let fullDictByDate = {};
    let returnDict = {
      license: {},
      content: {},
    };
  
    // Get split folder (assuming SELECTED_NUMBER is defined elsewhere)
    const splitFolder = getSplitFolder(SELECTED_NUMBER);
  
    // Load dictionaries if specified
    if (loadDicts) {
      try {
        fullDictByDate = JSON.parse(
          fs.readFileSync(path.join(splitFolder, 'full_dict_by_date.json'), 'utf8')
        );
        returnDict = JSON.parse(
          fs.readFileSync(path.join(splitFolder, 'return_dict.json'), 'utf8')
        );
  
        // Update start date if not the first date
        if (Object.keys(fullDictByDate).length > 0) {
          startDate = new Date(
            Object.keys(fullDictByDate).sort().pop()
          );
          startDate.setDate(startDate.getDate() + 1); // Add 1 day
        }
      } catch (error) {
        console.error('Error loading dictionaries:', error);
      }
    }
  
    // Generate list of dates
    const dates = [];
    for (let i = 0; i <= (endDate - startDate) / (1000 * 60 * 60 * 24); i++) {
      dates.push(new Date(startDate.getTime() + i * (1000 * 60 * 60 * 24)));
    }
  
    for (const curDate of dates) {
      let flag = true;
      let numSkip = 0;
  
      while (flag) {
        const curDateDir = getDatedSubfolders(curDate);
  
        const url = `https://api.biorxiv.org/details/biorxiv/<span class="math-inline">\{curDate\.toISOString\(\)\.slice\(0, 10\)\}/</span>{curDate.toISOString().slice(0, 10)}/${numSkip}`;
  
        https.get(url, (response) => {
          if (response.statusCode !== 200) {
            console.error('Error fetching data:', response.statusCode);
            return;
          }
  
          response.on('data', (chunk) => {
            data += chunk;
          });
  
          response.on('end', () => {
            try {
              const articles = JSON.parse(data);
  
              if (articles['messages'][0]['status'] !== 'ok') {
                flag = false;
                return;
              }
  
              updateFullDictByDate(articles, curDate);
              updateReturnDict(articles, curDate);
  
              // Save full_dict_by_date.json
              fs.writeFileSync(
                path.join(splitFolder, 'full_dict_by_date.json'),
                JSON.stringify(fullDictByDate, null, 2)
              );
  
              // Save return_dict.json
              fs.writeFileSync(
                path.join(splitFolder, 'return_dict.json'),
                JSON.stringify(returnDict, null, 2)
              );
  
              // Save daily articles as JSON
              fs.writeFileSync(
                path.join(curDateDir, curDate.toISOString().slice(0, 10) + '.json'),
                JSON.stringify(articles['collection'], null, 2)
              );
  
              console.log('='.repeat(50));
              console.log('Processed date:', curDate, 'with', articles['collection'].length, 'articles');
              console.log(`Sleeping for ${delay} second(s)... Zzz...`);
              console.log('='.repeat(50));
  
              setTimeout(() => {
                numSkip += 100;
                flag = true; // Reset flag for next iteration
              }, delay * 1000); // Delay in milliseconds
            } catch (error) {
              console.error('Error processing data:', error);
            }
          });
        }).on('error', (error) => {
          console.error('Error making request:', error);
        });
  
        let data = ''; // Buffer for incoming data from the response
      }
    }
  }

// Constant for the number of splits
const DO_NOT_CHANGE_FLAG = 100;

// Variable for the starting split number (adjustable)
let LEFT_OFF = 96;

// Boolean flag for using today's date (adjustable)
let USE_TODAY = true;

for (let num = LEFT_OFF; num < DO_NOT_CHANGE_FLAG; num++) {
    // No need to declare SELECTED_NUMBER globally as it's within the loop
    const SELECTED_NUMBER = num;
  
    const today = USE_TODAY ? new Date() : new Date(2023, 8, 4); // Adjust month index (0-based)
    const startDate = new Date(2013, 0, 1); // Adjust month index (0-based)
    const dates = [];
    for (let x = 0; x <= (today - startDate) / (1000 * 60 * 60 * 24); x++) {
      dates.push(new Date(startDate.getTime() + x * (1000 * 60 * 60 * 24)));
    }
  
    const splitDatesList = split_dates(dates, DO_NOT_CHANGE_FLAG);
  
    const [start_date, end_date] = splitDatesList[SELECTED_NUMBER]; // Destructuring assignment
  
    process_bioRxiv(start_date, end_date, load_dicts = false, delay = 1);
  }

  const fs = require('fs');
  const path = require('path');
  
  function combineOutputDicts(path = './output_dicts/', savePath = './global_dicts/', num = 0) {
    /*
     * Combines all output dicts into single JSON files, updating global dicts.
     * @param {string} [path='./output_dicts/'] - Path to output dict folders.
     * @param {string} [savePath='./global_dicts/'] - Path to save combined dicts.
     * @param {number} [num=0] - Number of the folder to process.
     * @returns {void}
     */
  
   try {
      const curReturnDict = JSON.parse(
        fs.readFileSync(path.join(path, String(num), 'return_dict.json'), 'utf8')
      );
      const curFullDictByDate = JSON.parse(
        fs.readFileSync(path.join(path, String(num), 'full_dict_by_date.json'), 'utf8')
      );
  
      console.log(`Combining and saving "return_dict" license values for folder ${num}...`);
  
      // Update global_return_dict using destructuring and defaults for license counts
      globalReturnDict.license = {
        ...globalReturnDict.license,
        ...curReturnDict.license.reduce((acc, [key, value]) => {
          return { ...acc, [key]: (acc[key] || 0) + value };
        }, {}),
      };
  
      // Update content directly
      globalReturnDict.content = { ...globalReturnDict.content, ...curReturnDict.content };
  
      fs.writeFileSync(path.join(savePath, 'return_dict.json'), JSON.stringify(globalReturnDict, null, 2));
  
      console.log(`Combining and saving "full_dict_by_date" content items for folder ${num}...`);
  
      // Merge full_dict_by_date dictionaries
      globalFullDictByDate = { ...globalFullDictByDate, ...curFullDictByDate };
  
      fs.writeFileSync(path.join(savePath, 'full_dict_by_date.json'), JSON.stringify(globalFullDictByDate, null, 2));
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`No files in folder ${num}, continuing to the next folder...`);
      } else {
        console.error('Error combining dicts:', error);
      }
    }
  }

  function combineOutputDicts(path = './output_dicts/', savePath = './global_dicts/', num = 0, returnDict = {}, fullDictByDate = {}) {
    // ... function logic using returnDict and fullDictByDate ...
  }
  
  const globalReturnDict = {
    'license': {},
    'content': {}
  };
  
  const globalFullDictByDate = {};
  
  combineOutputDicts(..., globalReturnDict, globalFullDictByDate);
const fs = require('fs').promises; // Using promises for cleaner async/await usage
const path = require('path');

async function getGlobalFolder() {
  /*
   * Creates the global folder for combined JSONs if it doesn't exist.
   * @returns {string} - Path to the global folder.
   */
  const globalFolderPath = path.join(__dirname, './global_dicts/');

  try {
    await fs.mkdir(globalFolderPath, { recursive: true }); // Create folder recursively
  } catch (error) {
    if (error.code === 'EEXIST') {
      console.log('Global folder already exists.');
    } else {
      console.error('Error creating global folder:', error);
    }
  }

  return globalFolderPath;
}

const fs = require('fs').promises; // Using promises for cleaner async/await usage
const path = require('path');

async function getGlobalFolder() {
  /*
   * Creates the global folder for combined JSONs if it doesn't exist.
   * @returns {string} - Path to the global folder.
   */
  const globalFolderPath = path.join(__dirname, './global_dicts/');

  try {
    await fs.mkdir(globalFolderPath, { recursive: true }); // Create folder recursively
  } catch (error) {
    if (error.code === 'EEXIST') {
      console.log('Global folder already exists.');
    } else {
      console.error('Error creating global folder:', error);
    }
  }

  return globalFolderPath;
}

for (let num = 0; num < DO_NOT_CHANGE_FLAG; num++) {
    combine_output_dicts(
      path='./output_dicts/',
      savePath: async () => await get_global_folder(),
      num
    );
  }

lastFolderNum = int(getLastFolder('./amend_dicts/'));
SELECTED_NUMBER = lastFolderNum + 1;

const fs = require('fs').promises; // Using promises for async/await
const path = require('path');

async function runProcessBioRxiv(start = SELECTED_NUMBER, flag = DO_NOT_CHANGE_FLAG) {
  /*
   * Runs process_bioRxiv for a specific number of splits.
   * @param {number} [start=SELECTED_NUMBER] - Starting split number (inclusive).
   * @param {number} [flag=DO_NOT_CHANGE_FLAG] - Number of splits to process.
   */

  for (let num = start; num < start + flag; num++) {
    try {
      // Assuming get_last_available_date is defined elsewhere and returns a Date object
      const lastAvailableDate = await get_last_available_date();
      const dates = [];
      for (let x = 0; x <= (new Date().getTime() - lastAvailableDate.getTime()) / (1000 * 60 * 60 * 24); x++) {
        dates.push(new Date(lastAvailableDate.getTime() + x * (1000 * 60 * 60 * 24)));
      }

      const splitDatesList = await split_dates(dates, flag); // Assuming split_dates is defined elsewhere

      const [startDate, endDate] = splitDatesList[num]; // Destructuring assignment

      await process_bioRxiv(startDate, endDate, load_dicts = false, delay = 1); // Use default values with assignment
    } catch (error) {
      if (error instanceof IndexError) { // Specific error handling
        console.error(`Error occurred for split ${num}:`, error);
        flag -= 1;
        if (flag === 0) {
          console.log('No more splits to try, exiting...');
          break;
        }
        console.log(`Skipping to next split and trying with flag ${flag}`);
        continue; // Skip to next iteration without breaking the loop
      } else {
        console.error('Unexpected error:', error); // Handle other errors
      }
    }
  }
}

runProcessBioRxiv();

const fs = require('fs').promises; // Using promises for async/await
const path = require('path');

async function combineOutputDicts(path = './output_dicts/', savePath = './global_dicts/', num = 0) {
  /*
   * Combines output dicts into single JSON files, updating global dicts.
   * @param {string} [path='./output_dicts/'] - Path to output dict folders.
   * @param {string} [savePath='./global_dicts/'] - Path to save combined dicts.
   * @param {number} [num=0] - Number of the folder to process.
   * @returns {void}
   */

  try {
    const curReturnDictPath = path.join(path, String(num), 'return_dict.json');
    const curFullDictByDatePath = path.join(path, String(num), 'full_dict_by_date.json');

    const curReturnDictData = await fs.readFile(curReturnDictPath, 'utf8');
    const curFullDictByDateData = await fs.readFile(curFullDictByDatePath, 'utf8');

    const curReturnDict = JSON.parse(curReturnDictData);
    const curFullDictByDate = JSON.parse(curFullDictByDateData);

    console.log(f'Combining and saving "return_dict" license values for folder {num}...');

    globalReturnDict.license = {
      ...globalReturnDict.license,
      ...curReturnDict.license.reduce((acc, [key, value]) => {
        return { ...acc, [key]: (acc[key] || 0) + value };
      }, {}),
    };

    globalReturnDict.content = { ...globalReturnDict.content, ...curReturnDict.content };

    await fs.writeFile(path.join(savePath, 'return_dict.json'), JSON.stringify(globalReturnDict, null, 2));

    console.log(f'Combining and saving "full_dict_by_date" content items for folder {num}...');

    globalFullDictByDate = { ...globalFullDictByDate, ...curFullDictByDate };

    await fs.writeFile(path.join(savePath, 'full_dict_by_date.json'), JSON.stringify(globalFullDictByDate, null, 2));
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(f'No files in folder {num}, continuing to the next folder...');
    } else {
      console.error('Error combining dicts:', error);
    }
  }
}

const fs = require('fs').promises; // Using promises for async/await
const path = require('path');

async function getGlobalFolder() {
  /*
   * Creates the global folder for combined JSONs if it doesn't exist.
   * @returns {string} - Path to the global folder.
   */
  const globalFolderPath = path.join(__dirname, './global_dicts/');

  try {
    await fs.mkdir(globalFolderPath, { recursive: true }); // Create folder recursively
  } catch (error) {
    if (error.code === 'EEXIST') {
      console.log('Global folder already exists.');
    } else {
      console.error('Error creating global folder:', error);
    }
  }

  return globalFolderPath;
}

// global_dicts.js
module.exports = {
    returnDict: require('./global_dicts/return_dict.json'), // Assuming the file exists
    fullDictByDate: require('./global_dicts/full_dict_by_date.json'), // Assuming the file exists
  };
  
  // In your main script
  const { returnDict, fullDictByDate } = require('./global_dicts');
  
  combineOutputDicts(..., returnDict, fullDictByDate);
