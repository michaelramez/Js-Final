
let arrHighScore = [{ key: 'A', value: 0 }];

if (localStorage !== null) {

    for (var i = 0; i < localStorage.length; i++) {
        arrHighScore[i] = {
            key: localStorage.key(i),
            value: localStorage.getItem(localStorage.key(i))
        }

    }

    arrHighScore.sort(function (a, b) { return b.value - a.value });

    document.getElementById("h3_highScore").innerText = "High Score: " + arrHighScore[0].value + "";

}





// --------------------------------------------------

class Random {

    static get(start, end) {
        return Math.floor(Math.random() * end) + start;
    }

    static color_food() {
        return `rgb(
                ${Random.get(200, 255)},
                ${Random.get(0, 110)},
                ${Random.get(0, 110)}
            )`;
    }

    static color_poison() {
        return `rgb(
                ${Random.get(72, 1, 72)},
                ${Random.get(0, 110)},
                ${Random.get(0, 110)}
            )`;
    }

}

// --------------------------------------------------

class Food {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
    }

    static generate() {
        return new Food(Random.get(0, canvas.width), Random.get(0, canvas.height));
    }

    draw() {
        let color = Random.color_food();
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width / 2, Math.PI * 2, false);
        ctx.shadowInset = true;
        ctx.shadowBlur = Random.get(5, 10);
        ctx.shadowColor = color;
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
    }

}

class Poison {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
    }

    static generate() {
        return new Poison(Random.get(0, canvas.width), Random.get(0, canvas.height));
    }

    draw() {
        let color = Random.color_poison();
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width / 2, Math.PI * 2, false);
        ctx.shadowInset = true;
        ctx.shadowBlur = Random.get(5, 10);
        ctx.shadowColor = color;
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
    }

}


// --------------------------------------------------

class Dot {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
        this.back = null;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width / 2, Math.PI * 2, false);
        ctx.fillStyle = 'Black';
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'Gold';
        ctx.stroke();
        if (this.hasBack()) this.back.draw();
    }

    hasBack() {
        return this.back !== null;
    }

    copy() {
        if (this.hasBack()) {
            this.back.copy();
            this.back.x = this.x;
            this.back.y = this.y;
        }
    }

    add() {
        if (this.hasBack()) return this.back.add();
        this.back = new Dot(this.x, this.y);
        this.back.width *= 1.2;
        this.width *= 1.2;
    }

    right() {
        this.copy();
        this.x += this.width;
    }

    left() {
        this.copy();
        this.x -= this.width;
    }

    up() {
        this.copy();
        this.y -= this.height;
    }

    down() {
        this.copy();
        this.y += this.height;
    }

    hitBorder() {
        return this.x > canvas.width - this.width || this.x < 0 ||
            this.y > canvas.height - this.height || this.y < 0;
    }

    dotHit(body, head) {
        return head.x == body.x && head.y == body.y;
    }

    hit_body(head, second = false) {

        if (this === head && !this.hasBack()) return false;
        if (this === head) return this.back.hit_body(head, true);

        if (second && !this.hasBack()) return false;
        if (second) return this.back.hit_body(head);

        if (this.hasBack()) return this.dotHit(this, head) || this.back.hit_body(head);

        return this.dotHit(this, head);

    }

    grid() {

        for (let x = 0; x <= canvas.width; x += this.width) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
        }

        for (let y = 0; y <= canvas.height; y += this.height) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }

        ctx.strokeStyle = 'Peru';
        ctx.lineWidth = 0.2;
        ctx.stroke();

    }

}

// --------------------------------------------------

class Snake {

    constructor() {
        this.head = new Dot(200, 30);
        this.draw();
        this.direction = 'down';
        this.head.add();
        this.head.add();
        this.head.add();
        this.head.add();
        this.score = 0;
    }

    draw() {
        this.head.draw();
    }

    right() {
        if (this.direction == 'left') return;
        this.direction = 'right';
    }

    left() {
        if (this.direction == 'right') return;
        this.direction = 'left';
    }

    up() {
        if (this.direction == 'down') return;
        this.direction = 'up';
    }

    down() {
        if (this.direction == 'up') return;
        this.direction = 'down';
    }

    move() {
        if (this.direction == 'right') return this.head.right();
        if (this.direction == 'down') return this.head.down();
        if (this.direction == 'left') return this.head.left();
        if (this.direction == 'up') return this.head.up();
    }

    eat() {
        this.head.add();
        this.score = this.score + 1;
    }

    dead() {
        return this.head.hitBorder() || this.head.hit_body(this.head) || poisoned;
    }

}

// --------------------------------------------------

