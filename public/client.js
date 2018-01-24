console.log('Client-side code running');

// <<<<--------------------------->>>>
// <<<<----Variable declaration--->>>>
// <<<<--------------------------->>>>
	//counter used to limit the amount of balls created
	let counter = 20; 
	//ball counter to be used for debuging purposses
	let ballcounter = 0;
	//score
	let score = 0;
	//stages for the bouncing balls that affect frequency 
	const stageOne = 200;
	const stageTwo = 300;
	const stageThree = 400;
	//seconds in the timer
	let s = 0;
	//submit button
	let submitScore = 0;

// <<<<--------------------------->>>>
// <<<<---        Timer     ------>>>>
// <<<<--------------------------->>>>

	//show the timer
	document.getElementById('timer').innerHTML = 01 + ":" + 00;
	startTimer();

function startTimer() {
	let presentTime = document.getElementById('timer').innerHTML;
	let timeR = presentTime.split(/[:]+/);
	let m = timeR[0];
	s = checkS((timeR[1] - 1));
	if (s==59) {
		m=m-1
	}

	document.getElementById('timer').innerHTML = m + ":" + s;
	setTimeout(startTimer, 1000);
}

function checkS(sec) {
	if (sec < 10 && sec >= 0) {
		sec = "0" +sec
	};
	if (sec < 0) {
		sec = "59"
	};return sec;
}


// <<<<--------------------------->>>>
// <<<<----Constructor class------>>>>
// <<<<--------------------------->>>>
//main drop constructor
function Drop(x = 25, y = 25, r = 15, col = "#e74c3c"){
	this.x = x;
	this.y = y;
	this.r = r;
	this.col = col;
	this.vx = random(-5,5);
	this.vy = 5;
	}
Drop.prototype.move = function() {
	this.y += this.vy;
};

Drop.prototype.draw = function() {
	fill(this.col);
	ellipse(this.x, this.y, this.r);
};


//bouncing drop sub class
function BDrop(x = 25, y = 25, r = 15, col = "#D6A2E8") {
	Drop.call(this, x, y, r, col);
}

BDrop.prototype = Object.create(Drop.prototype);
BDrop.prototype.constructor = Drop;

//Changing the move method
BDrop.prototype.move = function() {
	this.x += this.vx;
	this.y += this.vy;

	if(this.y < 0 || this.y > 700) {
  		
  		//this.vx *= -1;
   		this.vy *= -1;
 	}
 	if(this.x < 0 || this.x > 900) {
  		
  		//this.vx *= -1;
   		this.vx *= -1;
 	}
  	
}

// BDrop.prototype.onScreen = function() {
//   	if(this.x - (this.r / 2) < 0 || this.x + (this.r / 2) > width || this.y - (this.r / 2) < 0 || this.y + (this.r / 2) > height) { return false; }
//   	return true;
// };

//paddle constructor
function Paddle(x = mouseX, y = 685, w = 150, h = 15, r = 20, col = "#e67e22"){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.r = r;
	this.col = col;
}

Paddle.prototype.draw = function(){
	fill(this.col);
	rect(this.x, this.y, this.w, this.h, this.r);//x y w h r
}


// <<<<--------------------------->>>>
// <<<<----Code that uses class--->>>>
// <<<<--------------------------->>>>


let drops = []; //dropping object array
let bdrops = []; //bouncing objects array



function setup() {
	createCanvas(900, 700);//creates canvas of specified size (width, height)
	background(0);	
	frameRate(60);

	//setting up score

	fetch('/scores', {method: 'GET'})
	.then(function(response) {
		if(response.ok) return response.json();
		throw new Error('Request failed');
	})
	.then(function(data){
		if(data) {
			submitScore = data.score;
		}else{
			submitScore = 0;
		}
	})
	.catch(function(error) {
		console.log(error);
	});

	const button = document.getElementById('myButton');
	button.addEventListener('click', function(e) {
	  console.log('button was clicked');

	  fetch('/score', {
	  	method: 'POST',
	  	body: JSON.stringify({score: score}),
	  	headers: {
	  		Accept : 'application/json',
	  		'Content-Type': 'application/json'
	  	}

	  })
	    .then(function(response) {
	      if(response.ok) {
	        console.log('Score was recorded');
	        return;
	      }
	      throw new Error('Request failed.');
	    })
	    .catch(function(error) {
	      console.log(error);
	    });
});

}

 function createDrop(){
	drops.push( new Drop((Math.random()*900), -30));//draws random items at the top of the canvas
	//bdrops.push( new BDrop((Math.random()*900), 50));//draws random items at the top of the canvas
			
		
		// console.log("The number of balls dropped: " + ballcounter.toString());
		// ballcounter++;

}

 function createBounce(){
	bdrops.push( new BDrop((Math.random()*900), 50));//draws random items at the top of the canvas

}


// function drawPaddle(){
// 	rect(mouseX-50, 680, 150, 15, 20);//x y w h r
// }
// setInterval(draw, 1000);

function draw(){
	let paddle = new Paddle();
	
	background('#34495e');
	for (let i = 0; i < drops.length; i++) { //creates drops if the array if the array size is more than 0
		if (drops[i].y < canvas.height+50 && drops[i].y+20 >= paddle.y && drops[i].y <= paddle.y-15 && drops[i].x > paddle.x && drops[i].x < paddle.x+paddle.w) {// checks the y coorodinate of the drop and if the y value is more than the canvas height	
				score=score + 1;
				//show the score on the html index
				document.getElementById('score').innerHTML =score;
				drops.splice(i,1)
			
			
		}
		drops[i].move();
				drops[i].draw();
	}

	for (let i = 0; i < bdrops.length; i++) { 
				bdrops[i].move();
				bdrops[i].draw();
		if (bdrops[i].y < canvas.height+50 && bdrops[i].y+20 >= paddle.y && bdrops[i].y <= paddle.y-15 && bdrops[i].x > paddle.x && bdrops[i].x < paddle.x+paddle.w) {
				score=score -1;
				//show the score on the html index
				document.getElementById('score').innerHTML =score;
		}

	}


	if(counter%60 == 0){ // reduces the amount of dropped balls
		createDrop();
		console.log("Your socre is :" +score);
		console.log(s)
		//console.log("Paddle xPos :" +paddle.x);
		//console.log("Paddle yPos :" +paddle.y);
		
	}
	
				
	if(counter%100== 0){ // reduces the amount of bounmcing balls
		if (counter< stageThree){ 
			createBounce();

			//saveScore(submitScore);
			}
		}
		
	if (s <= 0) {
	//alert("Game over");
	background('#ff4757');
		drops.length = 0;
			bdrops.length = 0;

	}
	
		
	counter++;
	paddle.draw();
	//console.log(s)

	

}

// setInterval(function() {
//   fetch('/scores', {method: 'GET'})
//     .then(function(response) {
//       if(response.ok) return response.json();
//       throw new Error('Request failed.');
//     })
//     .then(function(data) {
//       submitScore = data.score;
//     })
//     .catch(function(error) {
//       console.log(error);
//     });
// }, 1000);

// console.log(submitScore);

//function saveScore(submitScore){
	
//}
