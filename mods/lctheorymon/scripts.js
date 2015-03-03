exports.BattleScripts = {
	init: function () {
	this.modData('Pokedex', 'nincada').abilities = {0:"Compound Eyes", 1:"Regenerator", H:"Run Away"};
	this.modData('Pokedex', 'poliwag').abilities = {0:"Damp", 1:"Drizzle", H:"Swift Swim"};
	this.modData('Pokedex', 'tentacool').abilities = {0:"Clear Body", 1:"Rain Dish", H:"Regenerator"};

	this.modData('Pokedex', 'nincada').learnset.earthquake = ['5L100'];
	this.modData('Pokedex', 'nincada').learnset.uturn = ['5L100'];
	this.modData('Pokedex', 'mincinno').learnset.bulletseed = ['5L100'];
	this.modData('Pokedex', 'mincinno').learnset.rockblast = ['5L100'];

	this.modData('Pokedex', 'froakie').baseStats = {hp:41,atk:56,def:41,spa:62,spd:44,spe:75};
	}
};