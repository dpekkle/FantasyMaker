<?php
	//get JSON from POST
	$json = json_decode(file_get_contents('php://input'));
	
	// connect to mongodb
	$m = new MongoClient();
		
	// select a database
	$db = $m->FM_graph;
	
	//select collection (ie a table within db)
	$collection = $db->createCollection("graph");
	
	//for all elements in JSON
	for ($i = 0; $i < count($json); $i++){
		$collection->remove(array('data.id'=> $json[$i]->data->id));
	}

	echo "ok";
?>


	