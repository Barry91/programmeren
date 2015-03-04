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
		maxForward: 5,
  		maxBack: 5,
  		maxQuestions: 2,
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

			//show feedback
			feedback.show('<p>De instellingen zijn gewijzigd!</p><p>Gooi de dobbelsteen om verder te gaan.</p>');		
		}

	}

	var feedback = { 

		show: function(message) {
			//add feedback message
			setTimeout(function() {				
				feedback.clear();					
				setTimeout(function() {
					var element = $('.message');
					element.innerHTML = message;
					element.className = 'message active';	
				}, 250);		
			}, 500);
		},

		clear: function() {
			//remove feedback message
  			var element = $('.message');
  			element.innerHTML = '';
  			element.className = 'message';  			
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

		currentQuestion: null,

		// methods
		init: function() {		
			//init utils and settings	
			utils.init();
			settings.init();
			//build game
			game.build();
		},

		build: function() {
			feedback.show('<p>Welkom bij Code Monkey Island</p><p>Gooi de dobbelsteen om het spel te starten.</p>');
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

           		switch (fields[i]) {
			        case 'N':
			            element.className = 'neutral';
			        break;
			        case 'F':
		            	element.className = 'forward';
			        break;
			        case 'Q':
			        	element.className = 'question';
			        break;
			        default:
		           		element.className = 'back';
			        break;
		        } 

            	width = Math.floor((window.innerWidth-30) / fields.length);
            	element.width = width;

	            container.appendChild(element);
	        }

	        this.setFinishPoint();
  		},

  		getFields: function() {
  			var fields = [], number, i;

  			//set all fields to neutral first
  			for (i = 0; i < settings.totalFields; i++) {
  				fields[i] = 'N';
	        }	        

	        //add task fields on random indexes, max number is controlled by the settings
	        fields = this.setTaskFields(fields, 'F', settings.maxForward);
	        fields = this.setTaskFields(fields, 'B', settings.maxBack);
	        fields = this.setTaskFields(fields, 'Q', settings.maxQuestions);

	        game.tasks = fields; // store field tasks in array
	        
	        return fields;
  		},

  		setTaskFields: function(fields, fieldName, max) {
  			//get random number of fields limited by max
  			var i, randomField, randomNum = Math.floor(Math.random() * max) + 1;

  			for (i = 0; i < randomNum; i++) {
  				randomField = Math.floor(Math.random() * fields.length);
  				//apply task to random fields
  				fields[randomField] = fieldName;
  			}

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

  		resetPawns: function() {
  			//teleport pawns to start
  			var i;
  			for (i = 0; i < game.pawns.length; i++) {
  				game.pawns[i].teleport(game.pawns[i].element);
  			}
  		},

  		clear: function() {
  			//empty board
  			var container = $('.fields');
			clear.elements(container);
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

	    	feedback.show('<p>Speler ' + (game.activePawn + 1) + ' heeft ' + dice.eyes + ' gegooid.</p>');

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

	  		//if the new step fits on the board	
	  		if(steps + this.currentField < settings.totalFields) {
	  			pawn.style.left = (steps + this.currentField - 1) * settings.stepSize + 'px'; // move element
	  			this.currentField = this.currentField + steps; // store current field
	  		} else { 
	  			//move the pawn into the teleporter
	  			pawn.style.left = settings.totalFields * settings.stepSize + 'px';	  			
	  			//teleport the pawn to the startpoint
	  			setTimeout(function() {
					feedback.show('<p>Speler ' + (game.activePawn + 1) + ' heeft de finish behaald.</p><p>Gooi de dobbelsteen om verder te gaan.</p>');   
	  				self.teleport(pawn);
	  				game.taskDone = true;
	  			}, 1000);
	  		}	 

	  		setTimeout(function () {
	  			//if task is done
  				if(game.taskDone) {
  					self.setActive();
  					game.taskDone = false;
  					//enable dice when animations done
  					dice.enable();
  				} else {
  					//do the task that belongs to the field
  					self.doTask(self.currentField);
  				}
		    }, 1000);
	  	},

	  	doTask: function(i) {

	  		var pawn = game.pawns[game.activePawn].element;

	  		//if field is not occupied by a pawn
	  		if(this.isOnSameField() == false) {
		  		var task = game.tasks[i - 1]; // get task corresponding to field	 

			  	switch (task) {
			  		//case neutral field
			        case 'N':
			            this.setActive();		            
				        dice.enable();
			        break;
			        //case steps back field
			        case 'B':
		            	feedback.show('<p>Speler ' + (game.activePawn + 1) + ' is op een rood veld terecht gekomen en gaat ' + settings.stepsBack + ' stap(pen) terug.</p><p>Gooi de dobbelsteen om verder te gaan.</p>');
			            game.taskDone = true;
		            	this.move(-settings.stepsBack);
			        break;
			        //case question field
			        case 'Q':
			        	game.currentQuestion = new Question();
			        	game.currentQuestion.init();
			        break;
			        //case steps forward field
			        default:
		           		feedback.show('<p>Speler ' + (game.activePawn + 1) + ' is op een groen veld terecht gekomen en gaat ' + settings.stepsForward + ' stap(pen) vooruit.</p><p>Gooi de dobbelsteen om verder te gaan.</p>');
			           	game.taskDone = true;   
		           		this.move(settings.stepsForward);
			        break;
		        } 		
	    	} 
	    	else {	    		
	    		feedback.show('<p>Speler ' + (game.activePawn + 1) + ' is op een bezet veld terecht gekomen en keert terug naar het begin.</p><p>Gooi de dobbelsteen om verder te gaan.</p>');    		
	    		this.teleport(pawn);
	    		this.setActive();	    		
	    	}
	  	},

	  	isOnSameField: function() {
	  		var i;
  			for (i = 0; i < game.pawns.length; i++) {
  				//check if pawns are on the same field
  				if (game.pawns[i] != game.pawns[game.activePawn] && game.pawns[i].currentField == this.currentField) {  				
  					return true;
  				}
  			}
  			return false
	  	},

	  	setActive: function() {
	  		game.activePawn < (game.pawns.length - 1) ? game.activePawn++ : game.activePawn = 0; // change active pawn
	  	},

	  	teleport: function(element) {
	  		//only teleport if player is on a step
	  		if (this.currentField != 0) {
	  			element.style.left = -settings.stepSize + 'px';
	  			this.currentField = 0;
	  			dice.enable();
	  		}
	  	}
  	};

  	function Question() {
  		//Question constructor
  		this.question = null;
  		self = this;
  	}

  	Question.prototype = {

  		init: function() {
  			this.get();
  		},

  		get: function() {
  			//get random question from data.js
  			var randomNum = Math.floor(Math.random() * questions.length);
  			this.question = questions[randomNum];
  			this.set();
	  	},

	  	set: function() {

	  		//set question elements
	  		var i, li, radio, text;
	  		var question = this.question.question;
	  		var options = this.question.options;
	  		
	  		//create question text
	  		var questionEl = $('.question-text');	
	  		text = document.createTextNode(question);
	  		questionEl.appendChild(text);

	  		//create question options
	  		var optionsEl = $('.options');	
	  		for (i = 0; i < options.length; i++) {

	  			li = document.createElement('li');
	  			text = document.createTextNode(options[i]);
	  			radio = document.createElement('input');
			    radio.type = 'radio';
			    radio.name = 'options';
			    radio.value = i + 1;

			    //append all nodes
			    li.appendChild(radio);
			    li.appendChild(text);
	  			optionsEl.appendChild(li);
	  		}

	  		this.show();
	  	},
		
		enable: function() {		
			//enable answering 
			var element = $('.check-answer');		
			element.addEventListener('click', this.checkAnswer);
		},	  	

		disable: function() {
			//disable answering 	
			var element = $('.check-answer');		
			element.removeEventListener('click', this.checkAnswer);
		},

  		show: function() {
  			//show question container
  			var element = $('.quiz');	
  			element.className = 'quiz active';	

  			this.enable();
  		},

  		hide: function() {
  			//hide question container
  			var element = $('.quiz');	
  			element.className = 'quiz';	

  			this.clear();
  			this.disable();
  		},

  		clear: function() {
  			//clear question from container
  			var options = $('.options');
  			var question = $('.question-text');

  			clear.elements(options);
  			clear.elements(question);
  		},

  		checkAnswer: function() {
  			//check if answer is correct
  			var selected = document.getElementsByName('options');
			var selected_value;

			//get selected value
			for(var i = 0; i < selected.length; i++){
			    if(selected[i].checked){
			        selected_value = selected[i].value;
			    }
			}

			//if answer is correct
			if(selected_value == self.question.answer) {
				//move pawn to finish
				var steps = settings.totalFields - game.pawns[game.activePawn].currentField; 
				game.pawns[game.activePawn].move(steps);
				feedback.show('<p>Het antwoord is correct!</br>Speler ' + (game.activePawn + 1) + ' gaat direct door naar de finish.</p><p>Gooi de dobbelsteen om verder te gaan.</p>');   
			} else { 
				dice.enable();
				feedback.show('<p>Het antwoord is helaas fout.</p><p>Gooi de dobbelsteen om verder te gaan.</p>'); 
			}

			self.hide();
  		}

  	};

  	var clear = {
  		//clear all elements in a element
  		elements: function(element) {
  			while (element.firstChild) {
  				element.removeChild(element.firstChild);
  			}
  		}
  	}
  	
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
