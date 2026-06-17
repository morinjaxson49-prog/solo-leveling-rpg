import * as THREE from 'three';

class Entity {
  constructor(x, y, z, type, size = 1) {
    this.type = type;
    this.health = 100;
    this.maxHealth = 100;
    this.position = new THREE.Vector3(x, y, z);
    
    // Create mesh
    const geometry = new THREE.BoxGeometry(size, size * 2, size);
    const color = this.getColorByType(type);
    const material = new THREE.MeshStandardMaterial({ 
      color: color,
      metalness: 0.3,
      roughness: 0.7,
      emissive: color,
      emissiveIntensity: 0.2
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }

  getColorByType(type) {
    const colors = {
      'player': 0x00ff00,
      'monster': 0xff0000,
      'boss': 0xff00ff
    };
    return colors[type] || 0xffffff;
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
