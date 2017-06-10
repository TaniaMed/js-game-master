'use strict';

class Vector {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}	
	plus(vector) {
<<<<<<< HEAD
        if (vector instanceof Vector) {
            return new Vector(this.x + vector.x, this.y + vector.y);
        }
        throw new Error('position must be Vector');
    }
=======
	    // expect это функция из библиотеки для тестирования, в коде её не нужно использовать
        // здесь нужно просто проверить тип аргумента
        expect(vector).to.eql(new Vector(vector.x, vector.y));
		return new Vector(this.x + vector.x, this.y + vector.y);
	}
>>>>>>> origin/master
	times(n) {
		return new Vector(this.x * n, this.y * n);
	}
}

class Actor {    
	constructor(position = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) { 
        this.err = new Error('position must be Vector');
        
        if (!(position instanceof Vector)) throw this.err;
        if (!(size instanceof Vector)) throw this.err;
        if (!(speed instanceof Vector)) throw this.err;
        
        this.pos = position;
		this.size = size;
		this.speed = speed;
<<<<<<< HEAD
=======
        
		// Это лучше вынести в начало функции, и сделать 3 отдельных if, чтобы было понятнее
        if (!(position instanceof Vector) ||
            !(size instanceof Vector) ||
            !(speed instanceof Vector)) {
            // переменная e не определена,
            // тут нужно что-то вроде throw new Error('position must be Vector')
            throw e;
        }
>>>>>>> origin/master
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
<<<<<<< HEAD
	    if (!(actor instanceof Actor)) { 
            throw this.err;
=======
	    // см. выше
		expect(actor).to.eql(new Actor(actor.pos, actor.size, actor.speed));

        let xColl = false;
        let yColl = false;

        // очень сложное услови
        // должно быть так: если выше - false, если ниже - false, если правее - false, если левее - false
        // иначе true
        if (this.right >= actor.left && this.left <= actor.right) xColl = true;
        if (this.bottom >= actor.top && this.top <= actor.bottom) yColl = true;
        if (this.bottom === actor.bottom && this.top === actor.top &&
            this.right === actor.right && this.left === actor.left) yColl = false;
        if (this.left === actor.right || this.right == actor.left || 
            this.top === actor.bottom || this.bottom === actor.top) yColl = false;

        if (xColl && yColl) {
            return true;
>>>>>>> origin/master
        }
        if (actor === this) {
            return false;
        } else if (actor.left >= this.right) {
            return false;
        } else if (actor.top >= this.bottom) {
            return false;
        } else if (actor.right <= this.left) {
            return false;
        } else if (actor.bottom <= this.top) {
            return false;
        }
        return true;
	}
}


class Fireball extends Actor {
<<<<<<< HEAD
    constructor(pos = new Vector(0, 0), speed = new Vector(0, 0), size = new Vector(1, 1)) {
        super(pos, speed, size); 
        this.speed = speed; 
=======
    constructor(position = new Vector(0, 0), speed = new Vector(0, 0), size = new Vector(1, 1)) {
        super(position, speed, size); 
        // это линие операчии, поля заполняются в конструкторе базового класса
        this.speed = speed;
        this.pos = position;
>>>>>>> origin/master
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
<<<<<<< HEAD
    constructor(pos, speed = new Vector(2, 0)) {
        super(pos, speed); 
        this.speed = speed;
=======
    // здесь конструтор должен принимать 1 аргумент
    constructor(position = new Vector(0, 0), speed = new Vector(2, 0), size = new Vector(1, 1)) {
        super(position, speed, size); 
>>>>>>> origin/master
    }
}

class VerticalFireball extends Fireball {
<<<<<<< HEAD
    constructor(pos, speed = new Vector(0, 2)) {
        super(pos, speed); 
        this.speed = speed;
=======
    // здесь тоже 1 аргумент
    constructor(position = new Vector(0, 0), speed = new Vector(0, 2), size = new Vector(1, 1)) {
        super(position, speed, size); 
>>>>>>> origin/master
    }
}

class FireRain extends Fireball {
<<<<<<< HEAD
    constructor(pos = new Vector(0, 0), speed = new Vector(0, 3)) {
        super(pos, speed);
        this.position = pos;   
        
=======
    constructor(position = new Vector(0, 0)) {
        super(position);
        // это нужно передать в базовый конструтор
        this.speed = new Vector(0, 3);
        this.position = position;
>>>>>>> origin/master
    }
    get type() {
        return 'fireball';
    }
    handleObstacle() {
        this.pos = this.position;
    }
} 

class Coin extends Actor {
<<<<<<< HEAD
    constructor(pos, size = new Vector(0.6, 0.6)) {
        super(pos, size);
        this.pos = this.pos.plus(new Vector(0.2, 0.1));
        this.size = size;
=======
    // 1 аргумент
    constructor(position = new Vector(1, 1), size = new Vector(0.6, 0.6)) {
        super(position, size);
        // post через базовый конструктор
        this.pos = new Vector(position.x + 0.2, position.y + 0.1);
>>>>>>> origin/master
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
       return new Vector(x, y + Math.sin(this.spring) * this.springDist);
   }
   getNextPosition(time = 1) {
       this.updateSpring(time);
       return this.getSpringVector(this.pos.x, this.pos.y);
   }
   act(time) {
       this.pos = this.getNextPosition(time);
   } 
}

<<<<<<< HEAD
class Player extends Actor {
    constructor(pos, size = new Vector(0.8, 1.5)) {
        super(pos, size);
        this.pos = this.pos.plus(new Vector(0, -0.5));
        this.size = size;
        }  
=======
// Должен наследоваться от класса Actor
class Player {
    constructor(pos = new Vector(0, 0.5)) {
        // через базовый конструтор
        this.pos =  new Vector(pos.x + 0, pos.y - 0.5);
        this.size = new Vector(0.8, 1.5);     
    }
>>>>>>> origin/master
    get type() {
        return 'player';
    }
}

class Level {
	constructor(grid = [], actors = []) {
<<<<<<< HEAD
        
        this.grid = grid.slice(0);
        this.actors = actors.slice(0);
		this.status = null;
        this.finishDelay = 1; 
        
=======
	    // здесь лучше создать копию массива, чтобы изменения не отражались во вне
        // Array.from() или .slice(0)
        this.grid = grid;
        this.actors = actors;
		this.status = null;
        this.finishDelay = 1;            
	}
    get player() {
	    // здесь лучше использовать метод find
       return this.actors.filter(actor => actor.type === 'player')[0];
    }
    get height() {
        return this.grid.length;
    }
    get width() {
	    // это лучше посчитать один раз в конструктое
>>>>>>> origin/master
        let goodLength = 0;
        if (this.grid.length > 0) {
            this.grid.forEach(function(line) { 
                                if (line.length > goodLength) {
                                    goodLength = line.length;
                                }});
        }
        this.width = goodLength;
        this.height = this.grid.length;
	}
    get player() {
       return this.actors.find(actor => actor.type === 'player');
    }
    isFinished() {
<<<<<<< HEAD
        return this.status !== null && this.finishDelay < 0;
	}
    actorAt(actor = undefined) {
        return this.actors.find(other => {
            if (actor.isIntersect(other)) {
=======
	    // тренарное сравнение лишнее
        // ? true : false; можно просто убрать
        return this.status !== null && this.finishDelay < 0 ? true : false;
	}
    actorAt(actor = undefined) {
       for (let num in this.actors) {
            let other = this.actors[num];
            // здесь нужно использовать метод isIntersect
            if (other !== actor &&
                actor.pos.x + actor.size.x > other.pos.x &&
                actor.pos.x < other.pos.x + other.size.x &&
                actor.pos.y + actor.size.y > other.pos.y &&
                actor.pos.y < other.pos.y + other.size.y) {
>>>>>>> origin/master
                return other;
            }
        });
    }
    obstacleAt(pos, size) {
        let xStart = Math.floor(pos.x);
        let xEnd = Math.ceil(pos.x + size.x);
        let yStart = Math.floor(pos.y);
        let yEnd = Math.ceil(pos.y + size.y);

<<<<<<< HEAD
        if (xStart < 0 || xEnd > this.width || yStart < 0) {
=======
        // фигурные скобки у if лучше не опускать
        if (xStart < 0 || xEnd > this.width || yStart < 0)
>>>>>>> origin/master
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
       if (type === 'lava' || type === 'fireball') {
            this.status = 'lost';
<<<<<<< HEAD
            return 'lost';
       }
       if (type === 'coin') {
            this.removeActor(actor);
            if (this.noMoreActors('coin')) {
                this.status = 'won';
                return 'won';
=======
            this.finishDelay = 1;
            // тут лучше добавить return и убрать else
        } else if (type === 'coin') {
           // здесь нужно использовать removeActor
            this.actors = this.actors.filter(other => other !== actor);
           // тут нужно использовать noMoreActors
            if (!this.actors.some(actor => actor.type === 'coin')) {
                this.status = "won";
                this.finishDelay = 1;
>>>>>>> origin/master
            }
        }
    }
}

class LevelParser {
<<<<<<< HEAD
    constructor(obj = {}) {
        this.list = obj;
    }  
    actorFromSymbol(symbol = undefined) {
        return this.list[symbol];
=======
    // по умолчанию должен быть пустой объект
    constructor(obj = {'@': Player}) {
        // это что-то неправильно, здесь нужно просто сохранить переданный словарь
        this.name = Object.getOwnPropertyNames(obj);
        this.value = obj[this.name]
    }  
    actorFromSymbol(symbol = undefined) {
        // здесь нужно использовать схему переданную в конструктор
        let actorChars = {
                            '@': Player,
                            'o': Coin,
                            '=': Fireball, 
                            '|' : HorizontalFireball, 
                            'v' : VerticalFireball
                         };
       actorChars[this.name] = this.value;
       return actorChars[symbol];
>>>>>>> origin/master
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
<<<<<<< HEAD
       let grid = [];      
       for (let y in plan) {
            let line = plan[y].split(''); 
            for (let x in line) {
                line[x] = this.obstacleFromSymbol(line[x]);
=======
       let grid = [];
       // можно не проверять длину, for (let y in plan) { на пустом массиве сразу закончится
       if (plan.length > 0) {
            for (let y in plan) {
                let line = plan[y].split(''); 
                for (let x in line) {
                    line[x] = this.obstacleFromSymbol(line[x]);
                }
                grid.push(line);
>>>>>>> origin/master
            }
            grid.push(line);
       }       
       return grid;
    }    
    createActors(plan = []) {        
<<<<<<< HEAD
        let actors = [];    
        for (let y in plan) {
            let line = plan[y].split(''); 
            for (let x in line) {
                let ClassA = this.actorFromSymbol(line[x]);
                if (typeof(ClassA) === 'function') {
                    let actor = new ClassA(new Vector(x, y));
                    if (actor instanceof Actor) {
                        actors.push(actor);
=======
       let actors = [];
       // см. предыдущий комментарий
       if (plan.length > 0) {
            for (let y in plan) {
                let line = plan[y].split(''); 
                for (let x in line) {
                    let classA = this.actorFromSymbol(line[x]);
                    if (typeof(classA) === 'function') {
                        let actor = new classA(new Vector(x, y));
                        if (actor instanceof Actor) {
                            actors.push(actor);
                        }
>>>>>>> origin/master
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

<<<<<<< HEAD
const actorDict = {
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
       .then(() => alert('Вы победили!')));
       
=======
// Здесь нужно запустить игру (см. раздел "Реализованные компоненты, которые необходимо использовать")
>>>>>>> origin/master
