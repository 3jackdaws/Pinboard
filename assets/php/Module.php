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

    public abstract function update($guid, $class, $data);

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