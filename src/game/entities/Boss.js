import * as THREE from 'three';
import Entity from './Entity';

class Boss extends Entity {
  constructor(x, y, z, level) {
    const size = 2;
    super(x, y, z, 'boss', size);
    this.level = level;
    this.name = `Igris - Level ${level}`;
    this.health = 250 + level * 60;
    this.maxHealth = this.health;
    this.attackPower = 35 + level * 6;
    this.attackRange = 5;
    this.attackCooldown = 0;
    this.attackSpeed = 1.3;
    this.speed = 12 + level * 0.3;
    this.detectionRange = 60;
    this.targetPlayer = null;
    this.phase = 1;
    this.phaseChangeHealth = this.maxHealth / 2;
    this.specialAttackCooldown = 0;
    this.specialAttackInterval = 2.5;
    this.ultimateCharge = 0;
    this.ultimateReady = false;
    
    this.mesh.material.color.setHSL(0.8, 1, 0.55);
    this.mesh.material.emissive.setHSL(0.8, 1, 0.5);
    this.mesh.material.emissiveIntensity = 0.6;
  }

  update(deltaTime, player) {
    // Phase progression
    if (this.health < this.phaseChangeHealth && this.phase === 1) {
      this.phase = 2;
      this.attackSpeed = 0.85;
      this.speed *= 1.3;
    }

    // Ultimate charge
    this.ultimateCharge += deltaTime * 0.3;
    if (this.ultimateCharge >= 1) {
      this.ultimateReady = true;
    }

    const distance = this.mesh.position.distanceTo(player.mesh.position);

    if (distance < this.detectionRange) {
      this.targetPlayer = player;
      const direction = new THREE.Vector3()
        .subVectors(player.mesh.position, this.mesh.position)
        .normalize();
      
      if (distance > this.attackRange + 1) {
        this.mesh.position.addScaledVector(direction, this.speed * deltaTime);
      } else {
        this.attackCooldown -= deltaTime;
        if (this.attackCooldown <= 0) {
          this.attackPlayer(player);
          this.attackCooldown = this.attackSpeed;
        }

        this.specialAttackCooldown -= deltaTime;
        if (this.specialAttackCooldown <= 0 && Math.random() > 0.65) {
          this.specialAttack(player);
          this.specialAttackCooldown = this.specialAttackInterval;
        }

        // Ultimate attack
        if (this.ultimateReady && Math.random() > 0.85 && this.phase === 2) {
          this.ultimateAttack(player);
          this.ultimateReady = false;
          this.ultimateCharge = 0;
        }
      }
    }
  }

  attackPlayer(player) {
    const baseDamage = this.attackPower + Math.random() * 18;
    const defense = player.defense;
    const damage = Math.max(8, baseDamage - (defense * 0.3));
    player.health -= damage;
  }

  specialAttack(player) {
    const distance = this.mesh.position.distanceTo(player.mesh.position);
    if (distance < 10) {
      const baseDamage = this.attackPower * 1.8 + Math.random() * 25;
      const defense = player.defense;
      const damage = Math.max(12, baseDamage - (defense * 0.2));
      player.health -= damage;
      console.log(`⚡ Boss special attack! ${damage.toFixed(1)} damage!`);
    }
  }

  ultimateAttack(player) {
    const baseDamage = this.attackPower * 3.5 + Math.random() * 40;
    const defense = player.defense;
    const damage = Math.max(25, baseDamage - (defense * 0.1));
    player.health -= damage;
    console.log(`💥 BOSS ULTIMATE! ${damage.toFixed(1)} damage!`);
  }

  takeDamage(damage) {
    this.health -= damage;
  }

  getExpReward() {
    return Math.floor(800 * Math.pow(1.35, this.level - 1));
  }
}

export default Boss;
