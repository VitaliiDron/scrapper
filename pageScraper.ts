import {Browser} from "puppeteer";

export const scraperObject = {
    url: 'https://www.goodreads.com/choiceawards/best-books-2020',
    amazonCart: 'https://www.amazon.com/gp/cart/view.html?ref_=nav_cart',
    amazonURL: (name: string) => {
        return `https://www.amazon.com/s?k=${name}&i=stripbooks-intl-ship&ref=nb_sb_noss_2`
    },
    async scraper(browser: Browser, bookGenre: string) {
        const pages = await browser.pages();
        const page = pages[0];
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);
        // Wait for the required DOM to be rendered
        await page.waitForSelector('.content');
        // Get the link to all the required books
        const bookUrls = await page.$$eval(
            'div.category',
            (links, genre ) => {
                // Extract the links from the data
                return links
                    .filter((el) => el.querySelector('a > h4')?.textContent === genre)
                    .map(el => el.querySelector('a')?.href)
            }, bookGenre);
        if (bookUrls[0] == null) {
            throw Error(`There were no ${bookGenre} books`);
        }

        //Get most popular book name
        await page.goto(bookUrls[0]);
        // console.log(`Navigating to ${bookUrls[0]}...`);
        await page.waitForSelector('.content');
        const bestBookByGenreName = await page.$$eval(
            'div.winner',
            (links: any[]) => {
                links = links
                    .map(el => el.querySelector('a.winningTitle').textContent)
                return links;
            });
        if (bestBookByGenreName[0] == null) {
            throw Error(`There were no ${bookGenre} books`);
        }

        //Search amazon for books
        await page.goto(this.amazonURL(bestBookByGenreName[0].replace(' ', '+')));
        console.log(`Navigating to ${this.amazonURL(bestBookByGenreName[0].replace(' ', '+'))}...`);
        await page.waitForSelector('#search');
        const linkToBookWithHardcover = await page.$$eval(
            '#search span.s-latency-cf-section > div.s-main-slot div.s-result-item div.a-size-base > a.a-size-base',
            (links: Element[]) => {
                return links
                    .filter((el) => el?.textContent === 'Hardcover')
                    .map((el) => (el as HTMLLinkElement).href)
            });
        if (linkToBookWithHardcover[0] == null) {
            throw Error('There were no books with hardcovers');
        }

        //Add book to cart
        console.log(`Navigating to ${linkToBookWithHardcover[0]}...`);
        await page.goto(linkToBookWithHardcover[0]);
        await page.waitForSelector('#a-page');
        const elements = await page.$x('//*[@id="submit.add-to-cart-announce"]');
        await elements[0].click().then(() =>
            page.waitForNavigation({waitUntil: 'load'}));

        //Show cart page
        await page.goto(this.amazonCart);
    }

}
