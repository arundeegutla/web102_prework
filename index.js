/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(container, games) {

    // loop over each item in the data
    games.forEach(game => {
        // create a new div element, which will become the game card
        const newDiv = document.createElement("div");

        // add the class game-card to the list
        newDiv.classList.add("game-card");

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        const content = `
                <img class="game-img" src="${game.img}"></img>
                <h2>${game.name}</h2>
                <p>${game.description}</p>
                <p>Backers: ${game.backers}</p>
            `;
        newDiv.innerHTML = content;
        // append the game to the container
        container.appendChild(newDiv);
    });

}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(gamesContainer, GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

function numCounter(element, number, add) {
    let start = 0;
    let end = number;
    let duration = 50;
    let counter = setInterval(function () {
        start += Math.max(Math.floor(number/10), 1);
        
        element.innerHTML = `
            <p>${add}${start.toLocaleString('en-US')}</p>
        `;
        if (start >= end) {
            element.innerHTML = `
                <p>${add}${number.toLocaleString('en-US')}</p>
            `;
            clearInterval(counter);
        }
    }, duration)
}

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce( (acc, game) => {
    return acc + game.backers;
  }, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
numCounter(contributionsCard, totalContributions, "");

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const totalRaise = GAMES_JSON.reduce( (acc, game) => {
    return acc + game.pledged;
  }, 0);

// set inner HTML using template literal
numCounter(raisedCard, totalRaise, "$");

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
numCounter(gamesCard, GAMES_JSON.length, "");


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let unfundedGames = GAMES_JSON.filter ( (game) => {
        return game.pledged < game.goal;
    });

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(gamesContainer, unfundedGames);
}


// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let fundedGames = GAMES_JSON.filter ( (game) => {
        return game.pledged >= game.goal;
    });

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(gamesContainer, fundedGames);
}


// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);
    // add all games from the JSON data to the DOM
    addGamesToPage(gamesContainer,GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
allBtn.addEventListener("click", showAllGames);
fundedBtn.addEventListener("click", filterFundedOnly);
unfundedBtn.addEventListener("click", filterUnfundedOnly);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
let unfundedGamesSum = GAMES_JSON.filter ( (game) => {
    return game.pledged < game.goal;
});

// create a string that explains the number of unfunded games using the ternary operator
const displayStr = `A total of $${totalRaise.toLocaleString('en-US')} has been raised for 
                    ${GAMES_JSON.length.toLocaleString('en-US')} ${GAMES_JSON.length > 1 ? "games" : "game"}. Currently, 
                    ${unfundedGamesSum.length} ${unfundedGamesSum.length > 1 ? "games" : "game"} remains undfunded. 
                    We need your help fund these amazing games!`;

// create a new DOM element containing the template string and append it to the description container
const elem = `
    <p>${displayStr}</p>
`; 
descriptionContainer.innerHTML = elem;
/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games

const [firstGame, secondGame, ...others] = sortedGames;
addGamesToPage(firstGameContainer, [sortedGames[0]]);
// do the same for the runner up item
addGamesToPage(secondGameContainer, [sortedGames[1]]);

/************************************************************************************
* Searching function
 */
const searchElement = document.getElementById("game-search");

searchElement.addEventListener('input', searchFunction);

function searchFunction(e){
    let filteredGames = GAMES_JSON.filter ( (game) => {
        return game.name.toLowerCase().indexOf(e.target.value.toLowerCase()) == 0;
    });
    deleteChildElements(gamesContainer);
    addGamesToPage(gamesContainer, filteredGames);
}