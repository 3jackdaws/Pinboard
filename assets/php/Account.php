<?php

/**
 * Created by PhpStorm.
 * User: ian
 * Date: 7/28/16
 * Time: 10:48 AM
 */
set_include_path(realpath($_SERVER['DOCUMENT_ROOT']) . '/assets/php');
require_once 'Database.php';

class Account
{
    protected $user;
    protected $database;

    public function __construct($token)
    {
        if($token){
            $sql = "SELECT * FROM users WHERE token=:token;";
            $statement = Database::connect()->prepare($sql);
            $statement->bindParam(':token', $token);
            $statement->execute();
            $this->user = $statement->fetchAll(PDO::FETCH_ASSOC)[0];
            $this->user['owned_boards'] = json_decode($this->user['owned_boards']);
            $this->user['participates_in'] = json_decode($this->user['participates_in']);
            if(!is_array($this->user['owned_boards'])){
                $this->user['owned_boards'] = [];
            }
            if(!is_array($this->user['participates_in'])){
                $this->user['participates_in'] = [];
            }
        }
    }

    public function setUser($name = null, $pass = null, $fullname = null){
        if($name){
            $this->user['name'] = $name;
        }
        if($pass){
            $this->user['pass'] = password_hash($pass, PASSWORD_BCRYPT);
        }
        if($fullname){
            $this->user['fullname'] = $fullname;
        }
    }

    public function generateToken(){
        if($this->user['pass']){
            $this->user['token'] = password_hash($this->user['pass'] ^ rand(0, PHP_INT_MAX), PASSWORD_BCRYPT);
            return $this->user['token'];
        }else{
            return false;
        }
    }

    public function getTokenFromCredentials($user, $pass){
        sleep(1);
        $sql = "SELECT token, passwd FROM users WHERE username=:user;";
        $statement = Database::connect()->prepare($sql);
        $statement->bindParam(':user', $user);
        $statement->execute();
        $this->user = $statement->fetchAll(PDO::FETCH_ASSOC)[0];
        if(password_verify($pass, $this->user['passwd'])){
            return $this->user['token'];
        }else{
            return null;
        }

    }

    public function save(){
        $user = $this->user['username'];
        $fullname = $this->user['fullname'];
        $token = $this->user['token'];
        $passwd = $this->user['passwd'];
        $owned = json_encode($this->user['owned_boards']);
        $part = json_encode($this->user['participates_in']);

        $sql = "INSERT INTO users (username, fullname, token, passwd, owned_boards, participates_in) VALUES(:user, :fullname, :token, :passwd, :own, :part) ON DUPLICATE KEY UPDATE username=:user, fullname=:fullname, token=:token, passwd=:passwd, owned_boards=:own, participates_in=:part;";
        $statement = Database::connect()->prepare($sql);
        $statement->bindParam(':user', $user);
        $statement->bindParam(':fullname', $fullname);
        $statement->bindParam(':token', $token);
        $statement->bindParam(':passwd', $passwd);
        $statement->bindParam(':own', $owned);
        $statement->bindParam(':part', $part);
        return $statement->execute();
    }

    public function getUName(){
        return $this->user['username'];
    }

    public function getFName(){
        return $this->user['fullname'];
    }

    public function getToken(){
        return $this->user['token'];
    }

    public function writeJSVars(){
        $vars = [];
        $vars['uname'] = $this->user['username'];
        $vars['ufullname'] = $this->user['fullname'];
        $vars['utoken'] = $this->user['token'];
        $vars['boards'] = $this->user['participates_in'];
        $vars['bnames'] = [];
        foreach($this->user['participates_in'] as $board)
            $vars['bnames'][] = Pinboard::nameOf($board);
        return "<script>var user = " . json_encode($vars) . ";</script>";
    }

    public function getBoardsWhereParticipant(){
        return $this->user['participates_in'];
    }

    /**
     * @param $board_id
     * Checks to see if the user owns the board id provided
     * @return boolean
     */
    public function owns($board_id){
        return array_search($board_id, $this->user['owned_boards']) != false;
    }

    public function particpatesIn($board_id){
        return array_search($board_id, $this->user['participant_in']) != false;
    }

    /**
     * @param $board_id
     * Adds a board id to the list of boards this user has ownership of
     * @return boolean
     */
    public function takeOwnershipOf($board_id){
        $val = array_search($board_id, $this->user['owned_boards']) == false;
        error_log($val);
        if($val){
            $board = new Pinboard($board_id);
            $board->setOwner($this->user['username']);
            $board->addParticipant($this->user['username']);
            $board->save();

            $this->user['owned_boards'][] = $board_id;
            $this->user['participates_in'][] = $board_id;
            $this->save();
        }
        return false;
    }
}