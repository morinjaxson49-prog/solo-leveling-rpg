import * as THREE from 'three';
import Entity from './Entity';

class Monster extends Entity {
  constructor(x, y, z, level) {
    const size = 0.7 + (level * 0.08);
    super(x, y, z, 'monster', size);
    this.level = level;
    this.health = 30 + level * 15;
    this.maxHealth = this.health;
    this.attackPower = 10 + level * 3;
    this.attackRange = 3.5;
    this.attackCooldown = 0;
    this.attackSpeed = 2.5 - (level * 0.12);
    this.speed = 14 + level;
    this.detectionRange = 30;
    this.targetPlayer = null;
    this.patrolAngle = Math.random() * Math.PI * 2;
    this.patrolRadius = Math.random() * 5 + 3;
    this.roamTimer = 0;
    this.updateColor();
  }

  updateColor() {
    const hue = Math.max(0, 0.05 - this.level * 0.005);
    const saturation = Math.min(1, 0.5 + this.level * 0.05);
    this.mesh.material.color.setHSL(hue, saturation, 0.35 + this.level * 0.03);
    this.mesh.material.emissive.setHSL(hue, saturation, 0.2);
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
        this.attackCooldown -= deltaTime;
        if (this.attackCooldown <= 0) {
          this.attackPlayer(player);
          this.attackCooldown = this.attackSpeed;
        }
      }
    } else {
      this.targetPlayer = null;
      // Improved patrol AI
      this.roamTimer -= deltaTime;
      if (this.roamTimer <= 0) {
        this.patrolAngle = Math.random() * Math.PI * 2;
        this.roamTimer = Math.random() * 3 + 2;
      }
      
      const patrolX = Math.cos(this.patrolAngle) * this.patrolRadius;
      const patrolZ = Math.sin(this.patrolAngle) * this.patrolRadius;
      this.mesh.position.x += patrolX * deltaTime * 0.5;
      this.mesh.position.z += patrolZ * deltaTime * 0.5;
    }
  }

  attackPlayer(player) {
    const baseDamage = this.attackPower + Math.random() * 10;
    const defense = player.defense;
    const damage = Math.max(2, baseDamage - (defense * 0.6));
    player.health -= damage;
  }

  takeDamage(damage) {
    this.health -= damage;
  }

  getExpReward() {
    return Math.floor(60 * Math.pow(1.25, this.level - 1));
  }
}

export default Monster;
