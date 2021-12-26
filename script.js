// jshint esversion:6
const gravity = 1;
const jumpPower = 15;
let runnerSpeed = 15;

let runner;
let gameBackground;
let platformBackground;
let gameFont;
let gameMusic;
let gameOverMusic;
let jumpSound;
let gameOver = false;
let playerScore = 0;
let platformsGroup;
let currentPlatformLocation;
let currentBackgroundTilePosition;
let backgroundTiles;


function setup(){
    createCanvas(840, 390);
    runner = createSprite(50,100,25,40);
    runner.depth = 4;
    runner.addAnimation('run', runningAnimation);
    runner.setCollider('rectangle', 0,0,10,41);
    platformsGroup = new Group();
    currentPlatformLocation = -width;
    currentBackgroundTilePosition = -width;
    backgroundTiles = new Group();
    newGame();
}

function preload(){
    runningAnimation = loadAnimation(
        'https://www.dropbox.com/s/0k5fzlkzxzykm9l/tile000.png',
		'https://www.dropbox.com/s/em49jwjpfj3wsd1/tile001.png',
		'https://www.dropbox.com/s/gilyijw74k5dq59/tile002.png',
		'https://www.dropbox.com/s/qpbqpjgi2ro5fkv/tile003.png',
		'https://www.dropbox.com/s/zlbn1sw6aau5vsk/tile004.png',
		'https://www.dropbox.com/s/ezncrujg9p0itbp/tile005.png',
		'https://www.dropbox.com/s/ne79wdcddzeee5q/tile006.png',
		'https://www.dropbox.com/s/e5fok4apbf5mg5h/tile007.png',
		'https://www.dropbox.com/s/zz2dhzw7y5sahlh/tile008.png',
		'https://www.dropbox.com/s/whfc0g4hptt9nnv/tile009.png'
    );
    gameBackground = loadImage('https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/snow-bg.png');
    platformBackground = loadImage('https://la-wit.github.io/build-an-infinite-runner/build/images/environments/defaultPlatform.png');
    gameFont = loadFont('https://la-wit.github.io/build-an-infinite-runner/build/fonts/ARCADE_R.TTF');
    gameMusic = loadSound('https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/drivin-home-low.mp3');
    gameOverMusic = loadSound('https://www.dropbox.com/s/q4h2azuivu0s6z1/Super%20Mario%20Lose%20Life.mp3');
    jumpSound = loadSound('https://la-wit.github.io/build-an-infinite-runner/build/sounds/jump07.mp3');
}


function draw(){
    if(!gameOver){
        drawSprites();
		updateScore();
		jumpDetection();
        runner.collide(platformsGroup, solidGround);

        runner.velocity.y += gravity;
        runner.velocity.x = runnerSpeed;
        camera.position.x = runner.position.x + 250;

        addNewPlatforms();
        removeOldPlatforms();
		addNewBackgroundTiles();
        removeOldBackgroundTiles();
        fallCheck();
    }

    else {
        gameOverText();
        if(gameMusic.isPlaying()) {
            gameMusic.stop();
            gameOverMusic.play();
        }

        if(keyWentDown(UP_ARROW)){
            newGame();
        }
    }
}

function addNewPlatforms(){
    if(platformsGroup.length < 5){
        let currentPlatformLength = 1132;
        let platform = createSprite(currentPlatformLocation * 1.3, random(300,400), 1132, 336);
        platform.collide(runner);
        currentPlatformLocation += currentPlatformLength;
        platform.addAnimation('default', platformBackground);
        platform.depth = 3;
        platformsGroup.add(platform);
    }
}

function solidGround(){
    runner.velocity.y = 0;
    runner.changeAnimation('run');
    if(runner.touching.right){
        runner.velocity.x = 0;
        runner.velocity.y+= 30;
    }
}

function jumpDetection(){
    if(keyWentDown(UP_ARROW)){
        runner.animation.rewind();
        runner.velocity.y = -jumpPower;
    }
}

function removeOldPlatforms(){
    for(let i = 0; i < platformsGroup.length; i++){
        if((platformsGroup[i].position.x) < runner.position.x-width){
            platformsGroup[i].remove();
        }
    }
}

function addNewBackgroundTiles(){
    if(backgroundTiles.length < 3){
        currentBackgroundTilePosition += 839;
        let bgLoop = createSprite(currentBackgroundTilePosition, height/2, 840, 390);
        bgLoop.addAnimation('bg', gameBackground);
        bgLoop.depth = 1;
        backgroundTiles.add(bgLoop);
    }
}

function removeOldBackgroundTiles(){
    for(let i = 0; i < backgroundTiles.length; i++){
        if((backgroundTiles[i].position.x) < runner.position.x-width){
            backgroundTiles[i].remove();
        }
    }
}

function fallCheck(){
    if(runner.position.y > height){
        gameOver = true;
    }

}

function gameOverText(){
    background(0,0,0,10);
    fill('white');
    stroke('black');
    textAlign(CENTER);
    textFont(gameFont);

    strokeWeight(2);
    textSize(90);
    strokeWeight(10);
    text('GAME OVER', camera.position.x, camera.position.y);

    textSize(15);
    text('Press up arrow to try again', camera.position.x, camera.position.y + 100);
    textSize(20);
    text('You ran ' + playerScore + ' metres!', camera.position.x, camera.position.y + 50);
}

function newGame(){
    platformsGroup.removeSprites();
    backgroundTiles.removeSprites();
    gameOver = false;
    updateSprites(true);
    runnerSpeed = 15;
    runner.position.x = 50;
    runner.position.y = 100;
    runner.velocity.x = runnerSpeed;
    currentPlatformLocation = -width;
    currentBackgroundTilePosition = -width;
    playerScore = 0;

    gameOverMusic.stop();
    gameMusic.play();
}

function updateScore(){
    if(frameCount % 60 === 0){
        playerScore++;
    }

    fill('white');
    textFont(gameFont);
    strokeWeight(2);
    stroke('black');
    textSize(20);
    textAlign(CENTER);
    text(playerScore, camera.position.x + 350, camera.position.y + 160);
}