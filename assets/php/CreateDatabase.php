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
guid VARCHAR (38),
username VARCHAR (32),
fullname VARCHAR (64),
token VARCHAR (60),
passwd VARCHAR(60)
);");
echo "<br><br>";
$db->query("CREATE TABLE boards
(
guid VARCHAR (38),
name VARCHAR (64),
owner VARCHAR (38),
participants VARCHAR (20000),
data TEXT (65565)
);");
echo "<br><br>";
$db->query("CREATE TABLE modules
(
guid VARCHAR (38),
type VARCHAR (64),
belongs_to VARCHAR (38),
data TEXT (65400)
);");