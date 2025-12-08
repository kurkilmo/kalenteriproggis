DROP DATABASE IF EXISTS kalenteri_app;
CREATE DATABASE kalenteri_app;
USE kalenteri_app;

-- Käyttäjät
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    passhash VARCHAR(60) NOT NULL,
    displayname VARCHAR(255) NOT NULL,
    settings JSON
);

-- Ryhmät
CREATE TABLE groups_table (
    id INT PRIMARY KEY AUTO_INCREMENT,
    owner_id INT NOT NULL,
    group_name VARCHAR(255) NOT NULL
);

-- Tapahtumat
CREATE TABLE events_table (
    id INT PRIMARY KEY AUTO_INCREMENT,
    owner_id INT NOT NULL,
    is_group_event BOOLEAN,
    title VARCHAR(255) NOT NULL,
    summary VARCHAR(255) NOT NULL,
    start DATETIME NOT NULL,
    end DATETIME NOT NULL,
    color VARCHAR(7)
);

-- Käyttäjät ja käyttäjän ryhmät
CREATE TABLE group_user (
    person_id INT NOT NULL,
    group_id INT NOT NULL,
    PRIMARY KEY(person_id, group_id)
);

-- Käytetään esimerkkidataa
-- Kaikilla salasanana "kissa123", 10:llä suolarundilla
INSERT INTO users (username, displayname, passhash, settings)
VALUES 
	("Heikki", "Heikki", "$2b$10$FPp8EF71OySKibamQqI1MeOciWXMv5V.CB3gY0WP6Tkvuffl5/rhW", '{"theme":"default","language":"fi","timezone":"Europe/Helsinki"}'),
    ("Pekka" , "Pekka" , "$2b$10$FPp8EF71OySKibamQqI1MeOciWXMv5V.CB3gY0WP6Tkvuffl5/rhW", '{"theme":"light","language":"fi","timezone":"Europe/Helsinki"}'),
    ("Matti" , "Matti" , "$2b$10$FPp8EF71OySKibamQqI1MeOciWXMv5V.CB3gY0WP6Tkvuffl5/rhW", '{"theme":"dark","language":"fi","timezone":"Europe/Helsinki"}'),
    ("Topias", "Topias", "$2b$10$FPp8EF71OySKibamQqI1MeOciWXMv5V.CB3gY0WP6Tkvuffl5/rhW", '{"theme":"default","language":"fi","timezone":"Europe/Helsinki"}'),
    ("Jaana" , "Jaana" , "$2b$10$FPp8EF71OySKibamQqI1MeOciWXMv5V.CB3gY0WP6Tkvuffl5/rhW", '{"theme":"light","language":"en","timezone":"Europe/Helsinki"}'),
    ("Essi"  , "Essi"  ,"$2b$10$FPp8EF71OySKibamQqI1MeOciWXMv5V.CB3gY0WP6Tkvuffl5/rhW" , '{"theme":"default","language":"en","timezone":"Europe/Helsinki"}'),
    ("Jasmin", "Jasmin", "$2b$10$FPp8EF71OySKibamQqI1MeOciWXMv5V.CB3gY0WP6Tkvuffl5/rhW", '{"theme":"default","language":"en","timezone":"Europe/Helsinki"}');

-- Ryhmien esimerkkidata
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

-- Käyttäjien kuuluminen ryhmiin
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
    (7, 6),
-- Huippu joukkue
    (8, 5),
    (8, 6),
    (8, 7),
-- Hiihtoseura
    (9, 2),
    (9, 6),
-- Neropatit
    (10, 4),
    (10, 7),
    (10, 6);


-- Arvoja luonut GEMINI(flash), täydentänyt ChatGPT-5 väreillä
INSERT INTO events_table (owner_id, is_group_event, title, summary, start, end, color)
VALUES
    -- Sammakot
    (1, true, 'Viikkopalaveri'                     , 'Sammakot-ryhmän viikoittainen tilannekatsaus ja seuraavien askeleiden suunnittelu.'               , '2025-10-21 10:00:00.000', '2025-10-21 11:30:00', '#1976D2'),
    (1, true, 'Projektin A-demo'                   , 'Demo Projektin A nykyisestä tilasta ja palautteen kerääminen.'                                    , '2025-10-22 14:00:00.000', '2025-10-22 15:00:00', '#0288D1'),
    (1, true, 'Koulutus: Uusi API'                 , 'Käyttöönottokoulutus uudesta Sammakot-ryhmän käyttämästä API:sta.'                                , '2025-10-23 09:00:00.000', '2025-10-23 12:00:00', '#4DB6AC'),
    (1, true, 'Tiimi-ilta'                         , 'Rentouttava tiimi-ilta keilauksen ja illallisen merkeissä.'                                       , '2025-10-24 18:00:00.000', '2025-10-24 21:00:00', '#F57C00'),
    (1, true, 'Sprintin suunnittelu'               , 'Seuraavan sprintin tehtävien läpikäynti ja priorisointi.'                                         , '2025-10-28 13:00:00.000', '2025-10-28 15:30:00', '#388E3C'),
    (1, true, 'Ideointisessio: Tuote B'            , 'Aivoriihi uuden Tuote B:n ominaisuuksista ja potentiaalisista käyttöliittymistä.'                 , '2025-10-29 11:00:00.000', '2025-10-29 12:30:00', '#FFB300'),
    (1, true, 'Lounastapaaminen asiakkaan X kanssa', 'Epämuodollinen lounastapaaminen asiakkaan X kanssa projektin etenemisestä.'                       , '2025-10-30 12:00:00.000', '2025-10-30 13:00:00', '#8BC34A'),
    (1, true, 'Viikon Sammakot-leffa'              , 'Sammakot-ryhmän sisäinen elokuvahetki toimistolla.'                                               , '2025-10-31 16:00:00.000', '2025-10-31 18:00:00', '#7E57C2'),
    (1, true, 'Bugien karsinta'                    , 'Dedikoitu aika priorisoitujen bugien korjaamiseen ja testaamiseen.'                               , '2025-11-04 09:30:00.000', '2025-11-04 11:00:00', '#E53935'),
    (1, true, 'Kuukausikatsaus'                    , 'Yhteenveto edellisen kuukauden saavutuksista ja tavoitteiden asettaminen seuraavalle kuukaudelle.', '2025-11-05 15:00:00.000', '2025-11-05 16:30:00', '#512DA8'),

    -- Jänikset
    (2, true, 'Strategiapalaveri'                  , 'Seuraavan kvartaalin strategisten tavoitteiden määrittely.'                     , '2025-10-27 09:00:00', '2025-10-27 11:00:00', '#1565C0'),
    (2, true, 'Q3 Tulosten analysointi'            , 'Tarkka analyysi viime kvartaalin taloudellisesta ja operatiivisesta tuloksesta.', '2025-10-28 13:30:00', '2025-10-28 15:30:00', '#283593'),
    (2, true, 'Asiakastapaaminen B'                , 'Tapaaminen avainasiakas B:n kanssa uusista tarpeista.'                          , '2025-10-29 10:30:00', '2025-10-29 11:30:00', '#43A047'),
    (2, true, 'Koodikatselmus'                     , 'Kriittisten koodiosien läpikäynti laadun varmistamiseksi.'                      , '2025-10-30 14:00:00', '2025-10-30 16:00:00', '#8E24AA'),
    (2, true, 'Uuden jäsenen perehdytys'           , 'Uuden tiimiläisen tutustuttaminen Jänikset-ryhmän toimintaan.'                  , '2025-10-31 09:00:00', '2025-10-31 12:00:00', '#FF7043'),
    (2, true, 'Markkinatutkimus-briefing'          , 'Yhteenveto uusimmista markkinatutkimustuloksista.'                              , '2025-11-03 13:00:00', '2025-11-03 14:30:00', '#00796B'),
    (2, true, 'Kuukausittainen raportointi'        , 'Kuukausiraporttien viimeistely ja läpikäynti johdolle.'                         , '2025-11-04 10:00:00', '2025-11-04 11:30:00', '#3949AB'),
    (2, true, 'Iltapäiväkahvit ja ideointi'        , 'Rentouttava sessio uusien ideoiden synnyttämiseksi.'                            , '2025-11-05 15:00:00', '2025-11-05 16:00:00', '#FBC02D'),
    (2, true, 'Verkkosivujen päivitys'             , 'Suunnitelma verkkosivujen sisällön ja teknisen alustan päivitykseen.'           , '2025-11-06 11:00:00', '2025-11-06 12:00:00', '#039BE5'),
    (2, true, 'Kehityskeskustelut'                 , 'Henkilökohtaiset keskustelut uratavoitteista ja kehitystarpeista.'              , '2025-11-07 09:00:00', '2025-11-07 10:00:00', '#6D4C41'),

    -- Kummitukset
    (3, true, 'Haamukoodin debuggaus'                       , 'Vanhojen, vaikeasti jäljitettävien virheiden ("haamukoodi") korjaaminen.'        , '2025-11-10 10:00:00', '2025-11-10 12:00:00', '#512DA8'),
    (3, true, 'Syväsukellus arkkitehtuuriin'                , 'Kriittisen järjestelmän arkkitehtuurin perusteellinen tarkastelu.'               , '2025-11-11 14:00:00', '2025-11-11 16:30:00', '#673AB7'),
    (3, true, 'Tietoturva-auditointi'                       , 'Kummitukset-ryhmän sovellusten tietoturva-aukkojen etsiminen.'                   , '2025-11-12 09:30:00', '2025-11-12 12:30:00', '#C62828'),
    (3, true, 'Henkinen palaute'                            , 'Anonyymi ja rakentava palautesessio tiimin toiminnasta.'                         , '2025-11-13 15:00:00', '2025-11-13 16:00:00', '#AB47BC'),
    (3, true, 'Retro: Kadonneet tunnit'                     , 'Katsaus edelliseen sprinttiin ja "kadonneiden" työtuntien syiden analysointi.'   , '2025-11-14 11:00:00', '2025-11-14 12:30:00', '#6A1B9A'),
    (3, true, 'Tuote A:n käyttöliittymän haamukuvien poisto', 'Pienten, käyttökokemusta heikentävien käyttöliittymäongelmien korjaus.'          , '2025-11-17 13:00:00', '2025-11-17 15:00:00', '#9C27B0'),
    (3, true, 'Kriisivalmiusharjoitus'                      , 'Simuloitu järjestelmävika ja nopea reagointiharjoitus.'                          , '2025-11-18 10:30:00', '2025-11-18 11:30:00', '#D32F2F'),
    (3, true, 'Kuolevaisten tapaaminen'                     , 'Kummitukset-ryhmän työn esittely muille osastoille.'                             , '2025-11-19 14:30:00', '2025-11-19 16:00:00', '#7B1FA2'),
    (3, true, 'Pilvipalveluiden mysteeri'                   , 'Koulutus ja ongelmanratkaisu pilvipalveluiden monimutkaisista konfiguraatioista.', '2025-11-20 09:00:00', '2025-11-20 12:00:00', '#4527A0'),
    (3, true, 'Tulevaisuuden varjostus'                     , 'Pitkän aikavälin tavoitteiden ja teknologiatrendien ennustaminen.'               , '2025-11-21 13:30:00', '2025-11-21 15:30:00', '#5E35B1'),

    -- Mahtikset
    (4, true, 'Mahtikokous'                        , 'Kaikki Mahtikset koolla päättämässä seuraavista suurista askelista.'           , '2025-11-24 09:00:00', '2025-11-24 11:00:00', '#D32F2F'),
    (4, true, 'Supervoimien hionta'                , 'Koulutussessio, jossa hiotaan ryhmän teknisiä erikoisosaamisia.'               , '2025-11-25 13:00:00', '2025-11-25 15:00:00', '#F57F17'),
    (4, true, 'Sankarityöt: Projektin C käynnistys', 'Uuden, erittäin tärkeän Projektin C aloituspalaveri.'                          , '2025-11-26 10:30:00', '2025-11-26 12:00:00', '#F44336'),
    (4, true, 'Vihollisanalyysi'                   , 'Kilpailijoiden ja markkinoiden uhkien syväluotaus.'                            , '2025-11-27 14:00:00', '2025-11-27 16:00:00', '#B71C1C'),
    (4, true, 'Mentori-ilta'                       , 'Mahtikset jakavat oppejaan ja kokemuksiaan nuoremmille kollegoille.'           , '2025-11-28 17:00:00', '2025-11-28 19:00:00', '#FFB300'),
    (4, true, 'Suurtiedonhallinta-seminaari'       , 'Miten hallita ja hyödyntää valtavia tietomassoja tehokkaasti.'                 , '2025-12-01 09:30:00', '2025-12-01 12:30:00', '#0288D1'),
    (4, true, 'Ratkaisun A läpimurto'              , 'Dedikoitu aika monimutkaisen Ratkaisun A viimeisten haasteiden selvittämiseen.', '2025-12-02 13:30:00', '2025-12-02 16:00:00', '#388E3C'),
    (4, true, 'Asiakas D:n pelastaminen'           , 'Kiireellinen kokous asiakas D:n kriittisen ongelman ratkaisemiseksi.'          , '2025-12-03 11:00:00', '2025-12-03 12:00:00', '#C62828'),
    (4, true, 'Vuosiraportin Mahti-osuus'          , 'Tietojen kerääminen ja analysointi Mahtikset-ryhmän osuudesta vuosiraporttiin.', '2025-12-04 10:00:00', '2025-12-04 11:30:00', '#1565C0'),
    (4, true, 'Tulevaisuuden Mahti-visio'          , 'Pitkän aikavälin vision ja kunnianhimoisten tavoitteiden luominen ryhmälle.'   , '2025-12-05 14:30:00', '2025-12-05 16:30:00', '#E65100'),

    -- Fanit
    (5, true, 'Fanit-ryhmän startti'      , 'Ensimmäinen virallinen kokoontuminen ja roolien jako.'                      , '2025-12-08 10:00:00', '2025-12-08 11:30:00', '#FF4081'),
    (5, true, 'Kohdeyleisö-analyysi'      , 'Syvällinen sukellus fanien kohdeyleisön mieltymyksiin ja käyttäytymiseen.'  , '2025-12-09 13:00:00', '2025-12-09 15:00:00', '#8E24AA'),
    (5, true, 'Sisältöstrategian ideointi', 'Brainstorming istunto uuden, fanien sitouttavan sisällön luomiseksi.'       , '2025-12-10 09:30:00', '2025-12-10 11:00:00', '#FBC02D'),
    (5, true, 'Sosiaalisen median työpaja', 'Parhaiden käytäntöjen ja uusien trendien läpikäynti sosiaalisessa mediassa.', '2025-12-11 14:30:00', '2025-12-11 16:30:00', '#03A9F4'),
    (5, true, 'Fanitapahtuman suunnittelu', 'Suunnitelman luominen seuraavan suuren fanitapahtuman järjestämiseksi.'     , '2025-12-12 11:00:00', '2025-12-12 12:30:00', '#7E57C2'),
    (5, true, 'KPI-katsaus'               , 'Keskeisten suorituskykyindikaattoreiden (KPI) määrittäminen ja mittaaminen.', '2025-12-15 10:00:00', '2025-12-15 11:00:00', '#C2185B'),
    (5, true, 'Viestinnän linjaus'        , 'Yhteisen äänen ja viestintätyylin määrittely fanien kanssa kommunikointiin.', '2025-12-16 13:00:00', '2025-12-16 14:30:00', '#AD1457'),
    (5, true, 'Kumppanuusneuvottelut E'   , 'Tapaaminen potentiaalisen kumppanin E:n kanssa fanitoiminnan tukemiseksi.'  , '2025-12-17 14:00:00', '2025-12-17 15:00:00', '#E91E63'),
    (5, true, 'Loppuvuoden juhlinta'      , 'Fanit-ryhmän epävirallinen joulunajan tapaaminen ja rentoutuminen.'         , '2025-12-19 18:00:00', '2025-12-19 21:00:00', '#F06292'),
    (5, true, 'Vuoden 2026 tavoitteet'    , 'Seuraavan vuoden fanien sitouttamiseen liittyvien tavoitteiden asettaminen.', '2025-12-22 09:00:00', '2025-12-22 11:00:00', '#D81B60'),

    -- Miljardööriklubi
    (6, true, 'Riskienhallinnan mestarikurssi'         , 'Kriittisten taloudellisten riskien tunnistaminen ja hallintatekniikoiden syventäminen.'     , '2026-01-27 10:00:00', '2026-01-27 12:00:00', '#E53935'),
    (6, true, 'Miljardöörien iltapäivätee'             , 'Rento keskustelutilaisuus, jossa jaetaan näkemyksiä tulevista sijoitussuunnista.'           , '2026-01-29 16:00:00', '2026-01-29 17:30:00', '#FFC107'),
    (6, true, 'Kryptovaluuttastrategiat 2026'          , 'Analyysi uusista kryptosijoitusstrategioista ja riskienhallinnasta.'                        , '2026-02-02 13:00:00', '2026-02-02 15:00:00', '#00BCD4'),
    (6, true, 'Yksityissijoittamisen huippusalaisuudet', 'Luottamuksellinen sessio uusista pääomasijoitusmahdollisuuksista.'                          , '2026-02-05 11:00:00', '2026-02-05 12:30:00', '#7B1FA2'),
    (6, true, 'Luksusinnovaatioiden esittely'          , 'Katsaus uusimpiin korkean profiilin luksusbrändeihin ja niiden teknologiaan.'               , '2026-02-07 14:00:00', '2026-02-07 16:00:00', '#FBC02D'),
    (6, true, 'Maailmantalouden näkymät'               , 'Kansainvälisen taloustilanteen ja tulevien trendien analyysi.'                              , '2026-02-10 09:00:00', '2026-02-10 11:00:00', '#303F9F'),
    (6, true, 'Kestävä varallisuus'                    , 'Paneelikeskustelu vastuullisesta sijoittamisesta ja pitkäjänteisestä varallisuudenhoidosta.', '2026-02-12 10:30:00', '2026-02-12 12:00:00', '#4CAF50'),
    (6, true, 'Eksklusiivinen viinitasting'            , 'Rajoitetun jäsenmäärän tapahtuma harvinaisten viinien maisteluun.'                          , '2026-02-14 18:00:00', '2026-02-14 21:00:00', '#B71C1C'),
    (6, true, 'Maailmanvalloitus-strategia'            , 'Pitkän aikavälin suunnitelma uusille markkinoille laajentumiseksi.'                         , '2026-02-17 13:00:00', '2026-02-17 15:30:00', '#F57F17'),
    (6, true, 'Hiljainen vetäytyminen'                 , 'Miljardööriklubin vuosittainen retriitti yksityisellä saarella.'                            , '2026-02-21 09:00:00', '2026-02-23 18:00:00', '#9C27B0'),

    -- Omituisten otusten kerho
    (7, true, 'Luovan hulluuden aamu' , 'Inspiroiva aivoriihi, jossa ei ole liian outoja ideoita.'              , '2026-02-25 09:00:00', '2026-02-25 10:30:00', '#8E24AA'),
    (7, true, 'Outojen ideoiden demo' , 'Kerhon jäsenet esittelevät kummallisimmat ideansa käytännössä.'        , '2026-02-26 13:00:00', '2026-02-26 15:00:00', '#BA68C8'),
    (7, true, 'Epätavallinen retki'   , 'Tutkimusmatka kaupunkiin täysin satunnaisella teemalla.'               , '2026-02-28 11:00:00', '2026-02-28 14:00:00', '#CE93D8'),
    (7, true, 'Improvisointipaja'     , 'Kokeellinen luovuusharjoitus ilman sääntöjä.'                          , '2026-03-03 15:00:00', '2026-03-03 16:30:00', '#AB47BC'),
    (7, true, 'Unien analyysi-ilta'   , 'Keskustelu outojen unien merkityksestä ja inspiraatiosta projekteihin.', '2026-03-05 18:00:00', '2026-03-05 19:30:00', '#7B1FA2'),
    (7, true, 'Salainen näyttely'     , 'Kerhon sisäinen näyttely omituisista luomuksista.'                     , '2026-03-07 10:00:00', '2026-03-07 12:00:00', '#6A1B9A'),
    (7, true, 'Yö ideatehtaalla'      , 'Luovuusmaraton myöhään yöhön asti.'                                    , '2026-03-10 21:00:00', '2026-03-11 02:00:00', '#9C27B0'),
    (7, true, 'Otusten keittokilpailu', 'Epätavallisten reseptien kisailu ja maistelu.'                         , '2026-03-12 16:00:00', '2026-03-12 18:00:00', '#EC407A'),
    (7, true, 'Muodonmuutospäivä'     , 'Jokainen jäsen vaihtaa rooliaan päiväksi.'                             , '2026-03-14 09:00:00', '2026-03-14 12:00:00', '#F06292'),
    (7, true, 'Kevään outousgala'     , 'Vuosittainen juhla omaperäisimmille saavutuksille.'                    , '2026-03-15 18:00:00', '2026-03-15 22:00:00', '#E040FB'),

    -- Huippu joukkue
    (8, true, 'Aamun startti'        , 'Tiimin yhteinen päivänavaus ja tavoitteiden läpikäynti.', '2026-03-17 08:00:00', '2026-03-17 08:30:00', '#1976D2'),
    (8, true, 'Tavoiteworkshop'      , 'Tarkka suunnitelma seuraavan viikon tavoitteista.'      , '2026-03-18 10:00:00', '2026-03-18 12:00:00', '#2196F3'),
    (8, true, 'Sparraussessio'       , 'Vertaispalaute ja kehitysideoiden jakaminen.'           , '2026-03-19 13:30:00', '2026-03-19 15:00:00', '#64B5F6'),
    (8, true, 'Strateginen aivoriihi', 'Tiimin tulevaisuuden suuntaviivojen määrittely.'        , '2026-03-20 09:00:00', '2026-03-20 11:00:00', '#0D47A1'),
    (8, true, 'Yhteishengen ilta'    , 'Tiimipäivällinen ja vapaa keskustelu onnistumisista.'   , '2026-03-21 18:00:00', '2026-03-21 21:00:00', '#42A5F5'),
    (8, true, 'Kehityspäivä'         , 'Tiimin sisäinen koulutus ja osaamisen jakaminen.'       , '2026-03-24 10:00:00', '2026-03-24 13:00:00', '#1565C0'),
    (8, true, 'Pikapalaveri'         , 'Nopea synkka ajankohtaisista asioista.'                 , '2026-03-25 09:00:00', '2026-03-25 09:30:00', '#64B5F6'),
    (8, true, 'Haastepäivä'          , 'Tiimikilpailu ongelmanratkaisussa ja luovuudessa.'      , '2026-03-26 14:00:00', '2026-03-26 16:00:00', '#1E88E5'),
    (8, true, 'Sprint review'        , 'Viikon lopun katsaus ja onnistumisten juhlistus.'       , '2026-03-28 15:00:00', '2026-03-28 16:00:00', '#1976D2'),
    (8, true, 'Kevätkauden päätös'   , 'Huippu joukkueen yhteenveto ja palkintojen jako.'       , '2026-03-30 17:00:00', '2026-03-30 19:00:00', '#0D47A1'),

    -- Hiihtoseura
    (9, true, 'Aamulenkki'           , 'Kevyt yhteinen hiihtolenkki ennen työpäivää.'       , '2026-01-10 07:30:00', '2026-01-10 09:00:00', '#90CAF9'),
    (9, true, 'Tekniikkaharjoitus'   , 'Hiihtotekniikan parantamiseen keskittyvä harjoitus.', '2026-01-12 17:00:00', '2026-01-12 18:30:00', '#42A5F5'),
    (9, true, 'Kilpailuvalmistelut'  , 'Valmistautuminen tulevaan kilpailuun.'              , '2026-01-13 15:00:00', '2026-01-13 16:30:00', '#1E88E5'),
    (9, true, 'Rullahiihto'          , 'Kesäkauden harjoitus rullasuksilla.'                , '2026-01-15 09:00:00', '2026-01-15 10:30:00', '#64B5F6'),
    (9, true, 'Suksihuoltoilta'      , 'Varusteiden huoltoa ja voitelua ennen viikonloppua.', '2026-01-16 18:00:00', '2026-01-16 20:00:00', '#1565C0'),
    (9, true, 'Viikonloppuleiri'     , 'Koko seuran yhteinen leiri lumisilla rinteillä.'    , '2026-01-18 09:00:00', '2026-01-19 17:00:00', '#0D47A1'),
    (9, true, 'Kisapäivä'            , 'Seuran sisäinen kilpailu eri sarjoissa.'            , '2026-01-22 10:00:00', '2026-01-22 13:00:00', '#1976D2'),
    (9, true, 'Saunailta'            , 'Rentouttava sauna ja iltapala harjoitusten jälkeen.', '2026-01-23 19:00:00', '2026-01-23 21:00:00', '#0288D1'),
    (9, true, 'Hiihtoretki'          , 'Pitkän matkan yhteishiihto luonnon helmassa.'       , '2026-01-25 08:00:00', '2026-01-25 12:00:00', '#039BE5'),
    (9, true, 'Talvikauden päätös'   , 'Kauden lopetustapahtuma palkintoineen.'             , '2026-01-27 17:00:00', '2026-01-27 20:00:00', '#01579B'),

    -- Neropatit
    (10, true, 'Aamun ajatushaaste'               , 'Päivittäinen looginen pulma tiimille.'                     , '2026-02-03 09:00:00', '2026-02-03 09:30:00', '#4CAF50'),
    (10, true, 'Algoritmiworkshop'                , 'Yhteinen algoritmiharjoitus ja vertaisopetus.'             , '2026-02-04 13:00:00', '2026-02-04 15:00:00', '#66BB6A'),
    (10, true, 'Kahvikeskustelu: tekoälyn etiikka', 'Avoin keskustelu tekoälyn vastuullisuudesta.'              , '2026-02-05 10:30:00', '2026-02-05 11:30:00', '#43A047'),
    (10, true, 'Neropattien hackathon'            , 'Vuorokauden mittainen ohjelmointitapahtuma.'               , '2026-02-07 09:00:00', '2026-02-08 09:00:00', '#2E7D32'),
    (10, true, 'Tietokilpailu-ilta'               , 'Leikkimielinen nörttivisailu.'                             , '2026-02-09 18:00:00', '2026-02-09 20:00:00', '#388E3C'),
    (10, true, 'Koodikatselmusmaraton'            , 'Laadunvarmistus ja refaktorointi-iltapäivä.'               , '2026-02-11 12:00:00', '2026-02-11 15:00:00', '#1B5E20'),
    (10, true, 'Aivoriihi: Uudet algoritmit'      , 'Ideointi seuraavan projektin laskentaoptimoinneista.'      , '2026-02-13 14:00:00', '2026-02-13 16:00:00', '#81C784'),
    (10, true, 'Opetussessio: GPU-ohjelmointi'    , 'Neropattien sisäinen tekninen koulutus GPU-kiihdytyksestä.', '2026-02-15 11:00:00', '2026-02-15 12:30:00', '#388E3C'),
    (10, true, 'Matikkailta'                      , 'Hauskoja matemaattisia ongelmia ja pizzaa.'                , '2026-02-17 17:00:00', '2026-02-17 19:00:00', '#4CAF50'),
    (10, true, 'Älyjen ilta'                      , 'Kauden päätöstilaisuus palkintoineen ja yhteenvetoineen.'  , '2026-02-20 18:00:00', '2026-02-20 21:00:00', '#43A047');

