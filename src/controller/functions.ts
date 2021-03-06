import * as puppeteer from "puppeteer";
import * as path from 'path';
import * as cheerio from 'cheerio';

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

// .......................................
// scrape COVID-19 Statewise Status (Upgraded version)
// .......................................
export async function scrapCowinDataSecond(url: string) {
    console.log(url)
    try {
        // puppeteer settings
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

        // getting Data from site
        var result: {}[] = await page.evaluate(() => {

            // getting keys for JSON object
            var trs = document.querySelectorAll('.statetable > thead > tr');
            var header: string[][] = [];
            var colspan: number[][] = [];
            for (let tr of trs as any) {
                const columns = tr.querySelectorAll('th');
                var tempHead: string[] = [];
                var tempColspan: number[] = [];
                for (let col of columns as any) {
                    tempHead.push(col.innerText.replace(/[&\/\\#, +()$~%.'":*?<>{}\s]/g, '_'))
                    tempColspan.push(+col.getAttribute('colspan') || 1)
                }
                header.push(tempHead);
                colspan.push(tempColspan);
            }
            header = header.filter(x => x.length != 0)
            colspan = colspan.filter(x => x.length != 0)

            var j = 0;
            var keys: string[] = [];
            for (let i = 0; i < header[0].length; i++) {
                if (colspan[0][i] == 1) {
                    keys.push(header[0][i])
                } else {
                    while (colspan[0][i] != 0) {
                        colspan[0][i]--;
                        keys.push(`${header[0][i]}_${header[1][j]}`)
                        j++;
                    }
                }
            }


            // getting actual data from the table
            const datatrs = document.querySelectorAll('.statetable > tbody > tr')
            return Array.from(datatrs, row => {
                const columns = row.querySelectorAll('td');
                const rowData: string[] = Array.from(columns, column => column.innerText.trim());
                var obj = {}
                rowData.forEach((data, index) => {
                    obj[keys[index]] = data
                    console.log(keys[index])
                })
                return obj
            }).filter(x => Object.keys(x).length == keys.length);

        })

        console.log(JSON.stringify(result, null, 2))

    } catch (error) {
        console.log(error.message);
    }

    //.......................................... 
    // Response
    //..........................................
    // [
    // {
    //   "S__No_": "1",
    //   "Name_of_State___UT": "Andaman and Nicobar Islands",
    //   "Active_Cases__Total": "14",
    //   "Active_Cases__Change_since_yesterday": "2",
    //   "Cured_Discharged_Migrated__Cumulative": "7349",
    //   "Cured_Discharged_Migrated__Change_since_yesterday": "6",
    //   "Deaths___Cumulative": "128",
    //   "Deaths___Change_since_yesterday": ""
    // },...

    // ]

}


export async function extraFun(url: string) {
    console.log(url)
    try {
        // puppeteer settings
        let browser = await puppeteer.launch({
            headless: false,
            args: [
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

        // let element = await page.$('.statetable'); // table class = statetable

        var result = await page.evaluate(() => {

            // getting keys for JSON object
            var trs = document.querySelectorAll('tr');
            var header: string[][] = [];
            var colspan: number[][] = [];
            var index: number = 0;

            while (index < trs.length) {
                var tr = trs[index];
                index++;

                var columns = tr.querySelectorAll('th');
                if (columns.length == 0) {
                    columns = tr.querySelectorAll('td');
                }
                var tempHead: string[] = [];
                var tempColspan: number[] = [];
                for (let col of columns as any) {
                    tempHead.push(col.innerText.replace(/[&\/\\#, +()$~%.'":*?<>{}\s]/g, '_'))
                    tempColspan.push(Number(col.getAttribute('colspan')) ? Number(col.getAttribute('colspan')) : 1)
                }
                header.push(tempHead);
                colspan.push(tempColspan);
                if (tempColspan.length != 0 && tempColspan.every(x => x == 1)) {
                    break;
                }
            }

            header = header.filter(x => x.length != 0)
            colspan = colspan.filter(x => x.length != 0)

            console.log({ header, colspan })
            for (let i = colspan.length - 1; i >= 0; i--) {
                // first for loop
                let tempArray = [];
                let k = 0;

                for (let j = 0; j < colspan[i].length; j++) {
                    // second for loop
                    if (colspan[i][j] == 1) {
                        tempArray.push(header[i][j]);
                    } else {
                        while (colspan[i][j] != 0) {
                            colspan[i][j] -= 1;
                            tempArray.push(`${header[i][j]}_${header[i + 1][k]}`);
                            k++;
                        }
                    }

                } //end of second for loop
                header[i] = tempArray;
            } //end of first for loop

            var headerKeys: string[] = header[0];
            console.log(headerKeys);

            // ....................................
            // getting actual data from the table
            // ...................................
            var actualData = [];
            // console.log(trs.length)
            while (index < trs.length) {
                var tr = trs[index];
                index++;
                const tds = tr.querySelectorAll('td');
                const rowData: string[] = Array.from(tds, td => td.innerText.trim());
                var obj = {}
                rowData.forEach((data, i) => {
                    obj[headerKeys[i]] = data;
                })
                actualData.push(obj);
            }

            actualData = actualData.filter(x => Object.keys(x).length == headerKeys.length);
            return actualData;

        })

        console.log(JSON.stringify(result, null, 2))
        browser.close;
    }
    catch (err) {
        console.log(err.message);
    }

}
// 
// Using cheerio for scraping
// 
export async function extraFun2(url: string) {
    console.log(url)
    try {
        // puppeteer settings
        let browser = await puppeteer.launch({
            headless: false,
            args: [
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

        let element = await page.$('.statetable');
        var HTML = await page.evaluate((el) => el.innerHTML, element);
        HTML = '<table>' + HTML + '</table>';
        const $ = cheerio.load(HTML);

        var trs = $('tr');
        var header: string[][] = [];
        var colspan: number[][] = [];
        var index: number = 0;
 
        while (index < trs.length) {
            var tr = trs[index];
            index++;
            if (!tr) continue;

            var columnNames = $(tr).find('th');
            if (columnNames.length == 0) {
                columnNames = $(tr).find('td');;
            }
            console.log(columnNames.text() + columnNames.length);
            var tempHead: string[] = [];
            var tempColspan: number[] = [];
            for (let i = 0; i < columnNames.length; i++) {
                var col = $(columnNames[i]);
                tempHead.push(col.text().replace(/[&\/\\#, +()$~%.'":*?<>{}\s]/g, '_'))
                tempColspan.push(Number(col.attr('colspan')) ? Number(col.attr('colspan')) : 1)
            }

            header.push(tempHead);
            colspan.push(tempColspan);
            if (tempColspan.length != 0 && tempColspan.every(x => x == 1)) {
                break;
            }
        }

        header = header.filter(x => x.length != 0)
        colspan = colspan.filter(x => x.length != 0)


        for (let i = colspan.length - 1; i >= 0; i--) {
            // first for loop
            let tempArray = [];
            let k = 0;

            for (let j = 0; j < colspan[i].length; j++) {
                // second for loop
                if (colspan[i][j] == 1) {
                    tempArray.push(header[i][j]);
                } else {
                    while (colspan[i][j] != 0) {
                        colspan[i][j] -= 1;
                        tempArray.push(`${header[i][j]}_${header[i + 1][k]}`);
                        k++;
                    }
                }

            } //end of second for loop
            header[i] = tempArray;
        } //end of first for loop

        var headerKeys: string[] = header[0];

        // ....................................
        // getting actual data from the table
        // ...................................
        var actualData = [];
        while (index < trs.length) {
            var tr = trs[index];
            index++;
            // const tds = $(tr).find('td');
            const tds = $(tr).children();
            const rowData: string[] = Array.from(tds, td => $(td).text().trim());
            var obj = {}
            rowData.forEach((data, i) => {
                obj[headerKeys[i]] = data;
            })
            actualData.push(obj);
        }

        actualData = actualData.filter(x => Object.keys(x).length == headerKeys.length);

        console.log(JSON.stringify(actualData, null, 2))
        browser.close;
    }
    catch (err) {
        console.log(err.message);
    }

}