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
    private $_board_data = [];
    private $_modules = [];

    public function __construct(){
        $this->_connection = Database::connect();
        $this->_board_data['guid'] = com_create_guid();
    }

    public static function getBoardByGUID($guid){
        $sql = "SELECT * FROM boards WHERE board_guid=:guid;";
        $statement = Database::connect()->prepare($sql);
        $statement->bindParam(':guid', $guid);
        $statement->execute();
        $results = $statement->fetchAll(PDO::FETCH_ASSOC);
        var_dump($results);
    }

    public function save(){
        $sql = "INSERT INTO boards (guid, name, owner, participants, data) VALUES(:guid, :name, :owner, :part, :data) ON DUPLICATE KEY UPDATE    
                name=:name, owner=:owner, participants=:part, data=:data;";
        $statement = Database::connect()->prepare($sql);
        $statement->bindParam(':guid', $this->_board_data['guid']);
        $statement->bindParam(':name', $this->_board_data['name']);
        $statement->bindParam(':owner', $this->_board_data['owner']);
        $statement->bindParam(':part', json_encode($this->_board_data['part']));
        $statement->bindParam(':data', json_encode($this->_board_data['data']));
        $statement->execute();
    }

    public function setBoardName($name){
        $this->_board_data['name'] = $name;
    }
    
    public function setOwner($owner_guid){
        $this->_board_data['owner'] = $owner_guid;
        if(array_search($owner_guid, $this->_board_data['participants']) == false){
            $this->_board_data['participants'][] = $owner_guid;
        }
    }

    public function addParticipant($p_guid){
        if(array_search($p_guid, $this->_board_data['participants']) == false){
            $this->_board_data['participants'][] = $p_guid;
        }
    }

    public function addModule($module_guid){
        $this->_modules[] = $module_guid;
    }

    public static function boardExists($board_guid){
        $sql = "SELECT * FROM boards WHERE guid=:guid;";
        $statement = Database::connect()->prepare($sql);
        $statement->bindParam(':guid', $board_guid);
        $statement->execute();
        $results = $statement->fetchAll(PDO::FETCH_ASSOC);
        return count($results) > 0;
    }
}