
let arrHighScore=[{key:'A',value:0}];

  if (localStorage !== null) {
     
    for (var i=0; i < localStorage.length; i++)  {
          arrHighScore[i]={
          key:localStorage.key(i),
          value:localStorage.getItem(localStorage.key(i))
        }
    
     }
   
    arrHighScore.sort(function(a, b){return b.value - a.value});
    
    document.getElementById("h3_highScore").innerText="High Score: "+arrHighScore[0].value+"";

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

    class Poison{

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
            ctx.fillStyle='Black';
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

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    var audio_background = new Audio();
    audio_background.src = "Meditative-Space.mp3";

    var audio_eat = new Audio();
    audio_eat.src = "mixkit-winning-a-coin-video-game-2069.wav";

    var audio_dead = new Audio();
    audio_dead.src = "mixkit-player-losing-or-failing-2042.wav";
    
    var audio_flag=0;

    const snake = new Snake();
    

    let food=Food.generate();

    let poisons=[];

    let gameOver=false;

    poisons.push(Poison.generate());
    
    let poisoned=false;

    let poison_time=snake.score+5;

    let time_count=1;

    let pauseMenu=false;

    window.addEventListener('keydown', (event) => {
            
            if(audio_flag==0)
            {
                audio_background.play();
                audio_flag=1;
            }

            if(snake.dead()!==true)
            event.preventDefault;

            if (event.key === "ArrowDown") return snake.down();
            if (event.key === "ArrowRight") return snake.right();
            if (event.key === "ArrowUp") return snake.up();
            if (event.key === "ArrowLeft") return snake.left();
            if ((event.key === "Escape") &&(!snake.dead())) return pauseMenu=!pauseMenu;    
            
        return false;
    });


    

    function drawFood() 
    {
        
            if (typeof food !== 'undefined') 
            {
                food.draw();

                if (hit(food, snake.head)) {
                                        
                    snake.eat();
                    audio_eat.play();
                    food=Food.generate();

                    document.getElementById("h3_Score").innerText="Score: "+snake.score+"";

                    for (const i in poisons) {

                        poisons[i]=Poison.generate();
                    }
                    
                    if(snake.score == poison_time)
                    {
                        poisons.push(Poison.generate());
                        
                        poison_time=snake.score+5;

                        time_count+=3;
                    }

                }
            }

    }




    function drawPoison() {
        
            for (const i in poisons) {

             const poison = poisons[i];

            if (typeof poison !== 'undefined') {
                poison.draw();

                if (hit(poison, snake.head)) {

                    poisoned=true;
                }
            }

    }
}

    function hit(food, snake_head) {
        let hit = false;

        let dx = food.x - snake_head.x;
        let dy = food.y - snake_head.y;
        let dis = Math.sqrt(dx * dx + dy * dy);

        if (dis < food.width / 2 + snake_head.width / 2) hit = true;

        return hit;
    }

    function pauseMenuRemove()
    {
        document.getElementById("divPause").style.display="none";
        pauseMenu=false; 
    }


    function loadGame()
    {
        if (!pauseMenu) {
            
            pauseMenuRemove();
            snake.move();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            snake.draw();
            snake.head.grid();
            drawFood();
            drawPoison();
        }

        if(pauseMenu)
        {
           document.getElementById("divPause").style.display="block"; 
        }
        


        if (snake.dead()) 
        {


            audio_background.pause();
            audio_dead.play();

            // window.clearInterval(loop_food);



            document.getElementById("game_over").classList.remove("displayGameOver");

            let form = document.querySelector("form");
            let inputname = document.getElementById("namePlayer");


            form.addEventListener("submit", (e) => {
                e.preventDefault();

                
            if (localStorage !== null) {
                for (var i = 0; i < localStorage.length; i++) {

                    if ((inputname.value == localStorage.key(i)) && (snake.score < localStorage.getItem(localStorage.key(i))))
                        snake.score = localStorage.getItem(localStorage.key(i));
                }
            }

            localStorage.setItem(inputname.value, snake.score);

            inputname.value = "";

            document.getElementById("game_over").style.display="none";
            
            document.getElementById("divPause").style.display="block";
            document.getElementById("displayButton").style.display="none";
            document.getElementById("h2Pause").innerText="Want to give it another try"

            })
            

        }
        
        if(!snake.dead())
        loop_draw = setTimeout(loadGame, 1000 / (15 + time_count));

    }

    // let loop_draw;

   


    loadGame();

    
    

    


// --------------------------------------------------
