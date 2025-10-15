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
    event_name VARCHAR(255) NOT NULL,
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
    (10, 6)
