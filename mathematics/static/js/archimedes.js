window.onload = function() {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    let vw = window.innerWidth;

    const startTime = Date.now();
    const duration = 1000;
    let below600 = (vw < 600);
    let centerX, centerY, radius;
    
    function createCanvas(viewportWidth) {
	if (viewportWidth >= 600) {
	    canvas.width = 500;
	    canvas.height = 500;
	    centerX = 250;
	    centerY = 250;
	    radius = 200;
	}
	else {
	    canvas.width = 200;
	    canvas.height = 200;
	    centerX = 100;
	    centerY = 100;
	    radius = 75;
	}
    }

    function redrawPolygon() {
	let event = new Event('change');
	let numberSides = document.getElementById("number-sides");
	numberSides.dispatchEvent(event);
    }

    function adjustCanvas(viewportWidth) {
	if (viewportWidth >= 600 && below600) {
	    canvas.width = 500;
	    canvas.height = 500;
	    centerX = 250;
	    centerY = 250;
	    radius = 200;
	    below600 = false;
	    redrawPolygon();
	}
	else if (viewportWidth < 600 && !below600) {
	    canvas.width = 200;
	    canvas.height = 200;
	    centerX = 100;
	    centerY = 100;
	    radius = 75;
	    below600 = true;
	    redrawPolygon();
	}

    }

    createCanvas(vw);

    window.addEventListener("resize", () => {
	vw = window.innerWidth;
	console.log(vw);
	adjustCanvas(vw);
    });

    context.strokeStyle = "cyan";

    function animateCircle() {
	let elapsedTime = Date.now() - startTime;
	let percentComplete = elapsedTime/duration;

	context.beginPath();
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.arc(centerX, centerY, radius, 0, 2 * Math.PI * percentComplete);
	context.stroke();

	if (elapsedTime < duration) {
	    requestAnimationFrame(animateCircle);
	}
    }
    requestAnimationFrame(animateCircle);
    context.save();

    let startTimeLine;
    function animateLine(startX, startY, endX, endY) {
	let elapsedTime = Date.now() - startTimeLine;
	let percentComplete = elapsedTime/duration;

	context.clearRect(0, 0, canvas.width, canvas.height);
	context.moveTo(startX, startY);
	context.lineTo(startX + (endX - startX) * percentComplete, startY + (endY - startY) * percentComplete);
	context.stroke();

	if (elapsedTime < duration) {
	    requestAnimationFrame(() => {
		animateLine(startX, startY, endX, endY);
	    });
	}
    }

    function findVertices(numSides) {
	let vertices = []
	// Adding .0001 to the quantity 2*Math.PI fixed a rounding issue that caused the loop to end early.
	for (let theta = 0; theta <= 2*Math.PI + .0001; theta += (2*Math.PI/numSides)){
	    coordX = Math.round(centerX + radius * Math.cos(theta))
	    coordY = Math.round(centerY + radius * Math.sin(theta))
	    vertices.push([coordX, coordY])
	    console.log(vertices);
	    console.log(theta, 2*Math.PI);
	}
	return vertices
    }


    let firstVertices;
    function animatePolygon(numSides) {
	let vertices = findVertices(numSides);
	firstVertices = [vertices[0], vertices[1]]
	startTimeLine = Date.now()
	
	let i=0; 
	function animateNextLine() {
	    startX = vertices[i][0];
	    startY = vertices[i][1];
	    endX = vertices[i+1][0];
	    endY = vertices[i+1][1];
	    console.log(vertices[i], vertices[i+1])
	    animateLine(startX, startY, endX, endY);
	    i++;
	    if (i+1 < vertices.length) {
		requestAnimationFrame(animateNextLine);
	    }
	}
	requestAnimationFrame(animateNextLine);
    }
    
    const areaText = document.getElementById("area-text");
    setTimeout(() => {
	requestAnimationFrame(() => {
	    animatePolygon(3);
	});
    }, duration);

    setTimeout(() => {
	areaText.classList.add("fade-in");
    }, duration + 1000);

    const numberSides = document.getElementById("number-sides");
    const calculateArea = document.getElementById("calculate-area");
    const displayArea = document.getElementById("display-area");
    const addText = document.getElementById("add-text");
    const intro = document.getElementById("intro");
    const playDemonstration = document.getElementById("play-demonstration");
    const skipDemonstration = document.getElementById("skip-demonstration");

    numberSides.addEventListener("change", () => {
	context.strokeStyle = "cyan";
	intro.innerHTML = "Assume the circle has a radius of 4 inches."

	addText.innerHTML = "";
	displayArea.innerHTML = "";

	context.beginPath();
	context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
	context.stroke();
	console.log(numberSides.value);
	animatePolygon(numberSides.value);
    });

    calculateArea.addEventListener("click", () => {
	let n = numberSides.value;
	let areaCircle = (Math.PI * 16).toFixed(6);
	let areaPolygon = (numberSides.value *.5 * 4**2 * Math.sin(2 * Math.PI/numberSides.value)).toFixed(6);
	let percentDifference = ((areaCircle - areaPolygon)/areaCircle * 100).toFixed(2)

	playDemonstration.disabled = true;

	intro.innerHTML = "Assume the circle has a radius of 4 inches."
	addText.innerHTML = `Divide the polygon into ${n} congruent triangles like the one shown.
			     The area of the polygon is the sum of these ${n} triangles.<br><br>

			     Let A<sub>n</sub> be the area of the inscribed, n-sided regular polygon.<br>
			     Let A<sub>T</sub> be the area of the triangle shown.<br><br>

			     To find the area of the triangle, we'll use this formula: <br>
			     A<sub>T</sub> = .5 * r<sup>2</sup> * sin(2&pi;/n)<br>
			     r: radius of the circle <br>
			     n: number of sides of the inscribed polygon<br><br>

			     The area of the ${n}-sided polygon is: <br>
			     A<sub>${n}</sub> = n * A<sub>T</sub> = ${n} * [.5 * 4<sup>2</sup> * sin(2&pi;/${n})]<br><br>
			     Let A<sub>C</sub> be the area of the circle:<br>
			     A<sub>C</sub> = &pi; * r<sup>2</sup> = 16&pi; = ${areaCircle} <br><br><br>

			     <span style="font-size: 1.1rem; border: 1px cyan solid">
			     Percent Difference = (A<sub>C</sub> - A<sub>${n}</sub>) / A<sub>C</sub> = 
			     ${percentDifference}%
			     </span>
			    `
	let i=0; 
	startTimeLine = Date.now();
	function animateNextLine() {
	    endX = firstVertices[i][0];
	    endY = firstVertices[i][1];
	    animateLine(centerX, centerY, endX, endY);
	    i++;
	    if (i < firstVertices.length) {
		requestAnimationFrame(animateNextLine);
	    }
	}
	requestAnimationFrame(animateNextLine);

	setTimeout(() => {
	    addText.classList.add("fade-in");
	    addText.style.display = "inline";

	    displayArea.classList.add("fade-in");
	    displayArea.innerHTML = `A<sub>${n}</sub> = 
				     ${areaPolygon}`

	    playDemonstration.disabled = false;
	}, duration)
    });

    const finalAnalysis = `The area of an n-sided polygon can be calculated<br>
			   using the following formula: <br>
			   A<sub>n</sub> = 1/2 * n * r<sup>2</sup> * sin(2&pi;/n) <br><br>

			   How can we calculate lim<sub>n &rarr; &infin;</sub> A<sub>n</sub> ?<br><br>

			   The details are involved, but one important limit will simplify our work: <br>
			   lim<sub>x &rarr; &infin;</sub> sin(x)/x = 1 <br><br>

			   A little algebra will show that <br>
			   A<sub>n</sub> = [r<sup>2</sup> * sin(2&pi;/n)] / (<sup>2</sup>/<sub>n</sub>) <br><br>

			   Multipy the numerator and denominator by &pi; <br>
			   and let x = 2&pi;/n. <br><br>
			   The limit can now be put in the form sin(x)/x mentioned above:<br>
			   A<sub>n</sub> = [&pi; r<sup>2</sup> * sin(2&pi;/n)] / (<sup>2&pi;</sup>/<sub>n</sub>) <br>
			   = [&pi; r<sup>2</sup> * sin(x)] / (x) <br><br>

			   Taking the limit:<br>
			   lim<sub>x &rarr; &infin;</sub> A<sub>n</sub> <br>
			   = lim<sub>x &rarr; &infin;</sub>[&pi; r<sup>2</sup> * sin(x)] / (x) <br>
			   = &pi; r<sup>2</sup> * lim<sub>x &rarr; &infin;</sub> sin(x) / (x) <br>
			   = &pi; r<sup>2</sup> <br><br>

			   We have proved the result.`;

    let animationId, animationId2;
    let timeOutId, timeOutId2;
    let stopEvent = false;
    playDemonstration.addEventListener("click", (event) => {
	let numberSidesPolygon = [...numberSides.options].map((option) => option.value);
	let i=0; 

	playDemonstration.disabled = true;
	calculateArea.disabled = true;
	numberSides.disabled = true;
	skipDemonstration.style.display = "block";

	let baseText = `Notice how the area of the polygon approaches <br> 
			the area of the circle as the number of sides increases.`
	// Add left arrow or up arrow, depending on the orientation of the elements
	intro.innerHTML = (vw < 1024) ? '<div style="font-size: 2.5rem; text-align: center"> &uarr; </div><br>' + 
			  baseText : baseText + '<br><br><span style="font-size: 5rem"> &larr; </span>'

	addText.innerHTML = "";

	context.clearRect(0, 0, canvas.width, canvas.height);	
	context.beginPath();
	context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
	context.stroke();

	timeOutId = setTimeout(() => {
	    function animateNextPolygon() {
		context.beginPath();
		context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
		context.stroke();
		displayArea.classList.add("fade-in");
		displayArea.innerHTML = `${numberSidesPolygon[i]} sides`
		animatePolygon(numberSidesPolygon[i]);
		i++;
		if (i < numberSidesPolygon.length) {
		    if (stopEvent) {
			context.clearRect(0, 0, canvas.width, canvas.height);	
			return;
		    }
		    timeOutId2 = setTimeout(() => {
			animationId2 = requestAnimationFrame(animateNextPolygon);
		    }, 1750);
		}
		else {
		    addText.classList.add("fade-in");
		    intro.innerHTML = `Now let's see what happens as the number of sides <br>
				       approaches infinity. <br><br>`;
		    addText.innerHTML = finalAnalysis;
		    playDemonstration.disabled = false;
		    calculateArea.disabled = false;
		    numberSides.disabled = false;
		    skipDemonstration.style.display = "none";

		}
	    }
	    animationId = requestAnimationFrame(animateNextPolygon);
	}, 1750);
    });

    skipDemonstration.addEventListener("click", (event) => {
	stopEvent = true;
	skipDemonstration.disabled = true;
	setTimeout(() => {
	    context.clearRect(0, 0, canvas.width, canvas.height);	
	    context.beginPath();
	    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
	    context.stroke();
	    displayArea.classList.add("fade-in");
	    displayArea.innerHTML = "";
	    addText.style.display = "inline-block"; 
	    addText.classList.add("fade-in");

	    intro.innerHTML = `Now let's see what happens as the number of sides <br>
			       approaches infinity. <br><br>`;
	    addText.innerHTML = finalAnalysis;

	    playDemonstration.disabled = false;
	    calculateArea.disabled = false;
	    numberSides.disabled = false;
	    skipDemonstration.disabled = false;

	    skipDemonstration.style.display = "none";
	    stopEvent = false;
	}, duration*3.5);
    });
}
