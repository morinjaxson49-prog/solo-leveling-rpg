import * as THREE from 'three';
import Entity from './Entity';

class Monster extends Entity {
  constructor(x, y, z, level) {
    const size = 0.7 + (level * 0.1);
    super(x, y, z, 'monster', size);
    this.level = level;
    this.health = 30 + level * 12;
    this.maxHealth = this.health;
    this.attackPower = 8 + level * 2.5;
    this.attackRange = 3;
    this.attackCooldown = 0;
    this.attackSpeed = 2 - (level * 0.1);
    this.speed = 12 + level * 0.8;
    this.detectionRange = 25;
    this.targetPlayer = null;
    this.patrolAngle = Math.random() * Math.PI * 2;
    this.updateColor();
  }

  updateColor() {
    const hue = Math.max(0, 0.05 - this.level * 0.008);
    this.mesh.material.color.setHSL(hue, 1, 0.4 + this.level * 0.05);
    this.mesh.material.emissive.setHSL(hue, 1, 0.2);
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
      // Patrol
      this.patrolAngle += deltaTime * 0.5;
      const patrolX = Math.cos(this.patrolAngle) * 3;
      const patrolZ = Math.sin(this.patrolAngle) * 3;
      this.mesh.position.x += patrolX * deltaTime;
      this.mesh.position.z += patrolZ * deltaTime;
    }
  }

  attackPlayer(player) {
    const baseDamage = this.attackPower + Math.random() * 8;
    const defense = player.defense;
    const damage = Math.max(1, baseDamage - (defense * 0.5));
    player.health -= damage;
  }

  takeDamage(damage) {
    this.health -= damage;
  }

  getExpReward() {
    return Math.floor(50 * Math.pow(1.2, this.level - 1));
  }
}

export default Monster;
