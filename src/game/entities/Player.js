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
    this.attackSpeed = 1;
    this.stamina = 100;
    this.maxStamina = 100;
    this.mana = 50;
    this.maxMana = 50;
    this.velocity = new THREE.Vector3();
    this.speed = 22;
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
    this.comboCounter = 0;
    this.comboTime = 0;
    
    this.mesh.material.emissiveIntensity = 0.4;
    
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
    const moveDirection = new THREE.Vector3();
    
    if (this.keys['w']) moveDirection.z -= 1;
    if (this.keys['s']) moveDirection.z += 1;
    if (this.keys['a']) moveDirection.x -= 1;
    if (this.keys['d']) moveDirection.x += 1;
    
    if (moveDirection.length() > 0) {
      moveDirection.normalize();
      const moveSpeed = this.isDashing ? this.speed * 2.5 : this.speed;
      this.velocity.copy(moveDirection).multiplyScalar(moveSpeed);
      this.mesh.position.add(this.velocity.clone().multiplyScalar(deltaTime));
      this.isMoving = true;
    } else {
      this.isMoving = false;
      this.velocity.multiplyScalar(0.8);
    }

    // Stamina management
    if (!this.isMoving) {
      this.stamina = Math.min(this.stamina + 50 * deltaTime, this.maxStamina);
    } else {
      this.stamina = Math.max(this.stamina - 20 * deltaTime, 0);
    }

    // Mana recovery
    this.mana = Math.min(this.mana + 25 * deltaTime, this.maxMana);

    // Cooldowns
    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
    }
    for (const skill in this.skillCooldowns) {
      if (this.skillCooldowns[skill] > 0) {
        this.skillCooldowns[skill] -= deltaTime;
      }
    }

    // Combo system
    if (this.comboTime > 0) {
      this.comboTime -= deltaTime;
    } else {
      this.comboCounter = 0;
    }

    this.isDashing = false;
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
    this.maxHealth = Math.floor(120 + this.level * 30);
    this.health = this.maxHealth;
    this.skill = Math.floor(12 + this.level * 4);
    this.defense = Math.floor(5 + this.level * 1.5);
    this.attackSpeed = Math.min(1.5, this.attackSpeed + 0.05);
    this.maxStamina = Math.floor(100 + this.level * 8);
    this.stamina = this.maxStamina;
    this.maxMana = Math.floor(50 + this.level * 12);
    this.mana = this.maxMana;
    console.log(`⭐ Level ${this.level}! Stats increased!`);
  }

  attack(target) {
    if (this.stamina < 15) return 0;
    if (this.attackCooldown > 0) return 0;
    this.stamina -= 15;
    this.attackCooldown = 0.4 / this.attackSpeed;
    
    this.comboCounter += 1;
    this.comboTime = 2;
    
    const baseDamage = this.skill + Math.random() * 15;
    const critChance = Math.random();
    const comboBonus = this.comboCounter > 1 ? (this.comboCounter * 0.1) : 0;
    const damage = (critChance > 0.8 ? baseDamage * 1.8 : baseDamage) * (1 + comboBonus);
    return damage;
  }

  useSkill(skillName) {
    if (this.skillCooldowns[skillName] > 0) return false;

    switch(skillName) {
      case 'slash':
        if (this.mana >= 15) {
          this.mana -= 15;
          this.skillCooldowns['slash'] = 0.5;
          return this.skill * 1.4 + Math.random() * 25;
        }
        break;
      case 'powerAttack':
        if (this.stamina >= 45) {
          this.stamina -= 45;
          this.skillCooldowns['powerAttack'] = 1.2;
          return this.skill * 3.2 + Math.random() * 40;
        }
        break;
      case 'dash':
        if (this.stamina >= 25) {
          this.stamina -= 25;
          this.skillCooldowns['dash'] = 0.8;
          this.isDashing = true;
          return true;
        }
        break;
      case 'heal':
        if (this.mana >= 30) {
          this.mana -= 30;
          this.skillCooldowns['heal'] = 1.5;
          const healAmount = 60 + this.level * 8;
          this.heal(healAmount);
          return true;
        }
        break;
    }
    return false;
  }
}

export default Player;
