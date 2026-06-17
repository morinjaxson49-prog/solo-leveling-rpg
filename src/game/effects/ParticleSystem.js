import * as THREE from 'three';

class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
    this.damageNumbers = [];
  }

  createExplosion(position, color, scale = 1) {
    const particleCount = Math.floor(30 * scale);
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.3;
      const speed = 20 + Math.random() * 30;
      const velocity = new THREE.Vector3(
        Math.cos(angle) * speed,
        Math.random() * 25 + 8,
        Math.sin(angle) * speed
      );
      
      const particle = {
        mesh: this.createParticleMesh(color),
        velocity,
        life: 1.2 + Math.random() * 0.8
      };
      particle.mesh.position.copy(position);
      this.scene.add(particle.mesh);
      this.particles.push(particle);
    }
  }

  createParticleMesh(color) {
    const geometry = new THREE.SphereGeometry(0.15, 8, 8);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.8,
      metalness: 0.6,
      roughness: 0.2
    });
    return new THREE.Mesh(geometry, material);
  }

  createDamageNumber(position, text, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    ctx.font = 'bold 70px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 5;
    ctx.fillText(text, 128, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({ 
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    });
    const geometry = new THREE.PlaneGeometry(3, 1.5);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    mesh.position.y += 2.5;
    
    this.scene.add(mesh);
    this.damageNumbers.push({ mesh, life: 1.5 });
  }

  update(deltaTime) {
    // Update particles
    this.particles = this.particles.filter(particle => {
      particle.mesh.position.addScaledVector(particle.velocity, deltaTime);
      particle.velocity.y -= 15 * deltaTime; // Gravity
      particle.life -= deltaTime;
      
      const progress = 1 - (particle.life / 2);
      particle.mesh.material.opacity = 1 - progress;
      particle.mesh.scale.set(1 - progress * 0.7, 1 - progress * 0.7, 1 - progress * 0.7);
      
      if (particle.life <= 0) {
        this.scene.remove(particle.mesh);
        return false;
      }
      return true;
    });

    // Update damage numbers
    this.damageNumbers = this.damageNumbers.filter(dmg => {
      dmg.life -= deltaTime;
      const progress = 1 - (dmg.life / 1.5);
      dmg.mesh.position.y += 3 * deltaTime;
      dmg.mesh.material.opacity = 1 - (progress * progress);
      dmg.mesh.scale.set(1 + progress * 0.3, 1 + progress * 0.3, 1);
      
      if (dmg.life <= 0) {
        this.scene.remove(dmg.mesh);
        return false;
      }
      return true;
    });
  }
}

export default ParticleSystem;
