canvas = document.querySelector("canvas")
canvas.width = innerWidth
canvas.height = innerHeight
ctx = canvas.getContext("2d")
restartDiv = document.querySelector("div")
//restartDiv.style.display = "none";
// vars for global use
let centerX = canvas.width / 2
let centerY = canvas.height / 2
let bulletSpeed = 12
let enemySpeed = 3
let enemySpawnRate = 1000
let bulletRadius = 8
let isGameRunning = true
let bgColor = "rgba(17, 21, 24, 0.3)"
let playerColor = "#CF1259"

// Game over function
function restartGame() {
	location.reload()
}
ctx.strokeStyle = 'white'

// Player
class Player {
	constructor(x, y, radius, color) {
	this.x = x
	this.y = y
	this.radius = radius
	this.color = color
	}
	draw() {
		ctx.beginPath()
		ctx.fillStyle = this.color
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		ctx.fill()
	}
}
// Player Initiation
let player = new Player(centerX, centerY, 30, playerColor)

// Bullets
class Bullet {
	constructor(x, y, radius, color, velocity) {
	this.x = x
	this.y = y
	this.radius = radius
	this.color = color
	this.velocity = velocity
	}
	draw() {
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		ctx.fillStyle = this.color
		ctx.fill()
	}
	update() {
		this.draw()
		this.x += this.velocity.x
		this.y += this.velocity.y
	}
}

// Enemies
class Enemy {
	constructor(x, y, radius, color, velocity) {
	this.x = x
	this.y = y
	this.radius = radius
	this.color = color
	this.velocity = velocity
	}
	draw() {
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		ctx.fillStyle = this.color
		ctx.fill()
	}
	update() {
		this.draw()
		this.x += this.velocity.x
		this.y += this.velocity.y
	}
}

// Arrays for bullets and Enemies
let bullets = []
let enemies = []

// Spawning Enemies
function spawnEnemies() {
let x
let y
setInterval(() => {
	let radius = Math.random() * (40 - 20) + 20
	if (Math.random() < 0.5) {
		if (Math.random() < 0.5) {
			x = 0 - radius
		} else {
			x = canvas.width + radius
		}
		y = Math.random() * canvas.height
	} else {
		if (Math.random() < 0.5) {
			y = 0 - radius
		} else {
			y = canvas.height + radius
		}
		x = Math.random() * canvas.width
	}

	//Calculating Enemy angle & velocity
	const angle = Math.atan2(player.y - y, player.x - x)
	let velocity = {
		x: Math.cos(angle) * enemySpeed,
		y: Math.sin(angle) * enemySpeed
	}
	// Enemy Color
	let colour = `hsl(${Math.random() * (250 - 60) + 60}, 80%, 60%)`
	enemies.push(new Enemy(x, y, radius, colour, velocity))
}, enemySpawnRate)
}

	// Fire on click
addEventListener('click', function(e) {
	// Calculating Bullet angle & velocity
	const angle = Math.atan2(e.clientY - player.y, e.clientX - player.x)
	let velocity = {
		x: Math.cos(angle) * bulletSpeed,
		y: Math.sin(angle) * bulletSpeed
	}
	bullet = new Bullet(centerX, centerY, bulletRadius, '#A3F9FF', velocity)
	bullets.push(bullet)
})


// Animate Loop
function animate() {
	if(!isGameRunning) return
	requestAnimationFrame(animate)
	//clear canvas
	ctx.fillStyle = bgColor
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	// Draw bullets
	bullets.forEach((bullet, i) => {
		bullet.update()

		// Splice out the bullet from array if out of canvas
		if(bullet.x < 0 - bullet.radius ||
			bullet.x > canvas.width + bullet.radius ||
			bullet.y < 0 - bullet.radius ||
			bullet.y > canvas.height + bullet.radius) {
			bullets.splice(i, 1)
		}
	})
	// Draw Enemies
	enemies.forEach((enemy, i) => {
		enemy.update()
		// distance b/w enemy and player
		const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y)
		// Checking if enemy is touching the player
		if(distance < player.radius + enemy.radius) {
			console.log('game over')
			restartDiv.style.display = "block"
			isGameRunning = false
		}

		// Checking if bullet is touching the enemy
		bullets.forEach((bullet, j) => {
			// distance b/w enemy and bullet
			const distance = Math.hypot(enemy.x - bullet.x, enemy.y - bullet.y)
			// kill enemy if touching bullet
			if(distance < bullet.radius + enemy.radius) {
				setTimeout(() => {
					bullets.splice(j, 1)
					enemies.splice(i, 1)
				}, 0)
			}
		})
		// Splice out the enemy from array if out of canvas
		if(enemy.x < 0 - enemy.radius ||
			enemy.x > canvas.width + enemy.radius ||
			enemy.y < 0 - enemy.radius ||
			enemy.y > canvas.height + enemy.radius) {
			enemies.splice(i, 1)
		}
	})
	player.draw()
}
animate()
spawnEnemies()
