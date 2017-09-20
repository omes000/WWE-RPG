
var characters = [
	{
		name: "Undertaker",
		health: 120,
		attack: 8,
		chokeslam: 50,
		tombstone: 100},
	{
		name: "Dark Bret",
		health: 120,
		attack: 5},
	{
		name: "Dark Sean Michaels",
		health: 150,
		attack: 10},
	{
		name: "Dark Hulk",
		health: 180,
		attack: 25}
];

//used to make it easier to understand code below
var undertaker = characters[0];
var darkbret = characters[1];
var darksean = characters[2];
var darkhulk = characters[3];

//used to easily identify who is player who is defender
var defender = "";
var yourChar = "";

//used to store the initial hit power for chosen character
var initialAttack = 0;
var winCounter = 0;
var playerLoss = false;

//updates the health for the characters
function updateStats(){
	$("#undertakerHealth").text(undertaker.health + " HP");
	$("#bretHealth").text(darkbret.health  + " HP");
	$("#seanHealth").text(darksean.health  + " HP");
	$("#hulkHealth").text(darkhulk.health  + " HP");
}

//Checks if player or defender has been defeated.
function checkDefeat(playerHealth, defenderHealth){
	if (defenderHealth <=0){
		$("#message").text(defender.name + " has been defeated");
		defender = "";
		$("#enemyAvatar").children().remove();
		$("#enemyPick").children().remove();
		winCounter++;
		checkGameWin();
	}
	else if (playerHealth <=0){
		$("#message").text("You Lost!");
		$("#reset-div").show();
		playerLoss = true;
	}
}

//Checks if game has been won
function checkGameWin(){
	if (winCounter >= characters.length-1 && yourChar.name != "Undertaker"){
		$("#message").text("Congratulations " + yourChar.name + "! You win!");
		return true;
	}
	else if (winCounter >= characters.length-1 && yourChar.name == "Undertaker"){
		$("#message").text("You win! The Undertaker will return...");
		$("#reset-div").show();
		return true;
	}
	else{
		return false;
	}
}

$(document).ready(function(){
	//Autoplays the video
    $("#player").get(0).play();

    //pauses the video and hides it if 'enter' is pushed
	$("body").keyup(function(event){
		console.log("HELLO");
		if(event.which ==13){
			$("#video-wrapper").hide();
			$("#player").get(0).pause();
		}
	});

	updateStats();

	$("#reset-div").hide();

	$("#charPick").on("click",".character", function(){
		//if the user hasn't chosen a character yet
		if (yourChar ===""){
			//clones the div containing the user's player choice to health bar section
			$(this).clone().addClass("avatar").appendTo("#yourPick");
			//adds the user's player's health bar
			$("#yourPick").append("<div class='healthBarShell'><div class='healthBarValue' id='yourBar'></div></div>").addClass("health");
		}
		
		//moves the defenders from options the player can choose to enemies
		$(this).siblings().removeClass("character").addClass("enemy");
		$(this).siblings().appendTo("#enemies");

		//sends the user's pick to the ring while remove the name and HP stats (for realism ;))
		$(this).appendTo("#yourAvatar");
		$(this).children().remove("p");

		//These if statements check to see who the player has chosen to play as and sets yourChar equal to that object element
		//Also stores the initial attack depending on which character is chosen
		if($(this).attr("id") == "undertakerBox"){
			yourChar = undertaker;
			initialAttack = yourChar.attack;
		}
		else if($(this).attr("id") == "darkbretBox"){
			yourChar = darkbret;
			initialAttack = yourChar.attack;
		}
		else if($(this).attr("id") == "darkseanBox"){
			yourChar = darksean;
			initialAttack = yourChar.attack;
		}
		else if($(this).attr("id") == "darkhulkBox"){
			yourChar = darkhulk;
			initialAttack = yourChar.attack;
		}
	});

	$("#enemies").on("click",".enemy", function(){
		if (defender== ""){
			$("#message").empty();
			$("#enemyPick").append("<div class='healthBarShell'><div class='healthBarValue' id='enemyBar'></div></div>").addClass("health");

			$(this).clone().addClass("avatar").appendTo("#enemyPick");
			$(this).parent().removeClass("text-center")
			$(this).children().remove("p");

			if($(this).attr("id") == "undertakerBox"){
				defender = undertaker;
				//This sends the not chosen enemies to the sides of the ring.
				$(this).siblings(".enemy:first").appendTo("#enemy1");
				$(this).siblings(".enemy:last").appendTo("#enemy2");
				$(this).appendTo("#enemyAvatar");
			}
			else if($(this).attr("id") == "darkbretBox"){
				$(this).siblings(".enemy:first").appendTo("#enemy1");
				$(this).siblings(".enemy:last").appendTo("#enemy2");
				$(this).appendTo("#enemyAvatar");
				defender = darkbret;
			}
			else if($(this).attr("id") == "darkseanBox"){
				$(this).siblings(".enemy:first").appendTo("#enemy1");
				$(this).siblings(".enemy:last").appendTo("#enemy2");
				$(this).appendTo("#enemyAvatar");
				defender = darksean;
			}
			else if($(this).attr("id") == "darkhulkBox"){
				$(this).siblings(".enemy:first").appendTo("#enemy1");
				$(this).siblings(".enemy:last").appendTo("#enemy2");
				$(this).appendTo("#enemyAvatar");
				defender = darkhulk;
			}
		}
	});

	$("#attack").on("click", function(){
		//these percents are used to calculate how much of the health bar needs to be removed
		var percentEnemy = 0;
		var percentYou = 0;
		$("#message").html("");

		//checks if the user is still playing
		if (defender != "" && !playerLoss){

			//calculates the percentage of the hit
			percentEnemy = 100-(yourChar.attack/defender.health) *100;
			defender.health -= yourChar.attack;

			//updates the health bar
			$('.healthBarValue').css('width', percentEnemy + '%' );

			percentYou = 100-(defender.attack/yourChar.health) *100;
			yourChar.health -= defender.attack;
			$('#yourBar').css('width', percentYou + '%' );

			//spits a message that details how much damage the player dealt how much damage was dealt to the player
			$("#message").html("<p>You hit " + defender.name + " with " + yourChar.attack + " power.</p>");
			$("#message").append("<p>" + defender.name + " hit you with " + defender.attack + " power.</p>");

			//increases the player's attack power
			yourChar.attack += initialAttack;
			checkDefeat(yourChar.health, defender.health);
			updateStats();
		}
		else if (yourChar ==""){
			//sends a message to the user to pick a character if they click the attack button before doing so
			$("#message").text("Pick a character");
		}
		else{
			$("#message").text("Pick a defender");
		}
	});
	
	$("#reset").on("click", function(){
		location.reload();
	});
});


