const NUM_BUSHES = 50;
const NUM_BALLS = 5;
const NUM_STONES = 10;

const bgMusic = new Audio("assets/bg-music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.5;

const footstep = new Audio("assets/footstep.mp3");
footstep.volume = 0.4;

let stepInterval = null;

const player = document.querySelector('.player');
const player_pos = {
    x: parseInt(window.innerWidth / 2),
    y: parseInt(window.innerHeight / 2)
};
const player_vel = { x: 0, y: 0 };
const balls = [];

const sound = new Audio('assets/coin.mp3');

function createBushes() {
    for (let i = 0; i < NUM_BUSHES; i++) {
        const div = document.createElement('div');
        div.classList.add('bush');
        div.style.left = Math.random() * 100 + '%';
        div.style.top = Math.random() * 100 + '%';
        document.body.appendChild(div);
    }
}

function createStones() {
    for (let i = 0; i < NUM_STONES; i++) {
        const div = document.createElement('div');
        div.classList.add('stone');
        div.style.left = Math.random() * 100 + '%';
        div.style.top = Math.random() * 100 + '%';
        document.body.appendChild(div);
    }
}

function generateBall() {
    const div = document.createElement('div');
    div.classList.add('pokeball');
    let x = Math.random() * 100 + '%';
    let y = Math.random() * 100 + '%';
    div.style.left = x;
    div.style.top = y;
    balls.push({ ball: div, pos: { x, y } });
    document.body.appendChild(div);
}

function createBalls() {
    for (let i = 0; i < NUM_BALLS; i++) {
        generateBall();
    }
}

function collision($div1, $div2) {
    var x1 = $div1.getBoundingClientRect().left;
    var y1 = $div1.getBoundingClientRect().top;
    var h1 = $div1.clientHeight;
    var w1 = $div1.clientWidth;
    var b1 = y1 + h1;
    var r1 = x1 + w1;

    var x2 = $div2.getBoundingClientRect().left;
    var y2 = $div2.getBoundingClientRect().top;
    var h2 = $div2.clientHeight;
    var w2 = $div2.clientWidth;
    var b2 = y2 + h2;
    var r2 = x2 + w2;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    return true;
}

function checkCollisions() {
    balls.forEach(ball => {
        if (collision(ball.ball, player)) {
            sound.play();
            ball.ball.remove();
            generateBall();
        }
    });
}

function run() {
    player_pos.x += player_vel.x;
    player_pos.y += player_vel.y;

    player.style.left = player_pos.x + 'px';
    player.style.bottom = player_pos.y + 'px';

    checkCollisions();
    requestAnimationFrame(run);
}

window.addEventListener("keydown", () => {
    if (bgMusic.paused) {
        bgMusic.play();
    }
}, { once: true });

function init() {
    createBushes();
    createBalls();
    createStones();

    bgMusic.play().catch(() => {
        console.log("Music will play after user interaction due to browser autoplay rules.");
    });

    run();
}

// Obstacle collisions
let playerEl = document.querySelector(".player");
let obstacles = document.querySelectorAll(".wall, .pond"); // both walls & pond

function isColliding(player, obstacle) {
    let pRect = player.getBoundingClientRect();
    let oRect = obstacle.getBoundingClientRect();

    return !(
        pRect.top > oRect.bottom ||
        pRect.bottom < oRect.top ||
        pRect.left > oRect.right ||
        pRect.right < oRect.left
    );
}

function updatePlayer() {
    let oldLeft = playerEl.offsetLeft;
    let oldTop = playerEl.offsetTop;

    playerEl.style.left = (oldLeft + player_vel.x) + "px";
    playerEl.style.top = (oldTop - player_vel.y) + "px";

    for (let obstacle of obstacles) {
        if (isColliding(playerEl, obstacle)) {
            // revert move if collided
            playerEl.style.left = oldLeft + "px";
            playerEl.style.top = oldTop + "px";
        }
    }

    requestAnimationFrame(updatePlayer);
}

updatePlayer();
init();

window.addEventListener('keydown', function (e) {
    if (e.key == "ArrowUp") {
        player_vel.y = 3;
        player.style.backgroundImage = 'url("assets/player_front.png")';
    }
    if (e.key == "ArrowDown") {
        player_vel.y = -3;
        player.style.backgroundImage = 'url("assets/player_back.png")';
    }
    if (e.key == "ArrowLeft") {
        player_vel.x = -3;
        player.style.backgroundImage = 'url("assets/player_left.png")';
    }
    if (e.key == "ArrowRight") {
        player_vel.x = 3;
        player.style.backgroundImage = 'url("assets/player_right.png")';
    }

    player.classList.add('active');

    if (!stepInterval) {
        stepInterval = setInterval(() => {
            footstep.currentTime = 0;
            footstep.play().then(() => {
                // stop sound quickly to simulate step
                setTimeout(() => {
                    footstep.pause();
                }, 300); // each step lasts 0.3s
            }).catch(() => { });
        }, 400); // gap between steps
    }
});

window.addEventListener('keyup', function () {
    player_vel.x = 0;
    player_vel.y = 0;
    player.classList.remove('active');
    clearInterval(stepInterval);
    stepInterval = null;
    footstep.pause();
    footstep.currentTime = 0;
});
