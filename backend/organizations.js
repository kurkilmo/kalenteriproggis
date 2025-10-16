import ICAL from "ical.js";
import axios from "axios";
import util from 'util';

const ALGO_ICAL_URL = process.env.ALGO_ICAL_URL

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
    return [{ title: "eioo" }]
}

export const organizations = {
    "algo": {
        "name": "Algo ry",
        "info": "Jyväskylän yliopiston tieto- ja ohjelmistotekniikan sekä teknologiajohtamisen opiskelijoiden kilta",
        "getEvents": getAlgoEvents,
    },
    "jelmu": {
        "name": "Jelmu ry.",
        "info": "Jyväskylän Elävän Musiikin Yhdistys ry järjestää livekeikkoja Jyväskylän Lutakon Tanssisalissa sekä Mustassa Kynnyksessä.",
        "getEvents": getJelmuEvents,
    }
}