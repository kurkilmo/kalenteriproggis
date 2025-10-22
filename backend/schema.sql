DROP DATABASE IF EXISTS kalenteri_app;
CREATE DATABASE kalenteri_app;
USE kalenteri_app;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL
);

CREATE TABLE groups_table (
    id INT PRIMARY KEY AUTO_INCREMENT,
    owner_id INT NOT NULL,
    group_name VARCHAR(255) NOT NULL
);

CREATE TABLE events_table (
    id INT PRIMARY KEY AUTO_INCREMENT,
    owner_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary VARCHAR(255) NOT NULL,
    start DATETIME NOT NULL,
    end DATETIME NOT NULL,
    color VARCHAR(7)
);

-- User and user's group
CREATE TABLE group_user (
    person_id INT NOT NULL,
    group_id INT NOT NULL,
    PRIMARY KEY(person_id, group_id)
);

-- Event and it's group
CREATE TABLE event_group (
    event_id INT NOT NULL,
    group_id INT NOT NULL,
    PRIMARY KEY(event_id, group_id)
);

INSERT INTO users (username)
VALUES 
	("Heikki"),
    ("Pekka"),
    ("Matti"),
    ("Topias"),
    ("Jaana"),
    ("Essi"),
    ("Jasmin");

INSERT INTO groups_table (owner_id, group_name)
VALUES
    (1, "Sammakot"),
    (1, "Jänikset"),
    (2, "Kummitukset"),
    (3, "Mahtikset"),
    (1, "Fanit"),
    (5, "Miljardööriklubi"),
    (6, "Omituisten otusten kerho"),
    (6, "Huippu joukkue"),
    (6, "Hiihtoseura"),
    (7, "Neropatit");

INSERT INTO group_user (group_id, person_id)
VALUES
-- Sammakot
    (1, 1), -- Heikki
    (1, 3), -- Matti
-- Jänikset
    (2, 1), -- Heikki
    (2, 5), -- Jaana
-- Kummitukset
    (3, 2), -- Pekka
-- Mahtikset
    (4, 3), -- Matti
    (4, 6), -- Essi
    (4, 7), -- Jasmin
-- Fanit
    (5, 1), -- Heikki
-- Miljardööriklubi
    (6, 5), -- Jaana
-- "Omituisten otusten kerho"
    (7, 1),
    (7, 2),
    (7, 3),
    (7, 4),
-- Huippu joukkue
    (8, 5),
    (8, 6),
    (8, 7),
-- Hiihtoseura
    (9, 2),
    (9, 6),
-- Neropatit
    (10, 4),
    (10, 6);

/*
CREATE TABLE events_table (
    id INT PRIMARY KEY AUTO_INCREMENT,
    owner_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary VARCHAR(255) NOT NULL,
    startTime DATETIME NOT NULL,
    endTime DATETIME NOT NULL
);
*/

-- Arvoja luonut GEMINI(flash), täydentänyt ChatGPT-5 väreillä
INSERT INTO events_table (owner_id, title, summary, start, end, color)
VALUES
    -- Sammakot
    (1, 'Viikkopalaveri', 'Sammakot-ryhmän viikoittainen tilannekatsaus ja seuraavien askeleiden suunnittelu.', '2025-10-21 10:00:00', '2025-10-21 11:30:00', '#1976D2'),
    (1, 'Projektin A-demo', 'Demo Projektin A nykyisestä tilasta ja palautteen kerääminen.', '2025-10-22 14:00:00', '2025-10-22 15:00:00', '#0288D1'),
    (1, 'Koulutus: Uusi API', 'Käyttöönottokoulutus uudesta Sammakot-ryhmän käyttämästä API:sta.', '2025-10-23 09:00:00', '2025-10-23 12:00:00', '#4DB6AC'),
    (1, 'Tiimi-ilta', 'Rentouttava tiimi-ilta keilauksen ja illallisen merkeissä.', '2025-10-24 18:00:00', '2025-10-24 21:00:00', '#F57C00'),
    (1, 'Sprintin suunnittelu', 'Seuraavan sprintin tehtävien läpikäynti ja priorisointi.', '2025-10-28 13:00:00', '2025-10-28 15:30:00', '#388E3C'),
    (1, 'Ideointisessio: Tuote B', 'Aivoriihi uuden Tuote B:n ominaisuuksista ja potentiaalisista käyttöliittymistä.', '2025-10-29 11:00:00', '2025-10-29 12:30:00', '#FFB300'),
    (1, 'Lounastapaaminen asiakkaan X kanssa', 'Epämuodollinen lounastapaaminen asiakkaan X kanssa projektin etenemisestä.', '2025-10-30 12:00:00', '2025-10-30 13:00:00', '#8BC34A'),
    (1, 'Viikon Sammakot-leffa', 'Sammakot-ryhmän sisäinen elokuvahetki toimistolla.', '2025-10-31 16:00:00', '2025-10-31 18:00:00', '#7E57C2'),
    (1, 'Bugien karsinta', 'Dedikoitu aika priorisoitujen bugien korjaamiseen ja testaamiseen.', '2025-11-04 09:30:00', '2025-11-04 11:00:00', '#E53935'),
    (1, 'Kuukausikatsaus', 'Yhteenveto edellisen kuukauden saavutuksista ja tavoitteiden asettaminen seuraavalle kuukaudelle.', '2025-11-05 15:00:00', '2025-11-05 16:30:00', '#512DA8'),

    -- Jänikset
    (1, 'Strategiapalaveri', 'Seuraavan kvartaalin strategisten tavoitteiden määrittely.', '2025-10-27 09:00:00', '2025-10-27 11:00:00', '#1565C0'),
    (1, 'Q3 Tulosten analysointi', 'Tarkka analyysi viime kvartaalin taloudellisesta ja operatiivisesta tuloksesta.', '2025-10-28 13:30:00', '2025-10-28 15:30:00', '#283593'),
    (1, 'Asiakastapaaminen B', 'Tapaaminen avainasiakas B:n kanssa uusista tarpeista.', '2025-10-29 10:30:00', '2025-10-29 11:30:00', '#43A047'),
    (1, 'Koodikatselmus', 'Kriittisten koodiosien läpikäynti laadun varmistamiseksi.', '2025-10-30 14:00:00', '2025-10-30 16:00:00', '#8E24AA'),
    (1, 'Uuden jäsenen perehdytys', 'Uuden tiimiläisen tutustuttaminen Jänikset-ryhmän toimintaan.', '2025-10-31 09:00:00', '2025-10-31 12:00:00', '#FF7043'),
    (1, 'Markkinatutkimus-briefing', 'Yhteenveto uusimmista markkinatutkimustuloksista.', '2025-11-03 13:00:00', '2025-11-03 14:30:00', '#00796B'),
    (1, 'Kuukausittainen raportointi', 'Kuukausiraporttien viimeistely ja läpikäynti johdolle.', '2025-11-04 10:00:00', '2025-11-04 11:30:00', '#3949AB'),
    (1, 'Iltapäiväkahvit ja ideointi', 'Rentouttava sessio uusien ideoiden synnyttämiseksi.', '2025-11-05 15:00:00', '2025-11-05 16:00:00', '#FBC02D'),
    (1, 'Verkkosivujen päivitys', 'Suunnitelma verkkosivujen sisällön ja teknisen alustan päivitykseen.', '2025-11-06 11:00:00', '2025-11-06 12:00:00', '#039BE5'),
    (1, 'Kehityskeskustelut', 'Henkilökohtaiset keskustelut uratavoitteista ja kehitystarpeista.', '2025-11-07 09:00:00', '2025-11-07 10:00:00', '#6D4C41'),

    -- Kummitukset
    (2, 'Haamukoodin debuggaus', 'Vanhojen, vaikeasti jäljitettävien virheiden ("haamukoodi") korjaaminen.', '2025-11-10 10:00:00', '2025-11-10 12:00:00', '#512DA8'),
    (2, 'Syväsukellus arkkitehtuuriin', 'Kriittisen järjestelmän arkkitehtuurin perusteellinen tarkastelu.', '2025-11-11 14:00:00', '2025-11-11 16:30:00', '#673AB7'),
    (2, 'Tietoturva-auditointi', 'Kummitukset-ryhmän sovellusten tietoturva-aukkojen etsiminen.', '2025-11-12 09:30:00', '2025-11-12 12:30:00', '#C62828'),
    (2, 'Henkinen palaute', 'Anonyymi ja rakentava palautesessio tiimin toiminnasta.', '2025-11-13 15:00:00', '2025-11-13 16:00:00', '#AB47BC'),
    (2, 'Retro: Kadonneet tunnit', 'Katsaus edelliseen sprinttiin ja "kadonneiden" työtuntien syiden analysointi.', '2025-11-14 11:00:00', '2025-11-14 12:30:00', '#6A1B9A'),
    (2, 'Tuote A:n käyttöliittymän haamukuvien poisto', 'Pienten, käyttökokemusta heikentävien käyttöliittymäongelmien korjaus.', '2025-11-17 13:00:00', '2025-11-17 15:00:00', '#9C27B0'),
    (2, 'Kriisivalmiusharjoitus', 'Simuloitu järjestelmävika ja nopea reagointiharjoitus.', '2025-11-18 10:30:00', '2025-11-18 11:30:00', '#D32F2F'),
    (2, 'Kuolevaisten tapaaminen', 'Kummitukset-ryhmän työn esittely muille osastoille.', '2025-11-19 14:30:00', '2025-11-19 16:00:00', '#7B1FA2'),
    (2, 'Pilvipalveluiden mysteeri', 'Koulutus ja ongelmanratkaisu pilvipalveluiden monimutkaisista konfiguraatioista.', '2025-11-20 09:00:00', '2025-11-20 12:00:00', '#4527A0'),
    (2, 'Tulevaisuuden varjostus', 'Pitkän aikavälin tavoitteiden ja teknologiatrendien ennustaminen.', '2025-11-21 13:30:00', '2025-11-21 15:30:00', '#5E35B1'),

    -- Mahtikset
    (3, 'Mahtikokous', 'Kaikki Mahtikset koolla päättämässä seuraavista suurista askelista.', '2025-11-24 09:00:00', '2025-11-24 11:00:00', '#D32F2F'),
    (3, 'Supervoimien hionta', 'Koulutussessio, jossa hiotaan ryhmän teknisiä erikoisosaamisia.', '2025-11-25 13:00:00', '2025-11-25 15:00:00', '#F57F17'),
    (3, 'Sankarityöt: Projektin C käynnistys', 'Uuden, erittäin tärkeän Projektin C aloituspalaveri.', '2025-11-26 10:30:00', '2025-11-26 12:00:00', '#F44336'),
    (3, 'Vihollisanalyysi', 'Kilpailijoiden ja markkinoiden uhkien syväluotaus.', '2025-11-27 14:00:00', '2025-11-27 16:00:00', '#B71C1C'),
    (3, 'Mentori-ilta', 'Mahtikset jakavat oppejaan ja kokemuksiaan nuoremmille kollegoille.', '2025-11-28 17:00:00', '2025-11-28 19:00:00', '#FFB300'),
    (3, 'Suurtiedonhallinta-seminaari', 'Miten hallita ja hyödyntää valtavia tietomassoja tehokkaasti.', '2025-12-01 09:30:00', '2025-12-01 12:30:00', '#0288D1'),
    (3, 'Ratkaisun A läpimurto', 'Dedikoitu aika monimutkaisen Ratkaisun A viimeisten haasteiden selvittämiseen.', '2025-12-02 13:30:00', '2025-12-02 16:00:00', '#388E3C'),
    (3, 'Asiakas D:n pelastaminen', 'Kiireellinen kokous asiakas D:n kriittisen ongelman ratkaisemiseksi.', '2025-12-03 11:00:00', '2025-12-03 12:00:00', '#C62828'),
    (3, 'Vuosiraportin Mahti-osuus', 'Tietojen kerääminen ja analysointi Mahtikset-ryhmän osuudesta vuosiraporttiin.', '2025-12-04 10:00:00', '2025-12-04 11:30:00', '#1565C0'),
    (3, 'Tulevaisuuden Mahti-visio', 'Pitkän aikavälin vision ja kunnianhimoisten tavoitteiden luominen ryhmälle.', '2025-12-05 14:30:00', '2025-12-05 16:30:00', '#E65100'),

    -- Fanit
    (1, 'Fanit-ryhmän startti', 'Ensimmäinen virallinen kokoontuminen ja roolien jako.', '2025-12-08 10:00:00', '2025-12-08 11:30:00', '#FF4081'),
    (1, 'Kohdeyleisö-analyysi', 'Syvällinen sukellus fanien kohdeyleisön mieltymyksiin ja käyttäytymiseen.', '2025-12-09 13:00:00', '2025-12-09 15:00:00', '#8E24AA'),
    (1, 'Sisältöstrategian ideointi', 'Brainstorming istunto uuden, fanien sitouttavan sisällön luomiseksi.', '2025-12-10 09:30:00', '2025-12-10 11:00:00', '#FBC02D'),
    (1, 'Sosiaalisen median työpaja', 'Parhaiden käytäntöjen ja uusien trendien läpikäynti sosiaalisessa mediassa.', '2025-12-11 14:30:00', '2025-12-11 16:30:00', '#03A9F4'),
    (1, 'Fanitapahtuman suunnittelu', 'Suunnitelman luominen seuraavan suuren fanitapahtuman järjestämiseksi.', '2025-12-12 11:00:00', '2025-12-12 12:30:00', '#7E57C2'),
    (1, 'KPI-katsaus', 'Keskeisten suorituskykyindikaattoreiden (KPI) määrittäminen ja mittaaminen.', '2025-12-15 10:00:00', '2025-12-15 11:00:00', '#C2185B'),
    (1, 'Viestinnän linjaus', 'Yhteisen äänen ja viestintätyylin määrittely fanien kanssa kommunikointiin.', '2025-12-16 13:00:00', '2025-12-16 14:30:00', '#AD1457'),
    (1, 'Kumppanuusneuvottelut E', 'Tapaaminen potentiaalisen kumppanin E:n kanssa fanitoiminnan tukemiseksi.', '2025-12-17 14:00:00', '2025-12-17 15:00:00', '#E91E63'),
    (1, 'Loppuvuoden juhlinta', 'Fanit-ryhmän epävirallinen joulunajan tapaaminen ja rentoutuminen.', '2025-12-19 18:00:00', '2025-12-19 21:00:00', '#F06292'),
    (1, 'Vuoden 2026 tavoitteet', 'Seuraavan vuoden fanien sitouttamiseen liittyvien tavoitteiden asettaminen.', '2025-12-22 09:00:00', '2025-12-22 11:00:00', '#D81B60'),

    -- Miljardööriklubi
    (5, 'Riskienhallinnan mestarikurssi', 'Kriittisten taloudellisten riskien tunnistaminen ja hallintatekniikoiden syventäminen.', '2026-01-27 10:00:00', '2026-01-27 12:00:00', '#E53935'),
    (5, 'Miljardöörien iltapäivätee', 'Rento keskustelutilaisuus, jossa jaetaan näkemyksiä tulevista sijoitussuunnista.', '2026-01-29 16:00:00', '2026-01-29 17:30:00', '#FFC107'),
    (5, 'Kryptovaluuttastrategiat 2026', 'Analyysi uusista kryptosijoitusstrategioista ja riskienhallinnasta.', '2026-02-02 13:00:00', '2026-02-02 15:00:00', '#00BCD4'),
    (5, 'Yksityissijoittamisen huippusalaisuudet', 'Luottamuksellinen sessio uusista pääomasijoitusmahdollisuuksista.', '2026-02-05 11:00:00', '2026-02-05 12:30:00', '#7B1FA2'),
    (5, 'Luksusinnovaatioiden esittely', 'Katsaus uusimpiin korkean profiilin luksusbrändeihin ja niiden teknologiaan.', '2026-02-07 14:00:00', '2026-02-07 16:00:00', '#FBC02D'),
    (5, 'Maailmantalouden näkymät', 'Kansainvälisen taloustilanteen ja tulevien trendien analyysi.', '2026-02-10 09:00:00', '2026-02-10 11:00:00', '#303F9F'),
    (5, 'Kestävä varallisuus', 'Paneelikeskustelu vastuullisesta sijoittamisesta ja pitkäjänteisestä varallisuudenhoidosta.', '2026-02-12 10:30:00', '2026-02-12 12:00:00', '#4CAF50'),
    (5, 'Eksklusiivinen viinitasting', 'Rajoitetun jäsenmäärän tapahtuma harvinaisten viinien maisteluun.', '2026-02-14 18:00:00', '2026-02-14 21:00:00', '#B71C1C'),
    (5, 'Maailmanvalloitus-strategia', 'Pitkän aikavälin suunnitelma uusille markkinoille laajentumiseksi.', '2026-02-17 13:00:00', '2026-02-17 15:30:00', '#F57F17'),
    (5, 'Hiljainen vetäytyminen', 'Miljardööriklubin vuosittainen retriitti yksityisellä saarella.', '2026-02-21 09:00:00', '2026-02-23 18:00:00', '#9C27B0');

    -- Omituisten otusten kerho
    (4, 'Luovan hulluuden aamu', 'Inspiroiva aivoriihi, jossa ei ole liian outoja ideoita.', '2026-02-25 09:00:00', '2026-02-25 10:30:00', '#8E24AA'),
    (4, 'Outojen ideoiden demo', 'Kerhon jäsenet esittelevät kummallisimmat ideansa käytännössä.', '2026-02-26 13:00:00', '2026-02-26 15:00:00', '#BA68C8'),
    (4, 'Epätavallinen retki', 'Tutkimusmatka kaupunkiin täysin satunnaisella teemalla.', '2026-02-28 11:00:00', '2026-02-28 14:00:00', '#CE93D8'),
    (4, 'Improvisointipaja', 'Kokeellinen luovuusharjoitus ilman sääntöjä.', '2026-03-03 15:00:00', '2026-03-03 16:30:00', '#AB47BC'),
    (4, 'Unien analyysi-ilta', 'Keskustelu outojen unien merkityksestä ja inspiraatiosta projekteihin.', '2026-03-05 18:00:00', '2026-03-05 19:30:00', '#7B1FA2'),
    (4, 'Salainen näyttely', 'Kerhon sisäinen näyttely omituisista luomuksista.', '2026-03-07 10:00:00', '2026-03-07 12:00:00', '#6A1B9A'),
    (4, 'Yö ideatehtaalla', 'Luovuusmaraton myöhään yöhön asti.', '2026-03-10 21:00:00', '2026-03-11 02:00:00', '#9C27B0'),
    (4, 'Otusten keittokilpailu', 'Epätavallisten reseptien kisailu ja maistelu.', '2026-03-12 16:00:00', '2026-03-12 18:00:00', '#EC407A'),
    (4, 'Muodonmuutospäivä', 'Jokainen jäsen vaihtaa rooliaan päiväksi.', '2026-03-14 09:00:00', '2026-03-14 12:00:00', '#F06292'),
    (4, 'Kevään outousgala', 'Vuosittainen juhla omaperäisimmille saavutuksille.', '2026-03-15 18:00:00', '2026-03-15 22:00:00', '#E040FB'),

    -- Huippu joukkue
    (6, 'Aamun startti', 'Tiimin yhteinen päivänavaus ja tavoitteiden läpikäynti.', '2026-03-17 08:00:00', '2026-03-17 08:30:00', '#1976D2'),
    (6, 'Tavoiteworkshop', 'Tarkka suunnitelma seuraavan viikon tavoitteista.', '2026-03-18 10:00:00', '2026-03-18 12:00:00', '#2196F3'),
    (6, 'Sparraussessio', 'Vertaispalaute ja kehitysideoiden jakaminen.', '2026-03-19 13:30:00', '2026-03-19 15:00:00', '#64B5F6'),
    (6, 'Strateginen aivoriihi', 'Tiimin tulevaisuuden suuntaviivojen määrittely.', '2026-03-20 09:00:00', '2026-03-20 11:00:00', '#0D47A1'),
    (6, 'Yhteishengen ilta', 'Tiimipäivällinen ja vapaa keskustelu onnistumisista.', '2026-03-21 18:00:00', '2026-03-21 21:00:00', '#42A5F5'),
    (6, 'Kehityspäivä', 'Tiimin sisäinen koulutus ja osaamisen jakaminen.', '2026-03-24 10:00:00', '2026-03-24 13:00:00', '#1565C0'),
    (6, 'Pikapalaveri', 'Nopea synkka ajankohtaisista asioista.', '2026-03-25 09:00:00', '2026-03-25 09:30:00', '#64B5F6'),
    (6, 'Haastepäivä', 'Tiimikilpailu ongelmanratkaisussa ja luovuudessa.', '2026-03-26 14:00:00', '2026-03-26 16:00:00', '#1E88E5'),
    (6, 'Sprint review', 'Viikon lopun katsaus ja onnistumisten juhlistus.', '2026-03-28 15:00:00', '2026-03-28 16:00:00', '#1976D2'),
    (6, 'Kevätkauden päätös', 'Huippu joukkueen yhteenveto ja palkintojen jako.', '2026-03-30 17:00:00', '2026-03-30 19:00:00', '#0D47A1'),

    -- Hiihtoseura
    (7, 'Aamulenkki', 'Kevyt yhteinen hiihtolenkki ennen työpäivää.', '2026-01-10 07:30:00', '2026-01-10 09:00:00', '#90CAF9'),
    (7, 'Tekniikkaharjoitus', 'Hiihtotekniikan parantamiseen keskittyvä harjoitus.', '2026-01-12 17:00:00', '2026-01-12 18:30:00', '#42A5F5'),
    (7, 'Kilpailuvalmistelut', 'Valmistautuminen tulevaan kilpailuun.', '2026-01-13 15:00:00', '2026-01-13 16:30:00', '#1E88E5'),
    (7, 'Rullahiihto', 'Kesäkauden harjoitus rullasuksilla.', '2026-01-15 09:00:00', '2026-01-15 10:30:00', '#64B5F6'),
    (7, 'Suksihuoltoilta', 'Varusteiden huoltoa ja voitelua ennen viikonloppua.', '2026-01-16 18:00:00', '2026-01-16 20:00:00', '#1565C0'),
    (7, 'Viikonloppuleiri', 'Koko seuran yhteinen leiri lumisilla rinteillä.', '2026-01-18 09:00:00', '2026-01-19 17:00:00', '#0D47A1'),
    (7, 'Kisapäivä', 'Seuran sisäinen kilpailu eri sarjoissa.', '2026-01-22 10:00:00', '2026-01-22 13:00:00', '#1976D2'),
    (7, 'Saunailta', 'Rentouttava sauna ja iltapala harjoitusten jälkeen.', '2026-01-23 19:00:00', '2026-01-23 21:00:00', '#0288D1'),
    (7, 'Hiihtoretki', 'Pitkän matkan yhteishiihto luonnon helmassa.', '2026-01-25 08:00:00', '2026-01-25 12:00:00', '#039BE5'),
    (7, 'Talvikauden päätös', 'Kauden lopetustapahtuma palkintoineen.', '2026-01-27 17:00:00', '2026-01-27 20:00:00', '#01579B'),

    -- Neropatit
    (8, 'Aamun ajatushaaste', 'Päivittäinen looginen pulma tiimille.', '2026-02-03 09:00:00', '2026-02-03 09:30:00', '#4CAF50'),
    (8, 'Algoritmiworkshop', 'Yhteinen algoritmiharjoitus ja vertaisopetus.', '2026-02-04 13:00:00', '2026-02-04 15:00:00', '#66BB6A'),
    (8, 'Kahvikeskustelu: tekoälyn etiikka', 'Avoin keskustelu tekoälyn vastuullisuudesta.', '2026-02-05 10:30:00', '2026-02-05 11:30:00', '#43A047'),
    (8, 'Neropattien hackathon', 'Vuorokauden mittainen ohjelmointitapahtuma.', '2026-02-07 09:00:00', '2026-02-08 09:00:00', '#2E7D32'),
    (8, 'Tietokilpailu-ilta', 'Leikkimielinen nörttivisailu.', '2026-02-09 18:00:00', '2026-02-09 20:00:00', '#388E3C'),
    (8, 'Koodikatselmusmaraton', 'Laadunvarmistus ja refaktorointi-iltapäivä.', '2026-02-11 12:00:00', '2026-02-11 15:00:00', '#1B5E20'),
    (8, 'Aivoriihi: Uudet algoritmit', 'Ideointi seuraavan projektin laskentaoptimoinneista.', '2026-02-13 14:00:00', '2026-02-13 16:00:00', '#81C784'),
    (8, 'Opetussessio: GPU-ohjelmointi', 'Neropattien sisäinen tekninen koulutus GPU-kiihdytyksestä.', '2026-02-15 11:00:00', '2026-02-15 12:30:00', '#388E3C'),
    (8, 'Matikkailta', 'Hauskoja matemaattisia ongelmia ja pizzaa.', '2026-02-17 17:00:00', '2026-02-17 19:00:00', '#4CAF50'),
    (8, 'Älyjen ilta', 'Kauden päätöstilaisuus palkintoineen ja yhteenvetoineen.', '2026-02-20 18:00:00', '2026-02-20 21:00:00', '#43A047');


/*
CREATE TABLE event_group (
    event_id INT NOT NULL,
    group_id INT NOT NULL,
    PRIMARY KEY(event_id, group_id)
);
*/

INSERT INTO event_group (group_id, event_id)
VALUES
    (1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10), -- Sammakot
    (2, 11), (2, 12), (2, 13), (2, 14), (2, 15), (2, 16), (2, 17), (2, 18), (2, 19), (2, 20), -- Jänikset
    (3, 21), (3, 22), (3, 23), (3, 24), (3, 25), (3, 26), (3, 27), (3, 28), (3, 29), (3, 30),
    (4, 31), (4, 32), (4, 33), (4, 34), (4, 35), (4, 36), (4, 37), (4, 38), (4, 39), (4, 40),
    (5, 41), (5, 42), (5, 43), (5, 44), (5, 45), (5, 46), (5, 47), (5, 48), (5, 49), (5, 50),
    (6, 51), (6, 52), (6, 53), (6, 54), (6, 55), (6, 56), (6, 57), (6, 58), (6, 59), (6, 60),
    (7, 61), (7, 62), (7, 63), (7, 64), (7, 65), (7, 66), (7, 67), (7, 68), (7, 69), (7, 70),
    (8, 71), (8, 72), (8, 73), (8, 74), (8, 75), (8, 76), (8, 77), (8, 78), (8, 79), (8, 80),
    (9, 81), (9, 82), (9, 83), (9, 84), (9, 85), (9, 86), (9, 87), (9, 88), (9, 89), (9, 90),
    (10, 91), (10, 92), (10, 93), (10, 94), (10, 95), (10, 96), (10, 97), (10, 98), (10, 99), (10, 100) -- Neropatit