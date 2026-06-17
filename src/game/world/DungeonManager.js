import * as THREE from 'three';

class DungeonManager {
  constructor(scene) {
    this.scene = scene;
    this.dungeons = [];
  }

  createDungeon(level) {
    // Create ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333,
      metalness: 0.2,
      roughness: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Create walls (boundaries)
    this.createWalls();

    // Add some obstacles
    this.createObstacles();
  }

  createWalls() {
    const wallMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a2e,
      metalness: 0.3,
      roughness: 0.7
    });

    const wallPositions = [
      { x: 0, y: 2, z: -50 },
      { x: 0, y: 2, z: 50 },
      { x: -50, y: 2, z: 0 },
      { x: 50, y: 2, z: 0 }
    ];

    const wallGeometry = new THREE.BoxGeometry(100, 4, 2);

    wallPositions.forEach(pos => {
      const wall = new THREE.Mesh(wallGeometry, wallMaterial);
      wall.position.set(pos.x, pos.y, pos.z);
      wall.castShadow = true;
      wall.receiveShadow = true;
      this.scene.add(wall);
    });
  }

  createObstacles() {
    const obstacleMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x555555,
      metalness: 0.5,
      roughness: 0.5
    });

    // Create random obstacles
    for (let i = 0; i < 10; i++) {
      const size = Math.random() * 3 + 2;
      const obstacleGeometry = new THREE.BoxGeometry(size, size, size);
      const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
      
      obstacle.position.set(
        (Math.random() - 0.5) * 80,
        size / 2,
        (Math.random() - 0.5) * 80
      );
      
      obstacle.castShadow = true;
      obstacle.receiveShadow = true;
      this.scene.add(obstacle);
    }
  }
}

export default DungeonManager;
