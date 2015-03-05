## Extended version Code Monkey Island - HTML5 Game (CMDA)

A funny online game based on the boardgame Code Monkey Island. By throwing the dice each player has to reach the finish with several rules and actions controlling their movement on the board. 

## Functions

1. Throwing the dice.
2. Adjust game settings.
3. Answer quiz questions.

## Rules/actions

1. Player has to reach the finish by throwing the dice.
2. When a player hits a green field he will automatically be moved forward by the number of steps provided in the settings.
3. When a player hits a red field he will automatically be moved back by the number of steps provided in the settings.
4. When a player hits a yellow field and gives the correct answers to the question he will automatically reach the finish. If not he stays on the same position.
5. When a player hits a occupied field he will return to the start 

## Motivation

To improve my skills in Object Oriented Coding I decided (in consultation with my teacher Joost Faber) to extend/bugfix the Code Monkey Island game they created as part of the 'Programming' lessons of the education 'Communication & Multimedia Design'. 

## Installation

Options 1: Simply copy the OOP_basic folder to your local system and open index.html in your webbrowser to play the game.
Options 2: Copy the contents of the OOP_basic folder to your webserver using a FTP client. Open the url of your website to play the game.

## Realization

21-02-2015
1. Understanding and configuring GitHub (2,5 hours)
	Thanks to https://www.youtube.com/watch?v=73I5dRucCds
	- Installed GitHub on Windows
	- Forked the project
	- Followed tutorials on GitShell status/add/commit/push
2. Studied the code and recreated the issues while playing the game (2 hour)

22-02-2015
3. Disabled dice when pawns are moving. (1,5 hour)
	Thanks to http://stackoverflow.com/questions/11565471/removing-event-listener-which-was-added-with-bind
	- Didn't understand the issue with removing the event handler at first
	- Debug
4. Added managable game settings. (3,5 hours)
	- Added HTML content and styling first
	- Changed the global settings to an object and made them managable
	- Made the game resettable/rebuilding itself
	- Debug

28-02-2015
5. Added dynamic feedback (2 hour)
	- Added HTML content and styling/transitions first
	- Created an feedback object and applied feedback on all actions/tasks
	- Debug
6. Added dynamic questions as a new task type (4 hours)
	- Added HTML content and styling/transitions first
	- Added a questions object to a new file called data.js 
	- Made the game pick a random question when a player hits a yellow field
	- Debug
7. Added rules for occupying the same field (2 hour)
	- Added a new method to check if a pawn is on the same field  
	- Applied the check at task level
	- Debug

29-02-2015
8. Optimized overall code (3 hour)
	- Replaced if statements with switch statements
	- added a new way of generating the board with a maximum number of tasks controlled by the settings
	- Debug
9. Added code comments (1 hour)

04-03-2015
10. Updated board generation (1,5 hour)
	- optimzed the generation of the board
	- Debug
11. Added delay to dice enable (0,5 hour)
	- To optimize the game flow
	- Debug
12. Updated data.js with usefull questions (1,5 hour)
	- Searched the web for Javascript Quizes
	- Translated questions to dutch
	- Debug
13. Final bug check (1,5 hour)
	- Debug

05-03-2015
13. Written this documentation (3 hour)
	- introduction
	- functions/rules
	- realization/changelog 

Total hours: 29,5	

## Changelog

By 05-03-2014

1. Optimized: Code.
2. Fixed: Teleported monkeys move in mysterious ways. (monkeys teleport as intended)
3. Fixed: Disable rolling the dice (click event) when still moving pawns or completing tasks. (dice disables when tasks are in progress)
4. Fixed/Added: Pawns occupy same field (player returns to start when hitting a occupied field).
4. Added: Dynamic feedback.
5. Added: Managable game settings.
6. Added: Dynamic quiz questions.
7. Added: Comments

## Personal improvements

1. Knowledge of GitHub 
2. Writing clean Object Oriented Code using classes, constructors, objects, methodes and properties.

## Contributors

- CMDA
Teacher Joost Faber

## License

Copyleft 2015 CMDA