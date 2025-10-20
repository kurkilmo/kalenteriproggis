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
    startTime DATETIME NOT NULL,
    endTime DATETIME NOT NULL
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

-- Arvoja luonut GEMINI(flash)
INSERT INTO events_table (owner_id, title, summary, startTime, endTime)
VALUES
    -- Sammakot
    (1, 'Viikkopalaveri', 'Sammakot-ryhmän viikoittainen tilannekatsaus ja seuraavien askeleiden suunnittelu.', '2025-10-21 10:00:00', '2025-10-21 11:30:00'), 
    (1, 'Projektin A-demo', 'Demo Projektin A nykyisestä tilasta ja palautteen kerääminen.', '2025-10-22 14:00:00', '2025-10-22 15:00:00'), 
    (1, 'Koulutus: Uusi API', 'Käyttöönottokoulutus uudesta Sammakot-ryhmän käyttämästä API:sta.', '2025-10-23 09:00:00', '2025-10-23 12:00:00'), 
    (1, 'Tiimi-ilta', 'Rentouttava tiimi-ilta keilauksen ja illallisen merkeissä.', '2025-10-24 18:00:00', '2025-10-24 21:00:00'), 
    (1, 'Sprintin suunnittelu', 'Seuraavan sprintin tehtävien läpikäynti ja priorisointi.', '2025-10-28 13:00:00', '2025-10-28 15:30:00'), 
    (1, 'Ideointisessio: Tuote B', 'Aivoriihi uuden Tuote B:n ominaisuuksista ja potentiaalisista käyttöliittymistä.', '2025-10-29 11:00:00', '2025-10-29 12:30:00'), 
    (1, 'Lounastapaaminen asiakkaan X kanssa', 'Epämuodollinen lounastapaaminen asiakkaan X kanssa projektin etenemisestä.', '2025-10-30 12:00:00', '2025-10-30 13:00:00'), 
    (1, 'Viikon Sammakot-leffa', 'Sammakot-ryhmän sisäinen elokuvahetki toimistolla.', '2025-10-31 16:00:00', '2025-10-31 18:00:00'), 
    (1, 'Bugien karsinta', 'Dedikoitu aika priorisoitujen bugien korjaamiseen ja testaamiseen.', '2025-11-04 09:30:00', '2025-11-04 11:00:00'),
    (1, 'Kuukausikatsaus', 'Yhteenveto edellisen kuukauden saavutuksista ja tavoitteiden asettaminen seuraavalle kuukaudelle.', '2025-11-05 15:00:00', '2025-11-05 16:30:00'),

    -- Jänikset
    (1, 'Strategiapalaveri', 'Seuraavan kvartaalin strategisten tavoitteiden määrittely.', '2025-10-27 09:00:00', '2025-10-27 11:00:00'),
    (1, 'Q3 Tulosten analysointi', 'Tarkka analyysi viime kvartaalin taloudellisesta ja operatiivisesta tuloksesta.', '2025-10-28 13:30:00', '2025-10-28 15:30:00'),
    (1, 'Asiakastapaaminen B', 'Tapaaminen avainasiakas B:n kanssa uusista tarpeista.', '2025-10-29 10:30:00', '2025-10-29 11:30:00'),
    (1, 'Koodikatselmus', 'Kriittisten koodiosien läpikäynti laadun varmistamiseksi.', '2025-10-30 14:00:00', '2025-10-30 16:00:00'),
    (1, 'Uuden jäsenen perehdytys', 'Uuden tiimiläisen tutustuttaminen Jänikset-ryhmän toimintaan.', '2025-10-31 09:00:00', '2025-10-31 12:00:00'),
    (1, 'Markkinatutkimus-briefing', 'Yhteenveto uusimmista markkinatutkimustuloksista.', '2025-11-03 13:00:00', '2025-11-03 14:30:00'),
    (1, 'Kuukausittainen raportointi', 'Kuukausiraporttien viimeistely ja läpikäynti johdolle.', '2025-11-04 10:00:00', '2025-11-04 11:30:00'),
    (1, 'Iltapäiväkahvit ja ideointi', 'Rentouttava sessio uusien ideoiden synnyttämiseksi.', '2025-11-05 15:00:00', '2025-11-05 16:00:00'),
    (1, 'Verkkosivujen päivitys', 'Suunnitelma verkkosivujen sisällön ja teknisen alustan päivitykseen.', '2025-11-06 11:00:00', '2025-11-06 12:00:00'),
    (1, 'Kehityskeskustelut', 'Henkilökohtaiset keskustelut uratavoitteista ja kehitystarpeista.', '2025-11-07 09:00:00', '2025-11-07 10:00:00'),

    -- Kummitukset
    (2, 'Haamukoodin debuggaus', 'Vanhojen, vaikeasti jäljitettävien virheiden ("haamukoodi") korjaaminen.', '2025-11-10 10:00:00', '2025-11-10 12:00:00'),
    (2, 'Syväsukellus arkkitehtuuriin', 'Kriittisen järjestelmän arkkitehtuurin perusteellinen tarkastelu.', '2025-11-11 14:00:00', '2025-11-11 16:30:00'),
    (2, 'Tietoturva-auditointi', 'Kummitukset-ryhmän sovellusten tietoturva-aukkojen etsiminen.', '2025-11-12 09:30:00', '2025-11-12 12:30:00'),
    (2, 'Henkinen palaute', 'Anonyymi ja rakentava palautesessio tiimin toiminnasta.', '2025-11-13 15:00:00', '2025-11-13 16:00:00'),
    (2, 'Retro: Kadonneet tunnit', 'Katsaus edelliseen sprinttiin ja "kadonneiden" työtuntien syiden analysointi.', '2025-11-14 11:00:00', '2025-11-14 12:30:00'),
    (2, 'Tuote A:n käyttöliittymän haamukuvien poisto', 'Pienten, käyttökokemusta heikentävien käyttöliittymäongelmien korjaus.', '2025-11-17 13:00:00', '2025-11-17 15:00:00'),
    (2, 'Kriisivalmiusharjoitus', 'Simuloitu järjestelmävika ja nopea reagointiharjoitus.', '2025-11-18 10:30:00', '2025-11-18 11:30:00'),
    (2, 'Kuolevaisten tapaaminen', 'Kummitukset-ryhmän työn esittely muille osastoille.', '2025-11-19 14:30:00', '2025-11-19 16:00:00'),
    (2, 'Pilvipalveluiden mysteeri', 'Koulutus ja ongelmanratkaisu pilvipalveluiden monimutkaisista konfiguraatioista.', '2025-11-20 09:00:00', '2025-11-20 12:00:00'),
    (2, 'Tulevaisuuden varjostus', 'Pitkän aikavälin tavoitteiden ja teknologiatrendien ennustaminen.', '2025-11-21 13:30:00', '2025-11-21 15:30:00'),

    -- Mahtikset
    (3, 'Mahtikokous', 'Kaikki Mahtikset koolla päättämässä seuraavista suurista askelista.', '2025-11-24 09:00:00', '2025-11-24 11:00:00'),
    (3, 'Supervoimien hionta', 'Koulutussessio, jossa hiotaan ryhmän teknisiä erikoisosaamisia.', '2025-11-25 13:00:00', '2025-11-25 15:00:00'),
    (3, 'Sankarityöt: Projektin C käynnistys', 'Uuden, erittäin tärkeän Projektin C aloituspalaveri.', '2025-11-26 10:30:00', '2025-11-26 12:00:00'),
    (3, 'Vihollisanalyysi', 'Kilpailijoiden ja markkinoiden uhkien syväluotaus.', '2025-11-27 14:00:00', '2025-11-27 16:00:00'),
    (3, 'Mentori-ilta', 'Mahtikset jakavat oppejaan ja kokemuksiaan nuoremmille kollegoille.', '2025-11-28 17:00:00', '2025-11-28 19:00:00'),
    (3, 'Suurtiedonhallinta-seminaari', 'Miten hallita ja hyödyntää valtavia tietomassoja tehokkaasti.', '2025-12-01 09:30:00', '2025-12-01 12:30:00'),
    (3, 'Ratkaisun A läpimurto', 'Dedikoitu aika monimutkaisen Ratkaisun A viimeisten haasteiden selvittämiseen.', '2025-12-02 13:30:00', '2025-12-02 16:00:00'),
    (3, 'Asiakas D:n pelastaminen', 'Kiireellinen kokous asiakas D:n kriittisen ongelman ratkaisemiseksi.', '2025-12-03 11:00:00', '2025-12-03 12:00:00'),
    (3, 'Vuosiraportin Mahti-osuus', 'Tietojen kerääminen ja analysointi Mahtikset-ryhmän osuudesta vuosiraporttiin.', '2025-12-04 10:00:00', '2025-12-04 11:30:00'),
    (3, 'Tulevaisuuden Mahti-visio', 'Pitkän aikavälin vision ja kunnianhimoisten tavoitteiden luominen ryhmälle.', '2025-12-05 14:30:00', '2025-12-05 16:30:00'),

    -- Fanit
    (1, 'Fanit-ryhmän startti', 'Ensimmäinen virallinen kokoontuminen ja roolien jako.', '2025-12-08 10:00:00', '2025-12-08 11:30:00'),
    (1, 'Kohdeyleisö-analyysi', 'Syvällinen sukellus fanien kohdeyleisön mieltymyksiin ja käyttäytymiseen.', '2025-12-09 13:00:00', '2025-12-09 15:00:00'),
    (1, 'Sisältöstrategian ideointi', 'Brainstorming istunto uuden, fanien sitouttavan sisällön luomiseksi.', '2025-12-10 09:30:00', '2025-12-10 11:00:00'),
    (1, 'Sosiaalisen median työpaja', 'Parhaiden käytäntöjen ja uusien trendien läpikäynti sosiaalisessa mediassa.', '2025-12-11 14:30:00', '2025-12-11 16:30:00'),
    (1, 'Fanitapahtuman suunnittelu', 'Suunnitelman luominen seuraavan suuren fanitapahtuman järjestämiseksi.', '2025-12-12 11:00:00', '2025-12-12 12:30:00'),
    (1, 'KPI-katsaus', 'Keskeisten suorituskykyindikaattoreiden (KPI) määrittäminen ja mittaaminen.', '2025-12-15 10:00:00', '2025-12-15 11:00:00'),
    (1, 'Viestinnän linjaus', 'Yhteisen äänen ja viestintätyylin määrittely fanien kanssa kommunikointiin.', '2025-12-16 13:00:00', '2025-12-16 14:30:00'),
    (1, 'Kumppanuusneuvottelut E', 'Tapaaminen potentiaalisen kumppanin E:n kanssa fanitoiminnan tukemiseksi.', '2025-12-17 14:00:00', '2025-12-17 15:00:00'),
    (1, 'Loppuvuoden juhlinta', 'Fanit-ryhmän epävirallinen joulunajan tapaaminen ja rentoutuminen.', '2025-12-19 18:00:00', '2025-12-19 21:00:00'),
    (1, 'Vuoden 2026 tavoitteet', 'Seuraavan vuoden fanien sitouttamiseen liittyvien tavoitteiden asettaminen.', '2025-12-22 09:00:00', '2025-12-22 11:00:00'),

    -- Miljardööriklubi
    (5, 'Globaali Investointisummit', 'Kansainvälisten sijoitusmahdollisuuksien ja markkinatrendien huipputapaaminen.', '2026-01-07 10:00:00', '2026-01-07 15:00:00'),
    (5, 'Hyväntekeväisyysgaala', 'Vuosittainen varainkeruutapahtuma valitulle hyväntekeväisyyskohteelle.', '2026-01-09 19:00:00', '2026-01-09 23:00:00'),
    (5, 'Teknologian Tulevaisuus', 'Eksklusiivinen katsaus nouseviin teknologioihin ja niiden vaikutukseen talouteen.', '2026-01-12 14:00:00', '2026-01-12 16:00:00'),
    (5, 'Kiinteistöportfolion optimointi', 'Keskustelu parhaista strategioista kiinteistösijoitusten maksimoimiseksi.', '2026-01-15 11:00:00', '2026-01-15 13:00:00'),
    (5, 'Yksityinen Taidehuutokauppa', 'Klubin jäsenille varattu taide-esineiden myyntitilaisuus.', '2026-01-18 16:00:00', '2026-01-18 18:00:00'),
    (5, 'Verosuunnittelun asiantuntijapaneeli', 'Kansainvälisen verotuksen ja varallisuudenhallinnan asiantuntijoiden tapaaminen.', '2026-01-21 09:00:00', '2026-01-21 12:00:00'),
    (5, 'Luksusmatkailun uudet kohteet', 'Esittely harvinaisista ja eksklusiivisista matkakohteista ja palveluista.', '2026-01-24 15:00:00', '2026-01-24 16:30:00'),
    (5, 'Riskienhallinnan mestarikurssi', 'Kriittisten taloudellisten ja poliittisten riskien tunnistaminen ja hallinta.', '2026-01-27 13:30:00', '2026-01-27 15:30:00'),
    (5, 'Cocktail-tilaisuus ja Verkostoituminen', 'Epämuodollinen tilaisuus klubin jäsenten väliseen verkostoitumiseen.', '2026-01-30 18:00:00', '2026-01-30 20:00:00'),
    (5, 'Seuraavan sukupolven johtajuus', 'Keskustelu perheyritysten jatkuvuudesta ja varallisuuden siirrosta.', '2026-02-02 10:00:00', '2026-02-02 12:00:00'),

    -- Omituisten otusten kerho
    (6, 'Alien-Kontaktisessio', 'Yhteinen yritys luoda yhteys tuntemattomiin ulottuvuuksiin.', '2026-02-05 21:00:00', '2026-02-05 23:00:00'),
    (6, 'Kryptidi-Havaintojen Keskustelu', 'Uusimpien havaintojen ja todisteiden läpikäynti Sasquatchista ja muista kryptideistä.', '2026-02-08 18:30:00', '2026-02-08 20:00:00'),
    (6, 'Ajan Matkustuksen Teoriailta', 'Syväluotaus paradokseihin ja mahdollisuuksiin ajassa liikkumiseen.', '2026-02-11 19:00:00', '2026-02-11 21:00:00'),
    (6, 'Salaliittoteorioiden Purkaminen', 'Yhteinen tutkimus tunnetuimmista salaliittoteorioista ja niiden paikkansapitävyydestä.', '2026-02-14 16:00:00', '2026-02-14 17:30:00'),
    (6, 'Omituiset Ruokareseptit', 'Klubin jäsenten valmistamien epätavallisten ruokalajien maisteluilta.', '2026-02-17 17:30:00', '2026-02-17 19:30:00'),
    (6, 'Paranormaalit Ilmiöt - Paneeli', 'Kokemusten ja tieteellisten selitysten vertailu aaveista ja muista ilmiöistä.', '2026-02-20 20:00:00', '2026-02-20 22:00:00'),
    (6, 'Unien Tulkinta Työpaja', 'Miten ymmärtää ja hyödyntää omia outoja uniaan luovassa mielessä.', '2026-02-23 18:00:00', '2026-02-23 19:30:00'),
    (6, 'Fortean Ilmiöt - Elokuvanäytös', 'Dokumentin katselu epätavallisista, tieteen ulkopuolisista ilmiöistä.', '2026-02-26 21:30:00', '2026-02-26 23:30:00'),
    (6, 'Maailman Oudoimmat Paikat', 'Virtuaalinen matka ja esittely planeetan erikoisimmista kohteista.', '2026-03-02 10:00:00', '2026-03-02 11:30:00'),
    (6, 'Tiivistetty Outous', 'Vuoden ensimmäisen kvartaalin omituisimpien tapahtumien yhteenveto ja suunnitelmat.', '2026-03-05 14:00:00', '2026-03-05 15:00:00'),

    -- Huippu joukkue
    (6, 'Strateginen Kärkihanke', 'Tärkeimmän projektin tavoitteiden ja resurssien määrittely.', '2026-03-09 09:00:00', '2026-03-09 11:30:00'),
    (6, 'Järjestelmä X:n optimointi', 'Syväluotaus kriittisen järjestelmän suorituskyvyn parantamiseksi.', '2026-03-12 13:00:00', '2026-03-12 15:00:00'),
    (6, 'Innovointisprintti', 'Intensiivinen, nopea kehitysjakso uusien ratkaisujen prototyyppien luomiseksi.', '2026-03-16 10:00:00', '2026-03-16 16:00:00'),
    (6, 'Koulutus: Johtava teknologia', 'Käytännön koulutus tiimin kannalta olennaisesta uusimmasta teknologiasta.', '2026-03-19 14:00:00', '2026-03-19 16:30:00'),
    (6, 'Asiakas F:n huipputapaaminen', 'Korkean tason neuvottelut avainasiakas F:n kanssa tulevasta yhteistyöstä.', '2026-03-23 11:00:00', '2026-03-23 12:00:00'),
    (6, 'Koodin Laadun Tarkistus', 'Perusteellinen koodikatselmus parhaiden käytäntöjen varmistamiseksi.', '2026-03-26 09:30:00', '2026-03-26 11:30:00'),
    (6, 'Ongelmanratkaisusessio', 'Yhteinen aivoriihi monimutkaisen teknisen haasteen ratkaisemiseksi.', '2026-03-30 13:30:00', '2026-03-30 15:30:00'),
    (6, 'Tiimipäivä ja verkostoituminen', 'Virallinen tiimipäivä, joka sisältää virkistystä ja epämuodollista verkostoitumista.', '2026-04-02 17:00:00', '2026-04-02 20:00:00'),
    (6, 'Toimintasuunnitelma Q2', 'Seuraavan kvartaalin yksityiskohtaisen toimintasuunnitelman laatiminen.', '2026-04-06 10:00:00', '2026-04-06 12:30:00'),
    (6, 'Kuukausikatsaus ja Tunnustus', 'Edellisen kuukauden saavutusten läpikäynti ja onnistumisten juhlistaminen.', '2026-04-09 15:00:00', '2026-04-09 16:00:00'),

    -- Hiihtoseura
    (6, 'Fysiikkatestit ja kesäharjoittelun aloitus', 'Seuran urheilijoiden kuntotestit ja suunnitelma kesäkaudelle.', '2026-04-13 17:00:00', '2026-04-13 19:00:00'),
    (6, 'Rullahiihtoleiri I', 'Ensimmäinen rullahiihtoleiri lumettoman kauden harjoittelun tehostamiseksi.', '2026-05-02 10:00:00', '2026-05-04 16:00:00'),
    (6, 'Sponsoritapaaminen ja varainkeruu', 'Tapaaminen nykyisten ja potentiaalisten sponsoreiden kanssa.', '2026-05-15 14:00:00', '2026-05-15 16:00:00'),
    (6, 'Maastolenkki ja tekniikkaharjoitus', 'Yhteinen pitkä lenkki ja sauvakävelyn / -juoksun tekniikan hionta.', '2026-06-07 09:30:00', '2026-06-07 12:00:00'),
    (6, 'Hallituksen kokous: Talous', 'Seuran taloustilanteen ja budjetin läpikäynti.', '2026-06-20 18:00:00', '2026-06-20 20:00:00'),
    (6, 'Rullahiihtoleiri II', 'Toinen rullahiihtoleiri painottaen pitkiä kestävyysharjoituksia.', '2026-07-10 10:00:00', '2026-07-12 16:00:00'),
    (6, 'Valmennusseminaari', 'Valmentajille ja vanhemmille suunnattu luento hiihtoharjoittelun uusimmista opeista.', '2026-08-05 17:30:00', '2026-08-05 19:30:00'),
    (6, 'Perinteisen tyylin harjoitus', 'Erityisesti perinteisen tekniikkaan keskittyvä harjoitus ulkona.', '2026-09-01 16:00:00', '2026-09-01 17:30:00'),
    (6, 'Varustepäivä ja suksihuolto-opastus', 'Varusteiden hankinta ja opastus suksien oikeaoppiseen huoltoon.', '2026-10-03 11:00:00', '2026-10-03 13:00:00'),
    (6, 'Lumen odotus -tilaisuus', 'Epävirallinen seuratapaaminen ja kauden tavoitteiden asettaminen ennen talvea.', '2026-11-06 18:30:00', '2026-11-06 20:30:00'),

    -- Neropatit
    (7, 'Avaruuden Lait - Seminaari', 'Fysiikan syvin luotaus ja keskustelu kvanttimekaniikan ja kosmologian risteyksestä.', '2026-11-10 14:00:00', '2026-11-10 17:00:00'),
    (7, 'Tekoälyn Eettinen Kehys', 'Neropatit-ryhmän pohdinta tekoälyn tulevaisuudesta ja sen eettisistä reunaehdoista.', '2026-11-15 10:00:00', '2026-11-15 12:30:00'),
    (7, 'Koodausmaraton: Ratkaise Ratkaiseva', 'Intensiivinen koodaussessio äärimmäisen monimutkaisen ongelman ratkaisemiseksi.', '2026-11-20 09:00:00', '2026-11-20 18:00:00'),
    (7, 'Filosofinen Debatti: Todellisuuden Rakenne', 'Syvällinen keskustelu tietoisuuden ja objektiivisen todellisuuden luonteesta.', '2026-11-25 18:00:00', '2026-11-25 20:00:00'),
    (7, 'Matematiikan Eleganssi', 'Esitys ja keskustelu kauneimmista matemaattisista todistuksista ja teorioista.', '2026-11-30 15:00:00', '2026-11-30 17:00:00'),
    (7, 'Mielen Kartat ja Neurotiede', 'Tutkimus ihmisen aivojen toiminnasta, muistista ja oppimisesta.', '2026-12-05 11:00:00', '2026-12-05 13:00:00'),
    (7, 'Tieteen Historialliset Mysteerit', 'Tarkastelussa tieteen historian ratkaisemattomat ja kiehtovimmat tapaukset.', '2026-12-10 16:30:00', '2026-12-10 18:30:00'),
    (7, 'Futuristinen Teknologiavisio', 'Pitkän aikavälin spekulaatio tulevaisuuden mullistavimmista keksinnöistä.', '2026-12-15 09:30:00', '2026-12-15 11:30:00'),
    (7, 'Talviakatemian Lukupiiri', 'Klassisen tieteellisen tai filosofisen teoksen analyysi ja purkaminen.', '2026-12-20 13:00:00', '2026-12-20 15:00:00'),
    (7, 'Vuoden 2026 Yhteenveto', 'Ryhmän omien oppimiskokemusten ja saavutusten kriittinen arviointi.', '2026-12-27 10:00:00', '2026-12-27 12:00:00');

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