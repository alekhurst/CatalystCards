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
	$region = mysqli_real_escape_string($conn, $_POST['region']);
	$group =  mysqli_real_escape_string($conn, $_POST['group']);
	$commitment =  mysqli_real_escape_string($conn, $_POST['commitment']);
	$work_type = mysqli_real_escape_string($conn, $_POST['work_type']);

	$sql = "INSERT INTO `wp_catalyst_commitments` (`uid`, `first_name`, `last_name`, `region`, `group`, `commitment`, `work_type`) VALUES (CURRENT_TIMESTAMP, '$first_name', '$last_name', '$region', '$group', '$commitment', '$work_type');";

	mysqli_query($conn,$sql);


	$conn->close();
?>