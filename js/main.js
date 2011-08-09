/*
 * Project:     ConsulTok
 * Description: E-commerce social shopping web app featuring the OpenTok & ShopSense APIs.
 * Website:     http://consultok.opentok.com
 * 
 * Author:      Ezra Velazquez
 * Website:     http://ezraezraezra.com
 * Date:        July 2011
 * 
 */

// Set up event handlers
function start(){
	web_socket();
	$("#result_slider").slider({
		orientation: "vertical",
		range: "min",
		min: 0,
		max: 100,
		value: 100,
		animate: true,
		slide: function(event, ui){
			var maxScroll = (($("#public_results").children().length) * ($(".result_container").height() + 10)) - $("#public_results").height();
			var final_scroll = ((100 - ui.value) * maxScroll / 100);
			$("#public_results").scrollTop(final_scroll);
		}
	});
	$("#private_result_slider").slider({
		orientation: "vertical",
		range: "min",
		min: 0,
		max: 100,
		value: 100,
		animate: true,
		slide: function(event, ui){
			var maxScroll = (($("#private_container_right").children().length) * ($(".result_container").height() + 10)) - $("#public_results").height();
			var final_scroll = ((100 - ui.value) * maxScroll / 100);
			$("#private_container_right").scrollTop(final_scroll);
		}
	});
	$("#search_button").click(function(){
		search_shopSense();
	});
	$("#dialog-email").dialog({
		resizable: false,
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {
			"Send email": function(){
				$(this).dialog("close");
				$.post('php/email.php', {
					'r_field': $("#email_to").val(),
					's_field': $("#email_from").val(),
					'm_field': $("#notes").val()
				}, function(data){
					//Blah
				});
			},
			Cancel: function(){
				$(this).dialog("close");
			}
		}
	});
	$("#email_notes").click(function(){
		$("#dialog-email").dialog("open");
	});
	$('#search_query').keypress(function(e){
	
		if (e.which == 13) {
			e.preventDefault();
			search_shopSense();
		}
	});
}

// Create web socket and add listeners
function web_socket(){
	socket = io.connect('http://consultok.opentok.com:8001');
	socket.on('values', function(data){
	});
	socket.on('public_data', function(data){
		$("#intro_text_public").css("display", "none");
		public_output = '';
		public_output += '<div class="result_container rc_public">';
		public_output += '<div class="img_holder">';
		public_output += '<img class="product_image" src="' + data.product.product.img + '" />';
		public_output += '</div>';
		public_output += '<div class="txt_holder txt_public">';
		public_output += '<span class="product_title">' + data.product.product.name.substring(0, 50) + '</span><br/>';
		public_output += '<div class="txt_holder_left txt_details txt_details_public">';
		public_output += '<span class="product_store">Store: <a href="' + data.product.product.retailerUrl + '">' + data.product.product.retailer + '</a></span><br/>';
		public_output += '<span class="product_price">Price: ' + data.product.product.priceLabel + '</span>';
		public_output += '</div>';
		public_output += '<div class="txt_holder_right txt_details txt_details_public">';
		public_output += '<span class="product_size">Sizes: <select name="sizes" class="product_sizes">';
		for (var y = 0; y < data.product.product.sizes.length; y++) {
			public_output += '<option value="' + data.product.product.sizes[y].name + '">' + data.product.product.sizes[y].name + '</option>';
		}
		public_output += '</select></span><br/>';
		public_output += '<span class="product_stock">In-Stock: ';
		if (data.product.product.inStock == 'true') {
			public_output += 'Yes';
		}
		else {
			public_output += 'No';
		}
		public_output += '</span></div></div></div>';
		$("#public_results").prepend(public_output);
		if ($("#public_results").children().length >= 3) {
			$("#public_slider_container").css("visibility", "visible");
		}
	});
}

// Send and gather JSON data from ShopSense
function search_shopSense(){
	if ($("#search_query").val() != "") {
		$("#private_container_right").html('<div class="progress_bar"><div class="progress_ball" id="progress_ball_1"></div><div class="progress_ball" id="progress_ball_2"></div><div class="progress_ball" id="progress_ball_3"></div></div>');
		
		var private_output = "";
		$.getJSON("http://api.shopstyle.com/action/apiSearch?callback=?", {
			pid: "uid2900-2911770-21",
			format: "jsonp",
			fts: $("#search_query").val()
		}, function(data){
			private_array.length = 0;
			for (var x = 0; x < data.products.length; x++) {
				private_array[x] = new Object();
				private_array[x].name = data.products[x].name;
				private_array[x].retailer = data.products[x].retailer;
				private_array[x].retailerUrl = data.products[x].retailerUrl;
				private_array[x].inStock = data.products[x].inStock;
				private_array[x].priceLabel = data.products[x].priceLabel;
				private_array[x].sizes = data.products[x].sizes;
				private_array[x].img = data.products[x].images[2].url;
				
				private_output += '<div class="result_container">';
				private_output += '<div class="img_holder">';
				private_output += '<img class="product_image" src="' + data.products[x].images[2].url + '"/>';
				private_output += '</div>';
				private_output += '<div class="txt_holder">';
				private_output += '<div class="product_title">' + data.products[x].name.substring(0, 50) + '</div>';
				private_output += '<div class="txt_holder_left txt_details">';
				private_output += '<span class="product_store">Store: <a href="' + data.products[x].retailerUrl + '">' + data.products[x].retailer + '</a></span><br/>';
				private_output += '<span class="product_price">Price: ' + data.products[x].priceLabel + '</span>';
				private_output += '</div>';
				private_output += '<div class="txt_holder_right txt_details">';
				private_output += '<span class="product_size">Sizes: <select name="sizes" class="product_sizes">';
				for (var y = 0; y < data.products[x].sizes.length; y++) {
					private_output += '<option value="' + data.products[x].sizes[y].name + '">' + data.products[x].sizes[y].name + '</option>';
				}
				private_output += '</select></span>';
				private_output += '<span class="product_stock">In-Stock: ';
				if (data.products[x].inStock == 'true') {
					private_output += 'Yes';
				}
				else {
					private_output += 'No';
				}
				private_output += '</span></div>';
				private_output += '<input type="button" value="share product" class="left_button share_button ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only " id="product_' + x + '"/>';
				private_output += '</div></div>';
			}
			$("#private_container_right").html(private_output);
			if (private_array.length > 3) {
				$("#private_slider_container").css("visibility", "visible");
			}
			$(".share_button").click(function(){
				socket.emit("private_data", {
					product: private_array[$(this).attr("id").substring(8)]
				});
			});
		});
	}
}
