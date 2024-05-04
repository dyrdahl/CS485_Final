//Parent Sprite Class
class Sprite {
    constructor(sprite_json, x, y, start_state, isBoid = false){
        this.sprite_json = sprite_json;
        this.x = x;
        this.y = y;
        this.state = start_state;
        this.root_e = "TenderBud";
        this.cur_frame = 0;
        this.cur_bk_data = null;
        this.x_v = 0;
        this.y_v = 0;

        this.isBoid = isBoid;
        if(this.isBoid) {
            this.position = createVector(this.x, this.y);
            this.boidVelocity = p5.Vector.random2D();
            this.boidVelocity.setMag(random(1,5));
            this.acceleration = createVector();
            this.maxBoidVelocity = 5;
            this.maxForce = 0.3;
        }
    }
    draw(state){
        if(state['boids'])
            this.boids = state['boids'];
        // If a sprite is ended mid-cycle, reset back to 0
        if(this.cur_frame >= this.sprite_json[this.root_e][this.state].length){
            this.cur_frame = 0;
        }
        this.spriteLength = this.sprite_json[this.root_e][this.state].length;
        if(!this.isBoid) {
            this.state = currSprite;
        }

        if (keyChanged) {
            this.cur_frame = 0;
            keyChanged = false;
        }

        var ctx = canvas.getContext('2d');
        if(this.sprite_json[this.root_e][this.state][this.cur_frame]['img'] == null){
            this.sprite_json[this.root_e][this.state][this.cur_frame]['img'] = new Image();
            this.sprite_json[this.root_e][this.state][this.cur_frame]['img'].src = '../Penguins/' + this.root_e + '/' + currSprite + '/' + this.cur_frame + '.png';
        }

        this.cur_bk_data = ctx.getImageData(this.x - this.x_v, this.y - this.y_v,
        this.sprite_json[this.root_e][this.state][this.cur_frame]['w'],
        this.sprite_json[this.root_e][this.state][this.cur_frame]['h']);
        
        if( this.cur_bk_data != null){
            ctx.putImageData(this.cur_bk_data , (this.x - this.x_v) , (this.y - this.y_v));
        }

        ctx.drawImage(this.sprite_json[this.root_e][this.state][this.cur_frame]['img'], this.x, this.y);

        if(!this.isBoid){
            // Change the sprites velocity based on what the current sprite is
            if(Object.keys(keyStates).length === 0){
                this.x_v = 0;
                this.y_v = 0;
            }
            if (currSprite === 'walk_N') {
                this.x_v = 0;
                this.y_v = -10;
            }
            if (currSprite === 'walk_S') {
                this.x_v = 0;
                this.y_v = 10;
            }
            if (currSprite === 'walk_W') {
                this.x_v = -10;
                this.y_v = 0;
            }
            if (currSprite === 'walk_E') {
                this.x_v = 10;
                this.y_v = 0;
            }
            if (currSprite === 'walk_NE'){
                this.x_v = 10;
                this.y_v = -10;
            }
            if (currSprite === 'walk_NW'){
                this.x_v = -10;
                this.y_v = -10;
            }
            if (currSprite === 'walk_SE'){
                this.x_v = 10;
                this.y_v = 10;
            }
            if (currSprite === 'walk_SW'){
                this.x_v = -10;
                this.y_v = 10;
            }
            if (currSprite === 'idleSpin'){
                this.x_v = 0;
                this.y_v = 0;
            }
            if (currSprite === 'idleLayDown'){
                this.x_v = 0;
                this.y_v = 0;
            }
            if (currSprite === 'idleFall'){
                this.x_v = 0;
                this.y_v = 0;
            }
        }

        if(this.isBoid) {
            this.boid_flocking();
        }
        else {
            // Boundary Checking
            if(this.x >= (window.innerWidth - this.sprite_json[this.root_e][this.state][this.cur_frame]['w']) ){
                this.bound_hit('E');
            }else if(this.x <= 0){
                this.bound_hit('W');
            }else if(this.y >= (window.innerHeight - this.sprite_json[this.root_e][this.state][this.cur_frame]['h']) ){
                this.bound_hit('S');
            }else if(this.y <= 0){
                this.bound_hit('N');
            }else{
                this.x = this.x + this.x_v;
                this.y = this.y + this.y_v;
            }
        }

        this.cur_frame++;
        if (this.cur_frame >= this.spriteLength) {
            this.cur_frame = 0;
        }
        return false;
    }

    bound_hit(side){
        var rightBound = (window.innerWidth - this.sprite_json[this.root_e][this.state][this.cur_frame]['w']);
        var bottomBound = (window.innerHeight - this.sprite_json[this.root_e][this.state][this.cur_frame]['h']);

        if(currSprite === 'walk_W'){
            this.invalidateKey('a');

            this.x = this.x + 10;
            this.x_v = 10;
        }else if(currSprite === 'walk_E'){
            this.invalidateKey('d');

            this.x = this.x - 50;
            this.x_v = -50;
        }else if(currSprite === 'walk_S'){
            this.invalidateKey('s');

            this.y = this.y - 10;
            this.y_v = -10;
        }else if(currSprite === 'walk_N'){
            this.invalidateKey('w');

            this.y = this.y + 10;
            this.y_v = 10;
        }else if(currSprite === 'walk_NE'){
            this.invalidateKey('w');
            this.invalidateKey('d');

            this.x = this.x - 20;
            this.x_v = -20;
            this.y = this.y + 10;
            this.y_v = 10;
        }else if(currSprite === 'walk_NW'){
            this.invalidateKey('w');
            this.invalidateKey('a');

            this.x = this.x + 20;
            this.x_v = 20;
            this.y = this.y + 10;
            this.y_v = 10;
        }else if(currSprite === 'walk_SE'){
            this.invalidateKey('d');
            this.invalidateKey('s');

            this.x = this.x - 20;
            this.x_v = -20;
            this.y = this.y - 10;
            this.y_v = -10;
        }else if(currSprite === 'walk_SW'){
            this.invalidateKey('a');
            this.invalidateKey('s');

            this.x = this.x + 30;
            this.x_v = 30;
            this.y = this.y - 10;
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

    invalidateKey(key) {
        delete keyStates[key];
    }

    boid_flocking() {
        if(this.x_v === 0 && this.y_v === 0) {
            this.x_v = 1;
            this.y_v = 1;
        }
        else if((Math.abs(this.x_v) + Math.abs(this.y_v)) < this.minBoidVelocity) {
            this.x_v *= 2 + 1;
            this.y_v *= 2 + 1;
        }
        let alignmentValue = this.alignment();
        let seperationValue = this.seperation();
        //this.cohesion();

        this.acceleration.add(alignmentValue);
        this.acceleration.add(seperationValue);
        
        this.boid_update();
        this.bound_check();
    }

    boid_update() {
        this.position.add(this.boidVelocity);
        this.boidVelocity.add(this.acceleration);
        this.boidVelocity.limit(this.maxBoidVelocity);
        this.acceleration.mult(0);
        this.x = this.position.x;
        this.y = this.position.y;
        }

    bound_check() {
        this.position.add(this.boidVelocity); // Update position based on velocity

        // Check horizontal boundaries
        if (this.position.x <= 0 || this.position.x >= (window.innerWidth - this.sprite_json[this.root_e][this.state][this.cur_frame]['w'])) {
            this.boidVelocity.x *= -1; // Reverse horizontal velocity
            this.position.x += this.boidVelocity.x; // Adjust position
        }
    
        // Check vertical boundaries
        if (this.position.y <= 0 || this.position.y >= (window.innerHeight - this.sprite_json[this.root_e][this.state][this.cur_frame]['h'])) {
            this.boidVelocity.y *= -1; // Reverse vertical velocity
            this.position.y += this.boidVelocity.y; // Adjust position
        }
    }

    alignment() {
        let detectionRadius = 5000;
        let steeringVector = createVector();
        let total = 0;
        for (let boid of this.boids) {
            let d = dist(this.position.x, this.position.y, boid.position.x, boid.position.y);
            if(boid != this && d < detectionRadius) {
                steeringVector.add(boid.boidVelocity);
                total ++;
            }
        }
        if(total > 0) {
            steeringVector.div(total);
            steeringVector.setMag(this.maxBoidVelocity);
            steeringVector.sub(this.boidVelocity);
            steeringVector.limit(this.maxForce);
        }
        return steeringVector;
    }

    seperation() {
        let detectionRadius = 100;
        let steeringVector = createVector();
        let total = 0;
        for (let boid of this.boids) {
            let d = dist(this.position.x, this.position.y, boid.position.x, boid.position.y);
            if(boid != this && d < detectionRadius) {
                let difference = p5.Vector.sub(this.position, boid.position);
                difference.div(d*d);
                steeringVector.add(difference);
                total ++;
            }
        }
        if(total > 0) {
            steeringVector.div(total);
            steeringVector.setMag(this.maxBoidVelocity);
            steeringVector.sub(this.boidVelocity);
            steeringVector.limit(this.maxForce);
        }
        return steeringVector;
    }

    cohesion() {
        let detectionRadius = 400;
        let steeringVector = createVector();
        let total = 0;
        for (let boid of this.boids) {
            let d = dist(this.position.x, this.position.y, boid.position.x, boid.position.y);
            if(boid != this && d < detectionRadius) {
                steeringVector.add(boid.position);
                total ++;
            }
        }
        if(total > 0) {
            steeringVector.div(total);
            steeringVector.sub(this.position);
            steeringVector.setMag(this.maxBoidVelocity);
            steeringVector.sub(this.boidVelocity);
            steeringVector.limit(this.maxForce);
        }
        return steeringVector;
    }

  
}
