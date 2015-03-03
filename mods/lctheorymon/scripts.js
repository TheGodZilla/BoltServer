/*
 * This is the mod for the LC Theorymon Project http://www.smogon.com/forums/threads/the-lc-theorymon-project.3531397/
 */
 
exports.BattleScripts = {
gen: 6,
init: function () {
   
    // Nincada + Regenerator, U-turn, and Earthquake
    this.modData('Pokedex', 'nincada').abilities['1'] = 'Regenerator';
    this.modData('Learnsets', 'nincada').learnset.uturn = ['6L1'];
    this.modData('Learnsets', 'nincada').learnset.earthquake = ['6L1'];
   
    // Poliwag + Drizzle
    this.modData('Pokedex', 'poliwag').abilities['0'] = 'Drizzle';
 
    // Froakie + 4 Speed (71 -> 75)
    this.modData('Pokedex', 'froakie').basestats = {hp:41,atk:56,def:40,spa:62,spd:44,spe:75};
   
    // Tentacool + Regenerator
    this.modData('Pokedex', 'tentacool').abilities['1'] = 'Regenerator';
   
    // Mincinno + Bullet Seed and Rock Blast
    this.modData('Learnsets', 'minccino').learnset.bulletseed = ['6L1'];
    this.modData('Learnsets', 'minccino').learnset.rockblast = ['6L1'];
   
}
};
