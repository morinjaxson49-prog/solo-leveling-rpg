import * as THREE from 'three';
import Entity from './Entity';

class Boss extends Entity {
  constructor(x, y, z, level) {
    const size = 2;
    super(x, y, z, 'boss', size);
    this.level = level;
    this.name = `Igris - Level ${level}`;
    this.health = 200 + level * 50;
    this.maxHealth = this.health;
    this.attackPower = 30 + level * 5;
    this.attackRange = 4;
    this.attackCooldown = 0;
    this.attackSpeed = 1.5;
    this.speed = 10 + level * 0.5;
    this.detectionRange = 50;
    this.targetPlayer = null;
    this.phase = 1;
    this.phaseChangeHealth = this.maxHealth / 2;
    this.specialAttackCooldown = 0;
    this.specialAttackInterval = 3;
    
    // Boss visual
    this.mesh.material.color.setHSL(0.8, 1, 0.5);
    this.mesh.material.emissive.setHSL(0.8, 1, 0.4);
    this.mesh.material.emissiveIntensity = 0.5;
  }

  update(deltaTime, player) {
    // Check phase
    if (this.health < this.phaseChangeHealth && this.phase === 1) {
      this.phase = 2;
      this.attackSpeed = 1.0; // Faster attacks
      this.speed *= 1.2;
    }

    const distance = this.mesh.position.distanceTo(player.mesh.position);

    if (distance < this.detectionRange) {
      this.targetPlayer = player;
      const direction = new THREE.Vector3()
        .subVectors(player.mesh.position, this.mesh.position)
        .normalize();
      
      if (distance > this.attackRange + 2) {
        this.mesh.position.addScaledVector(direction, this.speed * deltaTime);
      } else {
        // Regular attack
        this.attackCooldown -= deltaTime;
        if (this.attackCooldown <= 0) {
          this.attackPlayer(player);
          this.attackCooldown = this.attackSpeed;
        }

        // Special attack
        this.specialAttackCooldown -= deltaTime;
        if (this.specialAttackCooldown <= 0 && Math.random() > 0.7) {
          this.specialAttack(player);
          this.specialAttackCooldown = this.specialAttackInterval;
        }
      }
    }
  }

  attackPlayer(player) {
    const baseDamage = this.attackPower + Math.random() * 15;
    const defense = player.defense;
    const damage = Math.max(5, baseDamage - (defense * 0.3));
    player.health -= damage;
    console.log(`👹 Boss dealt ${damage.toFixed(1)} damage!`);
  }

  specialAttack(player) {
    // Wider AOE attack
    const distance = this.mesh.position.distanceTo(player.mesh.position);
    if (distance < 8) {
      const baseDamage = this.attackPower * 1.5 + Math.random() * 20;
      const defense = player.defense;
      const damage = Math.max(10, baseDamage - (defense * 0.2));
      player.health -= damage;
      console.log(`⚡ Boss used special attack! ${damage.toFixed(1)} damage!`);
    }
  }

  takeDamage(damage) {
    this.health -= damage;
  }

  getExpReward() {
    return Math.floor(500 * Math.pow(1.3, this.level - 1));
  }
}

export default Boss;
