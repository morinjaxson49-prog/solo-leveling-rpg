import * as THREE from 'three';

class Entity {
  constructor(x, y, z, type, size = 1) {
    this.type = type;
    this.health = 100;
    this.maxHealth = 100;
    this.position = new THREE.Vector3(x, y, z);
    
    // Create enhanced mesh with glow
    const geometry = new THREE.BoxGeometry(size, size * 2, size);
    const color = this.getColorByType(type);
    const material = new THREE.MeshStandardMaterial({ 
      color: color,
      metalness: 0.4,
      roughness: 0.6,
      emissive: color,
      emissiveIntensity: 0.3
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    
    // Add outline glow effect
    this.addGlowEffect(color);
  }

  addGlowEffect(color) {
    const outlineGeometry = new THREE.BoxGeometry(1.05, 2.1, 1.05);
    const outlineMaterial = new THREE.MeshBasicMaterial({
      color: color,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
    outline.position.copy(this.mesh.position);
    this.mesh.add(outline);
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
