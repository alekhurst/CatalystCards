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

	$first_name =  mysqli_real_escape_string($conn, $_POST['first_name']);
	$last_name =  mysqli_real_escape_string($conn, $_POST['last_name']);
	$manager =  mysqli_real_escape_string($conn, $_POST['manager']);
	$region = mysqli_real_escape_string($conn, $_POST['region']);
	$group =  mysqli_real_escape_string($conn, $_POST['group']);
	$commitment =  mysqli_real_escape_string($conn, $_POST['commitment']);
	$story =  mysqli_real_escape_string($conn, $_POST['story']);
	$photo_url =  mysqli_real_escape_string($conn, $_POST['photo_url']);
	$work_type = mysqli_real_escape_string($conn, $_POST['work_type']);

	$sql = "INSERT INTO `wp_catalyst_commitment` (`uid`, `first_name`, `last_name`, `region`, `group`, `commitment`, `manager`, `photo_url`, `story`, `work_type`) VALUES (CURRENT_TIMESTAMP, '$first_name', '$last_name', '$region', '$group', '$commitment', '$manager', '$photo_url', '$story', '$work_type');";

	mysqli_query($conn,$sql);


	$conn->close();
?>