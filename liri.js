var Twitter = require('twitter');
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");
var command = process.argv[2];
var queryString = process.argv.slice(3).join(' ');




function runTwitter() {
	
	var client = new Twitter(keys.twitterKeys);
	
 
	var params = {screen_name: 'sicknick2030'};
	
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	    	for (var i=0; i < 20; i++) {
	    	console.log(tweets[i].text)
	    	};
	 	}
	});
};

function runSpotify(queryString) {
	
	var spotify = new Spotify(keys.spotifyKeys);


 	
 // 	if(queryString === undefined){
	// 	queryString === "The Sign";
	// }else{
	// 	queryString === queryString;
	// }
	
	// var track = process.argv.slice(3).join();

	
  	spotify.search({ type: 'track', query: queryString || 'The Sign'})
  	.then(function(response) {
    	console.log("Artist(s): " + response.tracks.items[0].album.artists[0].name);
    	console.log("Song Name: " + response.tracks.items[0].name);
    	console.log("Spotify Link: " + response.tracks.items[0].artists[0].external_urls.spotify);
    	console.log("Album: " + response.tracks.items[0].album.name);
  	})
  	.catch(function(err) {
    	console.log(err);
  	});	 
};

function runIMDB(queryString) {
	
    var movieQuery = queryString || "Mr. Nobody"
	
	var queryUrl = "http://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&apikey=40e9cece";
	console.log(queryUrl);

	request(queryUrl, function(error, response, body) {
  		if (!error && response.statusCode === 200) {
    		console.log("Movie Title: " + JSON.parse(body).Title);
    		console.log("Release Year: " + JSON.parse(body).Year);
    		console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
    		console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
    		console.log("Country Produced: " + JSON.parse(body).Country);
    		console.log("Movie Language: " + JSON.parse(body).Language);
    		console.log("Movie Plot: " + JSON.parse(body).Plot);
    		console.log("Movie Actors: " + JSON.parse(body).Actors);
  		}
	});
}



function runDoIt() {
	console.log("running Do-It")

	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
    		return console.log(error);
  		}
	// console.log(data);
	var dataArr = data.split(',');
    
    command = dataArr[0];
    var queryString = dataArr[1];

    runSpotify(queryString);

});
}

function writeToLog() {
	fs.appendFile("log.txt", queryString, function(err) {

  		if (err) {
    		console.log(err);
  		}
  
  		else {
    		console.log("Content Added to Log!");
  		}
	});
}


 if (command === "my-tweets") {
 	runTwitter();
 	writeToLog();
 }

else if (command === "spotify-this-song") {
	runSpotify(queryString);
	writeToLog();
}

else if (command === "movie-this") {
	runIMDB(queryString);
	writeToLog();
	
}

else if ( command === "do-what-it-says") {
	runDoIt();
	writeToLog();
}