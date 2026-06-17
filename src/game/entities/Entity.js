import * as THREE from 'three';

class Entity {
  constructor(x, y, z, type) {
    this.type = type;
    this.health = 100;
    this.maxHealth = 100;
    this.position = new THREE.Vector3(x, y, z);
    
    // Create mesh
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshStandardMaterial({ 
      color: type === 'player' ? 0x00ff00 : 0xff0000,
      metalness: 0.5,
      roughness: 0.5
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }

  takeDamage(amount) {
    this.health -= amount;
  }

  heal(amount) {
    this.health = Math.min(this.health + amount, this.maxHealth);
  }

  isDead() {
    return this.health <= 0;
  }
}

export default Entity;
