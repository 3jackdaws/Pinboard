<?php

/**
 * Created by PhpStorm.
 * User: Ian Murphy
 * Date: 7/10/2016
 * Time: 10:04 PM
 */
set_include_path(realpath($_SERVER['DOCUMENT_ROOT']) . '/assets/php');
require 'Database.php';


class Pinboard
{
    private $_connection;
    public function __construct(Database $database){
        $this->_connection = $database->connect();
    }

    public function addBoard($board_name, $owner_id){

    }
}