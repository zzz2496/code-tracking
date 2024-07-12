<?php
	function cr($data){
		print '<pre>';
		print_r($data);
		print '</pre>';
	}
	cr($_REQUEST);
?>