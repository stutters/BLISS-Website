$(document).ready(function() {

	var $currentNavItem = false;
	var toLoad;
	var bgcolour = "yellow";
	var textColour = "white";
	var hash = window.location.hash.substr(1);
	var caseStudy = false;

	// if hash exists, load content
	function checkHash() { 
		var href = $(this).attr('href');	
		if (hash == href.substr(0, href.length)) {
			toLoad = hash;
			navChange(toLoad);
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

	function navChange(destination) {
	
		var $destination = destination.slice(0,(destination.indexOf('/',1)+1));
			
		var $navItem;
		$("#mainNavigation a").each(function(index) {
			// remove bg colour from all nav
			$(this).parent().css('background-color', 'transparent');
			if ($(this).attr('href')==$destination) {
				$navItem = $(this);
			}
		});
		
		// animate colour onto new nav item
		bgcolour = $navItem.attr('class');
		$navItem.parent().animateToClass(bgcolour, 500);
		
		// set new current nav item
		$currentNavItem = $navItem;

	}

	function loadContent() {
		// change content class
		//$(this).parent().removeClass().addClass(bgcolour);
		
		//load content
		var $page = $('<div />').load(toLoad + '#container,#bg', '',
		function() { 
			bgcolour = $("#contentContainer", $page).attr('class');
			var $content = $("#section", $page).contents();
			var $supplementary = $("#supplementary", $page).contents();
			var $heading = $page.find('h1').contents();
			var $backgroundSrc = $page.find('.bgimage').attr('src');
			var $features = $page.find('#featureContainer').contents();
			textColour = $page.find('h1').attr('class');
			if (textColour=="") {textColour="white";}

			// load background image
			changeBGImage($backgroundSrc);

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
		$("#contentContainer").animateToClass(bgcolour, 500, function() {$("#contentContainer").removeClass().addClass(bgcolour);});
		$("#iconBg").animateToClass(bgcolour, 500);
		$("h1").css({ color: textColour });
		$("ul#mainNavigation li a").animate({ color: textColour }, 'fast');
		$("#viewImage").animate({ color: textColour }, 'fast');
		$('#section').animate({
			height: 'toggle'
		},
		500, 'swing', hideLoader);
		$('h1').fadeIn();
		$('#supplementary').fadeIn();
		$('#featureContainer').fadeIn();
	}
	function hideLoader() {
		//$('#load').fadeOut('normal');
		}

	function activateLinks() {

			 toLoad = $(this).attr('href');
			 
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
			 navChange($(this).attr('href'));

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
			$('#navContainer').fadeOut();
			$('#supplementary').fadeOut();
			$("#contentContainer").animate({'marginTop':contentShift}).animate({'opacity':'0.15'}).mouseenter(function() {changeOpacity($(this),'1');}).mouseleave(function() {changeOpacity($(this),'0.15');});
			initFeatures('0.15');
			$('#viewImage').text('View Content').unbind('click',showBG).click(hideBG);
		}
	
	}
	
	function hideBG() {
		$('#navContainer').fadeIn();
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
				$(this).fadeIn(1000,
				function() {
					$('#background').remove();
					$(this).attr('id', 'background');
				});
			}
			).hide(
			).addClass('bgimage'
			).attr('src', imageSrc
			);
	}
	
	function initLinks() {
		// add main nav function
		$('a.page').click(activateLinks);
		$('a.showBG').click(showBG);
		$('a.caseStudy').click(activateCaseStudy);
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


	// set up tooltips
	/*$("#contactLinks a").each(

	function(index) {
		$(this).tooltip(
		{
			tip: '#' + $(this).attr('id') + 'Tooltip',
			effect: 'slide',
			direction: 'right',
			position: 'bottom left',
			offset: [ - 26, -9]
		});

	}

	);*/


});