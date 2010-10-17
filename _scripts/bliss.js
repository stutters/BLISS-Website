$(document).ready(function() {

	var $currentNavItem = false;
	var toLoad;
	var bgcolour = "white";
	var textColour = "white";
	var caseStudy = false;
	var isContact = false;
	var mapCheck = false;
	var options;
	var map;
	var latlng;
	var marker;
	var infowindow;


	function navChange() {
		
		var $destination = toLoad.slice(0,(toLoad.indexOf('/',1)+1));
			
		var $navItem;
		$("#mainNavigation a").each(function(index) {
			// remove bg colour from all nav
			$(this).parent().addClass('transparent');
			if ($(this).attr('href')==$destination) {
				$navItem = $(this);
			}
		});
		
		// animate colour onto new nav item
		$navItem.parent().fadeOut('fast', function() {
			$(this).removeClass().addClass(bgcolour).fadeIn('fast');
		});
		
		// set new current nav item
		$currentNavItem = $navItem;

	}

	function loadContent() { 
		
		//load content
		
		var $page = $('<div />').load(toLoad + ' #container,#background,#footer,#supplementaryContainer',
		function() { 
			bgcolour = $("#footer", $page).attr('class');
			var $content = $("#section", $page).contents();
			var $supplementary = $("#supplementaryContainer", $page).contents();
			var $heading = $page.find('h1').contents();
			var $features = $page.find('#featureContainer').contents();

			// insert content and heading
			$('#section').empty().append($content);
			$('#supplementaryContainer').empty().append($supplementary);
			$('#featureContainer').empty().append($features);
			$('h1').empty().append($heading);
			
			// load background image
			if(!isContact && !mapCheck) {
				var $backgroundSrc = $("#background", $page).css('backgroundImage').replace(/"/g,"").replace(/url\(|\)$/ig, "");
				changeBGImage($backgroundSrc);
				
			}
			else if (isContact && !mapCheck) {
				// arriving at contact page
				showMap();
				activateForm();
				mapCheck=true;
			}
			else {
				// leaving contact page
				var $backgroundSrc = $("#background", $page).css('backgroundImage').replace(/"/g,"").replace(/url\(|\)$/ig, "");
				changeBGImage($backgroundSrc);
				mapCheck=false;
				isContact=false;
			}
			
			if($('.twitterFeed').length) {
				initiateTwitter($('.twitterFeed').attr("id"));
			}
			
			
			// transform links and show content
			showNewContent();
		}

		);
	}

	function showNewContent() { 
		// activate links
		initLinks();
		// animate content to show
		document.title = $("h1").text().replace('.','') + " - BLISS";
		navChange(); 
		if($("#footer").attr('class')!=bgcolour) {
			$("#footer").switchClass($("#footer").attr('class'), bgcolour, 1000, function() {$("#footer").removeClass().addClass(bgcolour);});
		}
		$('#section').animate({
			height: 'toggle'
		},
		100, 'swing', hideLoader);
		$('h1').fadeIn();
		$('#supplementaryContainer').fadeIn();
		$('#featureContainer').fadeIn();
		
	}
	function hideLoader() {
		//$('#load').fadeOut('normal');
	}

	function activateLinks() {
			 
			 window.location.hash = $(this).attr('href').substr(0, $(this).attr('href').length);

			 return false;

	}
	
	function changePage(thisHash) { 
		
			toLoad = thisHash.substr(1, thisHash.length);
			
			if(toLoad=="/contact-and-find-us/") {
			 	isContact=true;
			}
		
			$('#section').animate({
				 height: 'toggle'
			 },
			 500, 'swing', loadContent);
			 $('h1').fadeOut();	  
			 $('#supplementaryContainer').fadeOut();
			 $('#featureContainer').fadeOut();

			 //$('#load').remove();
			 //$('#wrapper').append('<span id="load">LOADING...</span>');
			 //$('#load').fadeIn('normal');
	}
	
	function activateCaseStudy() {

		showBG();
		changeBGImage($(this).attr('href'));
		
		return false;
	}
	
	function showBG() {
	
		if(!caseStudy) {
			var contentShift = $(window).height() - $('#contentContainer').height() - $('#featureContainer').height() - 27;
			$('#navContainer').animate({'marginTop':'-137px'});
			$("#contentContainer").animate({'marginTop':contentShift}).animate({'opacity':'0.15'}).mouseenter(function() {changeOpacity($(this),'1');}).mouseleave(function() {changeOpacity($(this),'0.15');});
			$('#viewImage').unbind('click',showBG).bind('click',hideBG).find('span').text('View Content');
		}
		return false;
	
	}
	
	function hideBG() {

		$('#navContainer').animate({'marginTop':'0px'});
		$('#supplementaryContainer').fadeIn();
		$("#contentContainer").animate({'marginTop':'265px'}).animate({'opacity':'1'}).unbind('mouseenter').unbind('mouseleave');
		$('#viewImage').unbind('click',hideBG).click(showBG).find('span').text('View Image');
		return false;
	}
	
	function useMap() {
		$('#container').fadeOut();
		$('.useMap').parent('li').children().unbind('click',useMap).click(hideMap).children('span').text('View Content');
		map.setMapTypeId(google.maps.MapTypeId.HYBRID);
		map.setOptions({navigationControl: true,
  						mapTypeControl: true,
  						scaleControl: true
						});
		return false;
	}
	
	function hideMap() {
		$('#container').fadeIn();
		$('.useMap').parent('li').children().unbind('click',hideMap).click(useMap).children('span').text('View Map');
		map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
		map.setOptions({navigationControl: false,
  						mapTypeControl: false,
  						scaleControl: false
						});
		return false;
	}
	
	function changeBGImage(imageSrc) {
			
			$('<img />').load(function() {
				
				$('<div />'
				).attr('id','myBackground'
				).insertAfter('#background'
				).addClass('bgimage'
				).hide(
				).css('backgroundImage','url('+imageSrc+')'
				);
				
				document.getElementById('myBackground').style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+imageSrc+"', sizingMethod='scale')";
						
				
				//$('#myBackground').css('top',$(window).height()).animate({top:'0'},1000,'swing',
				$('#myBackground').fadeIn(400,
				function() {
					$('#background').remove();
					$('#myBackground').attr('id', 'background');
				});
			}
			).attr('src', imageSrc
			);
	}
	
	function showMap() {
		
			$('<div />'
			).attr('id','myMap'
			).insertAfter('#background'
			).addClass('bgimage'
			);
			
			buildMap('myMap');
			
			$('#myMap').css('top',$(window).height()).animate({top:'0'},1000,'swing',
					function() {
						$('#background').remove();
						$(this).attr('id', 'background');
			});
			
			
	}
	
	window["initiateTwitter"] = function(username) {
		$(".twitterFeed").liveTwitter(username, {limit: 1, rate: 300000, mode: 'user_timeline', showAuthor: true	});
	}
	
	window["buildMap"] = function(mapID) {
		
					latlng = new google.maps.LatLng(53.484174,-2.237483);
					options = {
					  zoom: 16,
					  center: latlng,
					  mapTypeId: google.maps.MapTypeId.SATELLITE,
					  disableDefaultUI: true,
					  navigationControlOptions: { 
					  	style: google.maps.NavigationControlStyle.ZOOM_PAN
					  }
					};
	
					map = new google.maps.Map(document.getElementById(mapID), options); 
					
					// Creating a marker and positioning it on the map
					marker = new google.maps.Marker({
					  position: new google.maps.LatLng(53.484174,-2.237483),
					  map: map,
					  //icon: 'http://google-maps-icons.googlecode.com/files/factory.png',
					  visible: true
					});
					
					// Creating an InfoWindow object
					infowindow = new google.maps.InfoWindow({
					  content: '<div style="text-align:left;"><h4 style="margin-bottom:0;">BLISS</h4><address><p style="font-style:normal;">The Landmark,<br/>21 Back Turner Street,<br/>Manchester,<br/>M4 1FR.</p></address></div>'
					});
					
					google.maps.event.addListener(marker, 'click', function() {
					  infowindow.open(map, marker);
					});
					
	}
	
	window["activateForm"] = function() {
		
			      $("label").inFieldLabels();
				
				  $(".button").click(function() { 
					  
					  $("label").removeClass('error').text;
					  $("input").css("border-color","#FFFFFF");
						
					  var name = $("input#name").val();
					  if (name == "") {
						  $("label#name_label").text("Don't forget your name!").addClass('error');
						  $("input#name").css("border-color","#B73720").focus();
						  
						  return false;
					  }
					  else {
						  	$("label#name_label").removeClass('error').text("Your name:");
					  		$("input#name").css("border-color","#FFFFFF");
					  }
					  
					  var email = $("input#email").val();
					  if (email == "") {
					  	$("label#email_label").text("Don't forget your email!").addClass('error');
					  	$("input#email").css("border-color","#B73720").focus();
					  	return false;
					  }
					  else {
						  	$("label#email_label").removeClass('error').text("Your name:");
					  		$("input#email").css("border-color","#FFFFFF");
					  }
					  var message = $("textarea#message").val();
						
						var dataString = 'name='+ name + '&email=' + email + '&message=' + message;
						//alert (dataString);return false;
						
						$.ajax({
					  type: "POST",
					  url: "/_scripts/process.php",
					  data: dataString,
					  success: function() {
						$('#contactForm').html("<div id='message' class='feature'></div>");
						$('#message').html("<h2>Thanks for your message!</h2><br/><br/>")
						.append("<h3>We will be in touch soon.</h3>")
						.hide()
						.fadeIn(1500, function() {
						  $('#message');
						});
					  }
					 });
					return false;
					});
	}
	
	function initLinks() {
		// add main nav function
		$('a.page').click(activateLinks);
		$('a.caseStudy').click(activateCaseStudy);
		$("a.useMap").click(useMap);
		$('#viewImage').click(showBG);
		
		$('#footerLinks li').mouseenter(function() {$(this).animate({opacity:'1'});}).mouseleave(function() {$(this).animate({opacity:'0.5'});});
		
	}

	  // Bind the event.
  $(window).hashchange( function(){
    // Watch for hash change
	changePage( location.hash );
  })


	
	// INIT
	$('#mainNavigation li a').click(activateLinks);
	initLinks();
	
});