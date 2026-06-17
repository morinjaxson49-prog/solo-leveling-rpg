import * as THREE from 'three';

class DungeonManager {
  constructor(scene) {
    this.scene = scene;
    this.dungeons = [];
    this.objects = [];
  }

  createDungeon(level) {
    // Create ground with texture-like material
    const groundGeometry = new THREE.PlaneGeometry(150, 150);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a3e,
      metalness: 0.1,
      roughness: 0.9
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
    this.objects.push(ground);

    // Create walls (boundaries) with gradient
    this.createWalls(level);

    // Add obstacles based on level
    this.createObstacles(level);

    // Add environmental decorations
    this.createDecorations(level);
  }

  createWalls(level) {
    const wallMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x2a2a4e,
      metalness: 0.4,
      roughness: 0.6
    });

    const wallPositions = [
      { x: 0, y: 2, z: -75 },
      { x: 0, y: 2, z: 75 },
      { x: -75, y: 2, z: 0 },
      { x: 75, y: 2, z: 0 }
    ];

    const wallGeometry = new THREE.BoxGeometry(150, 5, 2);

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
      color: 0x4a4a6e,
      metalness: 0.6,
      roughness: 0.4
    });

    const count = 8 + level * 2;
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 4 + 2;
      const obstacleGeometry = new THREE.BoxGeometry(size, size * 1.5, size);
      const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
      
      let validPosition = false;
      let x, z;
      while (!validPosition) {
        x = (Math.random() - 0.5) * 120;
        z = (Math.random() - 0.5) * 120;
        validPosition = Math.sqrt(x * x + z * z) > 15; // Avoid player spawn area
      }
      
      obstacle.position.set(x, size * 0.75, z);
      obstacle.rotation.y = Math.random() * Math.PI;
      obstacle.castShadow = true;
      obstacle.receiveShadow = true;
      this.scene.add(obstacle);
      this.objects.push(obstacle);
    }
  }

  createDecorations(level) {
    const decorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x6a5acd,
      metalness: 0.7,
      roughness: 0.3,
      emissive: 0x6a5acd,
      emissiveIntensity: 0.2
    });

    // Crystals
    for (let i = 0; i < 5 + level; i++) {
      const crystalGeometry = new THREE.ConeGeometry(0.5, 2, 8);
      const crystal = new THREE.Mesh(crystalGeometry, decorMaterial);
      
      crystal.position.set(
        (Math.random() - 0.5) * 100,
        1,
        (Math.random() - 0.5) * 100
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
