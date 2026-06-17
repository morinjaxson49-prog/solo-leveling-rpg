import * as THREE from 'three';
import Entity from './Entity';

class Player extends Entity {
  constructor(x, y, z) {
    super(x, y, z, 'player', 0.8);
    this.level = 1;
    this.experience = 0;
    this.experienceToNextLevel = 100;
    this.maxHealth = 150;
    this.health = this.maxHealth;
    this.skill = 15;
    this.defense = 5;
    this.stamina = 100;
    this.maxStamina = 100;
    this.mana = 50;
    this.maxMana = 50;
    this.velocity = new THREE.Vector3();
    this.speed = 20;
    this.isMoving = false;
    this.keys = {};
    this.attackCooldown = 0;
    this.skillCooldowns = {
      'slash': 0,
      'powerAttack': 0,
      'dash': 0,
      'heal': 0
    };
    this.isDashing = false;
    this.dashDirection = new THREE.Vector3();
    
    // Visual enhancements
    this.mesh.material.emissiveIntensity = 0.3;
    
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
      const moveSpeed = this.isDashing ? this.speed * 2 : this.speed;
      this.velocity.copy(moveDirection).multiplyScalar(moveSpeed);
      this.mesh.position.add(this.velocity.clone().multiplyScalar(deltaTime));
      this.isMoving = true;
    } else {
      this.isMoving = false;
      this.velocity.multiplyScalar(0.85);
    }

    // Stamina recovery
    if (!this.isMoving) {
      this.stamina = Math.min(this.stamina + 40 * deltaTime, this.maxStamina);
    } else {
      this.stamina = Math.max(this.stamina - 15 * deltaTime, 0);
    }

    // Mana recovery
    this.mana = Math.min(this.mana + 20 * deltaTime, this.maxMana);

    // Update cooldowns
    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
    }
    for (const skill in this.skillCooldowns) {
      if (this.skillCooldowns[skill] > 0) {
        this.skillCooldowns[skill] -= deltaTime;
      }
    }

    // End dash
    if (this.isDashing) {
      this.isDashing = false;
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
    this.maxHealth = Math.floor(100 + this.level * 25);
    this.health = this.maxHealth;
    this.skill = Math.floor(10 + this.level * 3);
    this.defense = Math.floor(5 + this.level * 1);
    this.maxStamina = Math.floor(100 + this.level * 5);
    this.stamina = this.maxStamina;
    this.maxMana = Math.floor(50 + this.level * 8);
    this.mana = this.maxMana;
    console.log(`🌟 Level Up! Current Level: ${this.level}`);
  }

  attack(target) {
    if (this.stamina < 15) return 0;
    if (this.attackCooldown > 0) return 0;
    this.stamina -= 15;
    this.attackCooldown = 0.4;
    const baseDamage = this.skill + Math.random() * 15;
    const critChance = Math.random();
    const damage = critChance > 0.8 ? baseDamage * 1.5 : baseDamage;
    return damage;
  }

  useSkill(skillName) {
    if (this.skillCooldowns[skillName] > 0) return false;

    switch(skillName) {
      case 'slash':
        if (this.mana >= 15) {
          this.mana -= 15;
          this.skillCooldowns['slash'] = 0.6;
          return this.skill * 1.2 + Math.random() * 20;
        }
        break;
      case 'powerAttack':
        if (this.stamina >= 40) {
          this.stamina -= 40;
          this.skillCooldowns['powerAttack'] = 1.5;
          return this.skill * 2.5 + Math.random() * 30;
        }
        break;
      case 'dash':
        if (this.stamina >= 20) {
          this.stamina -= 20;
          this.skillCooldowns['dash'] = 1.0;
          this.isDashing = true;
          return true;
        }
        break;
      case 'heal':
        if (this.mana >= 25) {
          this.mana -= 25;
          this.skillCooldowns['heal'] = 2.0;
          const healAmount = 50 + this.level * 5;
          this.heal(healAmount);
          return true;
        }
        break;
    }
    return false;
  }
}

export default Player;
