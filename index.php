<!DOCTYPE html>
<?php
include('dbconn.php');
?>
<html>
<head>
	<title>Whack A CS Student! Limited Time Offer</title>
	<link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro' rel='stylesheet' type='text/css'>
	<link href="index.css" rel="stylesheet" type="text/css">
</head>
<body>
<center>
<h1>
<?php 
	$queryscore = mysql_query("SELECT * FROM users");
	$max = 0; 
	$userwith = '';
	while($sc = mysql_fetch_array($queryscore)) {
		$thehighscore = $sc['score'];
		if($thehighscore > $max) {
			$max = $thehighscore;
			$userwith = $sc['username'];
		}
	}
	if($userwith == '') {
		echo 'No high score yet!';
	}
	else {
		echo 'The highest score is' , $thehighscore , ' by: ' , $userwith;
	}
?>
</h1>
<div id="contents">
<form action="index.php" method="POST">
	<input name="username" id="username" type="text" placeholder="Enter your username...">
	<input name="thebutton" id="thebutton" type="submit" value="Play!">
</form>
</div>
</center>
</body>
<footer>Created by Cameron Bernhardt and Kamil Ali</footer>
</html>
<?php
if($_POST['thebutton']) {
	$bool = true;
	$username = $_GET['username'];
	$query_for_points = mysql_query("SELECT * FROM users");
	while($row = mysql_fetch_array($query_for_points)) {
		$table_user = $row['username'];
		if($table_user == $username) {
			$currscore = $row['score'];
		}
		else {
			$bool = false;
		}
	}
	if($bool) {
		$_SESSION['user'] = $username;
		header("whack.php?score=$currscore&user=$username");
	}
	else {
		$currscore = 0; 
		mysql_query("INSERT INTO users(username, score) VALUES('$username', '$currscore')");
		$_SESSION['user'] = $username;
		header("whack.php?score=$currscore&user=$username");
	}
}
?>