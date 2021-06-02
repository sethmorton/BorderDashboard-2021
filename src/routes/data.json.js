
import fs from 'fs'
import { DateTime, Info } from 'luxon'
export async function get(req, res, next) {
    // the `slug` parameter is available because this file
    // is called [slug].json.js
    const { slug } = req.params;
    const jsonFile = 'data/entrybordercrossings.json'
    let json = fs.readFileSync(jsonFile);
    let parsedJson = JSON.parse(json);
    const filteredPort = parsedJson.filter(x => x['Port Name'] == 'Otay Mesa')
    let filteredMeasure = filteredPort.filter(x => x.Measure == 'Trucks')
    console.log(filteredPort)
    // filteredPort.forEach(x => {
    //     let date = DateTime.fromFormat(`${x['Month of Date']} 01 ${x.Year}`, "LLLL dd yyyy");
    // });
    let l_date = filteredMeasure.reduce((a, b) => {
        let date = DateTime.fromFormat(`${b['Month of Date']} 01 ${b.Year}`, "LLLL dd yyyy");
        return a > date ? a : date
    }, 0)
    console.log(l_date)
    let sumDate = filteredMeasure.filter(x => {
        return Number(x.Year) == l_date.year
    }
    ).filter(x => {
        return x['Month of Date'] == Info.months()[l_date.month - 1]
    }).reduce((sum, { Value }) => sum + Number(Value), 0);
    console.log(sumDate, "this is ")
    let sumDatePrev = filteredMeasure.filter(x => {
        return Number(x.Year)  == l_date.year - 1
    }
    ).filter(x => {
        return x['Month of Date'] == Info.months()[l_date.month - 1]
    }).reduce((sum, { Value }) => sum + Number(Value), 0);
    // let lastDate = DateTime.fromISO(
    //     filteredPort.reduce((a, { Year }, {'Month of Date'}) => {
    //         Date = Date.substring(0, Date.length - 11);
    //         let month = Date.substring(0, 2);
    //         let monthFiltered = Number(month.replace(/\//g, ''));
    //         let year = Number(Date.substring(4));
    //         let date = DateTime.fromObject({ year: year, month: monthFiltered, day: 1 })
    //         console.log(date.year)
    //         // console.log(date)
    //         return a > date ? a : date
    //     }
    //         , 0)
    // );
    // let trucksFiltered = filteredPort.filter(x => x.Measure == 'Trucks')
    // let filteredTime = []
    // let filteredTimePrev = []
    // trucksFiltered.forEach(x => {
    //     let Date = x.Date
    //     Date = Date.substring(0, Date.length - 11);
    //     let month = Date.substring(0, 2);
    //     let monthFiltered = Number(month.replace(/\//g, ''));
    //     let year = Number(Date.substring(4));
    //     let date = DateTime.fromObject({ year: year, month: monthFiltered, day: 1 })
    //     console.log(date)
    //     if (date.year == lastDate.year && date.month == lastDate.month) {
    //         filteredTime.push(x)
    //     }
    //     let datePrev = date.year;
    //     let lastYear = lastDate.year - 1;
    //     console.log(datePrev, lastYear)
    //     if (datePrev == lastYear && date.month == lastDate.month) {
    //         filteredTimePrev.push(x)
    //     }
    // })
    // console.log(filteredTime)
    // console.log(filteredTimePrev)
    //     csvtojson()
    // .fromFile(csvFilePath)
    // .then((jsonObj)=>{
    //     console.log(jsonObj);
    //     /**
    //      * [
    //      * 	{a:"1", b:"2", c:"3"},
    //      * 	{a:"4", b:"5". c:"6"}
    //      * ]
    //      */ 
    // })




    // if (article !== null) {
    // 	res.setHeader('Content-Type', 'application/json');
    // 	// res.end(JSON.stringify(article));
    // } else {
    // 	next();
    // }
}