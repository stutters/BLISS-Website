$(document).ready(function() {

	var $currentNavItem = false;
	var toLoad;
	var bgcolour = "white";
	var textColour = "white";
	var hash = window.location.hash.substr(1);
	var caseStudy = false;
	var isContact = false;
	var mapCheck = false;

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
			 $('#supplementary').fadeOut();
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
			$(this).parent().css('background-color', 'transparent');
			if ($(this).attr('href')==$destination) {
				$navItem = $(this);
			}
		});
		
		// animate colour onto new nav item
		//bgcolour = $navItem.attr('class');
		$navItem.parent().animateToClass(bgcolour, 1000);
		
		// set new current nav item
		$currentNavItem = $navItem;

	}

	function loadContent() {
		
		//load content
		var $page = $('<div />').load(toLoad + '#container,#bg,#footer', '',
		function() { 
			bgcolour = $("#footer", $page).attr('class');
			var $content = $("#section", $page).contents();
			var $supplementary = $("#supplementary", $page).contents();
			var $heading = $page.find('h1').contents();
			var $features = $page.find('#featureContainer').contents();
			//textColour = $page.find('h1').attr('class');
			//if (textColour=="") {textColour="white";}

			// load background image
			if(!isContact && !mapCheck) {
				var $backgroundSrc = $page.find('.bgimage').attr('src');
				changeBGImage($backgroundSrc);
				
			}
			else if (isContact && !mapCheck) {
				// arriving at contact page
				var $mapSrc = $("#background", $page).attr('src');
				showMap($mapSrc);
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
			$('#supplementary').empty().append($supplementary);
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
		$("#footer").animateToClass(bgcolour, 1000, function() {$("#footer").removeClass().addClass(bgcolour);});
		//$("h1").css({ color: textColour });
		//$("ul#mainNavigation li a").animate({ color: textColour }, 'fast');
		//$("#viewImage").animate({ color: textColour }, 'fast');
		$('#section').animate({
			height: 'toggle'
		},
		100, 'swing', hideLoader);
		$('h1').fadeIn();
		$('#supplementary').fadeIn();
		$('#featureContainer').fadeIn();
		
	}
	function hideLoader() {
		//$('#load').fadeOut('normal');
		}

	function activateLinks() {

			 toLoad = $(this).attr('href');
			 
			 if(toLoad=="/contact-and-find-us/") {
			 	isContact=true;
			 }
			 
			 $('#section').animate({
				 height: 'toggle'
			 },
			 500, 'swing', loadContent);
			 $('h1').fadeOut();	  
			 $('#supplementary').fadeOut();
			 $('#featureContainer').fadeOut();

			 //$('#load').remove();
			 //$('#wrapper').append('<span id="load">LOADING...</span>');
			 //$('#load').fadeIn('normal');
			 window.location.hash = $(this).attr('href').substr(0, $(this).attr('href').length);

			 // change nav colour
			 //navChange($(this).attr('href'));

			 return false;

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
			$('#supplementary').fadeOut();
			$("#contentContainer").animate({'marginTop':contentShift}).animate({'opacity':'0.15'}).mouseenter(function() {changeOpacity($(this),'1');}).mouseleave(function() {changeOpacity($(this),'0.15');});
			initFeatures('0.15');
			$('#viewImage').text('View Content').unbind('click',showBG).click(hideBG);
		}
	
	}
	
	function useMap() {
		$('#container').fadeOut();
		$('#useMap').text('View Content').unbind('click',showBG).click(hideMap);
		$('#background').attr('src','http://maps.google.com/maps?f=q&amp;source=s_q&amp;hl=en&amp;geocode=&amp;q=Bliss+Digital,+The+Landmark,+17-21+Back+Turner+St,+Manchester,+M41FR,+United+Kingdom&amp;sll=37.0625,-95.677068&amp;sspn=45.736609,73.476563&amp;ie=UTF8&amp;hq=Bliss+Digital,+The+Landmark,&amp;hnear=The+Landmark,+17-21+Back+Turner+St,+Manchester+M4+1FR,+United+Kingdom&amp;ll=53.484178,-2.237502&amp;spn=0.00211,0.004517&amp;z=14&amp;iwloc=A&amp;cid=7243559190158937974&amp;output=embed');
		return false;
	}
	
	function hideMap() {
		$('#container').fadeIn();
		$('#useMap').text('View Map').unbind('click',hideMap).click(useMap);
	}
	
	function hideBG() {

		$('#navContainer').animate({'marginTop':'0px'});
		$('#supplementary').fadeIn();
		$("#contentContainer").animate({'marginTop':'265px'}).animate({'opacity':'1'}).unbind('mouseenter').unbind('mouseleave');
		$('#viewImage').text('View Image').unbind('click',hideBG).click(showBG);
	}
	
	function initFeatures(thisOpacity) {
		$("#featureContainer div").animate({'opacity':thisOpacity},500).mouseenter(function() {changeOpacity($(this),'1');}).mouseleave(function() {changeOpacity($(this),thisOpacity);});
	}
	
	function changeOpacity(thisObject,thisOpacity) {
		$(thisObject).animate({'opacity':thisOpacity},500);
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
	
	function showMap(mapSrc) {
			
			$('<iframe />', {
			    name: 'myFrame',
			    id:   'myFrame',
			    frameborder:	'0',
			    scrolling:	'no',
			    marginheight:	'0',
			    marginwidth:	'0'
			}).insertAfter('#background'
			).attr('src', mapSrc
			).css('min-height',($(this).height()-130)
			).load( function() {
				$(this).css('top',($(this).height()*-0.1)).show().animate({top:'25%'},1000,'swing',
					function() {
						$('#background').remove();
						$(this).attr('id', 'background');
					});
				}
			).hide(
			).addClass('bgimage'
			);
	}
	
	function initLinks() {
		// add main nav function
		$('a.page').click(activateLinks);
		$('a.showBG').click(showBG);
		$('a.caseStudy').click(activateCaseStudy);
		$('a.useMap').click(useMap);
		initFeatures('0.15');
	}

	
	// INIT
	$('#mainNavigation li a').click(activateLinks);
	initLinks();
	
	// set initial nav item
	if(hash=="") {
		navChange(window.location.pathname);
	}
	
	// create view image button
	$('#viewImage').text('View Image').click(showBG);


});