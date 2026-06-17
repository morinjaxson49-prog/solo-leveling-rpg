class CombatSystem {
  constructor() {
    this.attackCooldown = {};
  }

  checkCollisions(player, monsters, boss, particleSystem, onDamage) {
    // Player vs Monsters
    monsters.forEach(monster => {
      const distance = player.mesh.position.distanceTo(monster.mesh.position);
      
      if (distance < 2.5) {
        const damage = player.attack(monster);
        if (damage > 0) {
          monster.takeDamage(damage);
          if (onDamage) onDamage(damage);
          
          const isCrit = damage > player.skill * 1.3;
          if (isCrit) {
            console.log(`🔥 CRITICAL! ${damage.toFixed(2)} damage!`);
            particleSystem.createExplosion(monster.mesh.position, 0xffaa00, 1.2);
          } else {
            particleSystem.createDamageNumber(monster.mesh.position, Math.floor(damage), 0xff4444);
          }
          
          if (player.comboCounter > 1) {
            particleSystem.createDamageNumber(
              monster.mesh.position,
              `x${player.comboCounter}`,
              0xffff00
            );
          }
        }
      }
    });

    // Player vs Boss
    if (boss) {
      const distance = player.mesh.position.distanceTo(boss.mesh.position);
      
      if (distance < 3) {
        const damage = player.attack(boss);
        if (damage > 0) {
          boss.takeDamage(damage);
          if (onDamage) onDamage(damage);
          
          const isCrit = damage > player.skill * 1.3;
          if (isCrit) {
            console.log(`🔥 CRITICAL BOSS HIT! ${damage.toFixed(2)} damage!`);
            particleSystem.createExplosion(boss.mesh.position, 0xffff00, 1.5);
          } else {
            particleSystem.createDamageNumber(boss.mesh.position, Math.floor(damage), 0xffaa00);
          }
        }
      }
    }
  }
}

export default CombatSystem;
