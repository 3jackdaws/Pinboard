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
    protected $board = [];

    public function __construct($board_uid)
    {
        $this->board = self::get($board_uid);
        $this->board['participants'] = json_decode($this->board['participants']);
    }

    public function addParticipant($username){
        if(!isset($this->board['participants'])) $this->board['participants'] = [];
        if(array_search($username, $this->board['participants']) == false){
            $this->board['participants'][] = $username;
            return true;
        }
        return false;
    }

    public function removeParticipant($username){
        $new = array_diff($this->board['participants'], [$username]);
        if(count($this->board['participants']) - count($new) > 0){
            $this->board['participants'] = $new;
            return true;
        }
        return false;
    }

    public function setOwner($username){
        $this->board['owner'] = $username;
    }

    public function contains($haystack, $needle){
        if(is_array($this->board[$haystack])){
            return array_search($needle, $this->board[$haystack]) !== false;
        }else{
            return $this->board[$haystack] == $needle;
        }
    }

    public function save(){
        return self::update($this->board['guid'], $this->board);
    }

    public static function nameOf($board_guid){
        $sql = "SELECT name FROM boards WHERE guid=:guid LIMIT 1;";
        $statement = Database::connect()->prepare($sql);
        $statement->bindParam(':guid', $board_guid);
        $statement->execute();
        return $statement->fetch()[0];
    }

    public static function getBoardByNameAndUser($name, $user){
        $sql = "SELECT * FROM boards WHERE name=:name AND participants LIKE :user LIMIT 1;";
        $statement = Database::connect()->prepare($sql);
        $statement->bindParam(':guid', $board_guid);
        $statement->execute();
        return $statement->fetch()[0];
    }

    /**
     * Creates a new empty board and returns the Pinboard object
     * @return string
     */
    public static function createBoard($name){
        $data['name'] = $name;
        $guid = Database::getGUID();
        self::update($guid, $data);
        return $guid;
    }

    public static function boardExists($board_guid){
        $sql = "SELECT EXISTS (SELECT * FROM boards WHERE guid=:guid);";
        $statement = Database::connect()->prepare($sql);
        $statement->bindParam(':guid', $board_guid);
        $statement->execute();
        return boolval($statement->fetch()[0]);
    }

    public static function get($guid){
        $sql = "SELECT * FROM boards WHERE guid=:guid;";
        $statement = Database::connect()->prepare($sql);
        $statement->bindParam(':guid', $guid);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        if($result) $result = $result[0];
        else return null;
        $result['data'] = json_decode($result['data']);
        return $result;
    }

    public static function update($guid, $data){

        $name = $data['name'];
        $participants = json_encode($data['participants']);
        $owner = $data['owner'];
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
        $board = self::get($guid);
        
        ob_start();
        var_dump($board['data']->modules);

        $sql = "DELETE FROM modules WHERE guid=:guid;";
        $statement = Database::connect()->prepare($sql);

        foreach ($board['data']->modules as $mod){

            foreach ($mod as $type=>$uid) {
                $statement->bindParam(':guid', $uid);
                $statement->execute();
            }
        }

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


    public static function writeBase($mod_id){
        ?>

        <div id="board" class="pinboard">
            <div id="dim" class="cover" onclick="board.addModule()"></div>
<!-- Start Modal Definition -->
            <div class="add-mod-modal">
                <div class="row">
                    <div class="col-lg-6" style="position: relative">
                        <h3>Module Type</h3>
                        <form>
                            <label name="stickynote">StickyNote</label>
                            <input type="radio" name="StickyNote" checked>
                        </form>
                    </div>
                    <div class="col-lg-6" style="position: relative">
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
                    <div class="row">
                        <div class="col-lg-12">
                            <h3>Module Name</h3>
                            <input id="mod-name" class="form-control" placeholder="Module Name" style="max-width: 600px; margin: 0 auto;"/>
                        </div>

                    </div>


                </div>
            </div>
<!--    END MODAL        -->
        </div>
        <script>
            var board=new Pinboard('<?=$mod_id?>');
        </script>
        <?php
    }
}