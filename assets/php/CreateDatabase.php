<?php
/**
 * Created by PhpStorm.
 * User: ian
 * Date: 7/11/16
 * Time: 10:45 AM
 */

$db = new PDO('mysql:host=localhost;dbname=pinboard', "pinboard", '');
$db->query("CREATE TABLE users
(
username VARCHAR (32) NOT NULL UNIQUE,
fullname VARCHAR (64),
token VARCHAR (60),
passwd VARCHAR(60),
owned_boards VARCHAR(4000),
participates_in VARCHAR(4000),
PRIMARY KEY (username)
);");
echo "<br><br>";
$db->query("CREATE TABLE boards
(
guid VARCHAR (38) NOT NULL UNIQUE,
name VARCHAR (64),
owner VARCHAR (38),
participants VARCHAR (20000),
updated TIMESTAMP,
data TEXT (65565),
PRIMARY KEY (guid)
);");
echo "<br><br>";
$db->query("CREATE TABLE modules
(
guid VARCHAR (38) NOT NULL UNIQUE,
name VARCHAR (32),
type VARCHAR (64),
belongs_to VARCHAR (38),
updated TIMESTAMP, 
data TEXT (65400),
PRIMARY KEY (guid)
);");