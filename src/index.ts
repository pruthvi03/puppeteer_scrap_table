import "reflect-metadata";
import { downloadFile, scrapCowinData, scrapeCricketTable, scrapeData, scrapHindiData } from './controller/functions';
import * as cron from "node-cron";



// // cron won’t start automatically
// var task = cron.schedule('33 17 6 7 *', () => {
//     scrapeCricketTable("https://www.espncricinfo.com/series/south-africa-tour-of-west-indies-2021-1263140/west-indies-vs-south-africa-3rd-t20i-1263153/full-scorecard")
//         .then(data => console.log(data))
//         .catch((err) => { console.log(err.massage) })
// },
//     {
//         scheduled: false,
//         timezone: "Asia/Kolkata"
//     });

// // start method is called to start the above defined cron job
// task.start();

// // stop method is called to stop already started cron job
// task.stop();

// // destroy method is called to stop and destroy already started cron job, after destroy you have to reinitialize the task as it is destroyed.
// task.destroy();




// Uncomment to use these functions

// // scarpe simple table data
// scrapeData("https://www.scrapethissite.com/pages/forms/")
// .then(data => console.log(data))
//     .catch((err) => { console.log(err.massage) })

// // scrape data in english lang
// scrapeCricketTable("https://www.espncricinfo.com/series/ipl-2021-1249214/mumbai-indians-vs-rajasthan-royals-24th-match-1254081/full-scorecard")
//     .then(data => console.log(data))
//     .catch((err) => { console.log(err.massage) })

// // scrape data in hindi lang
// scrapHindiData("https://www.espncricinfo.com/series/ipl-2021-1249214/mumbai-indians-vs-rajasthan-royals-24th-match-1254081/full-scorecard")
//     .then(data=>console.log(data))
//     .catch((err)=>{console.log(err.massage)})


// .......................................
// scrape COVID-19 Statewise Status
// .......................................
// scrapCowinData("https://www.mohfw.gov.in/")
// .then(()=>console.log("scraped"))
// .catch((err)=>console.log(err.message));

// .......................................
// Download fie/img
// .......................................
downloadFile("https://gujcovid19.gujarat.gov.in/")
.then(()=>console.log("downloaded"))
.catch((err)=>console.log(err.message));
