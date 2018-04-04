import Scene1 from './scene1.js'

let config = {
  // Use WebGL with Canvas fallback
  type: Phaser.AUTO,
  width: 800,
  height: 600,

  // scene: {
  //   preload
  //   create
  //   update
  // },
  //
  scene: [Scene1],

  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 300},
      debug: false
    }
  }
}

const game = new Phaser.Game(config)

export default game
