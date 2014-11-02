<?php
	$servername = "localhost";
	$username = "root";
	$password = "root";
	$dbname = "culture_wp";

	//create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	
	//check connection
	if(mysqli_connect_errno()) {
		echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}

	$time = (string)$_POST['time'];
	$time = strtotime($time);
	$time = date("Y-m-d H:i:s", $time);

	$first_name =  mysqli_real_escape_string($conn, $_POST['first_name']);
	$last_name =  mysqli_real_escape_string($conn, $_POST['last_name']);
	$manager =  mysqli_real_escape_string($conn, $_POST['manager']);
	$region = mysqli_real_escape_string($conn, $_POST['region']);
	$group =  mysqli_real_escape_string($conn, $_POST['group']);
	$commitment =  mysqli_real_escape_string($conn, $_POST['commitment']);
	$story =  mysqli_real_escape_string($conn, $_POST['story']);
	$photo_url =  mysqli_real_escape_string($conn, $_POST['photo_url']);

	$sql = "INSERT INTO `wp_catalyst_featured` (`uid`, `first_name`, `last_name`, `region`, `group`, `commitment`, `manager`, `photo_url`, `story`) VALUES ('$time', '$first_name', '$last_name', '$region', '$group', '$commitment', '$manager', '$photo_url', '$story');";

	mysqli_query($conn,$sql);


	$conn->close();
?>