var map;
var tweetMarkersArray = [];
var tweetArray = [];
var InfoWindow = new google.maps.InfoWindow({maxWidth:300});

// Parsing functions
String.prototype.parseURL = function() {
  return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/, function(url) {
    return url.link(url);
  });
};
String.prototype.parseUsername = function() {
  return this.replace(/[@]+[A-Za-z0-9-_]+/, function(u) {
    var username = u.replace("@","")
    return u.link("http://twitter.com/"+username);
  });
};
String.prototype.parseHashtag = function() {
  return this.replace(/[#]+[A-Za-z0-9-_]+/, function(t) {
    var tag = t.replace("#","%23")
    return t.link("http://search.twitter.com/search?q="+tag);
  });
};
String.prototype.parseTweet = function() {
	return this.parseURL().parseUsername().parseHashtag();
}

// pan the map to a marker with an offset form the center as a percentage
function panMapOffset(myLatLng, latPercent, lngPercent) {
  // Get the marker co-ords from center point offset
  var latOff = myLatLng.lat() - map.getCenter().lat();
  var lngOff = myLatLng.lng() - map.getCenter().lng();
  
  // Find the northeast point.
  var bounds = map.getBounds();
  var northEast = bounds.getNorthEast();
    
  // Get the new bound location
  var boundLat = northEast.lat() + latOff;
  var boundLng = northEast.lng() + lngOff;
    
  // Find the distance percentage offset form marker (the new center)
  var newLat = (((boundLat - myLatLng.lat()) / 100 ) * latPercent) + myLatLng.lat();
  var newLng = (((boundLng - myLatLng.lng()) / 100 ) * lngPercent) + myLatLng.lng();
    
  // Move the map to this new point
  map.panTo(new google.maps.LatLng(newLat, newLng));
}

// Load a map
function map_initialize() {
  var myLatLng = new google.maps.LatLng(53.484174,-2.237483);
  var myOptions = {
    zoom: 13,
    center: myLatLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
}

// Prepare a tweet for output
function prepare_tweet(tweet) {
	var content = "";
  
  content += "<h4>" + tweet.from_user + "</h4>";
  content += '<img class="tweet_profile_pic" height="40" width="40" src="' +tweet.profile_image_url+ '" />';
  content += '<p>' + tweet.text.toString().parseTweet() + '</p>';
	return content;
}

// Make a nice infowindow
function setInfoWindow(tweet) {
	var content = prepare_tweet(tweet);
	// wrap it up in a div
	content = '<div class="map_tweet_content">' + content + '</div>';
	InfoWindow.setContent(content); 
	return InfoWindow;
}

// Make a nice marker
function newMarker(myLatLng, tweet) {
	return new google.maps.Marker({
		
    position: myLatLng,
    map: map,
    title: tweet.from_user
  });
}

// Load tweets
function get_tweets(query, callback) {
	// If we send a query object use it
	if(typeof query == 'object') {
		query = $.param(query);
	  $.getJSON("http://search.twitter.com/search.json?"+query+"&callback=?", callback);
	}
	else if(typeof query == 'string') {
		$.getJSON("http://search.twitter.com/search.json"+query+"&callback=?", callback);
	}
}

function mark_tweet(tweet) {
	// Break up tweet coords
	var coordinates = tweet.geo.coordinates;
	var lat = coordinates[0];
	var lng = coordinates[1];
	var myLatLng = new google.maps.LatLng(lat,lng); 
	var marker = newMarker(myLatLng, tweet);
	
	marker.open = function(){
		setInfoWindow(tweet);	
	  InfoWindow.open(map,marker);
		panMapOffset(myLatLng, 25,25);
	};
	marker.close = function(){
		infowindow.close();
	}
	google.maps.event.addListener(marker, 'click', function() {
	  marker.open();
  });
	tweetMarkersArray.push(marker);
}

// Shows any overlays currently in the array
function show_markers() {
  if (tweetMarkersArray) {
    for (i in tweetMarkersArray) {
			if(!tweetMarkersArray[i].marked) {
				tweetMarkersArray[i].setMap(map);
				tweetMarkersArray[i].marked = true;
			}
    }
  }
}

function map_tweets(data) {
	if(data) {
		if(data.results){
			$.each (data.results, function(i,tweet) {
		    if(tweet) {
		      if(tweet.geo) {
		        if(tweet.geo.coordinates) {
		          mark_tweet(tweet);
		        } 
		      }
		    }
		  });
			// What ever tweets we got, show'em
      show_markers();
		}	   	
	}
}

// Shows any overlays currently in the array
function show_tweets() {
  if (tweetArray) {
    for (i in tweetArray) {
      // Add the tweet to our list
			var tweet = tweetArray[i];
			var t = $('<li class="tweet">'+prepare_tweet(tweet)+'</li>');
			$('#tweet_list').prepend(t);
    }
  }
}

function list_tweets(data) {
	// Reset tweetArray
	tweetArray = [];
	if(data) {
		if(data.results) {
		  $.each(data.results, function(i, tweet) {
				if(tweet) {
					// Add each tweet to our array
          tweetArray.push(tweet);
				}
			});
			// What ever tweets we got, show'em
			show_tweets();	
		}
	}
}

function load_tweets(data) {
	map_tweets(data);
  list_tweets(data);
    
  // We should get some more now in a bit
	if(data) {
		if(data.refresh_url) {
      setTimeout(function() {
        get_tweets(data.refresh_url, load_tweets);
      }, 10000);
    }
	}
}


$(document).ready(function() {
	// Make our map
	map_initialize();
  
	// Get delivery tweets and map them
	get_tweets({
		q: "geo tag",
		rpp: 100,
		//geocode: "53.484174,-2.237483,250mi"
	}, load_tweets);
});