class ProgressionSystem {
  constructor() {
    this.stats = {};
  }

  addExperience(player, amount) {
    player.gainExperience(amount);
    console.log(`Gained ${amount} experience! Total: ${player.experience}/${player.experienceToNextLevel}`);
  }

  getPlayerStats(player) {
    return {
      level: player.level,
      experience: player.experience,
      health: player.health,
      skill: player.skill,
      stamina: player.stamina
    };
  }

  getProgressToNextLevel(player) {
    return (player.experience / player.experienceToNextLevel) * 100;
  }
}

export default ProgressionSystem;
