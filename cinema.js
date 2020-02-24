const puppeteer = require('puppeteer');
class Cinema {
    constructor(url){
        this.url = url;
    }

    scrapeData(){
        async function scrape(url){
            const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
            const page = await browser.newPage();
            await page.goto(url);
            // Schedules are subject to change without prior notice.
            const nextDayLink = await page.evaluate(()=>document.querySelector("#maincontent > ul.nav.nav-tabs.tabs-up > li:nth-child(2) > a").href);
            const showingDate = await page.evaluate(()=>document.querySelector("#schedules > div > p > em").textContent.trim());
            const movies = await page.evaluate(()=>
                Array.from(document.querySelectorAll('#cinemas .cinema'))
                    .map((data) => ({
                        title: data.querySelector('[itemprop="workPresented"] [itemprop="url"] [itemprop="name"]').textContent.trim(),
                        image: data.querySelector('[itemprop="workPresented"] > div:nth-child(1)').style['backgroundImage'].slice(4, -1).replace(/"/g, ""),
                        mtrcb: data.querySelector('[itemprop="workPresented"] > div:nth-child(4)').textContent.trim(),
                        price: data.querySelector('li > div:nth-child(1)').textContent.trim()
                    })
                )
            )
            await browser.close();
            return {showingDate,nextDayLink,movies};
        };
        return scrape(this.url);
    }
}

module.exports = Cinema;