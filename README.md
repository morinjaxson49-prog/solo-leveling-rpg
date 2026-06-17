# Solo Leveling 3D RPG

A 3D browser-based RPG game inspired by the Solo Leveling universe, built with Three.js and JavaScript.

## Features

- **3D Graphics**: Built with Three.js for immersive 3D gameplay
- **Player Progression**: Level up, gain experience, and increase stats
- **Combat System**: Real-time combat with monsters of varying difficulty
- **Dungeon Exploration**: Battle monsters in progressively difficult dungeons
- **Stamina System**: Manage stamina while moving and attacking
- **Monster AI**: Intelligent enemy behavior with detection and attack patterns

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/morinjaxson49-prog/solo-leveling-rpg.git
cd solo-leveling-rpg

# Install dependencies
npm install
```

### Running the Game

```bash
# Development mode
npm run dev

# Build for production
npm run build
```

The game will be available at `http://localhost:3000`

## Controls

- **W** - Move Forward
- **A** - Move Left
- **S** - Move Backward
- **D** - Move Right
- **Attack** - Automatic when close to monsters

## Game Mechanics

### Player
- Start at Level 1 with basic stats
- Gain experience by defeating monsters
- Level up to increase Skill, Health, and Stamina
- Manage stamina while moving and attacking

### Monsters
- Patrol the dungeon and detect players
- Attack when within range
- Drop experience rewards based on their level
- Color changes with difficulty level

### Progression
- Each level requires more experience to achieve
- Stats scale with player level
- Defeat stronger monsters for more experience

## Project Structure

```
src/
├── index.js                 # Entry point
├── game/
│   ├── Game.js             # Main game class
│   ├── entities/
│   │   ├── Entity.js       # Base entity class
│   │   ├── Player.js       # Player entity
│   │   └── Monster.js      # Monster entity
│   ├── systems/
│   │   ├── CombatSystem.js # Combat logic
│   │   └── ProgressionSystem.js # Level/XP system
│   └── world/
│       └── DungeonManager.js # Dungeon generation
```

## Future Features

- [ ] Multiple dungeon levels
- [ ] Boss encounters
- [ ] Skill trees
- [ ] Item system
- [ ] Quests
- [ ] Multiplayer
- [ ] Sound effects and music
- [ ] Enhanced graphics and animations

## License

MIT
