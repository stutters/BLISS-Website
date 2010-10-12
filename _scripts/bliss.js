$(document).ready(function() {

	var $currentNavItem = false;
	var toLoad;
	var bgcolour = "white";
	var textColour = "white";
	var hash = window.location.hash.substr(1);
	var caseStudy = false;
	var isContact = false;
	var mapCheck = false;
	var options;
	var map;
	var latlng;
	var marker;
	var infowindow;

	// if hash exists, load content
	function checkHash() { 
		var href = $(this).attr('href');	
		if (hash == href.substr(0, href.length)) {
			toLoad = hash;
			navChange();
			 $('#section').animate({
				 height: 'toggle'
			 },
			 500, 'swing', loadContent);
			 $('h1').fadeOut();
			 $('#supplementaryContainer').fadeOut();
			$('#featureContainer').fadeOut();
		}

	}

	// check for hash
	$('#mainNavigation li a').each(checkHash);

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
		
		var $page = $('<div />').load(toLoad + ' #container,#bg,#footer,#supplementaryContainer',
		function() { 
			bgcolour = $("#footer", $page).attr('class');
			var $content = $("#section", $page).contents();
			var $supplementary = $("#supplementaryContainer", $page).contents();
			var $heading = $page.find('h1').contents();
			var $features = $page.find('#featureContainer').contents();

			// load background image
			if(!isContact && !mapCheck) {
				var $backgroundSrc = $page.find('.bgimage').attr('src');
				changeBGImage($backgroundSrc);
				
			}
			else if (isContact && !mapCheck) {
				// arriving at contact page
				showMap();
				mapCheck=true;
			}
			else {
				// leaving contact page
				var $backgroundSrc = $page.find('.bgimage').attr('src');
				changeBGImage($backgroundSrc);
				mapCheck=false;
				isContact=false;
			}

			// insert content and heading
			$('#section').empty().append($content);
			$('#supplementaryContainer').empty().append($supplementary);
			$('#featureContainer').empty().append($features);
			$('h1').empty().append($heading);
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
		//$("#footer").animateToClass(bgcolour, 1000, function() {$("#footer").removeClass().addClass(bgcolour);});
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
	
			var img = new Image();
			$(img).load(function() {
				$('#background').after(this);
				$(this).css('top',($(this).height()*-0.1)).animate({top:'25%'},1000,'swing',
				function() {
					$('#background').remove();
					$(this).attr('id', 'background');
				});
			}
			).addClass('bgimage'
			).attr('src', imageSrc
			);
	}
	
	function showMap() {
		
			$('<div />'
			).attr('id','myMap'
			).insertAfter('#background'
			).css('min-height',($(this).height()-130)
			).addClass('bgimage'
			);
			
			buildMap('myMap');
			
			$('#myMap').css('top',($(this).height()*-0.1)).show().animate({top:'25%'},1000,'swing',
					function() {
						$('#background').remove();
						$(this).attr('id', 'background');
			});
			
			
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
	
	function initLinks() {
		// add main nav function
		$('a.page').click(activateLinks);
		$('a.caseStudy').click(activateCaseStudy);
		$("a.useMap").click(useMap);
		$('#viewImage').click(showBG);
		
		$('#supplementaryContainer li,#footerLinks li').mouseenter(function() {changeOpacity($(this),'1');}).mouseleave(function() {changeOpacity($(this),'0.75');});
		
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