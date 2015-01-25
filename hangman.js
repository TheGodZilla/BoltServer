exports.hangman = function(h) {
	if (typeof h != "undefined") var hangman = h; else var hangman = new Object();
	var hangmanFunctions = {
		//reset hangman in the room - used once a round ends.
		reset: function(rid) {
			hangman[rid] = {
				givenguesses: 8,
				hangman: false,
				guessword: new Array(),
				hangmaner: new Array(),
				guessletters: new Array(),
				guessedletters: new Array(),
				guessedwords: new Array(),
				correctletters: new Array(),
				spaces: new Array(),
				hangmantopic: new Array(),
			};
		}
	};
	for (var i in hangmanFunctions) {
		hangman[i] = hangmanFunctions[i];
	}
	for (var i in Rooms.rooms) {
		if (Rooms.rooms[i].type == "chat" && !hangman[i]) {
			hangman[i] = new Object();
			hangman.reset(i);
		}
	}
	return hangman;
};

var cmds = {	

	hangman: function(target, room, user) {
		if (!user.can('broadcast', null, room)) {
			return this.sendReply('Only voices and up can start a game of hangman.');
		}

		if(hangman[room.id].hangman === true) {
			return this.sendReply('There is already a game of hangman going on.');
		}
		if(!target) {
			return this.sendReply('The correct syntax for this command is /hangman [word], [topic]');
		}
		if(hangman[room.id].hangman === false) {
			var targets = target.split(',');
			if(!targets[1]) {
				return this.sendReply('Make sure to include a topic.');
			}
			if(targets[0].length > 15) {
				return this.sendReply('People only get 8 guesses, don\'t be a dick.')
			}
			if(targets[0].indexOf(' ') != -1) {
				return this.sendReply('Don\'t include spaces in the word.');
			}
			hangman.reset(room.id);
			hangman[room.id].hangman = true;
			var targetword = targets[0].toLowerCase();
			hangman[room.id].guessword.push(targetword);
			hangman[room.id].hangmaner.push(user.userid);
			for(var i = 0; i < targets[0].length; i++) {
				hangman[room.id].guessletters.push(targetword[i]);
				hangman[room.id].spaces.push('_');
				hangman[room.id].hangmantopic[0] = targets[1];
			}
			return this.add('|html|<div class = "infobox"><div class = "broadcast-green"><center><font size = 2><b>' + user.name + '</b> started a game of hangman! The word has ' + targets[0].length + ' letters.<br>' + hangman[room.id].spaces.join(" ") + '<br>The category: ' + hangman[room.id].hangmantopic[0] + '</font></center></div></div>');
		}
	},

	viewhangman: function(target, room, user) {
		/*if(room.id === 'lobby') {
				return this.sendReply('|html|Please play this in another room; it\'s too spammy for lobby.');
		}*/
		if (!this.canBroadcast()) return;
		if(hangman[room.id].hangman === false) {
			return this.sendReply('There is no game of hangman going on right now.');
		}
		this.sendReplyBox('<font size = 2>' + hangman[room.id].spaces.join(" ") + '<br>Guesses left: ' + hangman[room.id].givenguesses + '<br>Category: ' + hangman[room.id].hangmantopic[0] + '</font>');
	},

	 topic: 'category',
	 category: function(target, room, user) {
		if(hangman === false) {
			return this.sendReply('There is no game of hangman going on right now.');
		}
		if(user.userid != hangman[room.id].hangmaner[0]) {
			return this.sendReply('You cannot change the topic because you are not running hangman.');
		}
		hangman[room.id].hangmantopic[0] = target;
		return this.sendReply('You changed the topic of the current game to \'' + target + '\'.');
	},
    
    hint: 'givehint',
    givehint: function(target, room, user) {
		if(hangman === false) {
			return this.sendReply('There is no game of hangman going on right now.');
		}
		if(user.userid != hangman[room.id].hangmaner[0]) {
			return this.sendReply('You can only give a hint if you are running the current game of hangman.');
		}
        return this.add('|html|<div class = "infobox"><b>' + user.name + '</b> has given a hint: ' + target + '</div>');
    },
    

    checkword: 'viewword',
	viewword: function(target, room, user) {
		if(user.userid === hangman[room.id].hangmaner[0]) {
			return this.sendReply('Your word is \'' + hangman[room.id].guessword[0] + '\'.');
		}
		else {
			return this.sendReply('lol you tryin to cheat?');
		}
	},

    guessletter: 'guess',
	guess: function(target, room, user) {
		if(hangman[room.id].hangman === false) {
			return this.sendReply('There is no game of hangman going on.');
		}
		if(user.userid === hangman[room.id].hangmaner[0]) {
			return this.sendReply('lol you\'re running the game, nerd.');
		}
		if(!target) {
			return this.sendReply('Cool, now specify a letter to guess.');
		}
		if(target.length > 1) {
			return this.sendReply('Only specify a single letter to guess. To guess the word, use /guessword.');
		}
		lettertarget = target.toLowerCase();
		for(var y = 0; y < 27; y++) {
			if(lettertarget === hangman[room.id].guessedletters[y]) {
				return this.sendReply('Someone has already guessed the letter \'' + lettertarget + '\'.');
			}
		}
		var letterright = new Array();
		for(var a = 0; a < hangman[room.id].guessword[0].length; a++) {
			if(lettertarget === hangman[room.id].guessletters[a]) {
				var c = a + 1;
				letterright.push(c);
				hangman[room.id].correctletters.push(c);
				hangman[room.id].spaces[a] = lettertarget;
			}
		}
		if(letterright[0] === undefined) {
			hangman[room.id].givenguesses = hangman[room.id].givenguesses - 1;
				if(hangman[room.id].givenguesses === 0) {
					hangman.reset(room.id);
					return this.add('|html|<b>' + user.name + '</b> guessed the letter \'' + lettertarget + '\', but it was not in the word. You have failed to guess the word, so the man has been hanged.');
				}
			this.add('|html|<b>' + user.name + '</b> guessed the letter \'' + lettertarget + '\', but it was not in the word.');
		}
		else {
			this.add('|html|<b>' + user.name + '</b> guessed the letter \'' + lettertarget + '\', which was letter(s) ' + letterright.toString() + ' of the word.');
		}
		hangman[room.id].guessedletters.push(lettertarget);
		if(hangman[room.id].correctletters.length === hangman[room.id].guessword[0].length) {
			this.add('|html|Congratulations! <b>' + user.name + '</b> has guessed the word, which was: \'' + hangman[room.id].guessword[0] + '\'.');
			hangman.reset(room.id)
		}
	},

	guessword: function(target, room, user) {
		if(hangman[room.id].hangman === false) {
			return this.sendReply('There is no game of hangman going on.');
		}
		if(!target) {
			return this.sendReply('Please specify the word you\'d like to guess.');
		}
		if(user.userid === hangman[room.id].hangmaner[0]) {
			return this.sendReply('You cannot guess the word because you are running hangman!');
		}
		var targetword = target.toLowerCase();
		if(targetword === hangman[room.id].guessword[0]) {
			this.add('|html|Congratulations! <b>' + user.name + '</b> has guessed the word, which was: \'' + hangman[room.id].guessword[0] + '\'.');
			hangman.reset(room.id)
		}
		else {
			if (hangman[room.id].guessedwords.indexOf(target) != -1) {
				return this.sendReply('Someone already guessed that word.')
			}
			hangman[room.id].givenguesses = hangman[room.id].givenguesses - 1;
			hangman[room.id].guessedwords.push(target);
			if(hangman[room.id].givenguesses === 0) {
				hangman.reset(room.id)
				return this.add('|html|<b>' + user.name + '</b> guessed the word \'' + targetword + '\', but it was not the word. You have failed to guess the word, so the man has been hanged.');
			}
			this.add('|html|<b>' + user.name + '</b> guessed the word \'' + targetword + '\', but it was not the word.');
		}
	},

	endhangman: function(target, room, user) {
		if (!user.can('mute', null, room)) {
			return this.sendReply('Only drivers and up can forcefully end a game.');
		}
		if(hangman[room.id].hangman === false) {
			return this.sendReply('There is no game going on.');
		}
		if(hangman[room.id].hangman === true) {
			this.add('|html|<b>' + user.name + '</b> forcefully ended the current game of hangman');
			hangman.reset(room.id);
		}
	},
    
	hangmanhelp: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<font size = 2>A brief introduction to </font><font size = 3>Hangman:</font><br />' +
						'The classic game, the basic idea of hangman is to guess the word that someone is thinking of before the man is "hanged." Players are given 8 guesses before this happens.<br />' + 
						'Games can be started by anyone of the rank Voice or higher.<br />' +
						'The commands are:<br />' +
						'<ul><li>/hangman [word], [category] - Starts a game of hangman, with a specified word and a general category. Requires: + % @ & ~</li>' +
						'<li>/guess [letter] - Guesses a letter.</li>' +
						'<li>/guessword [word] - Guesses a word.</li>' +
						'<li>/viewhangman - Shows the current status of hangman. Can be broadcasted.</li>' +
						'<li>/viewword OR /checkword - Allows the person running hangman to view the word.</li>' +
						'<li>/category [description] OR /topic [description] - Allows the person running hangman to change the category.</li>' +
                        '<li>/givehint [hint] OR /hint [hint] - Allows the person running hangman to give a hint.</li>' +
						'<li>/endhangman - Ends the game of hangman in the room. Requires: % @ & ~</li></ul>');
    }
};

for (var i in cmds) CommandParser.commands[i] = cmds[i];
