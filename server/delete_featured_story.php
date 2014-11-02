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

	$featured_id = (string)$_POST['featured_id'];
	$featured_id = strtotime($featured_id);
	$featured_id = date("Y-m-d H:i:s", $featured_id);

	$sql = "DELETE FROM wp_catalyst_featured WHERE uid= '$featured_id' ";
	
	$result = mysqli_query($conn, $sql);

	$conn->close();
?>