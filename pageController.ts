import {scraperObject} from './pageScraper';

export async function scrapeAll(browserInstance: any, genre: string) {
    let browser;
    try {
        browser = await browserInstance;
        await scraperObject.scraper(browser, genre);
    } catch (err) {
        console.log(err);
        browser.close();
    }
}
