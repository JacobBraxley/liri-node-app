const dotenv = require("dotenv").config();
const axios = require("axios");
const keys = require("./keys.js");
const spotifyAPI = require('node-spotify-api');
const spotify = new spotifyAPI(keys.spotify);
const fs = require("fs");
const moment = require("moment");

const cmd = process.argv[2];
const arg = process.argv.splice(3).join("+"); //Take multi word songs, artists, etc and put them together.


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
        console.log(`There was an error with our axios call to bandsintown.  Error: ${err}`);
    });
}


function spotifyThisSong(songName) {
    const songsToReturn = 1;

    spotify.search({ type: 'track', query: songName, limit: songsToReturn })
    .then(function(response) {
        for(let i = 0; i < songsToReturn && response.tracks.items.length; i++) {
            breakOutput();

            //Just get their names out the artists.  Join with a space.
            output(response.tracks.items[i].artists.map(x => { return x.name; }).join(" "));
            
            output(response.tracks.items[i].name); //track name
            output(response.tracks.items[i].preview_url);
            output(response.tracks.items[i].album.name);
        }
    })
    .catch(function(err) {
        if(err) {
            console.log(err);
        }
    });
}

function movieThis(movieName) {
//     * This will output the following information to your terminal/bash window:

//     ```
//       * Title of the movie.
//       * Year the movie came out.
//       * IMDB Rating of the movie.
//       * Rotten Tomatoes Rating of the movie.
//       * Country where the movie was produced.
//       * Language of the movie.
//       * Plot of the movie.
//       * Actors in the movie.
//     ```

//   * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

//     * If you haven't watched "Mr. Nobody," then you should: <http://www.imdb.com/title/tt0485947/>

//     * It's on Netflix!

//   * You'll use the `axios` package to retrieve data from the OMDB API. Like all of the in-class activities, the OMDB API requires an API key. You may use `trilogy`.
}

function doWhatItSays() {
    // * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.

    // * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.

    // * Edit the text in random.txt to test out the feature for movie-this and concert-this.
}

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