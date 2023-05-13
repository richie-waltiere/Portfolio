const createDeck = () => {
    let cards = [];
    let suits = [
		'<span style="color: red">&diams;</span>',
		'<span style="color: red">&hearts;</span>',
		'&clubs;',
		'&spades;'
		]
    // Array of numbers from 2 to 10
    let values = Array.from(Array(11).keys()).slice(2);
    // Map integer digits to strings and append face values
    values = values.map((digit) => String(digit)).concat(['J', 'Q', 'K', 'A'])

    // Create deck
    for (suit of suits) {
	for (value of values) {
	    cards.push(value + suit)
	}
    }
    console.log(cards);
    return cards
}

// Displays each hand, twenty-five hands per page
// element: Element where cards will be displayed
// cards: Cards to be displayed -- 2d array, organized into arrays of 5-card hands (e.g. [[hand1], [hand2], ... ])
// rankArr: Array consisting of the rank of each hand (e.g. ['Pair', null, 'Two Pair', ... ])
function displayEachHand(element, cards, rankArr, startIdx) {
    element.innerHTML = '';
    for (let i=startIdx; i<cards.length && i<(startIdx + 25); i++) {
	let rank = rankArr[i] ? ' &nbsp;&nbsp;&rarr;&nbsp;&nbsp;<span style="font-family: Courier, monospace; font-weight: 700">' + rankArr[i] + '</span>' : ''
	console.log(i, cards[i]);
	element.innerHTML += cards[i].join('  ') + rank + '<br><br>';
    }
}

let cards = createDeck();

function dealHand() {
    let randomInt, card;
    let hand = [];

    for (i=0; i<5; i++) {
	randomInt = Math.floor(Math.random() * 52);
	card = cards[randomInt];
	
	// No duplicate cards
	while (hand.includes(card)) {
	    randomInt = Math.floor(Math.random() * 52);
	    card = cards[randomInt];
	}

	hand.push(card);
    }
    return hand;
}

function dealAllHands(numHands) {
    let hands = [];
    for (let i=0; i<numHands; i++) {
	hands.push(dealHand());
	prevCards = [];
    }
    return hands;
}

// The hand ranks under consideration -- pair, two pair, three-of-a-kind -- are mutually exclusive. 
// Return value is of the form {pair: boolean, twoPair: boolean, threeOfAKind: boolean}
function rankHand(hand) {
    // Card value is two characters in length if it 10. Otherwise, card value is one character.
    let handValues = hand.map((card) => (card[1] === '0') ? card.slice(0,2) : card.slice(0,1))
    let counts = {};
    
    for (let value of handValues) {
	if (!counts[value]) {
	    counts[value] = handValues.reduce((acc, val) => acc + (val === value), 0);
	}
    }

    let countValues = Object.values(counts);
    let numPairs = countValues.reduce((acc,val) => acc + (val === 2), 0);
    let isPair = (numPairs === 1);
    let isTwoPair = (numPairs === 2);
    let isThreeOfAKind = countValues.includes(3) && (numPairs === 0); // An additional pair would create a full house
    let rank = isPair ? 'Pair' : isTwoPair ? 'Two Pair' : isThreeOfAKind ? 'Three of a Kind' : null;
    return [isPair, isTwoPair, isThreeOfAKind, rank];
}

function rankAllHands(hands) {
    let [pairs, twoPairs, threeOfAKinds] = [0, 0, 0];
    let rankArr = []
    for (let hand of hands) {
	handRank = rankHand(hand);
	pairs += handRank[0];
	twoPairs += handRank[1];
	threeOfAKinds += handRank[2];
	rankArr.push(handRank[3]);
    }
    return [pairs, twoPairs, threeOfAKinds, rankArr];
}

const canvas = document.getElementById('bar-chart');
const context = canvas.getContext('2d');
function displayChart(proportion, handRank) {
    let complement = (1 - proportion).toFixed(3);
    proportion = proportion.toFixed(3);
    let label1 = handRank + ' ( ' + proportion + ' ) '
    let label2 = 'Other Hands ' + '( ' + complement + ' ) '

    const currentChart = Chart.getChart(context);
    console.log(currentChart);
    if (currentChart) {
	currentChart.destroy();
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    
    let myChart = new Chart(context, {
	type: 'bar',
	data: {
	    labels: [label1, label2],
	    datasets: [{
		label: 'Experimental Probability',
		data: [proportion, complement],
		backgroundColor: [
			'rgba(255, 99, 132, 0.2)',
			'rgba(54, 162, 235, 0.2)'
		],
		borderColor: [
			'rgba(255, 99, 132, 1)',
			'rgba(54, 162, 235, 1)'
		],
		borderWidth: 1
	    }]
	},
	options: {
	    responsive: true,
	    scales: {
		yAxes: [{
		    ticks: {
			beginAtZero: true
		    }
		}]
	    }
	}
    });
}

const selectHand = document.getElementById('select-hand');
const displayHands = document.getElementById('display-hands');
const numTrials = document.getElementById('num-trials');
const trialsButton = document.getElementById('trials-button');
const errorMessage = document.getElementById('error-message');
const pageNumberLabel = document.getElementById('page-number-label');
const pokerDisplayControls = document.getElementById('poker-display-controls');

let hands, pairs, twoPairs, threeOfAKinds, rankArr, startIdx, numPages;
let createNewHand = true;
trialsButton.addEventListener('click', () => {
    let n = parseInt(numTrials.value);
    errorMessage.innerHTML = ''; 
    pokerDisplayControls.style.display = 'none';
    if (Number.isInteger(n) && 1 <= n && n <= 50000) {
	if (createNewHand) {
	    hands = dealAllHands(n);
	    [pairs, twoPairs, threeOfAKinds, rankArr] = rankAllHands(hands);
	    startIdx = 0;
	    displayEachHand(displayHands, hands, rankArr, startIdx);

	    pokerDisplayControls.style.display = 'flex';
	    numPages = Math.ceil(hands.length/25);
	    pageNumberLabel.innerHTML = `Page Number (1-${numPages}):`;
	    displayPageNumber(1);
	}
	else {
	    createNewHand = true;
	}

	let selectedHand = selectHand.value
	if (selectedHand === 'pair') {
	    displayChart(pairs/n, 'Pair');
	}
	else if (selectedHand === 'two-pair') {
	    displayChart(twoPairs/n, 'Two Pair');
	}
	else if (selectedHand === 'three-of-a-kind') {
	    displayChart(threeOfAKinds/n, 'Three Of A Kind');
	}
	console.log('pairs: ', pairs, 'twoPairs: ', twoPairs, 'threeOfAKind: ', threeOfAKinds);
    }
    else {
	errorMessage.innerHTML = '<span style="color: red">Enter a number between 1 and 50,000</span>';
    }
});

numTrials.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
	const click = new Event('click');
	trialsButton.dispatchEvent(click);
    }
});

selectHand.addEventListener('change', (event) => {
    if (numTrials.value) {
	createNewHand = false;
	const click = new Event('click');
	trialsButton.dispatchEvent(click);
    }
});

const pageNumberDisplay = document.getElementById('current-page');
const pageNumber = document.getElementById('page-number');
function displayPageNumber(page) {
    pageNumberDisplay.innerHTML = `page ${page}`;
}

let currentPage = 1;
const prevButton = document.getElementById('prev-button');
prevButton.addEventListener('click', () => {
    startIdx = Math.max(0, startIdx - 25);
    displayEachHand(displayHands, hands, rankArr, startIdx);
    currentPage = Math.max(1, currentPage - 1);
    displayPageNumber(currentPage);
});

const nextButton = document.getElementById('next-button');
nextButton.addEventListener('click', () => {
    // remainderHands keeps the number of hands displayed on the final page constant -- the remaining n hands, where n <= 25.
    let remainderHands = hands.length % 25;
    // This conditional is necessary to avoid displaying a blank page when startIdx = hands.length.
    if (remainderHands === 0) {
	startIdx = Math.min(hands.length - 25, startIdx + 25);
    }
    else {
	startIdx = Math.min(hands.length - remainderHands, startIdx + 25);
    }
    displayEachHand(displayHands, hands, rankArr, startIdx);
    currentPage = Math.min(numPages, currentPage + 1);
    console.log(startIdx, currentPage);
    displayPageNumber(currentPage);
});

pageNumber.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
	let toPage = parseInt(pageNumber.value);
	if (Number.isInteger(toPage) && 1 <= toPage && toPage <= numPages) {
	    console.log(toPage);
	    currentPage = toPage;
	    startIdx = 25 * (currentPage - 1);
	    console.log(startIdx, currentPage);
	    displayEachHand(displayHands, hands, rankArr, startIdx);
	    displayPageNumber(currentPage);
	}
    }
});
