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
		//if element does not exist in DB
		if ($collection->count(array('data.id'=> $json[$i]->data->id)) == 0){
			$collection->insert($json[$i]); //insert
		}
		else{
			//Element already exists, update.
			$collection->update(array('data.id'=> $json[$i]->data->id),$json[$i]);
		}
	}
	
	echo "ok";

	//echo "x: ", $json[0]->position->x," y: ", $json[0]->position->y ; //YAAAY
?>


	