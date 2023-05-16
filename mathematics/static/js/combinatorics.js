// Briefly change color of the background of the element provided as an argument.
// element: HTML element to which blink will be applied -> HTML Element
// blinkColor: color which will appear for 100ms before element returns to original background color -> str
function blink(element, blinkColor) {
    const bgColor = getComputedStyle(element).background;
    element.style.background = blinkColor;
    setTimeout(() => {
	element.style.background = bgColor;
    }, 100);
}

// Sets value of global variable prevGuess
// questionNumber: current questionNumber -> int
// guess: current guess -> int
let prevGuess, prevQuestionNumber;
function setPrevGuess(questionNumber, guess=null) {
    // prevGuess is associated with another question and should be 'reset' to null
    if (prevQuestionNumber !== questionNumber) {
	prevGuess = null;
    }
    else {
	if (guess) {
	    prevGuess = guess;
	}
    }
    prevQuestionNumber = questionNumber;
}

/* Provides feedback for correct and incorrect responses to a question.
 * questionNumber: Number of the question under consideration -> int
 * guess: Value selected by user -> str
 * correctAnswer: Correct value for the question under consideration -> str
 * responseElement: Element to which the response is written -> HTML Element
 * otherElements: Other elements that need modified when providing feedback -> HTML Element
 * otherElements should be an array of the form [{element: elmnt1 , displayStyle: displayStyle1}, 
 * {element: elmnt2, displayStyle: displayStyle2}...] 
 * displayStyle allows the function to return the element to the correct display style (block, flex, grid, etc.) */
function questionFeedback(questionNumber, guess, correctAnswer, responseElement, otherElements=null) {
    let incorrectAnswers = ['a','b','c','d'].filter((answer) => answer !== correctAnswer);
    responseElement.style.display = 'block'

    // Hide all other elements until correct answer given
    for (element of otherElements) {
	element.element.style.display = 'none'
    }

    // Set prevGuess to null if it is associated with another question.
    setPrevGuess(questionNumber);

    if (!guess) {
	responseElement.innerHTML = '<span style="color: white">Please select an answer.</span>';
	responseElement.scrollIntoView({behavior: 'smooth', block: 'end'});
	return;
    }
    else {
	responseElement.innerHTML = '';
	output = (guess === correctAnswer) ? '<span style="color: white">Correct!</span>' : '<span style="color: white">Not Quite. Try Again!</span>';
	responseElement.innerHTML = output;
    }

    // If answer is correct, display all elements provided in otherElements
    if (guess === correctAnswer) {
	for (element of otherElements) {
	    element.element.style.display =  element.displayStyle;
	}
	responseElement.scrollIntoView({behavior: 'smooth'});
    }
 
    console.log(incorrectAnswers, prevGuess, guess);
    // Blink to indicate the answer is still incorrect
    if (incorrectAnswers.includes(prevGuess) && incorrectAnswers.includes(guess)) {
	blink(responseElement, 'lightseagreen');
    }

    // Ensure question and response are visible if guess is incorrect
    if (guess !== correctAnswer) {
	responseElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    setPrevGuess(questionNumber, guess=guess);
}


function retrieveGuess(name) {
    let guess = document.querySelector(`input[name="${name}"]:checked`)
    if (guess) {
	return guess.value;
    }
    return
}

// Pigeonhole principle section:

// Example 1
const findMatchButton = document.getElementById('find-match-button');
const findMatchResponse = document.getElementById('find-match-response');
const findMatchExplanation = document.getElementById('find-match-explanation');
const pigeonholePrincipleDef = document.getElementById('pigeonhole-principle-definition');

findMatchButton.addEventListener('click', () => {
    let questionNumber = '1';
    let guess = retrieveGuess("find-match");
    let correctAnswer = 'b';
    let responseElement = findMatchResponse;
    let otherElements = [{element: pigeonholePrincipleDef, displayStyle: 'block'}, 
			 {element: findMatchExplanation, displayStyle: 'block'}]

    questionFeedback(questionNumber, guess, correctAnswer, responseElement, otherElements=otherElements);
});

// Example 2
const birthMonthButton = document.getElementById('birthmonth-button');
const birthMonthResponse = document.getElementById('birthmonth-response');
const birthMonthExplanation = document.getElementById('birthmonth-explanation');
const cupGrid = document.getElementById('cup-grid');

birthMonthButton.addEventListener('click', () => {
    let questionNumber = '2';
    let guess = retrieveGuess("birthmonth");
    let correctAnswer = 'd';
    let responseElement = birthMonthResponse;
    let otherElements = [{element: birthMonthExplanation, displayStyle: 'block'}, 
			 {element: cupGrid, displayStyle: 'grid'}];

    questionFeedback(questionNumber, guess, correctAnswer, responseElement, otherElements=otherElements);
});

// Poker section -- probability of a pair: 

// question 1
const pairQ1Button = document.getElementById('pair-q1-button');
const pairQ1Response= document.getElementById('pair-q1-response');
const pairQ1Explanation= document.getElementById('pair-q1-explanation');

pairQ1Button.addEventListener('click', () => {
    let questionNumber = '3';
    let guess = retrieveGuess("pair-q1");
    let correctAnswer = 'c';
    let responseElement = pairQ1Response;
    let otherElements = [{element: pairQ1Explanation, displayStyle: 'block'}];

    questionFeedback(questionNumber, guess, correctAnswer, responseElement, otherElements=otherElements);
});

// question 2
const pairQ2Button = document.getElementById('pair-q2-button');
const pairQ2Response= document.getElementById('pair-q2-response');
const pairQ2Explanation= document.getElementById('pair-q2-explanation');

pairQ2Button.addEventListener('click', () => {
    let questionNumber = '4';
    let guess = retrieveGuess("pair-q2");
    let correctAnswer = 'a';
    let responseElement = pairQ2Response;
    let otherElements = [{element: pairQ2Explanation, displayStyle: 'block'}];

    questionFeedback(questionNumber, guess, correctAnswer, responseElement, otherElements=otherElements);
});

// question 3
const pairQ3Button = document.getElementById('pair-q3-button');
const pairQ3Response= document.getElementById('pair-q3-response');
const pairQ3Explanation= document.getElementById('pair-q3-explanation');

pairQ3Button.addEventListener('click', () => {
    let questionNumber = '5';
    let guess = retrieveGuess("pair-q3");
    let correctAnswer = 'b';
    let responseElement = pairQ3Response;
    let otherElements = [{element: pairQ3Explanation, displayStyle: 'block'}];

    questionFeedback(questionNumber, guess, correctAnswer, responseElement, otherElements=otherElements);
});

// Poker section -- probability of a two pair
const twoPairButton = document.getElementById('two-pair-button');
const twoPairResponse= document.getElementById('two-pair-response');
const twoPairExplanation= document.getElementById('two-pair-explanation');

twoPairButton.addEventListener('click', () => {
    let questionNumber = '6';
    let guess = retrieveGuess("two-pair");
    let correctAnswer = 'a';
    let responseElement = twoPairResponse;
    let otherElements = [{element: twoPairExplanation, displayStyle: 'block'}];

    questionFeedback(questionNumber, guess, correctAnswer, responseElement, otherElements=otherElements);
});

// Poker section -- probability of a three of a kind
const threeOfAKindButton = document.getElementById('three-of-a-kind-button');
const threeOfAKindResponse= document.getElementById('three-of-a-kind-response');
const threeOfAKindExplanation= document.getElementById('three-of-a-kind-explanation');

threeOfAKindButton.addEventListener('click', () => {
    let questionNumber = '7';
    let guess = retrieveGuess("three-of-a-kind");
    let correctAnswer = 'd';
    let responseElement = threeOfAKindResponse;
    let otherElements = [{element: threeOfAKindExplanation, displayStyle: 'block'}];

    questionFeedback(questionNumber, guess, correctAnswer, responseElement, otherElements=otherElements);
});
