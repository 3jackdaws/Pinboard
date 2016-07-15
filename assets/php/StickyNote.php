<?php

/**
 * Created by PhpStorm.
 * User: ian
 * Date: 7/14/16
 * Time: 9:24 AM
 */
set_include_path(realpath($_SERVER['DOCUMENT_ROOT']) . '/assets/php');
require 'Module.php';

class StickyNote extends Module
{
    public function update($guid, $class, $data){
        
        $sql = "INSERT INTO modules (guid, type, belongs_to, data) VALUES(:guid, :type, :belongs_to, :data) ON DUPLICATE KEY UPDATE    
                type=:type, belongs_to=:belongs_to, data=:data;";
        $data_json = json_encode($data);
        $statement = Database::connect()->prepare($sql);
        $statement->bindParam(':guid', $guid);
        $statement->bindParam(':type', $class);
        $statement->bindParam(':belongs_to', $belongs_to);
        $statement->bindParam(':data', $data_json);
        $statement->execute();
    }

    private function normalizeZIndex($module){

    }

    private function parseModule($module){
        $this->_module_data = $module;
    }
}