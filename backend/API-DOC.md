# Rajapinnan dokumentaatio
Ajantasainen ainakin committiin [39f1513](https://github.com/kurkilmo/kalenteriproggis/commit/39f15130f7f3e3e328d64912385c0091752873a5) asti.

## Kirjautuminen
### `GET /api/login/`
#### Pyyntö:
Vaatii [Basic](https://en.wikipedia.org/wiki/Basic_access_authentication)-tunnistautumisheaderin:
```
Authorization: Basic UGVra2E6a2lzc2ExMjM=
```
Tunnistautumiskoodi on Base64-enkoodattu merkkijono `käyttäjänimi:salasana`.

#### Vastaus:
-   `401`: Salasana tai käyttäjänimi on väärä:
    ```json
    {
        "error": "invalid username or password"
    }
    ```
-   `200`: Kirjautuminen onnistui
    Vastaus asettaa evästeen `token`, jonka avulla käyttäjä tunnistetaan myöhemmistä pyynnöistä

---
### Kirjautumista vaativien pyyntöjen virheviestit
Kaikki kirjautumista vaativat endpointit vastaavat samalla tavalla kirjautumisen puuttuessa tai `token`-cookien ollessa vääränlainen:
#### `401`
```json
{
    "error": "no authorization provided"
}
```
tai
```json
{
    "error": "invalid token"
}
```
Jos tokeniin liittyvää käyttäjää ei ole:
```json
{
    "error": "you don't exist"
}
```
---
## Käyttäjät
### `GET /api/users/`
Hakee kaikki käyttäjät.
#### Vastaus:
-   `200`:
    ```json
    [
        {
          "id": 6,
          "username": "Essi"
        },
        {
          "id": 1,
          "username": "Heikki"
        },
        ...
    ]
    ```
---
### `POST /api/users/`
Luo uuden käyttäjän.
#### Pyyntö:
Body:
```json
    {
        "username": "käyttäjänimi",
        "password": "salasana"
    }
```

#### Vastaus:
-   `201`: Käyttäjä luotiin onnistuneesti
-   `403`: Saman niminen käyttäjä on jo olemassa:
    ```json
    {
        "error": "user exists",
        "username": "käyttäjänimi"
    }
    ```
---
### `GET /api/users/<id>`
Hakee yksittäisen käyttäjän tiedot id:llä.
#### Vastaus:
-   `200`:
    ```json
    {
        "id": 6,
        "username": "Essi"
    }
    ```
-   `404`: Pyydettyä käyttjä-id:tä ei löydy.
---
## Oman käyttäjän tiedot:
Kaikki `/api/me/*`-pyynnöt vaativat kirjautumisen (=token-evästeen)
### `GET /api/me`
#### Vastaus:
-   `200`
    ```json
    {
        "id": 2,
        "username": "Pekka"
    }
    ```
---
### `GET /api/me/events/`
Hakee oman käyttäjän tapahtumat
#### Vastaus:
-   `200`:
    ```json
    [
        {
            "id": 21,
            "owner_id": 2,
            "title": "Haamukoodin debuggaus",
            "summary": "Vanhojen, vaikeasti jäljitettävien virheiden (\"haamukoodi\")   korjaaminen.",
            "start": "2025-11-10T08:00:00.000Z",
            "end": "2025-11-10T10:00:00.000Z",
            "color": "#512DA8"
        },
        {
            "id": 22,
            "owner_id": 2,
            "title": "Syväsukellus arkkitehtuuriin",
            "summary": "Kriittisen järjestelmän arkkitehtuurin perusteellinen   tarkastelu.",
            "start": "2025-11-11T12:00:00.000Z",
            "end": "2025-11-11T14:30:00.000Z",
            "color": "#673AB7"
        },
        ...
    ]
    ```
---
### `GET /api/me/groups/`
Hakee ryhmät, joihin käyttäjä kuuluu.
#### Vastaus:
-   `200`:
    ```json
    [
        {
            "id": 3,
            "name": "Kummitukset"
        },
        {
            "id": 7,
            "name": "Omituisten otusten kerho"
        }
    ]
    ```
---
## Tapahtumat
### `GET /api/events/`
Hakee kaikki tapahtumat.
**Toiminta muuttunee tulevaisuudessa, ei vaikuta järkevältä että kuka tahansa näkee kaikki tapahtumat**
#### Vastaus:
-   `200`:
    ```json
    [
        {
            "id": 1,
            "owner_id": 1,
            "title": "Viikkopalaveri",
            "summary": "Sammakot-ryhmän viikoittainen tilannekatsaus ja seuraavien askeleiden suunnittelu.",
            "start": "2025-10-21T07:00:00.000Z",
            "end": "2025-10-21T08:30:00.000Z",
            "color": "#1976D2"
        },
        ...
    ]
    ```
---
## Ryhmät
Kaikki `/api/groups/*`-pyynnöt vaativat kirjautumisen (=token-evästeen).
### `GET /api/groups/`
Hakee kaikki ryhmät. Mukana tulee ryhmiin kuuluvat käyttäjät.
#### Vastaus:
-   `200`:
    ```json
    [
        {
          "id": 1,
          "name": "Sammakot",
          "members": [
            {
              "id": 1,
              "username": "Heikki"
            },
            {
              "id": 3,
              "username": "Matti"
            }
          ]
        },
        ...
    ]
    ```
---
### `GET /api/groups/<id>`
Hakee yksittäisen ryhmän tiedot.
#### Vastaus:
-   `200`:
    ```json
    {
        "id": 10,
        "owner_id": 7,
        "name": "Neropatit"
    }
    ```

**Endpoint ei anna vielä virhekoodia, jos ryhmää ei löydy. Ryhmän käyttäjiäkään ei lukeudu vastaukseen, voisi varmaan lisätä**

---
### GET `/api/groups/<id>/events/`
Hakee yksittäisen ryhmän tapahtumat.
#### Vastaus:
-   `200`:
    ```json
    [
        {
            "id": 91,
            "owner_id": 8,
            "title": "Aamun ajatushaaste",
            "summary": "Päivittäinen looginen pulma tiimille.",
            "start": "2026-02-03T07:00:00.000Z",
            "end": "2026-02-03T07:30:00.000Z",
            "color": "#4CAF50",
            "event_id": 91,
            "group_id": 10
        },
        ...
    ]
    ```
-   `404`: Ryhmää ei löydy
---
### `POST /api/groups/`
Luo uuden ryhmän. Uuden ryhmän omistaja on ryhmän luova käyttäjä,
ja luova käyttäjä kuuluu automaattisesti ryhmään.
#### Pyyntö:
Body:
```json
{
  "name": "Juopot" // Luotavan ryhmän nimi
}
```
#### Vastaus:
-   `201`: Ryhmä luotiin onnistuneesti.
    *(Muuttuu ehkä jatkossa palauttamaan myös luodun ryhmän id:n)*
-   `400`: Uuden ryhmän nimi puuttuu pyynnöstä:
    ```json
    {
        "error": "No group name provided"
    }
    ```
---
### `POST /api/groups/<id>/members`
Lisää ryhmään uuden käyttäjän.
#### Pyyntö:
Body:
```json
{
    "userId": 3 // Lisättävän käyttäjän id
}
```
#### Vastaus:
-   `201`: Käyttäjä lisättiin onnistuneesti
-   `400`: Lisättävän käyttäjän id:tä ei annettu:
    ```json
    { "error": "No new userId provided" }
    ```
-   `404`: Ryhmää ei löydy, johon yritetään lisätä:
    ```json
    { "error": "Group id <id> not found" }
    ```
-   `403`: Lisäävä käyttäjä ei ole ryhmän omistaja:
    ```json
    { "error": "You are not the group's owner" }
    ```
-   `403`: Lisättävä käyttäjä on jo ryhmässä:
    ```json
    { "error": "User is already a member of the group" }
    ```
---
### `DELETE /api/groups/<id>`
Poistaa ryhmän.
#### Vastaus:
-   `204`: Ryhmä poistettu onnistuneesti.
-   `404`: Poistettavaa ryhmää ei löydy:
-   `403`: Poistava käyttäjä ei omista ryhmää:
    ```json
    { "error": "You don't own this grop" }
    ```
    Siinä on typo, mutta olkoot.