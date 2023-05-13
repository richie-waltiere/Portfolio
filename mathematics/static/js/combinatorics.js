function blink(element, blinkColor) {
    const bgColor = getComputedStyle(element).background;
    element.style.background = blinkColor;
    setTimeout(() => {
	element.style.background = bgColor;
    }, 100);
}

let prevGuess, prevQuestionNumber;
function setPrevGuess(questionNumber, guess=null) {
    console.log(prevQuestionNumber, questionNumber);
    console.log('guess: ', guess);
    if (prevQuestionNumber !== questionNumber) {
	prevGuess = null;
    }
    else {
	if (guess) {
	    prevGuess = guess;
	}
    }
    prevQuestionNumber = questionNumber;
    console.log('prevGuess: ', prevGuess);
}

// responseElement: element to which the response is written
// otherElements should be an array of the form [{element: elmnt1 , displayStyle: displayStyle1], {element: elmnt2, displayStyle: displayStyle2}...]
function questionFeedback(questionNumber, checkedValue, correctAnswer, incorrectAnswers, responseElement, otherElements=null) {
    const bgColor = getComputedStyle(responseElement).background;
    responseElement.style.display = 'block'
    for (element of otherElements) {
	element.element.style.display = 'none'
    }

    let guess;

    // Reset prevGuess value to null if it's value is associated with another question
    setPrevGuess(questionNumber);

    if (checkedValue === null) {
	responseElement.innerHTML = '<span style="color: white">Please select an answer.</span>';
	return;
    }

    else {
	responseElement.innerHTML = '';
	guess = checkedValue.value;
	output = (guess === correctAnswer) ? '<span style="color: white">Correct!</span>' : '<span style="color: white">Not Quite. Try Again!</span>';
	responseElement.innerHTML = output;
    }

    if (guess === correctAnswer) {
	for (element of otherElements) {
	    element.element.style.display =  element.displayStyle;
	}
	responseElement.scrollIntoView({behavior: 'smooth'});
    }
 
    if (incorrectAnswers.includes(prevGuess) && incorrectAnswers.includes(guess)) {
	blink(responseElement, 'lightseagreen');
    }

    if (guess !== correctAnswer) {
	responseElement.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    setPrevGuess(questionNumber, guess=guess);
}

const findMatchButton = document.getElementById('find-match-button');
const findMatchResponse = document.getElementById('find-match-response');
const findMatchExplanation = document.getElementById('find-match-explanation');
const pigeonholePrincipleDef = document.getElementById('pigeonhole-principle-definition');

findMatchButton.addEventListener('click', () => {
    let questionNumber = '1';
    let checkedValue = document.querySelector('input[name="find-match"]:checked');
    let correctAnswer = 'b';
    let incorrectAnswers = ['a', 'c', 'd'];
    let responseElement = findMatchResponse;
    let otherElements = [{element: pigeonholePrincipleDef, displayStyle: 'block'}, 
			 {element: findMatchExplanation, displayStyle: 'block'}]

    questionFeedback(questionNumber, checkedValue, correctAnswer, incorrectAnswers, responseElement, otherElements=otherElements);
});

const birthMonthButton = document.getElementById('birthmonth-button');
const birthMonthResponse = document.getElementById('birthmonth-response');
const birthMonthExplanation = document.getElementById('birthmonth-explanation');
const cupGrid = document.getElementById('cup-grid');

birthMonthButton.addEventListener('click', () => {
    let questionNumber = '2';
    let checkedValue = document.querySelector('input[name="birthmonth"]:checked');
    let correctAnswer = 'd';
    let incorrectAnswers = ['a', 'b', 'c'];
    let responseElement = birthMonthResponse;
    let otherElements = [{element: birthMonthExplanation, displayStyle: 'block'}, 
			 {element: cupGrid, displayStyle: 'grid'}];

    questionFeedback(questionNumber, checkedValue, correctAnswer, incorrectAnswers, responseElement, otherElements=otherElements);
});

const pairQ1Button = document.getElementById('pair-q1-button');
const pairQ1Response= document.getElementById('pair-q1-response');
const pairQ1Explanation= document.getElementById('pair-q1-explanation');

pairQ1Button.addEventListener('click', () => {
    let questionNumber = '3';
    let checkedValue = document.querySelector('input[name="pair-q1"]:checked');
    let correctAnswer = 'c';
    let incorrectAnswers = ['a', 'b', 'd'];
    let responseElement = pairQ1Response;
    let otherElements = [{element: pairQ1Explanation, displayStyle: 'block'}];

    questionFeedback(questionNumber, checkedValue, correctAnswer, incorrectAnswers, responseElement, otherElements=otherElements);
});

const pairQ2Button = document.getElementById('pair-q2-button');
const pairQ2Response= document.getElementById('pair-q2-response');
const pairQ2Explanation= document.getElementById('pair-q2-explanation');

pairQ2Button.addEventListener('click', () => {
    let questionNumber = '4';
    let checkedValue = document.querySelector('input[name="pair-q2"]:checked');
    let correctAnswer = 'a';
    let incorrectAnswers = ['b', 'c', 'd'];
    let responseElement = pairQ2Response;
    let otherElements = [{element: pairQ2Explanation, displayStyle: 'block'}];

    questionFeedback(questionNumber, checkedValue, correctAnswer, incorrectAnswers, responseElement, otherElements=otherElements);
});

const pairQ3Button = document.getElementById('pair-q3-button');
const pairQ3Response= document.getElementById('pair-q3-response');
const pairQ3Explanation= document.getElementById('pair-q3-explanation');

pairQ3Button.addEventListener('click', () => {
    let questionNumber = '5';
    let checkedValue = document.querySelector('input[name="pair-q3"]:checked');
    let correctAnswer = 'b';
    let incorrectAnswers = ['a', 'c', 'd'];
    let responseElement = pairQ3Response;
    let otherElements = [{element: pairQ3Explanation, displayStyle: 'block'}];

    questionFeedback(questionNumber, checkedValue, correctAnswer, incorrectAnswers, responseElement, otherElements=otherElements);
});

const twoPairButton = document.getElementById('two-pair-button');
const twoPairResponse= document.getElementById('two-pair-response');
const twoPairExplanation= document.getElementById('two-pair-explanation');

twoPairButton.addEventListener('click', () => {
    let questionNumber = '6';
    let checkedValue = document.querySelector('input[name="two-pair"]:checked');
    let correctAnswer = 'a';
    let incorrectAnswers = ['b', 'c', 'd'];
    let responseElement = twoPairResponse;
    let otherElements = [{element: twoPairExplanation, displayStyle: 'block'}];

    questionFeedback(questionNumber, checkedValue, correctAnswer, incorrectAnswers, responseElement, otherElements=otherElements);
});

const threeOfAKindButton = document.getElementById('three-of-a-kind-button');
const threeOfAKindResponse= document.getElementById('three-of-a-kind-response');
const threeOfAKindExplanation= document.getElementById('three-of-a-kind-explanation');

threeOfAKindButton.addEventListener('click', () => {
    let questionNumber = '7';
    let checkedValue = document.querySelector('input[name="three-of-a-kind"]:checked');
    let correctAnswer = 'd';
    let incorrectAnswers = ['a', 'b', 'c'];
    let responseElement = threeOfAKindResponse;
    let otherElements = [{element: threeOfAKindExplanation, displayStyle: 'block'}];

    questionFeedback(questionNumber, checkedValue, correctAnswer, incorrectAnswers, responseElement, otherElements=otherElements);
});

