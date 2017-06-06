'use strict';

class Vector {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}	
	plus(vector) {
        expect(vector).to.eql(new Vector(vector.x, vector.y));
		return new Vector(this.x + vector.x, this.y + vector.y);
	}
	times(n) {
		return new Vector(this.x * n, this.y * n);
	}
}

class Actor {    
	constructor(position = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) { 
		this.pos = position;
		this.size = size;
		this.speed = speed;
        
        if (position.__proto__ !== Vector.prototype ||
            size.__proto__ !== Vector.prototype ||
            speed.__proto__ !== Vector.prototype) {
            throw e;
        }
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
        return this.pos.y + this.size.y
    }
	act() {
	}    
	isIntersect(actor) {        
		expect(actor).to.eql(new Actor(actor.pos, actor.size, actor.speed));

        let xColl = false;
        let yColl = false;

        if (this.right >= actor.left && this.left <= actor.right) xColl = true;
        if (this.bottom >= actor.top && this.top <= actor.bottom) yColl = true;
        if (this.bottom === actor.bottom && this.top === actor.top &&
            this.right === actor.right && this.left === actor.left) yColl = false;
        if (this.left === actor.right || this.right == actor.left || 
            this.top === actor.bottom || this.bottom === actor.top) yColl = false;

        if (xColl && yColl) {
            return true;
        }
        return false;
	}
}

class Level {
	constructor(grid = [], actors = []) {
        this.grid = grid;
        this.actors = actors;
		this.status = null;
        this.finishDelay = 1;            
	}
    get player() {
       return this.actors.filter(actor => actor.type === 'player')[0];       
    }
    get height() {
        return this.grid.length;
    }
    get width() {
        let goodLength = 0;
        if (this.grid.length > 0) {
            goodLength = this.grid[0].length;
            this.grid.forEach(function(line) { 
                                if (line.length > goodLength) {
                                    goodLength = line.length;
                                }});
        }
        return goodLength;
    }
    isFinished() {
        return this.status !== null && this.finishDelay < 0 ? true : false;   
	}
    actorAt(actor = undefined) {
       for (let num in this.actors) {
            let other = this.actors[num];
            if (other !== actor &&
                actor.pos.x + actor.size.x > other.pos.x &&
                actor.pos.x < other.pos.x + other.size.x &&
                actor.pos.y + actor.size.y > other.pos.y &&
                actor.pos.y < other.pos.y + other.size.y) {
                return other;
            }
       }
    }
    obstacleAt(pos, size) {
        let xStart = Math.floor(pos.x);
        let xEnd = Math.ceil(pos.x + size.x);
        let yStart = Math.floor(pos.y);
        let yEnd = Math.ceil(pos.y + size.y);

        if (xStart < 0 || xEnd > this.width || yStart < 0)
            return "wall";
        if (yEnd > this.height)
            return "lava";
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
        if (this.actors.some(actor => actor.type === type)) {
            return false;
        }    
        return true;        
    }
    playerTouched(type, actor) {
       if (type === 'lava' || type === 'fireball') {
            this.status = 'lost';
            this.finishDelay = 1;
        } else if (type === 'coin') {
            this.actors = this.actors.filter(other => other !== actor);
            if (!this.actors.some(actor => actor.type === 'coin')) {
                this.status = "won";
                this.finishDelay = 1;
            }
        }
    }
}

class LevelParser {
    constructor(obj = {'@': Player}) {
        this.name = Object.getOwnPropertyNames(obj);
        this.value = obj[this.name]
    }  
    actorFromSymbol(symbol = undefined) {
        let actorChars = {
                            '@': Player,
                            'o': Coin,
                            '=': Fireball, 
                            '|' : HorizontalFireball, 
                            'v' : VerticalFireball
                         };
       actorChars[this.name] = this.value;
       return actorChars[symbol];
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
       let grid = [];
       if (plan.length > 0) {
            for (let y in plan) {
                let line = plan[y].split(''); 
                for (let x in line) {
                    line[x] = this.obstacleFromSymbol(line[x]);
                }
                grid.push(line);
            }
       } 
       return grid;
    }    
    createActors(plan = []) {        
       let actors = [];
       if (plan.length > 0) {
            for (let y in plan) {
                let line = plan[y].split(''); 
                for (let x in line) {
                    let classA = this.actorFromSymbol(line[x]);
                    if (classA !== undefined &&          
                       (Actor === classA.__proto__ || 
                        Actor === classA || 
                        Player === classA)) 
                    {                        
                        let actor = new classA(new Vector(x, y));
                        actors.push(actor);
                    } 
                }
            }
       } 
       return actors;
    }
    parse(plan = []) {
        let grid = this.createGrid(plan);
        let actors = this.createActors(plan);
        return new Level(grid, actors);        
    }
}

class Fireball extends Actor {
    constructor(position = new Vector(0, 0), speed = new Vector(0, 0), size = new Vector(1, 1)) {
        super(position, speed, size); 
        this.speed = speed;
        this.pos = position;
        this.size = size;
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
        if (!level.obstacleAt(newPos, this.size)) {
            this.pos = newPos;
        } else { 
            this.handleObstacle(); 
        }       
    }
}    

class HorizontalFireball extends Fireball {
    constructor(position = new Vector(0, 0), speed = new Vector(2, 0), size = new Vector(1, 1)) {
        super(position, speed, size); 
    }
}

class VerticalFireball extends Fireball {
    constructor(position = new Vector(0, 0), speed = new Vector(0, 2), size = new Vector(1, 1)) {
        super(position, speed, size); 
    }
}

class FireRain extends Fireball {
    constructor(position = new Vector(0, 0)) {
        super(position); 
        this.speed = new Vector(0, 3);     
        this.position = position;
    }
    get type() {
        return 'fireball';
    }
    handleObstacle() {
        this.pos = this.position;
    }
} 

class Coin extends Actor {
    constructor(position = new Vector(1, 1), size = new Vector(0.6, 0.6)) { 
        super(position, size); 
        this.pos = new Vector(position.x + 0.2, position.y + 0.1);
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
        this.spring += this.springSpeed * time;
   }
   getSpringVector(x = 0, y = 0) {
       return new Vector(x, y + Math.sin(this.spring) * this.springDist)
   }
   getNextPosition(time = 1) {
       this.updateSpring(time);
       return this.getSpringVector(this.pos.x, this.pos.y);
   }
   act(time) {
       this.pos = this.getNextPosition(time);
   } 
}

class Player {
    constructor(pos = new Vector(0, 0.5)) {
        this.pos =  new Vector(pos.x + 0, pos.y - 0.5);
        this.size = new Vector(0.8, 1.5);     
    }
    get type() {
        return 'player';
    }
}