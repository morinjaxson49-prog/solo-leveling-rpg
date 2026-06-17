import * as THREE from 'three';
import Entity from './Entity';

class Monster extends Entity {
  constructor(x, y, z, level) {
    super(x, y, z, 'monster');
    this.level = level;
    this.health = 30 + level * 10;
    this.maxHealth = this.health;
    this.attackPower = 5 + level * 2;
    this.attackRange = 3;
    this.attackCooldown = 0;
    this.attackSpeed = 2;
    this.speed = 8 + level;
    this.detectionRange = 20;
    this.targetPlayer = null;
    this.updateColor();
  }

  updateColor() {
    // Color based on level
    const hue = Math.max(0, 1 - this.level * 0.1);
    this.mesh.material.color.setHSL(hue, 1, 0.5);
  }

  update(deltaTime, player) {
    const distance = this.mesh.position.distanceTo(player.mesh.position);

    if (distance < this.detectionRange) {
      this.targetPlayer = player;
      const direction = new THREE.Vector3()
        .subVectors(player.mesh.position, this.mesh.position)
        .normalize();
      
      if (distance > this.attackRange) {
        this.mesh.position.addScaledVector(direction, this.speed * deltaTime);
      } else {
        // Attack
        this.attackCooldown -= deltaTime;
        if (this.attackCooldown <= 0) {
          this.attackPlayer(player);
          this.attackCooldown = this.attackSpeed;
        }
      }
    } else {
      this.targetPlayer = null;
    }
  }

  attackPlayer(player) {
    const damage = this.attackPower + Math.random() * 5;
    player.health -= damage;
    console.log(`Monster dealt ${damage.toFixed(2)} damage to player!`);
  }

  takeDamage(damage) {
    this.health -= damage;
  }

  getExpReward() {
    return 50 * this.level;
  }
}

export default Monster;
