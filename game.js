var config = {
  // Use WebGL with Canvas fallback
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 300},
      debug: false
    }
  }
}
const game = new Phaser.Game(config)

function preload() {
  this.load.image('sky', 'assets/sky.png')
  this.load.image('ground', 'assets/platform.png')
  this.load.image('star', 'assets/star.png')
  this.load.image('bomb', 'assets/bomb.png')
  this.load.image('ground', 'assets/platform.png')
  this.load.spritesheet('dude', 'assets/dude.png', {
    frameWidth: 32,
    frameHeight: 48
  })
}

let platforms
let player
let cursors
let stars
let score = 0
let scoreText
let bombs
let gameOver

function collectStar(player, star) {
  star.disableBody(true, true)
  score = score + 10
  scoreText.setText(`score: ${score}`)

  if (stars.countActive(true) === 0) {
    stars.children.iterate(function(child) {
      child.enableBody(true, child.x, 0, true, true)
    })

    var x = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400)

    var bomb = bombs.create(x, 16, 'bomb')
    bomb.setBounce(1)
    bomb.setCollideWorldBounds(true)
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
    bomb.allowGravity = false
  }
}

function hitBomb(player, bomb) {
  this.physics.pause()
  player.setTint(0xff0000)
  player.anims.play('turn')
  gameOver = true
}

function create() {
  // Images are positioned based on their center.
  this.add.image(400, 300, 'sky')
  // this.add.image(0, 0, 'star').setOrigin(0, 0)

  // Add some platforms to jump on
  platforms = this.physics.add.staticGroup()
  platforms
    .create(400, 568, 'ground')
    .setScale(2)
    .refreshBody()
  platforms.create(600, 400, 'ground')
  platforms.create(50, 250, 'ground')
  platforms.create(750, 220, 'ground')

  player = this.physics.add.sprite(100, 450, 'dude')
  player.setBounce(0.2)
  player.setCollideWorldBounds(true)
  // "body" represents the sprite in the arcade physics engine
  // player.body.setGravityY(300)

  // Create three animations. They basically cycle through the sprite.
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
    frameRate: 10,
    repeat: -1
  })
  this.anims.create({
    key: 'turn',
    frames: [{key: 'dude', frame: 4}],
    frameRate: 20
  })
  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
    frameRate: 10,
    repeat: -1
  })

  // Enable keyboard shortcuts
  cursors = this.input.keyboard.createCursorKeys()

  // Create some stars we can pick up
  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: {x: 12, y: 0, stepX: 70}
  })
  stars.children.iterate(function(child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
  })

  // And some bombs
  bombs = this.physics.add.group()

  // Detect collision
  this.physics.add.collider(stars, platforms)
  this.physics.add.collider(bombs, platforms)
  this.physics.add.collider(player, platforms)
  this.physics.add.collider(player, bombs, hitBomb, null, this)
  this.physics.add.overlap(player, stars, collectStar, null, this)

  // Score system
  scoreText = this.add.text(16, 16, `score: ${score}`, {
    fontSize: '32px',
    fill: '#000'
  })
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160)
    player.anims.play('left', true)
  } else if (cursors.right.isDown) {
    player.setVelocityX(160)
    player.anims.play('right', true)
  } else {
    player.setVelocityX(0)
    player.anims.play('turn')
  }

  // We test whether the player is touching the floor,
  // otherwise you'd be able to jump mid-air.
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330)
  }
}

// http://phaser.io/tutorials/making-your-first-phaser-3-game/part10

export default game
