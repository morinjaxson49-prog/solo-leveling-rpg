import * as THREE from 'three';

class Particle {
  constructor(position, velocity, color, life) {
    this.position = position.clone();
    this.velocity = velocity;
    this.color = color;
    this.life = life;
    this.maxLife = life;
  }

  update(deltaTime) {
    this.position.addScaledVector(this.velocity, deltaTime);
    this.life -= deltaTime;
    this.velocity.y -= 9.8 * deltaTime; // Gravity
  }
}

class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
    this.damageNumbers = [];
    this.canvas = document.createElement('canvas');
    this.canvas.width = 256;
    this.canvas.height = 256;
  }

  createExplosion(position, color, scale = 1) {
    const particleCount = Math.floor(20 * scale);
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5);
      const speed = 15 + Math.random() * 25;
      const velocity = new THREE.Vector3(
        Math.cos(angle) * speed,
        Math.random() * 20 + 5,
        Math.sin(angle) * speed
      );
      
      const particle = new Particle(position, velocity, color, 1 + Math.random());
      this.particles.push(particle);
    }
  }

  createDamageNumber(position, text, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 128);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({ 
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    mesh.position.y += 2;
    
    this.scene.add(mesh);
    this.damageNumbers.push({ mesh, life: 1.5 });
  }

  update(deltaTime) {
    // Update particles
    this.particles = this.particles.filter(particle => {
      particle.update(deltaTime);
      return particle.life > 0;
    });

    // Update damage numbers
    this.damageNumbers = this.damageNumbers.filter(dmg => {
      dmg.life -= deltaTime;
      const progress = 1 - (dmg.life / 1.5);
      dmg.mesh.position.y += 2 * deltaTime;
      dmg.mesh.material.opacity = 1 - progress;
      
      if (dmg.life <= 0) {
        this.scene.remove(dmg.mesh);
        return false;
      }
      return true;
    });
  }
}

export default ParticleSystem;
