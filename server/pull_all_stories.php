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

	// $firstname = ucfirst(strip_tags(mysqli_real_escape_string($connection, $_POST['first_name'])));	
	// $lastname = ucfirst(strip_tags(mysqli_real_escape_string($connection, $_POST['last_name'])));
	// $region = strip_tags(mysqli_real_escape_string($connection, $_POST['region']));
	// $group = strip_tags(mysqli_real_escape_string($connection, $_POST['group']));
	// $commitment = sha1(strip_tags(mysqli_real_escape_string($connection, $_POST['card'])));

	$sql = "SELECT * FROM wp_catalyst_commitment";
	$result = mysqli_query($conn, $sql);

	$i = 0;
	while($r = mysqli_fetch_assoc($result)) {
	    $rows[$i] = $r;
	    $i++;
	}
	
	echo json_encode($rows);
	$conn->close();
?>