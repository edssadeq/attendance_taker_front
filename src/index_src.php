<?php
require_once __DIR__."/database/dbconnection.php";
//var_dump($_SESSION);

if(!isset($_SESSION['user']) || empty($_SESSION['user'])){
    //redirect if not login
    header("Location: ./views/login.php");
}
$loggedinUserName = explode("@", $_SESSION['user'])[0];