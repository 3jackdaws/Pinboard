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


class Module
{
    private $_module_data = [];
    public function save(){
        $sql = "INSERT INTO modules (guid, type, belongs_to, data) VALUES(:guid, :type, :belongs_to, :data) ON DUPLICATE KEY UPDATE    
                type=:type, belongs_to=:belongs_to, data=:data;";
        $statement = Database::connect()->prepare($sql);
        $statement->bindParam(':guid', $this->_board_data['guid']);
        $statement->bindParam(':type', $this->_board_data['type']);
        $statement->bindParam(':belongs_to', $this->_board_data['belongs_to']);
        $statement->bindParam(':data', json_encode($this->_board_data['data']));
        $statement->execute();
    }
}