class CombatSystem {
  constructor() {
    this.attackCooldown = {};
  }

  checkCollisions(player, monsters) {
    monsters.forEach(monster => {
      const distance = player.mesh.position.distanceTo(monster.mesh.position);
      
      // Check if player can attack
      if (distance < 2) {
        const damage = player.attack(monster);
        if (damage > 0) {
          monster.takeDamage(damage);
          console.log(`Player dealt ${damage.toFixed(2)} damage!`);
        }
      }
    });
  }
}

export default CombatSystem;
