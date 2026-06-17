import * as THREE from 'three';
import Entity from './Entity';

class Player extends Entity {
  constructor(x, y, z) {
    super(x, y, z, 'player');
    this.level = 1;
    this.experience = 0;
    this.experienceToNextLevel = 100;
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.skill = 10;
    this.stamina = 100;
    this.maxStamina = 100;
    this.velocity = new THREE.Vector3();
    this.speed = 15;
    this.isMoving = false;
    this.keys = {};
    this.attackCooldown = 0;
    
    this.setupInput();
  }

  setupInput() {
    document.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
    });
    document.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }

  update(deltaTime) {
    // Handle movement
    const moveDirection = new THREE.Vector3();
    
    if (this.keys['w']) moveDirection.z -= 1;
    if (this.keys['s']) moveDirection.z += 1;
    if (this.keys['a']) moveDirection.x -= 1;
    if (this.keys['d']) moveDirection.x += 1;
    
    if (moveDirection.length() > 0) {
      moveDirection.normalize();
      this.velocity.copy(moveDirection).multiplyScalar(this.speed);
      this.mesh.position.add(this.velocity.clone().multiplyScalar(deltaTime));
      this.isMoving = true;
    } else {
      this.isMoving = false;
      this.velocity.multiplyScalar(0.9);
    }

    // Stamina recovery
    if (!this.isMoving) {
      this.stamina = Math.min(this.stamina + 30 * deltaTime, this.maxStamina);
    } else {
      this.stamina = Math.max(this.stamina - 10 * deltaTime, 0);
    }

    // Update attack cooldown
    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
    }
  }

  gainExperience(amount) {
    this.experience += amount;
    if (this.experience >= this.experienceToNextLevel) {
      this.levelUp();
    }
  }

  levelUp() {
    this.level += 1;
    this.experience = 0;
    this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5);
    this.maxHealth += 20;
    this.health = this.maxHealth;
    this.skill += 5;
    this.maxStamina += 10;
    this.stamina = this.maxStamina;
    console.log(`Level Up! Current Level: ${this.level}`);
  }

  attack(target) {
    if (this.stamina < 20) return 0; // Not enough stamina
    if (this.attackCooldown > 0) return 0; // Still on cooldown
    this.stamina -= 20;
    this.attackCooldown = 0.5;
    const damage = this.skill + Math.random() * 10;
    return damage;
  }
}

export default Player;
