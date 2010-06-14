$(document).ready(function() {

    var $currentNavItem = false;
    var toLoad;
    var bgcolour;
	var hash = window.location.hash.substr(1);

	// if hash exists, load content
	function checkHash() { 
        var href = $(this).attr('href');
        if (hash == href.substr(0, href.length)) {
			toLoad = '/' + hash + '/';
			navChange(toLoad);
	        //bgcolour = $(this).attr('class');
	        $('#section').animate({
	            height: 'toggle'
	        },
	        500, 'swing', loadContent);
	        $('h1').fadeOut();
	        $('#supplementaryContent').fadeOut();
			$('#featureContainer').fadeOut();
        }

    }

    // check for hash
    $('#mainNavigation li a').each(checkHash);

    function navChange(destination) {
		
		var $navItem;
		$("#mainNavigation a").each(function(index) {
			// remove bg colour from all nav
			$(this).parent().css('background-color', 'transparent');
				if ($(this).attr('href')==destination) {
				$navItem = $(this);
			}
		});
		
		// animate colour onto new nav item
        var bgcolour = $navItem.attr('class');
        $navItem.parent().animateToClass(bgcolour, 500);
        
        // set new current nav item
        $currentNavItem = $navItem;

    }

    function loadContent() {
		// change content class
		$(this).parent().removeClass().addClass(bgcolour);
		
		//load content
        var $page = $('<div />').load(toLoad + ' #contentContainer,h1,.bgimage,#supplementaryContent,#featureContainer', '',
        function() { 
        	bgcolour = $("#contentContainer", $page).attr('class');
            var $content = $("#section", $page).contents();
            var $supplementary = $("#supplementaryContent", $page).contents();
            var $heading = $page.find('h1').contents();
            var $backgroundSrc = $page.find('.bgimage').attr('src');
			var $features = $page.find('#featureContainer').contents();

            // load background image
            var img = new Image();
            $(img).load(function() {
                $(this).hide();
                $('.bgimage').after(this);
                $(this).fadeIn('1000',
                function() {
                    $('.bgimage').remove();
                    $(this).attr('id', 'background');
                });
            }
            ).addClass('background'
            ).attr('src', $backgroundSrc
            );

            // insert content and heading
            $('#section').empty().append($content);
            $('#supplementaryContent').empty().append($supplementary);
			$('#featureContainer').empty().append($features);
            $('h1').empty().append($heading);
            // transform links and show content
            showNewContent();
        }

        );
    }

    function showNewContent() {
		// activate links
		$('a.page').click(activateLinks);
		// animate content to show
        $("#contentContainer").animateToClass(bgcolour, 500, function() {$("#contentContainer").removeClass().addClass(bgcolour);});
        $("#iconBg").animateToClass(bgcolour, 500);
        $("h4").animateToClass(bgcolour, 500);
        $('#section').animate({
            height: 'toggle'
        },
        500, 'swing', hideLoader);
        $('h1').fadeIn();
        $('#supplementaryContent').fadeIn();
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
	        	        
	        $('#supplementaryContent').fadeOut();
			$('#featureContainer').fadeOut();
	        //$('#load').remove();
	        //$('#wrapper').append('<span id="load">LOADING...</span>');
	        //$('#load').fadeIn('normal');
	        window.location.hash = $(this).attr('href').substr(0, $(this).attr('href').length);

	        // change nav colour
	        navChange($(this).attr('href'));

	        return false;

	}

	// add main nav function
    $('#mainNavigation li a').click(activateLinks);
    $('a.page').click(activateLinks);


    // set up tooltips
    $("#contactLinks a").each(

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

    );


});