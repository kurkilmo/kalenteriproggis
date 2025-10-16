import ICAL from "ical.js";
import axios from "axios";
import util from 'util';
import * as cheerio from 'cheerio'

const ALGO_ICAL_URL = process.env.ALGO_ICAL_URL
const JELMU_URL = process.env.JELMU_URL

function logObject(obj) {
    console.log(
        util.inspect(
            obj,
            { showHidden: false, depth: null, colors: true }
        )
    )
}

async function getAlgoEvents() {
    const icalData = await axios.get(ALGO_ICAL_URL)
    const jCalData = ICAL.parse(icalData.data)
    const comp = new ICAL.Component(jCalData)
    const vevents = comp.getAllSubcomponents("vevent")

    const result = []

    vevents.forEach(vevent => {
        const start = vevent.getFirstPropertyValue("dtstart").toJSDate()
        const end = vevent.getFirstPropertyValue("dtend").toJSDate()
        const summary = vevent.getFirstPropertyValue("summary");

        result.push({
            start: start.toISOString(),
            end: end.toISOString(),
            title: summary,
            color: "#fbbebd" // Pinkki :)
        })
    })

    return result
}

async function getJelmuEvents() {
    console.log("nyt vittu")
    const html = await axios.get(JELMU_URL)
    
    const $ = cheerio.load(html.data)
    const result = []
    $('.product').each((i, el) => {
        const titles = []
        $(el).find('h2.woocommerce-loop-product__title').find('span').each((i, el) => {
            titles.push($(el).text().trim())
        })
        if (titles.length == 0) {
            titles.push($(el).find('h2.woocommerce-loop-product__title').text().trim())
        }
        const title = titles.join(' | ')
        const dateText = $(el).find('span.date').text().trim()
        const location = $(el).find('span.location').text()
        const age = $(el).find('span.age').text()
        const doors = $(el).find('span.doors').text()
        const price = $(el).find('span.price').text()
        const url = $(el).find('a').first().attr('href')

        const summary = `${location} - ${age} - ${doors} - ${price}`

        const startDate = new Date()
        let endDate = new Date()

        const parseDate = (dateString, dateObj) => {
            const day = parseInt(dateString.match(/^\d+(?=\.\d+\.$)/)[0])
            dateObj.setDate(day)
            const month = parseInt(dateString.match(/(?<=^\d+\.)\d+(?=\.$)/)[0])
            console.log(month)
            if (month-1 < dateObj.getMonth()) {
                dateObj.setFullYear(dateObj.getFullYear() + 1)
            }
            dateObj.setMonth(month-1)
        }

        if (/^\d+\.\d+. - \d+\.\d+\.$/.test(dateText)) {
            const match = dateText.match(/\d+\.\d+\./g)
            parseDate(match[0], startDate)
            parseDate(match[1], endDate)
        } else {
            parseDate(dateText, startDate)
            endDate = new Date(startDate)
        }

        const timeMatch = doors.match(/\d+/g)
        startDate.setHours(parseInt(timeMatch[0]))
        startDate.setMinutes(parseInt(timeMatch[1]))
        startDate.setSeconds(0)
        endDate.setHours(startDate.getHours() + 3)
        
        result.push(
            {
                start: startDate.toISOString(),
                end: endDate.toISOString(),
                title,
                summary,
                url,
                color: "#7b751d" // On vähän ruma mut jelmun väri
            }
        )
    })
    
    console.log(result)
    return result
}

export const organizations = [
    {
        fullname: "Algo ry",
        name: "algo",
        info: "Jyväskylän yliopiston tieto- ja ohjelmistotekniikan sekä teknologiajohtamisen opiskelijoiden kilta",
        getEvents: getAlgoEvents,
    },
    {
        fullname: "Jelmu ry",
        name: "jelmu",
        info: "Jyväskylän Elävän Musiikin Yhdistys ry järjestää livekeikkoja Jyväskylän Lutakon Tanssisalissa sekä Mustassa Kynnyksessä.",
        getEvents: getJelmuEvents,
    }
]
