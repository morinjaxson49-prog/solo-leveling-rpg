import * as THREE from 'three';

class DungeonManager {
  constructor(scene) {
    this.scene = scene;
    this.dungeons = [];
    this.objects = [];
  }

  createDungeon(level) {
    // Create ground with better appearance
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x0f1a3e,
      metalness: 0.15,
      roughness: 0.95
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
    this.objects.push(ground);

    this.createWalls(level);
    this.createObstacles(level);
    this.createDecorations(level);
  }

  createWalls(level) {
    const wallMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x2a2a5e,
      metalness: 0.5,
      roughness: 0.5
    });

    const wallPositions = [
      { x: 0, y: 3, z: -100 },
      { x: 0, y: 3, z: 100 },
      { x: -100, y: 3, z: 0 },
      { x: 100, y: 3, z: 0 }
    ];

    const wallGeometry = new THREE.BoxGeometry(200, 6, 3);

    wallPositions.forEach(pos => {
      const wall = new THREE.Mesh(wallGeometry, wallMaterial);
      wall.position.set(pos.x, pos.y, pos.z);
      wall.castShadow = true;
      wall.receiveShadow = true;
      this.scene.add(wall);
      this.objects.push(wall);
    });
  }

  createObstacles(level) {
    const obstacleMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x4a4a7e,
      metalness: 0.6,
      roughness: 0.3
    });

    const count = 10 + level * 3;
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 5 + 2.5;
      const obstacleGeometry = new THREE.BoxGeometry(size, size * 1.8, size);
      const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
      
      let validPosition = false;
      let x, z;
      while (!validPosition) {
        x = (Math.random() - 0.5) * 160;
        z = (Math.random() - 0.5) * 160;
        validPosition = Math.sqrt(x * x + z * z) > 20;
      }
      
      obstacle.position.set(x, size * 0.9, z);
      obstacle.rotation.y = Math.random() * Math.PI;
      obstacle.castShadow = true;
      obstacle.receiveShadow = true;
      this.scene.add(obstacle);
      this.objects.push(obstacle);
    }
  }

  createDecorations(level) {
    const decorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x7a6aed,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x7a6aed,
      emissiveIntensity: 0.4
    });

    // Crystals
    for (let i = 0; i < 8 + level; i++) {
      const crystalGeometry = new THREE.ConeGeometry(0.6, 2.5, 8);
      const crystal = new THREE.Mesh(crystalGeometry, decorMaterial);
      
      crystal.position.set(
        (Math.random() - 0.5) * 140,
        1.2,
        (Math.random() - 0.5) * 140
      );
      crystal.rotation.y = Math.random() * Math.PI;
      crystal.castShadow = true;
      this.scene.add(crystal);
      this.objects.push(crystal);
    }
  }

  clearDungeon() {
    this.objects.forEach(obj => {
      this.scene.remove(obj);
    });
    this.objects = [];
  }
}

export default DungeonManager;
