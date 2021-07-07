import * as puppeteer from "puppeteer";


// Simple Table Scrape
export async function scrapeData(url) {
    try {
        console.log(url)
        let browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(url);
        const result = await page.evaluate(() => {
            
            const grabRowData = (row, className) => {
                return row.querySelector(`td.${className}`).innerText.trim()
            }

            const data = [];

            const allRows: NodeListOf<Element> = document.querySelectorAll('tr.team');


            // looping over each team row
            for (const tr of allRows as any) {
                data.push({
                    name: grabRowData(tr, 'name'),
                    year: grabRowData(tr, 'year'),
                    wins: grabRowData(tr, 'wins'),
                    losses: grabRowData(tr, 'losses')
                })
            }

            return data;

        });
        browser.close();


        return result;
    } catch (error) {
        console.log(error.message);
    }
}


export async function scrapeCricketTable(url) {
    try {
        console.log(url)
        let browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });
        await page.goto(url);


        const teamsDetails = await page.$$eval('div.event > div> .match-info > .teams > .team', teams => {
            return Array.from(teams, team => {
                const teamName = team.querySelector('.name-detail').textContent;
                const teamScore = team.querySelector('.score').textContent;

                return {
                    'teamName': teamName,
                    'teamScore': teamScore
                }

            });
        });

        // console.log(teamsDetails);

        var oneScoreTable = await page.$$eval('div:nth-child(1) > div.Collapsible > div > div > div > table.table.batsman > tbody > tr', rows => {
            return Array.from(rows, row => {
                const columns = row.querySelectorAll('td');
                const rowData = Array.from(columns, column => column.innerText);

                return {
                    'batsman': rowData[0],
                    'outby': rowData[1],
                    'R': rowData[2],
                    'B': rowData[3],
                    'M': rowData[4],
                    'fours': rowData[5],
                    'sixes': rowData[6],
                    'SR': rowData[7]
                }
            });
        });

        var secScoreTable = await page.$$eval('div:nth-child(2) > div.Collapsible > div > div > div > table.table.batsman > tbody > tr', rows => {
            return Array.from(rows, row => {
                const columns = row.querySelectorAll('td');
                const rowData = Array.from(columns, column => column.innerText);

                return {
                    'batsman': rowData[0],
                    'outby': rowData[1],
                    'R': rowData[2],
                    'B': rowData[3],
                    'M': rowData[4],
                    'fours': rowData[5],
                    'sixes': rowData[6],
                    'SR': rowData[7]
                }
            });
        });

        const looser = await page.$eval("div.team.team-gray >div.name-detail > a > p", elem => elem.textContent);
        var winner = (looser == teamsDetails[0].teamName) ? teamsDetails[1].teamName : teamsDetails[0].teamName;

        // browser.close();
        await page.click('button[value="en"]');
        await page.click("i.language-icon");
        await page.click("div.language-body > div:nth-child(2) > div > div");

        // Use Promise.all to wait for actions (navigation and click)
        await Promise.all([
            await page.waitForSelector('button#wzrk-cancel'),
            await page.click('button#wzrk-cancel'),
            await page.click('.best-player-name > a'),
            page.waitForNavigation()
        ])


        const heading: string[] = await page.$$eval('.text-uppercase.player-card-heading', anchors => { return anchors.map(anchor => anchor.textContent) })

        const data: string[] = await page.$$eval('.player-card-description', anchors => { return anchors.map(anchor => anchor.textContent) })

        var POM_Details = {}
        for (var i = 0; i < data.length; i++) {
            POM_Details[heading[i].replace(" ", "")] = data[i];
        }

        oneScoreTable = oneScoreTable.filter(obj => Object.keys(obj).length == 8)
        secScoreTable = secScoreTable.filter(obj => Object.keys(obj).length == 8)

        return { 'teamOneDetails': teamsDetails[0], 'teamSecDetails': teamsDetails[1], 'winner': winner, oneScoreTable, secScoreTable, POM_Details };
    } catch (error) {
        console.log(error.message);
    }


}

export async function scrapHindiData(url: string) {
    try {
        console.log(url)
        let browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });
        await page.goto(url);
        await page.click('button[value="en"]');
        await page.waitForSelector('button#wzrk-cancel');
        await page.click('button#wzrk-cancel');

        console.log("clicked on cancel btn")
        await page.click("i.language-icon");
        await page.click("div.language-body > div:nth-child(2) > div > div");

        console.log("waiting for navigation")
        await page.waitForNavigation()

        console.log("fetching the data")
        const teamsDetails = await page.$$eval('div.event > div> .match-info > .teams > .team', teams => {
            return Array.from(teams, team => {
                const teamName = team.querySelector('.name-detail').textContent;
                const teamScore = team.querySelector('.score').textContent;

                return {
                    'teamName': teamName,
                    'teamScore': teamScore
                }

            });
        });

        console.log(teamsDetails);

        var oneScoreTable = await page.$$eval('div:nth-child(1) > div.Collapsible > div > div > div > table.table.batsman > tbody > tr', rows => {
            return Array.from(rows, row => {
                const columns = row.querySelectorAll('td');
                const rowData = Array.from(columns, column => column.innerText);

                return {
                    'batsman': rowData[0],
                    'outby': rowData[1],
                    'R': rowData[2],
                    'B': rowData[3],
                    'M': rowData[4],
                    'fours': rowData[5],
                    'sixes': rowData[6],
                    'SR': rowData[7]
                }
            });
        });

        var secScoreTable = await page.$$eval('div:nth-child(2) > div.Collapsible > div > div > div > table.table.batsman > tbody > tr', rows => {
            return Array.from(rows, row => {
                const columns = row.querySelectorAll('td');
                const rowData = Array.from(columns, column => column.innerText);

                return {
                    'batsman': rowData[0],
                    'outby': rowData[1],
                    'R': rowData[2],
                    'B': rowData[3],
                    'M': rowData[4],
                    'fours': rowData[5],
                    'sixes': rowData[6],
                    'SR': rowData[7]
                }
            });
        });

        const looser = await page.$eval("div.team.team-gray >div.name-detail > a > p", elem => elem.textContent);
        var winner = (looser == teamsDetails[0].teamName) ? teamsDetails[1].teamName : teamsDetails[0].teamName;

        // browser.close();

        oneScoreTable = oneScoreTable.filter(obj => Object.keys(obj).length == 8)
        secScoreTable = secScoreTable.filter(obj => Object.keys(obj).length == 8)

        return { 'teamOneDetails': teamsDetails[0], 'teamSecDetails': teamsDetails[1], 'winner': winner, oneScoreTable, secScoreTable };
    } catch (error) {
        console.log(error.message);
    }


}