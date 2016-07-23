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
        $real_data['modules'] = $data['modules'];
        $real_data['config'] = $data['config'];
        $data_json = json_encode($real_data);
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

    public function load($guid){
        $this->_module_data = self::get($guid);
    }

    public function processIncomingModule($module){
        return $module;
    }

    public function processOutgoingModule($module){
        return $module;
    }

    private function writeModules($guid){
        foreach($this->_module_data['data']['modules'] as $mod){
            $module = Module::get($mod);
            
        }
    }

    public static function writeBase($mod_id){
        ?>

        <div id="board" class="pinboard">
            <div id="dim" class="cover" onclick="board.addModule()"></div>
            <div class="col-lg-6 add-mod-modal">
                <div class="container">
                    <div class="col-lg-3" style="border-right: 1px solid lightgrey">
                        <h3>Module Type</h3>
                        <form>
                            <label name="stickynote">StickyNote</label>
                            <input type="radio" name="StickyNote" checked>
                        </form>
                    </div>
                    <div class="col-lg-3">
                        <h3>Module Configuration</h3>
                        <table class="config">
                            <tr>
                                <td class="td-a" onclick="board.selectTD(this)">
                                    
                                </td>
                                <td class="td-b" onclick="board.selectTD(this)">

                                </td>
                            </tr>
                            <tr>
                                <td class="td-b" onclick="board.selectTD(this)">

                                </td>
                                <td class="td-a" onclick="board.selectTD(this)">

                                </td>
                            </tr>
                        </table>
                        <button class="btn btn-primary" onclick="board.checkUIConfig()">Add Module</button>
                    </div>
                </div>
            </div>
        </div>
        <script>
            var board=new Pinboard('<?=$mod_id?>');
        </script>
        <?php
    }
}