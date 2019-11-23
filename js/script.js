let canvas = document.getElementById('canvas');
let sonicBg = document.getElementById('bcg-game');
let sonicImg = document.getElementById('sonic-player');
let little = document.getElementById('little-red');
let coins = document.getElementById('gold-ring');
let weapon = document.getElementById('weapon')

// let singleP = document.getElementById('single-player');
// singleP.onclick = () => {
//   startGame();
// }

class Sonic1P {
  constructor (canvas, sonicBg) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
    this.interval;
    this.player;
    this.gravity = 5;
    this.floorY = 400;
    this.sonicBgX = 0;
    this.sonicBgY = 0;
    this.sonicBgX2 = canvas.width;
    this.sonicBg = sonicBg;
    this.sonicCoins = 0;
    this.coinsArr = [];
    this.enemies = [];
    this.weapon = [];
    this.frames = 0;
  }

  startGame() {
    this.createKeyEvents();
    this.player = new Sonic(0, 350, 55, 125, sonicImg)
    this.interval = setInterval(() => {
      this.frames++
      // if (this.player.y > this.floorY) {
      //   this.player.y+=this.gravity;
      // }
      if (this.frames % 10 == 0) {
        this.coinsArr.push(new Coin(this.width, this.floorY-25, 25, 25, coins))
      }
      if (this.frames % 173 == 0) {
        this.enemies.push(new Little(this.width, this.floorY-50, 50, 50, little))
      }
      this.coinsArr.forEach((coin,ci) => {
        if (this.player.checkCollition(coin)){
          this.sonicCoins+=1;
          this.coinsArr.splice(ci,1);
        }
      })
      this.enemies.forEach((enemy, ei) => {
        if (this.player.checkCollition(enemy)) {
          this.sonicCoins-=10;
          this.enemies.splice(ei,1);
        }
      })
      if (this.sonicCoins % 5 == 0 && this.sonicCoins > this.weapon.length * 1) {
        this.weapon.push(new Weapon(this.player.x + this.player.w, 50, 50, weapon))
      }
      this.draw()
    },1000/60)
  }

  draw() {
    this.ctx.clearRect(0,0,this.width, this.height);
    this.drawBackground();
    this.player.drawItself(this.ctx, this.gravity, this.floorY);
    this.coinsArr.forEach(coin => {
      coin.x-=10;
      coin.drawItself(this.ctx)
    })
    this.enemies.forEach(e => {
      e.x-=5;
      e.drawItself(this.ctx)
    })
  }

  drawBackground() {
    if (this.sonicBgX <= 0) {
      this.sonicBgX2 = this.sonicBgX + this.width
    }
    if (this.sonicBgX > 0) {
      this.sonicBgX2 = this.sonicBgX - this.width
    }
    if (this.sonicBgX2 <= 0) {
      this.sonicBgX = this.sonicBgX2 + this.width
    }
    if (this.sonicBgX2 > 0) {
      this.sonicBgX = this.sonicBgX2 - this.width
    }
    this.ctx.drawImage(this.sonicBg, this.sonicBgX, this.sonicBgY, this.width, this.height);
    this.ctx.drawImage(this.sonicBg, this.sonicBgX2, this.sonicBgY, this.width, this.height);
  }

  //Sonic moves
  move(value) {
   if (this.player.x + this.player.w < this.width) {
     this.player.x-=value;
   }
   if (this.player.x + this.player.w > this.width) {
     this.player.x+=value;
   }
   if (this.player.x < 0) {
     this.player.x+=value;
   }
  }

  //Background move
  moveBack(value) {
   this.sonicBgX+=value;
  }

  //Event Listener
  createKeyEvents() {
   document.onkeydown = (event) => {
     switch(event.which) {
       case 32:
       // this.ctx.drawImage(this.player.x + this.player.w,this.player.w/2, 50, 50, weapon)
       // this.weapon.drawItself(this.ctx);
       case 37:
       this.move(5);
       this.moveBack(20);
       break;
       case 38:
       this.player.jump(this.gravity);
       break;
       case 39:
       this.move(-5);
       this.moveBack(-20);
       break;
       case 40:
       this.player.goDown(this.ctx)
       default:
       break;
      }
    }
  document.onkeyup = (event) => {
    switch(event.which) {
      case 40:
      this.player.goUp(this.ctx)
      break;
     }
   }
 }
}

class Unit {
  constructor (x, y, w, h, src) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.src = src;
  }

  drawItself(ctx, gravity, floorY) {
    if (this.y + this.h < floorY) {
      this.y+=gravity
    }
    if (this.y + this.h > floorY) {
      this.y = floorY - this.h;
    }
    ctx.drawImage(this.src, this.x, this.y, this.w, this.h);
  }
}

class Sonic extends Unit {
  constructor (x, y, w, h, src) {
    super (x, y, w, h, src)
    this.h = h;
  }

  goDown (ctx) {
    this.h = 70
  }

  goUp (ctx) {
    this.h = 125;
  }

  jump (gravity) {
    if (this.y > this.h/2) {
      this.y-=200-gravity
    }
  }

  checkCollition(unit) {
    if (this.x + (this.w/2) > unit.x && unit.x + unit.w > this.x && this.y < unit.y + unit.h && this.y + this.h > unit.y) {
      return true;
    }
    return false;
  }
}

class Coin extends Unit {
  constructor (x, y, w, h, src) {
    super(x, y, w, h, src)
    this.y = Math.floor(Math.random()* (326 - 126 + 1) + 126);
  }
  drawItself(ctx) {
    ctx.drawImage(this.src, this.x, this.y, this.w, this.h);
  }
}

class Little extends Unit {
  constructor (x, y, w, h, src) {
    super (x, y, w, h, src)
    this.y = Math.floor(Math.random() * 400);
  }
  drawItself(ctx) {
    ctx.drawImage(this.src, this.x, this.y, this.w, this.h);
  }
}

class Weapon extends Unit {
  drawItself(ctx) {
    this.weapon.forEach(wpn => {
      wpn+=10;
      ctx.drawImage(this.src, this.x, this.y, this.w, this.h);
    })
  }

  checkCollition(unit) {
    if (this.x + (this.w/2) > unit.x && unit.x + unit.w > this.x && this.y < unit.y + unit.h && this.y + this.h > unit.y) {
      return true;
    }
    return false;
  }
}

class Sonic2P {
  constructor (canvas, sonicBg) {}
}

let game = new Sonic1P(canvas, sonicBg);
game.startGame();