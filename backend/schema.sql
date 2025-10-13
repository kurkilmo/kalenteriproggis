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
    ("Topia"),
    ("Jaana"),
    ("Essi"),
    ("Jasmin")