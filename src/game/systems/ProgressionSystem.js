class ProgressionSystem {
  constructor() {
    this.stats = {};
  }

  addExperience(player, amount) {
    player.gainExperience(amount);
    const nextLevel = player.experienceToNextLevel;
    const currentExp = player.experience;
    const progress = (currentExp / nextLevel * 100).toFixed(1);
    console.log(`📈 +${amount} EXP! Progress: ${progress}%`);
  }

  getPlayerStats(player) {
    return {
      level: player.level,
      experience: player.experience,
      health: player.health,
      maxHealth: player.maxHealth,
      skill: player.skill,
      defense: player.defense,
      stamina: player.stamina,
      maxStamina: player.maxStamina,
      mana: player.mana,
      maxMana: player.maxMana
    };
  }

  getProgressToNextLevel(player) {
    return (player.experience / player.experienceToNextLevel) * 100;
  }
}

export default ProgressionSystem;
