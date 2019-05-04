const dotenv = require("dotenv").config();
const axios = require("axios");
const keys = require("./keys.js");
const spotifyAPI = require('node-spotify-api');
const spotify = new spotifyAPI(keys.spotify);
const fs = require("fs");
const moment = require("moment");

let cmd = process.argv[2];
let arg = process.argv.splice(3).join("+"); //Take multi word songs, artists, etc and put them together.


function output(txt, withNewLine = true) {
    fs.appendFile("log.txt", txt + (withNewLine ? "\n" : ""), function(err) {
        if(err) {
            console.log("There was a problem with writing to file (log.txt). Error: " + err);
        }
    })
    console.log(txt); //includes it own new line.
}

function breakOutput() {
    output("-------------------------------");
}

function concertThis(name) {
    const displayLimit = 5;

    const queryURL = `https://rest.bandsintown.com/artists/${name}/events?app_id=codingbootcamp|date=upcoming`;
    axios.get(queryURL)
    .then(function(response) {
        //No need to guard against a bad artists.  Bands will return an error to us.
        
        for(let i = 0; i < displayLimit; i++) {
            let event = response.data[i];

            breakOutput();
            output(`Venue: ${event.venue.name}`);
            output(`Location: ${event.venue.city}, ${event.venue.region}`);
            const formatedMoment = moment(new Date(event.datetime));
            output(`Date: ${formatedMoment.format("MM\/DD\/YYYY")}`);
        }  

    })
    .catch(function(err) {
        if(err) {
            console.log(`There was an error with our axios call to bandsintown.  Error: ${err}`);
        }
    });
}


function spotifyThisSong(songName) {
    const songsToReturn = 1;

    spotify.search({ type: 'track', query: songName, limit: songsToReturn })
    .then(function(response) {
        if(response.tracks.items.length === 0) {
            console.log("Spotify could not find this track.");
        } else {
            for(let i = 0; i < songsToReturn && response.tracks.items.length; i++) {
                breakOutput();

                //Just get their names out the artists.  Join with a space.
                const joinedArtists = response.tracks.items[i].artists.map(x => { return x.name; }).join(" ");
                if(joinedArtists) {
                    output(`Artists: ${joinedArtists}`);
                }
                
                if(response.tracks.items[i].name) { //track name
                    output(`Name: ${response.tracks.items[i].name}`);
                }

                if(response.tracks.items[i].preview_url) {
                    output(`Preview: ${response.tracks.items[i].preview_url}`);
                }

                if(response.tracks.items[i].album.name) {
                    output(`Album: ${response.tracks.items[i].album.name}`);
                }
            }
        }
    })
    .catch(function(err) {
        if(err) {
            console.log(err);
        }
    });
}

function movieThis(movieName) {
    const queryURL = `http://www.omdbapi.com/?t=${movieName}&plot=short&apikey=${process.env.IMDB_KEY}`;
    axios.get(queryURL)
    .then(function(response) {
        if(response.data.Response != "False") { //Skip if we didn't get anything.
            breakOutput();
            output(`Title: ${response.data.Title}`); 
            output(`Year: ${response.data.Year}`); 
            output(`IMDB Rating: ${response.data.imdbRating}`); 

            //If we can find a rating from Rotten Tomatoes.
            let rtRating = response.data.Ratings.find(x => x.Source === "Rotten Tomatoes");
            if(rtRating) {//Only if one was found.
                output(`Rotten Tomatoes Rating: ${rtRating.Value}`); 
            }

            output(`Country: ${response.data.Country}`); 
            output(`Language: ${response.data.Language}`); 
            output(`Plot: ${response.data.Plot}`); 
            output(`Actors: ${response.data.Actors}`); 
        } else {
            console.log("IMDB could not find your movie.");
        }
    })
    .catch(function(err) {
        if(err) {
            console.log(`There was an error with our axios call to IMDB.  Error: ${err}`);
        }
    });
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(err, data) {
        if(err) {
            console.log("There was a problem with doWhatItSays.  Error: " + err);
        } else {
            const fileItems = data.split(",");

            if(fileItems[0] != "do-what-it-says") {
                cmd = fileItems[0];
                arg = fileItems[1];
                processCmd();
            }
        }
    });
}

function processCmd() {
    switch(cmd) {
        case "concert-this":
        concertThis(arg ? arg : "Lindsey+Stirling"); //Default to Lindsey Strling if they didn't provide one.
        break;
        case "spotify-this-song":
        spotifyThisSong(arg ? arg : "Take Flight"); //Default to Take Flight if they didn't provide one.
        break;
        case "movie-this":
        movieThis(arg ? arg : "Gattaca"); //Default to Gattaca if they didn't provide one.
        break;
        case "do-what-it-says":
        doWhatItSays();
        break;
        default:
        console.log(`Usage:`);
        console.log(`  node liri.js concert-this <artist/band name here>`);
        console.log(`  node liri.js spotify-this-song <song name here>`);
        console.log(`  node liri.js movie-this <movie name here>`);
        console.log(`  node liri.js do-what-it-says`);
    }
}

processCmd();