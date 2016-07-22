<?php

/**
 * Created by PhpStorm.
 * User: ian
 * Date: 7/11/16
 * Time: 2:10 PM
 */

/**
 * Class Module
 * Base class for modules
 */
set_include_path(realpath($_SERVER['DOCUMENT_ROOT']) . '/assets/php');
require_once 'Database.php';

class Pinboard
{
    protected $_module_data = [];
    public static function get($guid){
        $sql = "SELECT * FROM boards WHERE guid=:guid;";
        $statement = Database::connect()->prepare($sql);
        $statement->bindParam(':guid', $guid);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC)[0];
        $result['data'] = json_decode($result['data']);
        return $result;
    }

    public static function update($guid, $data){
        $name = $data['name'];
        $owner = $data['owner'];
        $participants = $data['participants'];
        $data_json = json_encode($data['data']);
        $sql = "INSERT INTO boards (guid, name, owner, participants, data) VALUES(:guid, :name, :owner, :part, :data) ON DUPLICATE KEY UPDATE guid=:guid, name=:name, owner=:owner, participants=:part, data=:data;";
        $statement = Database::connect()->prepare($sql);
        $statement->bindParam(':guid', $guid);
        $statement->bindParam(':name', $name);
        $statement->bindParam(':owner', $owner);
        $statement->bindParam(':part', $participants);
        $statement->bindParam(':data', $data_json);
        return $statement->execute();
    }

    public static function delete($guid){
        $sql = "DELETE FROM boards WHERE guid=:guid;";
        $statement = Database::connect()->prepare($sql);
        $statement->bindParam(':guid', $guid);
        $statement->execute();
    }

    public function processIncomingModule($module){
        return $module;
    }

    public function processOutgoingModule($module){
        return $module;
    }
}