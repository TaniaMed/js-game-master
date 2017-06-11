'use strict';

class Vector {
	constructor(x = 0, y = 0) {
	  this.x = x;
	  this.y = y;
	}	
	plus(vector) {
	  if (!(vector instanceof Vector)) {
	      // форматирование
          // в задании написано сообщение должно быть "Можно прибавлять к вектору только вектор типа Vector"
          // лучше сделать как задании, на всякий случай
	  throw new Error('vector must be Vector');
      }
      return new Vector(this.x + vector.x, this.y + vector.y);
	}
	times(n) {
	  return new Vector(this.x * n, this.y * n);
	}
}

class Actor {    
  constructor(position = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) { 
        
    if (!(position instanceof Vector)) {
      throw new Error('position must be Vector');
    }
    if (!(size instanceof Vector)) {
      throw new Error('size must be Vector');
    }
    if (!(speed instanceof Vector)) {
      throw new Error('speed must be Vector');
    }

    this.pos = position;
	this.size = size;
	this.speed = speed;
  }
  get type() {
    return 'actor';
  }
  get left() {
    return this.pos.x;
  }
  get right() {
    return this.pos.x + this.size.x;
  }
  get top() {
    return this.pos.y;
  }
  get bottom() {
    return this.pos.y + this.size.y;
  }
  act() {
  }    
  isIntersect(actor) {        
	if (!(actor instanceof Actor)) { 
      throw new Error('actor must be Actor');
    }
    if (actor === this) {
      return false;
    } 
    if (actor.left >= this.right) {
      return false;
    } 
    if (actor.top >= this.bottom) {
      return false;
    } 
    if (actor.right <= this.left) {
      return false;
    } 
    if (actor.bottom <= this.top) {
      return false;
    }
    return true;
	}
}

class Level {
	constructor(grid = [], actors = []) {
        
    this.grid = grid.slice();
    this.actors = actors.slice();
	this.status = null;
    this.finishDelay = 1; 
        
    this.width = this.grid.reduce(function(bestLength, newLine) {
      if (newLine.length > bestLength) {
        return newLine.length;
      }
      return bestLength;
    }, 0);
            
    this.height = this.grid.length;
  }
  get player() {
    return this.actors.find(actor => actor.type === 'player');
  }
  isFinished() {
    return this.status !== null && this.finishDelay < 0;
  }
  actorAt(actor = undefined) {
    if (!(actor instanceof Actor)) { 
      throw new Error('actor must be Actor');
    }
    return this.actors.find(other => actor.isIntersect(other));
  }
  obstacleAt(pos, size) {
    let xStart = Math.floor(pos.x);
    let xEnd = Math.ceil(pos.x + size.x);
    let yStart = Math.floor(pos.y);
    let yEnd = Math.ceil(pos.y + size.y);

    if (xStart < 0 || xEnd > this.width || yStart < 0) {
      return "wall";
    }
    if (yEnd > this.height) {
      return "lava";
    }
    for (let y = yStart; y < yEnd; y++) {
      for (let x = xStart; x < xEnd; x++) {
        let fieldType = this.grid[y][x];
        if (fieldType) {
          return fieldType;
        }                
      }
    }
  }    
  removeActor(actor) {
    this.actors = this.actors.filter(other => other !== actor);
  }
  noMoreActors(type = '') {
    return !this.actors.some(actor => actor.type === type);  
  }
  playerTouched(type, actor) {
    // Посмотрите описание метода в задании, тут нужно ещё проверить текущий статус
    // сейччас можно собрать последнюю монетку и пройти уровень после соприкосновения с шаровой молнией
    if (type === 'lava' || type === 'fireball') {
      this.status = 'lost';
      // метод не должен ничего возврщать - тут должен быть просто return;
      return 'lost';
    } 
    if (type === 'coin' && this.status === null) {
      this.removeActor(actor);
      if (this.noMoreActors('coin')) {
        this.status = 'won';
        return 'won';
      }
    }
  }
}

class LevelParser {
  constructor(list = {}) {
    this.list = Object.assign({}, list);
  }  
  actorFromSymbol(symbol = undefined) {
    return this.list[symbol];
  }
  obstacleFromSymbol(symbol = undefined) {
    switch (symbol) {
      case 'x':
        return 'wall';          
      case '!':
        return 'lava';          
      default:
        return undefined;        
    }
  }
  createGrid(plan = []) {
    return plan.map(line => line.split('').map(symbol =>   
                                this.obstacleFromSymbol(symbol)));
  }    
  createActors(plan = []) { 
    let actors = [];    
    plan.forEach((line, y) => {
      line.split('').forEach((element, x) => {
        let classA = this.actorFromSymbol(element);
        if (typeof(classA) === 'function') {
          let actor = new classA(new Vector(x, y));
          if (actor instanceof Actor) {
            actors.push(actor);
          }
        }
      })
    });
    return actors;
  }
  parse(plan = []) {
    let grid = this.createGrid(plan);
    let actors = this.createActors(plan);
    return new Level(grid, actors);        
  }
}

class Fireball extends Actor {
  constructor(pos = new Vector(0, 0), speed = new Vector(0, 0)) {
    super(pos, new Vector(1, 1), speed); 
  }
  get type() {
    return 'fireball';
  }
  getNextPosition(time = 1) {
    return this.pos.plus(this.speed.times(time));
  }
  handleObstacle() {
    this.speed = this.speed.times(-1);
  }
  act(time, level) {   
    let newPos = this.getNextPosition(time);
    if (level.obstacleAt(newPos, this.size)) {
      this.handleObstacle(); 
    } else { 
      this.pos = newPos;
    }       
  }
}    

class HorizontalFireball extends Fireball {
  constructor(pos) {
    super(pos, new Vector(2, 0));
  }
}

class VerticalFireball extends Fireball {
  constructor(pos) {
    super(pos, new Vector(0, 2)); 
  }
}

function changeSpeed() {
  let max = -5;
  let min = 5;
  return Math.random() * (max - min) + min;
}

class ObliquelyFireball extends Fireball {
  constructor(pos) {
    super(pos, new Vector(changeSpeed(), changeSpeed())); 
  }
}

class СircularCoin extends Actor {
  constructor(pos = new Vector(0,0)) {
    super(pos.plus(new Vector(0.2, 0.1)), new Vector(0.6, 0.6));
    this.basePos = this.pos;
    this.springSpeed = 8;
    this.springDist = 2;
        
    let max = 0;
    let min = 2 * Math.PI;
    this.spring = Math.random() * (max - min) + min;
  }
  get type() {
    return 'coin';
  }
  updateSpring(time = 1) {
    this.spring = this.spring + this.springSpeed * time;
  }
  getSpringVector(x = 0, y = 0) {
    return new Vector(x + Math.sin(this.spring) * this.springDist , y + Math.cos(this.spring) * this.springDist);
  }
  getNextPosition(time = 1) {
    this.updateSpring(time);
    return this.getSpringVector(this.basePos.x, this.basePos.y);
  }
  act(time = 1) {
    this.pos = this.getNextPosition(time);
  } 
}



class FireRain extends Fireball {
  constructor(pos) {
    super(pos, new Vector(0, 3));
    this.startPosition = pos;           
  }
  get type() {
    return 'fireball';
  }
  handleObstacle() {
    this.pos = this.startPosition;
  }
} 

class Coin extends Actor {
  constructor(pos = new Vector(0,0)) {
    super(pos.plus(new Vector(0.2, 0.1)), new Vector(0.6, 0.6));
    this.basePos = this.pos;
    this.springSpeed = 8;
    this.springDist = 0.07;
        
    let max = 0;
    let min = 2 * Math.PI;
    this.spring = Math.random() * (max - min) + min;
  }
  get type() {
    return 'coin';
  }
  updateSpring(time = 1) {
    this.spring = this.spring + this.springSpeed * time;
  }
  getSpringVector(x = 0, y = 0) {
    return new Vector(x, y + Math.sin(this.spring) * this.springDist);
  }
  getNextPosition(time = 1) {
    this.updateSpring(time);
    return this.getSpringVector(this.basePos.x, this.basePos.y);
  }
  act(time = 1) {
    this.pos = this.getNextPosition(time);
  } 
}

class Player extends Actor {
  constructor(pos = new Vector(0, 0)) {
    super(pos.plus(new Vector(0, -0.5)), new Vector(0.8, 1.5));
  }  
  get type() {
    return 'player';
  }
}

const schemas = [
  [
    "     v                 ",
    "                       ",
    "                       ",
    "         %      o      ",
    "                       ",
    "  |   #      w         ",
    "  o                 o  ",
    "  x               = x  ",
    "  x      %   o o    x  ",
    "  x  @    *  xxxxx  x  ",
    "  xxxxx             x  ",
    "      x!!!!!!!!!!!!!x  ",
    "      xxxxxxxxxxxxxxx  ",
    "                       "
  ],
  [
    "        |           |  ",
    "                       ",
    "   #           %       ",
    "                       ",
    "                       ",
    "                       ",
    "           #           ",
    "                       ",
    "                       ",
    "     |       %         ",
    "                       ",
    "         =      |      ",
    " @ |  o            o   ",
    "xxxxxxxxx!!!!!!!xxxxxxx",
    "                       "
  ],
  [
    "             #         ",
    "                   %   ",
    "                       ",
    "    o                  ",
    "    x      | x!!x=     ",
    "         x             ",
    "                      x",
    "                       ",
    "   #                   ",
    "          %            ",
    "               xxx     ",
    "                       ",
    "                       ",
    "       xxx  |          ",
    "                       ",
    " @                     ",
    "xxx                    ",
    "                %      "
  ], [
    "   v         v",
    "              ",
    "         !o!  ",
    "              ",
    "              ",
    "  %           ",
    "              ",
    "         xxx  ",
    "   #      o   ",
    "        =     ",
    "  @           ",
    "  xxxx        ",
    "  |           ",
    "      xxx    x",
    "              ",
    "          !   ",
    "              ",
    "       #      ",
    " o       x    ",
    " x      x     ",
    "       x      ",
    "      x      ",
    "   xx         ",
    "              "
  ]
];

const actorDict = {
  '%': ObliquelyFireball,
  '#': СircularCoin,
  '@': Player,
  'o': Coin,
  '=': HorizontalFireball,
  '|': VerticalFireball,
  'v': FireRain
};

const parser = new LevelParser(actorDict);
runGame(schemas, parser, DOMDisplay)
  .then(() => console.log('Вы выиграли приз!'));

/*const actorDict = {
  '%': ObliquelyFireball,
  '@': Player,
  'o': Coin,
  '=': HorizontalFireball,
  '|': VerticalFireball,
  'v': FireRain
};

const parser = new LevelParser(actorDict);

loadLevels()
  .then(JSON.parse)
  .then(levels => runGame(levels, parser, DOMDisplay)
    .then(() => alert('Вы победили!')));*/