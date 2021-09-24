<?php
$pdo_conn = null;
require_once __DIR__."/database/dbconnection.php"; //$pdo_conn

//get post request
//validate email
// search it in data base error if not exist
// compare password error if not the same

$email = "";
$password = "";
$errors = ["email"=>"", "password"=>""];


// TODO: delete this
//var_dump($_SESSION);

if($_SERVER['REQUEST_METHOD'] == 'POST'){
    if((!isset($_POST['email'])) || !isset($_POST["password"])){
        $errors = ["email"=>"Please enter your email !", "password"=>"Please enter your password"];
//        exit();
    }else{
        $email = trim($_POST['email']);
        $password = trim($_POST["password"]);

        if(empty($email) || empty($password)){
            $errors = ["email"=>"Please enter your email !", "password"=>"Please enter your password"];
        }else{
            $errors = validateLogIn($pdo_conn, $email, $password);
            if(count($errors)<=0){
                $_SESSION['user']=$email;
                $_SESSION['loggedin'] = true;
                header("Location: ../index.php");
            }
        }
    }
}

function validateLogIn($db, $input_email, $input_password): array{
    $result = getUserByEmail($db, $input_email);
    //var_dump($result);
    if($result){
        if(compairePassword($result, $input_password)) return [];
        else return ["email"=>"", "password"=>"Password is not correct!"];
    }
    else return ["email"=>"Email not found!", "password"=>""];
}

function getUserByEmail($db, $email){
    $sql = "SELECT * FROM `user_table` WHERE `USERNAME`= :USERNAME";
    $statment = $db->prepare($sql);
    $statment->execute([":USERNAME"=> $email]);
    $result = $statment->fetchAll(PDO::FETCH_ASSOC);
    return $result[0] ?? $result;
}

function compairePassword($user, $input_password){
    if($user['PASSWORD'] == $input_password) return true;
    else return  false;
}
