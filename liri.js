const dotenv = require("dotenv").config();
const axios = require("axios");
const keys = require("./keys.js");
const spotify = require('node-spotify-api');
const spotifyKey = new spotify(keys.spotify);
const fs = require("fs");
const moment = require("moment");

const cmd = process.argv[2];
const arg = process.argv[3];


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

    spotify.search({ type: 'track', query:  songName, limit: 1 })
    .then(function(response) {
        console.log(response);
    })
    .catch(function(err) {
        console.log(err);
    });

    //process.env.SPOTIFY_ID
//process.env.SPOTIFY_SECRET


//     * This will show the following information about the song in your terminal/bash window

//     * Artist(s)

//     * The song's name

//     * A preview link of the song from Spotify

//     * The album that the song is from

//   * If no song is provided then your program will default to "The Sign" by Ace of Base.

//   * You will utilize the [node-spotify-api](https://www.npmjs.com/package/node-spotify-api) package in order to retrieve song information from the Spotify API.

//   * The Spotify API requires you sign up as a developer to generate the necessary credentials. You can follow these steps in order to generate a **client id** and **client secret**:

//   * Step Four: On the next screen, scroll down to where you see your client id and client secret. Copy these values down somewhere, you'll need them to use the Spotify API and the [node-spotify-api package](https://www.npmjs.com/package/node-spotify-api).
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
    concertThis(process.argv.splice(3).join("+"));
    break;
    case "spotify-this-song":
    spotifyThisSong(arg);
    break;
    case "movie-this":
    movieThis(arg);
    break;
    case "do-what-it-says":
    doWhatItSays();
    break;
    default:
    console.log(`Usage:`);
    console.log(`  node liri.js concert-this <artist/band name here>`);
    console.log(`  node liri.js spotify-this-song '<song name here>`);
    console.log(`  node liri.js movie-this '<movie name here>'`);
    console.log(`  node liri.js do-what-it-says`);
}