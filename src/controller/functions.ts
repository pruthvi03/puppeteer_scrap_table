import * as puppeteer from "puppeteer";
import * as path from 'path';

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

            return JSON.stringify(data, null, 2);

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

        // Use Promise.all to wait for actions (navigation and click)

        // waiting for selector button#wzrk-cancel
        console.log("waiting for selector button#wzrk-cancel")
        await page.waitForSelector('button#wzrk-cancel');
        await page.click('button#wzrk-cancel');
        await page.click('.best-player-name > a');
        await page.waitForNavigation();



        const heading: string[] = await page.$$eval('.text-uppercase.player-card-heading', anchors => { return anchors.map(anchor => anchor.textContent) })

        const data: string[] = await page.$$eval('.player-card-description', anchors => { return anchors.map(anchor => anchor.textContent) })

        var POM_Details = {}
        for (var i = 0; i < data.length; i++) {
            POM_Details[heading[i].replace(" ", "")] = data[i];
        }

        oneScoreTable = oneScoreTable.filter(obj => Object.keys(obj).length == 8)
        secScoreTable = secScoreTable.filter(obj => Object.keys(obj).length == 8)

        return JSON.stringify({
            'teamOneDetails': teamsDetails[0],
            'teamSecDetails': teamsDetails[1],
            'winner': winner,
            oneScoreTable,
            secScoreTable,
            POM_Details
        }, null, 2);
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

        return JSON.stringify({
            'teamOneDetails': teamsDetails[0],
            'teamSecDetails': teamsDetails[1],
            'winner': winner,
            oneScoreTable,
            secScoreTable
        }, null, 2);
    } catch (error) {
        console.log(error.message);
    }


}

// .......................................
// scrape COVID-19 Statewise Status
// .......................................
export async function scrapCowinData(url: string) {
    console.log(url)
    try {
        let browser = await puppeteer.launch({
            headless: true, args: [
                '--start-maximized' // you can also use '--start-fullscreen'
            ]
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 0
        });
        await page.click('.trigger-state');

        var { firstRowThs, firstRowThsColspan, secRowThs } = await page.$$eval('.statetable > thead > tr ', trs => {
            var secRowThs = [];
            var firstRowThs = [];
            var firstRowThsColspan = []

            var firstRow = trs[1].querySelectorAll('th')

            for (let i = 0; i < firstRow.length; i++) {
                firstRowThs.push(firstRow[i].textContent.replace(/[&\/\\#, +()$~%.'":*?<>{}\s]/g, '_'));
                if (firstRow[i].hasAttribute('colspan')) {
                    firstRowThsColspan.push(+firstRow[i].getAttribute('colspan'))
                }
                else {
                    firstRowThsColspan.push(1);
                }
            }
            var secRow = trs[2].querySelectorAll('th')
            for (let i = 0; i < secRow.length; i++) {
                secRowThs.push(secRow[i].textContent);
            }

            return { firstRowThs, firstRowThsColspan, secRowThs }
        })
        // console.log({ firstRowThs, firstRowThsColspan, secRowThs })


        var finalResult = await page.evaluate(({ firstRowThs, firstRowThsColspan, secRowThs }) => {

            var rows = document.querySelectorAll('#state-data > div > div > div > div > table > tbody > tr');
            var tableResult = []
            for (let row of rows as any) {
                const columns = row.querySelectorAll('td');
                var rowData = []

                for (let col of columns as any) {
                    rowData.push(col.innerText.trim())
                }


                var i = 0;
                var j = 0;
                var k = 0;
                var tempRow = {}
                while (k < rowData.length) {
                    var colSpanCount: number = firstRowThsColspan[i];

                    if (colSpanCount < 2) {
                        tempRow[firstRowThs[i]] = rowData[k]
                        i++;
                        k++;
                    } else {
                        var subTemp = {};
                        while (colSpanCount > 0) {
                            colSpanCount--;
                            subTemp[secRowThs[j]] = rowData[k]
                            j++;
                            k++;
                        }
                        tempRow[firstRowThs[i]] = subTemp
                        i++;
                    }

                }
                tableResult.push(tempRow)

            }
            tableResult = tableResult.filter(x => Object.keys(x).length == 5)
            return JSON.stringify(tableResult, null, 2)

        }, { firstRowThs, firstRowThsColspan, secRowThs });
        browser.close();
        console.log(finalResult);

    } catch (error) {
        console.log(error.message);
    }
}

export async function downloadFile(url: string) {
    try {
        console.log(url)
        let browser = await puppeteer.launch({
            headless: true, args: [
                '--start-maximized' // you can also use '--start-fullscreen'
            ]
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 0
        });

        
        const client = await page.target().createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: path.join(__dirname, '../downloads'),
        });

        await page.click('#ctl00_body_aDownloadExcel');
        await page.waitForTimeout(1000); // have to wait briefly to prevent the browser from closing before the download
        browser.close();

    } catch (error) {
        console.log(error.message);
    }
}

