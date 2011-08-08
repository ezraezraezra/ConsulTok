/*
 * Project: ConsulTok
 * Description: E-commerce social shopping web app featuring the OpenTok & ShopSense APIs.
 * 
 * Author: Ezra Velazquez
 * Website: http://ezraezraezra.com
 * Date: July 2011
 * 
 */
	var apiKey = 1784392;
	var sessionId = '234070a745e67636ce6823cb951a9f81f7e1e6ed';
	var session;
	var publisher;
	var subscribers = {};
	var vid_height = 250;
	var vid_width = 387;
	var video_feed_num = 0;
	var my_conn_id;
	
	TB.addEventListener("exception", exceptionHandler);

		if (TB.checkSystemRequirements() != TB.HAS_REQUIREMENTS) {
			alert("You don't have the minimum requirements to run this application."
				  + "Please upgrade to the latest version of Flash.");
		} else {
			session = TB.initSession(sessionId);
			session.addEventListener('sessionConnected', sessionConnectedHandler);
			session.addEventListener('sessionDisconnected', sessionDisconnectedHandler);
			session.addEventListener('connectionCreated', connectionCreatedHandler);
			session.addEventListener('connectionDestroyed', connectionDestroyedHandler);
			session.addEventListener('streamCreated', streamCreatedHandler);
			session.addEventListener('streamDestroyed', streamDestroyedHandler);
		}

		//--------------------------------------
		//  LINK CLICK HANDLERS
		//--------------------------------------

		function connect() {
			session.connect(apiKey, token);
		}

		function disconnect() {
			session.disconnect();
		}

		function startPublishing() {
			if (!publisher) {
				hide("intro_text_cameras");
				hide("start_camera");
				var vid_container = document.createElement('div');
				vid_container.setAttribute('id', session.connection.connectionId);
				my_conn_id = session.connection.connectionId;
				vid_container.setAttribute('class', 'video_feed');
				video_feed_num += 1;
				
				var parentDiv = document.getElementById("opentok_container");
				var publisherDiv = document.createElement('div');
				publisherDiv.setAttribute('id', 'opentok_publisher');
				parentDiv.appendChild(vid_container);
				vid_container.appendChild(publisherDiv);
				if(video_feed_num >= 3) {
					vid_width = (900 / video_feed_num) - 20;
					vid_height = vid_width / 1.548;
				}
				var publisherProps = {width: vid_width, height: vid_height, subscribeToAudio: true};
				publisher = session.publish(publisherDiv.id, publisherProps);
			}
			resize_video_feeds(video_feed_num);
		}

		function stopPublishing() {
			if (publisher) {
				hide("stop_camera");
				session.unpublish(publisher);
				show("start_camera");	
			}
			publisher = null;
		}

		//--------------------------------------
		//  OPENTOK EVENT HANDLERS
		//--------------------------------------

		function sessionConnectedHandler(event) {
			for (var i = 0; i < event.streams.length; i++) {
				addStream(event.streams[i]);
			}
			show("start_camera");
		}

		function streamCreatedHandler(event) {
			for (var i = 0; i < event.streams.length; i++) {
				addStream(event.streams[i]);
			}
		}

		function streamDestroyedHandler(event) {
			video_feed_num -= 1;
			document.getElementById("opentok_container").removeChild(document.getElementById(event.streams[0].connection.connectionId));
			resize_video_feeds(video_feed_num);
		}

		function sessionDisconnectedHandler(event) {
			publisher = null;
		}

		function connectionDestroyedHandler(event) {
		}

		function connectionCreatedHandler(event) {
		}

		function exceptionHandler(event) {
			alert("Exception: " + event.code + "::" + event.message);
		}

		//--------------------------------------
		//  HELPER METHODS
		//--------------------------------------

		function addStream(stream) {
			hide("intro_text_cameras");
			if (stream.connection.connectionId == session.connection.connectionId) {
				show("stop_camera");
				return;
			}
			var vid_container = document.createElement('div');
			vid_container.setAttribute('id', stream.connection.connectionId);
			vid_container.setAttribute('class', 'video_feed');
			video_feed_num += 1;
			
			var parentDiv = document.getElementById("opentok_container");	
			var subscriberDiv = document.createElement('div');
			subscriberDiv.setAttribute('id', stream.streamId+"_1");
			parentDiv.appendChild(vid_container);
			vid_container.appendChild(subscriberDiv);
			var subscriberProps = {width: vid_width, height: vid_height, subscribeToAudio: true};
			subscribers[stream.streamId] = session.subscribe(stream, subscriberDiv.id, subscriberProps);
			resize_video_feeds(video_feed_num);
		}

		function show(id) {
			document.getElementById(id).style.display = 'block';
		}

		function hide(id) {
			document.getElementById(id).style.display = 'none';
		}
		
		function resize_video_feeds(amount_of_feeds) {
			if(amount_of_feeds == 0) {
				document.getElementById("opentok_container").style.width = "407px";
				document.getElementById("opentok_container").style.height = "250px";
				vid_width = 378;
				vid_height = 250;
				return;
			}
			if(amount_of_feeds == 1) {
				document.getElementById("opentok_container").style.width = "407px";
				document.getElementById("opentok_container").style.height = "250px";
				vid_width = 387;
				vid_height = 250;
				for (var x = 0; x < document.getElementById("opentok_container").getElementsByClassName("video_feed").length; x++) {
					vid_id = document.getElementById("opentok_container").getElementsByClassName("video_feed");
					vid_container = vid_id[0].getElementsByTagName("object");
					vid_container[0].setAttribute("height",  vid_height.toString());
					vid_container[0].setAttribute("width", vid_width.toString());
					vid_id[x].style.width = vid_width+"px";
					vid_id[x].style.height = vid_height+"px";
				}
				return;
			}
			if(amount_of_feeds == 2) {
				document.getElementById("opentok_container").style.width = "814px";
				document.getElementById("opentok_container").style.height = "250px";
				vid_width = 387;
				vid_height = 250;
				for (var x = 0; x < document.getElementById("opentok_container").getElementsByClassName("video_feed").length; x++) {
					vid_id = document.getElementById("opentok_container").getElementsByClassName("video_feed");
					vid_container = vid_id[x].getElementsByTagName("object");
					vid_container[0].setAttribute("height",  vid_height.toString());
					vid_container[0].setAttribute("width", vid_width.toString());
					vid_id[x].style.width = vid_width+"px";
					vid_id[x].style.height = vid_height+"px";
				}
				return;
			}
			
			vid_width = (900 / amount_of_feeds) - 20;
			vid_height = vid_width / 1.548;
			document.getElementById("opentok_container").style.width = ((vid_width + 20) * amount_of_feeds) + "px";
			document.getElementById("opentok_container").style.height = (vid_height)+"px";
			
			for(var x = 0; x < document.getElementById("opentok_container").getElementsByClassName("video_feed").length; x++) {
				vid_id = document.getElementById("opentok_container").getElementsByClassName("video_feed");
				vid_container = vid_id[x].getElementsByTagName("object");
				vid_container[0].setAttribute("height",  vid_height.toString());
				vid_container[0].setAttribute("width", vid_width.toString());
				vid_id[x].style.width = vid_width+"px";
				vid_id[x].style.height = vid_height+"px";
			}
		}