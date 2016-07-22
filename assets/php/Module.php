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

abstract class Module
{
    protected $_module_data = [];
    public function get($guid){
        $sql = "SELECT * FROM modules WHERE guid=:guid;";
        $statement = Database::connect()->prepare($sql);
        $statement->bindParam(':guid', $guid);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC)[0];
        $result['data'] = json_decode($result['data']);
        return $result;
    }

    public function update($guid, $class, $data){
        $sql = "INSERT INTO modules (guid, type, belongs_to, data) VALUES(:guid, :type, :belongs_to, :data) ON DUPLICATE KEY UPDATE    
                type=:type, belongs_to=:belongs_to, data=:data;";
        $data_json = json_encode($data);
        $statement = Database::connect()->prepare($sql);
        $statement->bindParam(':guid', $guid);
        $statement->bindParam(':type', $class);
        $statement->bindParam(':belongs_to', $belongs_to);
        $statement->bindParam(':data', $data_json);
        return $statement->execute();
    }

    public function delete($guid){
        $sql = "DELETE FROM modules WHERE guid=:guid;";
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