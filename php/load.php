<?php
	// connect to mongodb
	$m = new MongoClient();
		
	// select a database
	$db = $m->FM_graph;
	
	//select collection-
	$collection = $db->createCollection("graph");
	
	//get all data from graph collection
	$cursor = $collection->find();
	
	//construct JSON via array.
	$i = 0;
	foreach($cursor as $obj){
			$return[$i] = array(
				'data'=>$obj['data'],
				'position'=>$obj['position'],
				'group'=>$obj['group'],
				'removed'=>$obj['removed'],
				'selected'=>$obj['selected'],
				'selectable'=>$obj['selectable'],
				'locked'=>$obj['locked'],
				'grabbable'=>$obj['grabbable'],
				'classes'=>$obj['classes']
			);
			$i++;
	}
   echo json_encode($return); //encode and return array
?>