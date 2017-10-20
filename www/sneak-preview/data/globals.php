<?php
    $GLOBALS['intended_environment'] = 'Staging';
	
	$GLOBALS['root_url'] = ($GLOBALS['intended_environment'] == 'Staging') ? 'https://www.mynyte.co.uk/staging/': 'https://www.mynyte.co.uk/live/';
?>
