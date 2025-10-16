import { getAlgoEvents } from './algo.js'

export const organizations = {
    "algo": {
        "name": "Algo ry",
        "info": "Jyväskylän yliopiston tieto- ja ohjelmistotekniikan sekä teknologiajohtamisen opiskelijoiden kilta",
        "getEvents": getAlgoEvents,
    },
    "jelmu": {
        "name": "Jelmu ry.",
        "info": "Jyväskylän Elävän Musiikin Yhdistys ry järjestää livekeikkoja Jyväskylän Lutakon Tanssisalissa sekä Mustassa Kynnyksessä.",
        "getEvents": () => [{title:"eioo"}],
    }
}