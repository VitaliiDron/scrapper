import puppeteer from 'puppeteer';

export async function startBrowser() {
    let browser;
    try {
        console.log("Opening the browser......");
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--disable-setuid-sandbox", "--start-maximized"],
            'ignoreHTTPSErrors': true,
        });
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
    return browser;
}
