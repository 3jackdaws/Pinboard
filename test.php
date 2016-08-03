<?php
/**
 * Created by PhpStorm.
 * User: ian
 * Date: 7/22/16
 * Time: 9:45 PM
 */
set_include_path(realpath($_SERVER['DOCUMENT_ROOT']) . '/assets/php');
require_once 'Account.php';
require_once 'Pinboard.php';


$user = new Account(null);
$t = $user->getTokenFromCredentials("3jackdaws", "Testpassword1");

$user = new Account($t);
$new = Pinboard::createBoard("NEW2");
$user->takeOwnershipOf($new);
//$board = new Pinboard("4F953E59-8570-41BF-B466-F5BF5542A6D9");
//$board->addParticipant($user->getUName());
//$board->addParticipant("bob");
//$board->addParticipant("cryotech");
//$board->removeParticipant("3jackdaws");
