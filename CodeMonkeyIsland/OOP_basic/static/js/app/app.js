(function() {

	'use strict';

	// globals
	var $,$$;

	var settings = { 

		//default settings
		totalFields: 15,		
		stepSize: 68,
		stepsNeutral: 0,
		stepsForward: 1, 
		stepsBack: 2,
		finishPoint: 1025,

		init: function() {
			//enable click event
			this.enable();
		},

		enable: function() {
			//add click event listener
			var element = $('.save-settings');		
			element.addEventListener('click', this.save);
		},

		save: function() {
			//set settings with input values
			var totalFields = parseInt($('.total-fields').value);
			settings.stepsForward = parseInt($('.steps-forward').value);
			settings.stepsBack = parseInt($('.steps-back').value);		

			//if total field setting changed
			if(totalFields != settings.totalFields)
			{
				//reset game
				settings.totalFields = totalFields;
				game.reset();
			}		
		}

	}

	// game object literal (controller)
	var game = {
		// properties
		// session object here?
		pawns: [],
		activePawn: 0,
		
		tasks:[],
		taskDone: false, 

		// methods
		init: function() {		
			//init utils and settings	
			utils.init();
			settings.init();
			//build game
			game.build();
		},

		build: function() {
			//init board
			board.init();
			//create pawns
			this.getPawns();
			//enable dice
			dice.enable();
		},

		reset: function() {
			//disable dice
			dice.disable();
			//reset board
			board.reset();
			//reset game settings
			this.pawns = [];
			this.activePawn = 0;
			this.tasks = [];
			this.taskDone = false;			
		},

		getPawns: function() {
			var ulPawns = $$('.pawns li'),
				i;

			for(i = 0; i < ulPawns.length; i++) {
				this.pawns[i] = new Pawn(ulPawns[i]);
			}
		}
	};

	// board object literal
  	var board = {
  		// methods
  		init: function() {
  			var fields = this.getFields(),
  				container = $('.fields'),
  				element, width, i;

  			for (i = 0; i < fields.length; i++) {
           		element = document.createElement('li');

	            if (fields[i] === 'N'){
	                element.className = 'neutral';
	            } else if (fields[i] === 'F') {
	                element.className = 'forward';
	            } else {
	            	element.className = 'back';
	            }

            	width = Math.floor((window.innerWidth-30) / fields.length);
            	element.width = width;

	            container.appendChild(element);
	        }

	        this.setFinishPoint();
  		},

  		getFields: function() {
  			var fields = [],
  				number, i;

  			for (i = 0; i < settings.totalFields; i++) {
	            number = Math.random();

	            if (number < 0.65 ){
	                fields[i] = 'N';
	            }
	            else if ((number < 0.85 )&&(i != settings.totalFields - 1)){
	                fields[i] = 'F';
	            }
	            else if ((number >= 0.85)&&(i<=1)){
	                fields[i] = 'N';
	            }
	            else {
	                fields[i] = 'B';
	            }
	        }

	        game.tasks = fields; // store field tasks in array
	        return fields;
  		},

  		setFinishPoint: function() {
  			//position the finish point after the last step
  			var finish = $('.finish');
  			settings.finishPoint = settings.totalFields * settings.stepSize + 5;
  			finish.style.left = settings.finishPoint + 'px';
  		},

  		reset: function() {
  			//this becomes self
  			self = this;
  			//reset pawns to start
  			self.resetPawns();
  			//waittil teleports done  			
  			setTimeout(function() {
  				//clear board
  				self.clear();
  				//rebuild game
  				game.build();
  			}, 1000); //1000 miliseconds
  		},

  		clear: function() {
  			//empty board
  			var container = $('.fields');
  			while (container.firstChild) {
  				container.removeChild(container.firstChild);
  			}
  		},

  		resetPawns: function() {
  			//teleport pawns to start
  			var i;
  			for (i = 0; i < game.pawns.length; i++) {
  				game.pawns[i].teleport(game.pawns[i].element);
  			}
  		}

  	};

  	// dice object literal
  	var dice = {
  		// properties
  		eyes: 1,
  		sound: new Audio('./static/sfx/shake_dice.mp3'),
  		
  		// methods
  		init: function(event) {

  			var element = event.target;

  			this.eyes = Math.floor(6 * Math.random()) + 1;
  			this.setImg(element);
  			this.roll(element);
  		},
  		setImg: function(element) {

	        switch (this.eyes) {
		        case 1:
		            element.src = "./static/images/one.png";
		            break;
		        case 2:
		            element.src = "./static/images/two.png";
		            break;
		        case 3:
		            element.src = "./static/images/three.png";
		            break;
		        case 4:
		            element.src = "./static/images/four.png";
		            break;
		        case 5:
		            element.src = "./static/images/five.png";
		            break;
		        case 6:
		        	element.src = "./static/images/six.png";
		            break;
	        }  
	    },

	    roll: function(element) {
	    	//disable dice when rolling
	    	this.disable();
	        element.classList.remove('rotatein');
	        element.parentElement.classList.remove('slidein');

	        setTimeout(function (){
	            element.classList.add('rotatein');
		        element.parentElement.classList.add('slidein');
		    }, 1);

	        this.sound.pause();
	        this.sound.currentTime = 0;
	        this.sound.play();

	        game.pawns[game.activePawn].move(dice.eyes);
	    },

  		enable: function() {
  			//add click event listener
			var element = $('.dice');			
			element.addEventListener('click', clickEvent);
		},

		disable: function() {
			//remove click event listener
			var element = $('.dice');			
			element.removeEventListener('click', clickEvent);
		}
  	};

  	//added the dice function to a global var so the click event listener can be removed
  	var clickEvent = dice.init.bind(dice);

  	// pawn constructor object 
  	function Pawn(element) {
  		// properties
  		this.element = element;
  		this.currentField = 0;
  	};

  	Pawn.prototype = {
  		// methods
  		move: function(steps) {
	  		var pawn = game.pawns[game.activePawn].element, // active pawn element (li)
	  			self = this;

	  		if(steps + this.currentField < settings.totalFields) {
	  			pawn.style.left = (steps + this.currentField - 1) * settings.stepSize + 'px'; // move element
	  			this.currentField = this.currentField + steps; // store current field
	  		} else {
	  			pawn.style.left = settings.totalFields * settings.stepSize + 'px';
	  			
	  			setTimeout(function() {
	  				this.currentField = 0;
	  				self.teleport(pawn);
	  				//enable dice when animations done
	  				dice.enable();
	  			}, 1000);
	  		}	 

	  		setTimeout(function (){
  				if(game.taskDone) {
  					self.setActive();
  					game.taskDone = false;
  					//enable dice when animations done
  					dice.enable();
  				} else {
  					self.doTask(self.currentField);
  				}
		    }, 1000);
	  	},

	  	doTask: function(i) {
	  		var task = game.tasks[i-1]; // get task corresponding to field

	  		if (task === 'N') {
	            this.setActive();
	            //enable dice when animations done
	            dice.enable();
	        }
	        else if (task === 'B') {
	        	game.taskDone = true;
	            this.move(-settings.stepsBack);
	        }
	        else {
	        	game.taskDone = true;   
	            this.move(settings.stepsForward);
	        }
	  	},

	  	setActive: function() {
	  		game.activePawn < (game.pawns.length - 1) ? game.activePawn++ : game.activePawn = 0; // change active pawn
	  	},

	  	teleport: function(element) {
	  		//only teleport if player is on a step
	  		if (this.currentField != 0) {
	  			console.log('teleporter seriously out of order!');
	  			element.style.left = -settings.stepSize + 'px';
	  		}
	  	}
  	};
  	
  	// utils object literal
	var utils = {
		// methods
		init: function() {
			$  = this.selectElement, 
			$$ = this.selectElements
		},
		selectElement: function(el) {
			return document.querySelector(el);
		},
		selectElements: function(el) {
			return document.querySelectorAll(el);
		}
	};

	// start application
	game.init();

})();
