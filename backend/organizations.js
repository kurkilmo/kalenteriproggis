import ICAL from "ical.js";
import axios from "axios";
import util from 'util';
import * as cheerio from 'cheerio'

const ALGO_ICAL_URL = process.env.ALGO_ICAL_URL
const JELMU_URL = process.env.JELMU_URL

// Hakee Algo ry:n tapahtumat ja muuttaa ne sovelluksen käyttämään muotoon
async function getAlgoEvents() {
    const icalData = await axios.get(ALGO_ICAL_URL)
    const jCalData = ICAL.parse(icalData.data)
    const comp = new ICAL.Component(jCalData)
    const vevents = comp.getAllSubcomponents("vevent")

    const result = []
    let id = 1

    // Käydään tapahtumat läpi ja muokataan haluttuun muotoon
    vevents.forEach(vevent => {
        const start = vevent.getFirstPropertyValue("dtstart").toJSDate()
        const end = vevent.getFirstPropertyValue("dtend").toJSDate()
        const summary = vevent.getFirstPropertyValue("summary");

        // Lisätään tapahtuma tuloslistaan
        result.push({
            id: id++,
            start: start.toISOString(),
            end: end.toISOString(),
            title: summary,
            color: "#fbbebd" // Pinkki :)
        })
    })

    return result
}

// Hakee Jelmu ry:n tapahtumat ja muuttaa ne sovelluksen käyttämään muotoon
async function getJelmuEvents() {
    const html = await axios.get(JELMU_URL)
    
    const $ = cheerio.load(html.data)
    const result = []
    let id = 1

    // Käydään tapahtumat läpi ja muokataan haluttuun muotoon
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

        // Apufunktio päivämäärän jäsentämiseen
        const parseDate = (dateString, dateObj) => {
            const day = parseInt(dateString.match(/^\d+(?=\.\d+\.$)/)[0]) // Päivä
            dateObj.setDate(day)
            const month = parseInt(dateString.match(/(?<=^\d+\.)\d+(?=\.$)/)[0]) // Kuukausi
            if (month-1 < dateObj.getMonth()) {
                dateObj.setFullYear(dateObj.getFullYear() + 1)
            }
            dateObj.setMonth(month-1)
        }

        // Päivämäärän käsittely
        if (/^\d+\.\d+. - \d+\.\d+\.$/.test(dateText)) { // Esim. 15.6. - 16.6.
            const match = dateText.match(/\d+\.\d+\./g)
            parseDate(match[0], startDate)
            parseDate(match[1], endDate)
        } else {
            parseDate(dateText, startDate)
            endDate = new Date(startDate)
        }

        // Kellonajan käsittely
        const timeMatch = doors.match(/\d+/g)
        startDate.setHours(parseInt(timeMatch[0]))
        startDate.setMinutes(parseInt(timeMatch[1]))
        startDate.setSeconds(0)
        endDate.setHours(startDate.getHours() + 3)
        
        result.push(
            {
                id: id++,
                start: startDate.toISOString(),
                end: endDate.toISOString(),
                title,
                summary,
                url,
                color: "#7b751d" // On vähän ruma mut jelmun väri
            }
        )
    })

    return result
}

// Organisaatiot ja niiden tapahtumien hakufunktiot
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
