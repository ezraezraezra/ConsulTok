<?php
/*
 * Project: ConsulTok
 * Description: E-commerce social shopping web app featuring the OpenTok & ShopSense APIs.
 * 
 * Author: Ezra Velazquez
 * Website: http://ezraezraezra.com
 * Date: July 2011
 * 
 */
require 'sdk/OpenTokSDK.php';

$a = new OpenTokSDK(API_Config::API_KEY,API_Config::API_SECRET);
$the_token = $a->generate_token('234070a745e67636ce6823cb951a9f81f7e1e6ed', RoleConstants::MODERATOR);
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="description" content="Live video stream to consult with your friends over shopping" />
<meta name="keywords" content="OpenTok TokBox ShopSense API" />
<meta name="author" content="Ezra Velazquez" />
<!--

 _____                       _ _____     _    
/  __ \                     | |_   _|   | |   
| /  \/ ___  _ __  ___ _   _| | | | ___ | | __
| |    / _ \| '_ \/ __| | | | | | |/ _ \| |/ /
| \__/\ (_) | | | \__ \ |_| | | | | (_) |   < 
 \____/\___/|_| |_|___/\__,_|_| \_/\___/|_|\_\
 
-->
<title>ConsulTok</title>
<script src="http://static.opentok.com/v0.91/js/TB.min.js" type="text/javascript" charset="utf-8"></script>
<script type="text/javascript" src="js/main.js"></script>
<script type="text/javascript" src="js/tb.js"></script>
<script type="text/javascript" src="io/dist/socket.io.js"></script>
<script type="text/javascript" src="js/jquery-1.5.1.min.js"></script>
<link type="text/css" href="css/jquery-ui-1.8.14.custom.css" rel="stylesheet" />
<script type="text/javascript" src="js/jquery-ui-1.8.14.custom.min.js"></script>
<script type="text/javascript">
	var socket;
	var token = "<?php echo $the_token; ?>";
	var private_array = new Array();
	var public_output = "";
	$(document).ready(function() {
		start();
		connect();
	});
	
</script>
<link type="text/css" href="css/main.css" rel="stylesheet" />
</head>
<body>
	<div id="main_container">
		<div id="dialog-email" title="Email Your Shopping Notes">
			<form>
				<label for="email_to" class="labels">To:</label><br/>
				<input type="text" name="email_to" id="email_to" class="form_input" placeholder="customer@domain.com" /><br/><br/>
				<label for="email_from" class="labels">From:</label><br/>
				<input type="text" name="email_from" id="email_from" class="form_input" placeholder="consultant@domail.com" /><br/><br/><br/><br/>
			</form>
			<div id="form_instructions">Fill out the entries above<br/>to email your notes.</div>
		</div>
		<div id="title_container">
			ConsulTok
		</div>
		<div id="shop_container">
			<div id="private_container" class="top_container">
				<div id="private_container_left">
					<div id="private_label" class="view_labels">
						Private View
					</div>
					<form id="private_form">
						<label for="search_for" id="search_for_label" class="labels">Search for</label>
						<input type="text" name="search_for" id="search_query" placeholder="Dress, Heels, etc"/>
						<input type="button" value="search" id="search_button" class="left_button ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only left_button"/>
						<label for="notes" id="label_notes" class="labels">Notes</label>
						<textarea id="notes" placeholder="Write some notes"></textarea>
						<input type="button" value="email notes" id="email_notes" class="left_button ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only left_button"/>		
					</form>
				</div>
				<div id="private_container_right_holder">
					<div id="private_top"></div>
					<div id="private_container_right">
						<!-- Filled via JS -->
						<div id="intro_text_private">
							<p>Hello shoppers! This is the private view; only you can see what's on this pane.</p>
						</div>
					</div>
					<div id="private_bottom"></div>
				</div>
				<div id="private_slider_container">
					<div id="private_result_slider"></div>
				</div>
			</div>
			<div id="public_container" class="top_container">
				<div id="public_label" class="view_labels">
						Public View
				</div>
				<div id="public_results_container">
					<div id="public_top"></div>
					<div id="public_results">
					<!-- Filled via JS -->
					<div id="intro_text_public">
						<p>This is the public view; anyone who's on this page can see what's posted here.</p>
					</div>
					</div>
					<div id="public_bottom"></div>
				</div>
				<div id="public_slider_container">
					<div id="result_slider"></div>
				</div>
			</div>
		</div>
		<div id="vid_container">
			<div id="camera_label" class="view_labels">
						Cameras
			</div>
			<div id="button_container">
				<input type="button" value="turn camera on" id="start_camera" class="left_button ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only left_button" onClick="javascript:startPublishing()"/>
				<input type="button" value="turn camera off" id="stop_camera" class="left_button ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only left_button" onClick="javascript:stopPublishing()"/>
			</div>
			<div id="opentok_container">
				<div id="intro_text_cameras">
					<p>Anyone who has selected to turn on their cameras will show up here. Even if you decide not to turn yours on, you can still see other folks.</p>
				</div>
			</div>
		</div>
	</div>
</body>
</html>