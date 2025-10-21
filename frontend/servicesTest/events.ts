import { getDate } from "@/utilities/utils";
import { TimelineEventProps } from "react-native-calendars";

export const timelineEvents: TimelineEventProps[] = [
  {
    id: 1,
    title: "AI & Machine Learning Summit",
    summary: "Kansainvälinen tekoälykonferenssi.",
    start: `${getDate(0)} 09:00:00`,
    end: `${getDate(0)} 17:00:00`,
    color: "#e6add8",
  },
  {
    id: 2,
    title: "Sustainable Tech Forum",
    summary: "Keskustelu ympäristöteknologiasta.",
    start: `${getDate(1)} 10:00:00`,
    end: `${getDate(1)} 16:00:00`,
    color: "#aaddff",
  },
  {
    id: 3,
    title: "Innovation Hackathon",
    summary: "48 tunnin hackathon innovaatioille.",
    start: `${getDate(2)} 18:00:00`,
    end: `${getDate(4)} 18:00:00`,
    color: "#ffd580",
  },
  {
    id: 4,
    title: "Space Exploration Day",
    summary: "Luennot ja workshopit avaruustutkimuksesta.",
    start: `${getDate(0)} 09:30:00`,
    end: `${getDate(0)} 17:30:00`,
    color: "#ff9999",
  },
  {
    id: 5,
    title: "AI Ethics Seminar",
    summary: "Tekoälyn etiikka ja vastuullisuus.",
    start: `${getDate(-1)} 13:00:00`,
    end: `${getDate(-1)} 17:00:00`,
    color: "#aaffaa",
  },
  {
    id: 6,
    title: "Charity Concert",
    summary: "Konsertti hyväntekeväisyyteen.",
    start: `${getDate(-1)} 19:00:00`,
    end: `${getDate(-1)} 22:00:00`,
    color: "#ffaaff",
  },
  {
    id: 7,
    title: "Tech & Space Seminar",
    summary: "Uudet satelliittiteknologiat esittelyssä.",
    start: `${getDate(-2)} 09:00:00`,
    end: `${getDate(-2)} 17:00:00`,
    color: "#80dfff",
  },
  {
    id: 8,
    title: "Green Energy Expo",
    summary: "Uusiutuvan energian näyttely.",
    start: `${getDate(1)} 09:00:00`,
    end: `${getDate(1)} 15:00:00`,
    color: "#ccffcc",
  },
  {
    id: 9,
    title: "Robotics Workshop",
    summary: "Hands-on työpaja robottien ohjelmoinnista.",
    start: `${getDate(2)} 10:00:00`,
    end: `${getDate(2)} 16:00:00`,
    color: "#ffcc80",
  },
  {
    id: 10,
    title: "Healthcare Innovation Forum",
    summary: "Terveysteknologian innovaatioita.",
    start: `${getDate(3)} 09:30:00`,
    end: `${getDate(3)} 16:30:00`,
    color: "#a0a0ff",
  },
  {
    id: 11,
    title: "Cybersecurity Summit",
    summary: "Tietoturva ja kyberturvallisuus.",
    start: `${getDate(2)} 09:00:00`,
    end: `${getDate(2)} 15:00:00`,
    color: "#ff9999",
  },
  {
    id: 12,
    title: "Blockchain Workshop",
    summary: "Lohkoketjuteknologia käytännössä.",
    start: `${getDate(3)} 10:00:00`,
    end: `${getDate(3)} 16:00:00`,
    color: "#99ffcc",
  },
  {
    id: 13,
    title: "Virtual Reality Expo",
    summary: "VR ja AR teknologiat.",
    start: `${getDate(4)} 09:00:00`,
    end: `${getDate(4)} 17:00:00`,
    color: "#ffb3b3",
  },
  {
    id: 14,
    title: "Digital Marketing Seminar",
    summary: "Markkinointi digitaalisessa maailmassa.",
    start: `${getDate(1)} 09:30:00`,
    end: `${getDate(1)} 14:30:00`,
    color: "#ccff99",
  },
  {
    id: 15,
    title: "Startup Pitch Day",
    summary: "Startup-yritysten esittelypäivä.",
    start: `${getDate(0)} 11:00:00`,
    end: `${getDate(0)} 16:00:00`,
    color: "#ffccff",
  },
  {
    id: 16,
    title: "Education Innovation Forum",
    summary: "Koulutuksen uudet innovaatiot.",
    start: `${getDate(5)} 09:00:00`,
    end: `${getDate(5)} 17:00:00`,
    color: "#cce0ff",
  },
  {
    id: 17,
    title: "Climate Action Summit",
    summary: "Ilmastonmuutoksen torjunta.",
    start: `${getDate(6)} 09:00:00`,
    end: `${getDate(6)} 17:00:00`,
    color: "#99ccff",
  },
  {
    id: 18,
    title: "Global Health Forum",
    summary: "Globaali terveys ja hyvinvointi.",
    start: `${getDate(3)} 09:00:00`,
    end: `${getDate(3)} 17:00:00`,
    color: "#ffb366",
  },
  {
    id: 19,
    title: "Future Mobility Expo",
    summary: "Tulevaisuuden liikkuminen ja autot.",
    start: `${getDate(4)} 09:00:00`,
    end: `${getDate(4)} 16:00:00`,
    color: "#b3ffb3",
  },
  {
    id: 20,
    title: "Smart Cities Conference",
    summary: "Älykkäät kaupungit ja IoT.",
    start: `${getDate(5)} 10:00:00`,
    end: `${getDate(5)} 18:00:00`,
    color: "#ffb3ff",
  },
];

export function getEvents() {
  return timelineEvents;
}

export function getEventById(id: number) {
  return timelineEvents.find((e) => e.id === id);
}

// export { TimelineEvents }