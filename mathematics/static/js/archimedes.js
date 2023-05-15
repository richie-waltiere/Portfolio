window.onload = function() {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    let vw = window.innerWidth;

    const duration = 1000;
    let below600 = (vw < 600);
    let centerX, centerY, radius;
    
    // Create canvas -- size of canvas based on width of viewport
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

    // Redraw polygon on canvas
    function redrawPolygon() {
	let event = new Event('change');
	let numberSides = document.getElementById("number-sides");
	numberSides.dispatchEvent(event);
    }

    // If viewport width crosses threshold of 600px, adjust size of canvas
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
	adjustCanvas(vw);
    });

    context.strokeStyle = "cyan";

    let startTimeCircle = Date.now();
    function animateCircle() {
	let elapsedTime = Date.now() - startTimeCircle;
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

    // animateLine is the basic building block for animating all polygons
    let startTime;
    function animateLine(startX, startY, endX, endY) {
	let elapsedTime = Date.now() - startTime;
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

    // Return an array of the coordinates of all vertices of the polygon 
    // numSides: number of sides of the polygon -> int
    function findVertices(numSides) {
	let vertices = []

	// Adding .0001 to the quantity 2*Math.PI fixed a rounding issue that caused the loop to end early.
	for (let theta = 0; theta <= 2*Math.PI + .0001; theta += (2*Math.PI/numSides)){
	    coordX = Math.round(centerX + radius * Math.cos(theta))
	    coordY = Math.round(centerY + radius * Math.sin(theta))
	    vertices.push([coordX, coordY])
	}
	return vertices
    }

    let triangleVertices;
    function animatePolygon(numSides) {
	let vertices = findVertices(numSides);

	// triangleVertices is used below in animateTriangle (under the "calculateArea" event listener)
	// to draw the triangle, which illustrates how the area of the polygon is calculated.
	triangleVertices = [vertices[0], vertices[1]]  

	startTime = Date.now()
	
	// Draw the sides of the inscribed polygon
	let i=0; 
	function animateNextLine() {
	    startX = vertices[i][0];
	    startY = vertices[i][1];
	    endX = vertices[i+1][0];
	    endY = vertices[i+1][1];
	    animateLine(startX, startY, endX, endY);
	    i++;
	    if (i+1 < vertices.length) {
		requestAnimationFrame(animateNextLine);
	    }
	}
	requestAnimationFrame(animateNextLine);
    }
    
    // Animate the first incribed triangle when the webpage opens
    setTimeout(() => {
	requestAnimationFrame(() => {
	    animatePolygon(3);
	});
    }, duration);

    // Display the area text 1s after the inscribed triangle is drawn
    const areaText = document.getElementById("area-text");
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
 
    // Reset all elements to original state and draw the polygon selected
    numberSides.addEventListener("change", () => {
	context.strokeStyle = "cyan";
	intro.innerHTML = "Assume the circle has a radius of 4 inches."

	addText.innerHTML = "";
	displayArea.innerHTML = "";

	context.beginPath();
	context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
	context.stroke();
	animatePolygon(numberSides.value);
    });

    // Draw the triangle used to illustrate area calculations. Display calculations.
    calculateArea.addEventListener("click", () => {
	let n = numberSides.value;
	let areaCircle = (Math.PI * 16).toFixed(6);
	let areaPolygon = (numberSides.value *.5 * 4**2 * Math.sin(2 * Math.PI/numberSides.value)).toFixed(6);
	// Percent difference between area of circle and area of polygon
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
	startTime = Date.now();
	function animateTriangle() {
	    endX = triangleVertices[i][0];
	    endY = triangleVertices[i][1];
	    animateLine(centerX, centerY, endX, endY);
	    i++;
	    if (i < triangleVertices.length) {
		requestAnimationFrame(animateTriangle);
	    }
	}
	requestAnimationFrame(animateTriangle);

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

    let stopEvent = false;
    playDemonstration.addEventListener("click", (event) => {
	// Array of all possibilities for the number of sides of the inscribed polygon (ascending order)
	let numberSidesPolygon = [...numberSides.options].map((option) => option.value);

	// Disable all buttons during demonstration. 
	// Pressing any of the buttons during the demonstration will cause 
	// unintended behaviors, like running several animations simultaneously.
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

	// Draw circle without animation
	context.clearRect(0, 0, canvas.width, canvas.height);	
	context.beginPath();
	context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
	context.stroke();

	let i=0; 
	setTimeout(() => { // Allow user a moment to read associated text before beginning demonstration
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
		    setTimeout(() => {
			requestAnimationFrame(animateNextPolygon);
		    }, 1750);
		}
		else {
		    addText.classList.add("fade-in");
		    intro.innerHTML = `Now let's see what happens as the number of sides <br>
				       approaches infinity. <br><br>`;
		    addText.innerHTML = finalAnalysis;

		    // Enable all buttons after demonstration
		    playDemonstration.disabled = false;
		    calculateArea.disabled = false;
		    numberSides.disabled = false;

		    skipDemonstration.style.display = "none";
		}
	    }
	    requestAnimationFrame(animateNextPolygon);
	}, 1500);
    });

    skipDemonstration.addEventListener("click", (event) => {
	stopEvent = true; // Break out of animation loop in demonstration
	skipDemonstration.disabled = true;
	
	// timout = duration * 3.5 is long enough for current animation to end. 
	// If the current animation does not end before breaking out of the
	// animation loop, the demonstration will continue.
	setTimeout(() => {
	    // Display empty circle (no inscribed polygons) after demonstration
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
