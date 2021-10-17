import {startBrowser} from './browser'
import {scrapeAll} from './pageController';
import * as inquirer from "inquirer";

const genres = [
    '\nFiction\n',
    '\nMystery & Thriller\n',
    '\nHistorical Fiction\n',
    '\nFantasy\n',
    '\nRomance\n',
    '\nScience Fiction\n',
    '\nHorror\n',
    '\nHumor\n',
    '\nNonfiction\n',
    '\nMemoir & Autobiography\n',
    '\nHistory & Biography\n',
    '\nScience & Technology\n',
    '\nFood & Cookbooks\n',
    '\nGraphic Novels & Comics\n',
    '\nPoetry\n',
    '\nDebut Novel\n',
    '\nYoung Adult Fiction\n',
    '\nYoung Adult Fantasy\n',
    "\nMiddle Grade & Children's\n",
    '\nPicture Books\n'
]
inquirer
    .prompt([
        {
            type: 'list',
            name: 'genre',
            message: 'Choose your favourite genre: ',
            choices: genres,
        },
    ]).then(answer => {
        //Start the browser and create a browser instance
        let browserInstance = startBrowser();
        scrapeAll(browserInstance, answer.genre)
    }
)
// Pass the browser instance to the scraper controller
