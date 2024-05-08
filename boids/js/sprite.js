//Note: =================================== SPRITE ===================================
var lastTransitionPosition = { x: 0, y: 0 };
var minimumTravelDistance = 40; // pixels

var distanceTrav = 0;
let boundUnlock = false;
let currBoidCount;


class Sprite {
    constructor(sprite_json, x, y, start_state){
        this.sprite_json = sprite_json;
        this.x = x;
        this.y = y;
        this.state = start_state;
        this.root_e = "TenderBud";
        this.cur_frame = 0;
        this.cur_bk_data = null;
        this.x_v = 0;
        this.y_v = 0;
        // this.hitBox = 50;
        this.w = this.sprite_json[this.root_e][this.state][this.cur_frame]['w'];
        this.h = this.sprite_json[this.root_e][this.state][this.cur_frame]['h'];
    }
    draw(state){
        if(this.cur_frame >= this.sprite_json[this.root_e][this.state].length){
            this.cur_frame = 0;
        }
        this.spriteLength = this.sprite_json[this.root_e][this.state].length;
        this.state = this.state;

        if (keyChanged) {
            this.cur_frame = 0;
            keyChanged = false;
        }
        var ctx = canvas.getContext('2d');
        if(this.sprite_json[this.root_e][this.state][this.cur_frame]['img'] == null){
            this.sprite_json[this.root_e][this.state][this.cur_frame]['img'] = new Image();
            this.sprite_json[this.root_e][this.state][this.cur_frame]['img'].src = '../Penguins/' + this.root_e + '/' + this.state + '/' + this.cur_frame + '.png';
        }

        if( this.cur_bk_data != null && state['has_background_changed'] === false){
            ctx.putImageData(this.cur_bk_data , (this.x - this.x_v) , (this.y - this.y_v));
        }

        this.cur_bk_data = ctx.getImageData(this.x, this.y,
            this.sprite_json[this.root_e][this.state][this.cur_frame]['w'],
            this.sprite_json[this.root_e][this.state][this.cur_frame]['h']);

        ctx.drawImage(this.sprite_json[this.root_e][this.state][this.cur_frame]['img'], this.x, this.y);

        // Change the sprites velocity based on what the current sprite is
        if(Object.keys(keyStates).length === 0){
            this.x_v = 0;
            this.y_v = 0;
        }
        if (this.state === 'walk_N') {
            this.x_v = 0;
            this.y_v = -10;
        }
        if (this.state === 'walk_S') {
            this.x_v = 0;
            this.y_v = 10;
        }
        if (this.state === 'walk_W') {
            this.x_v = -10;
            this.y_v = 0;
        }
        if (this.state === 'walk_E') {
            this.x_v = 10;
            this.y_v = 0;
        }
        if (this.state === 'walk_NE'){
            this.x_v = 10;
            this.y_v = -10;
        }
        if (this.state === 'walk_NW'){
            this.x_v = -10;
            this.y_v = -10;
        }
        if (this.state === 'walk_SE'){
            this.x_v = 10;
            this.y_v = 10;
        }
        if (this.state === 'walk_SW'){
            this.x_v = -10;
            this.y_v = 10;
        }
        if (this.state === 'idleSpin'){
            this.x_v = 0;
            this.y_v = 0;
        }
        if (this.state === 'idleLayDown'){
            this.x_v = 0;
            this.y_v = 0;
        }
        if (this.state === 'idleFall'){
            this.x_v = 0;
            this.y_v = 0;
        }

        if(this.x >= (window.innerWidth - this.w) ){
            this.bound_hit('E');
            // if(boundUnlock){
                this.changeBackground('E');
            // }
        }
        // WEST WALL
        else if(this.x <= 0){
            this.bound_hit('W');
            // if(boundUnlock) {
                this.changeBackground('W');
            // }
        }
        // SOUTH WALL
        else if(this.y >= (window.innerHeight - this.h) ){
            this.bound_hit('S');
            // if(boundUnlock) {
                this.changeBackground('S');
            // }
        }
        // NORTH WALL
        else if(this.y <= 0){
            this.bound_hit('N');
            // if(boundUnlock) {
                this.changeBackground('N');
            // }
            // debuggingOutput("            <________ BoundHit ________>" + currBackground, "orange");
        }else{
            this.x = this.x + this.x_v;
            this.y = this.y + this.y_v;
        }

        this.cur_frame++;
        if (this.cur_frame >= this.spriteLength) {
            this.cur_frame = 0;
        }
        return false;
    }

    changeBackground(side){
        let boidsRequired = numBoids * (stagesComplete + 1);
        let boidsRemaining = boidsRequired - (player1_score + player2_score);
        let shouldUnlock = boidsRemaining <= 0;

        console.log("SC: " + stagesComplete + " | Boid Required: " + boidsRemaining + " | " + boidsRemaining + " | " + shouldUnlock)
        if (shouldUnlock) {
            boundUnlock = true; // Only set to true based on the game condition
        }

        if (!boundUnlock) return; // Prevent changing background if movement is locked

        if (currBackground === 'center') {
            switch (side) {
                case 'N':
                    currBackground = 'north';
                    currBoidSprite = 'jelly_2';
                    this.y = (window.innerHeight - this.y) - this.h - this.y_v;
                    break;
                case 'E':
                    currBackground = 'east';
                    currBoidSprite = 'jelly_3';
                    this.x = 10;
                    break;
                case 'S':
                    currBackground = 'south';
                    currBoidSprite = 'jelly_4';
                    this.y = 10;
                    break;
                case 'W':
                    currBackground = 'west';
                    currBoidSprite = 'coin_2';
                    this.x = (window.innerWidth - this.x) - this.w - this.x_v;
                    break;
            }
            stagesComplete++;
            boundUnlock = false;
            mapTransition = true;
            return;

        } else if (currBackground === 'north' && side === 'S') {
            currBackground = 'center';
            this.y = 10;
            mapTransition = true;
            stagesComplete++;
        } else if (currBackground === 'east' && side === 'W') {
            currBackground = 'center';
            this.x = (window.innerWidth - this.x) - this.w - this.x_v;
            mapTransition = true;
            stagesComplete++;
        } else if (currBackground === 'south' && side === 'N') {
            currBackground = 'center';
            this.y = (window.innerHeight - this.y) - this.h - this.y_v ;
            mapTransition = true;
            stagesComplete++;
        } else if (currBackground === 'west' && side === 'E') {
            currBackground = 'center';
            this.x = 10;
            mapTransition = true;
            stagesComplete++;
        }
        currBoidSprite = 'jelly_1';
        console.log("Transition to " + currBackground);
        boundUnlock = false;
    }


    bound_hit(){
        var rightBound = (window.innerWidth - this.sprite_json[this.root_e][this.state][this.cur_frame]['w']);
        var bottomBound = (window.innerHeight - this.sprite_json[this.root_e][this.state][this.cur_frame]['h']);

        if(this.state === 'walk_E') {
            this.x_v = 0;
        }
        if(this.state === 'walk_N'){
            this.y = this.y + 10;
            this.y_v = 0;
        }
        if(this.state === 'walk_W'){
            this.x = this.x + 10;
            this.x_v = 0;
        }
        if(this.state === 'walk_S'){
            this.y_v = 0;
        }
        if(this.state === 'walk_NE'){
            this.y = this.y - 10;
            this.y_v = 10;
        }
        if(this.state === 'walk_NW'){
            this.y = this.y - 10;
            this.y_v = 10;
        }
        if(this.state === 'walk_SW'){
            this.y = this.y + 10;
            this.y_v = 10;
        }
        if(this.state === 'walk_SE'){
            this.y = this.y + 10;
            this.y_v = -10;
        }
        if(this.x <= 0){
            this.x = 10;
            this.x_v = 10;
        }
        else if(this.x >= rightBound){
            this.x = this.x - 20;
            this.x_v = - 20;
        } else if(this.y <= 0){
            this.y = 10;
            this.y_v = 10;
        }else if(this.y >= bottomBound){
            this.y = this.y -20;
            this.y_v = - 20;
        }
    }
}

//Note: =================================== BOID ===================================
class Boid {
    constructor(sprite_json, x, y, start_state){
        this.sprite_json = sprite_json;
        this.state = start_state;
        this.root_e = 'Underwater';
        this.boid_cur_frame = Math.floor(Math.random() * this.sprite_json[this.root_e][this.state].length)
        this.x = x;
        this.y = y;

        this.position = createVector(this.x, this.y);
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 4));
        this.acceleration = createVector();
        this.maxForce = mForce;
        this.maxSpeed = mSpeed;
        this.minBoidVelocity = 2;
        this.w = this.sprite_json[this.root_e][this.state][this.boid_cur_frame]['w'];
        this.h = this.sprite_json[this.root_e][this.state][this.boid_cur_frame]['h'];
        // this.hitBox = 20;
    }
    draw(state){
        this.spriteLength = this.sprite_json[this.root_e][this.state].length;

        var ctx = canvas.getContext('2d');
        if(this.sprite_json[this.root_e][this.state][this.boid_cur_frame]['img'] == null){
            this.sprite_json[this.root_e][this.state][this.boid_cur_frame]['img'] = new Image();
            this.sprite_json[this.root_e][this.state][this.boid_cur_frame]['img'].src = '../Boid/' + this.root_e + '/' + this.state + '/' + this.boid_cur_frame + '.png';
        }

        ctx.drawImage(this.sprite_json[this.root_e][this.state][this.boid_cur_frame]['img'], this.x, this.y);

        this.boid_flocking(state['boids']);

        this.boid_cur_frame++;
        if (this.boid_cur_frame >= this.spriteLength) {
            this.boid_cur_frame = 0;
        }

        this.updateB();
        this.bound_check();
        return false;
    }

    boid_flocking(boids) {
        // What does this do?
        // if(this.x_v === 0 && this.y_v === 0) {
        //     this.x_v = 1;
        //     this.y_v = 1;
        // }
        // else if((Math.abs(this.x_v) + Math.abs(this.y_v)) < this.minBoidVelocity) {
        //     this.x_v *= 2 + 1;
        //     this.y_v *= 2 + 1;
        // }

        let alignment = this.alignment(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);

        // separation.mult(separationSlider.value());
        // cohesion.mult(cohesionSlider.value());
        // alignment.mult(alignSlider.value());

        separation.mult(separation_mod);
        cohesion.mult(alignment_mod);
        alignment.mult(cohesion_mod);

        this.acceleration.add(alignment);
        this.acceleration.add(separation);
        this.acceleration.add(cohesion);
    }
    updateB() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);
        this.x = this.position.x;
        this.y = this.position.y;
    }

    bound_check() {
        this.position.add(this.velocity); // Update position based on velocity
        let spriteWidth = this.sprite_json[this.root_e][this.state][this.boid_cur_frame]['w'];
        let spriteHeight = this.sprite_json[this.root_e][this.state][this.boid_cur_frame]['h'];

        // Check horizontal boundaries
        if (this.position.x <= 3 || this.position.x >= (window.innerWidth - spriteWidth - 3)) {
            this.velocity.x *= -1; // Reverse horizontal velocity
            this.position.x += this.velocity.x; // Adjust position
        }
        // Check vertical boundaries
        if (this.position.y <= 3 || this.position.y >= (window.innerHeight - spriteHeight - 3)) {
            this.velocity.y *= -1; // Reverse vertical velocity
            this.position.y += this.velocity.y; // Adjust position
        }
    }

    alignment(boids) {
        let perceptionRadius = alignFactor;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other !== this && d < perceptionRadius) {
                steering.add(other.velocity);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    separation(boids) {
        let perceptionRadius = separationFactor;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other !== this && d < perceptionRadius && d > 0) {
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(d * d);
                steering.add(diff);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }


    cohesion(boids) {
        let perceptionRadius = cohesionFactor;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other !== this && d < perceptionRadius) {
                steering.add(other.position);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }
}

//Note: =================================== BACKGROUND ===================================
class BackgroundSprite {
    constructor(sprite_json, start_state) {
        this.sprite_json = sprite_json;
        this.state = start_state;
        this.root_e = "CyberBack";
        this.back_cur_frame = 0;
        this.frameDelay = 200; // Time in milliseconds between frames
        this.lastFrameChangeTime = Date.now();
    }

    draw() {
        var ctx = canvas.getContext('2d');
        if (this.sprite_json[this.root_e][this.state][this.back_cur_frame]['img'] == null) {
            this.sprite_json[this.root_e][this.state][this.back_cur_frame]['img'] = new Image();
            this.sprite_json[this.root_e][this.state][this.back_cur_frame]['img'].src = '../Background/' + this.root_e + '/' + this.state + '/' + this.back_cur_frame + '.png';
        }

        // Draw the current frame
        ctx.drawImage(this.sprite_json[this.root_e][this.state][this.back_cur_frame]['img'], 0, 0, window.innerWidth, window.innerHeight);

        // Check if it's time to update the background frame
        let currentTime = Date.now();
        if (currentTime - this.lastFrameChangeTime >= this.frameDelay) {
            this.back_cur_frame++;
            if (this.back_cur_frame >= this.sprite_json[this.root_e][this.state].length) {
                this.back_cur_frame = 0;  // Loop back to the first frame
            }
            this.lastFrameChangeTime = currentTime;  // Reset the last frame change time
        }
    }
}