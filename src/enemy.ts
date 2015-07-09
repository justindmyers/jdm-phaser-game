module PhaserGame {
    export class Enemy extends Character {        
        queuedJump: Boolean = false;
        
        constructor(game: PhaserGame.Game, spriteKey: string, x: number, y: number) {
            super(game, x, y, spriteKey, 0);
            
            game.add.existing(this);
            this.smoothed = false;

            //TODO: Load animations from level
            this.animations.add('walk', [0, 1, 2, 3, 4], 10, true);
            this.animations.add('climb', [12, 13], 10, true);
            this.animations.add('attack', [6, 7, 8, 9, 10], 10, false);
            this.animations.add('duck', [5], 10, false); 
            
            //animations (walk, duck, attack, duck/attack, damage, climb)                        
            game.physics.p2.enable(this);
            
            this.body.fixedRotation = true;
            game.physics.p2.gravity.y = 1200;
        }
                
        update() {           
            this.body.velocity.x = 0;    
                            
            if (this.shouldMove('left')) {
                this.moveLeft();
            } else if (this.shouldMove('right')) {
                this.moveRight();
            } else {
                if(!this.isAttacking) {
                    this.animations.frame = 0;
                }
            }
            
            //The buttons below only register once per keypress
            if(this.shouldAttack()) {
                this.attack();
            }
            
            if(this.shouldJump()) {
                if(this.game.time.now > this.jumpTimer && this.checkIfCanJump()) {
                    this.body.moveUp(600);
                    this.jumpTimer = this.game.time.now + 750;
                }
            }
        }
        
        moveLeft() {
            this.body.moveLeft(200);
            
            if(!this.isAttacking) {
                this.animations.play('walk');
            } 

            if (this.scale.x == 1) {
                this.scale.x = -1;
            }
        }
        
        moveRight() {
            this.body.moveLeft(-200);
            
            if(!this.isAttacking) {
                this.animations.play('walk');
            }

            if (this.scale.x == -1) {
                this.scale.x = 1;
            }
        }
        
        attack() {
            if (!this.isAttacking)
            {
                this.animations.play('attack');
                this.isAttacking = true;
                this.game.time.events.add(450, function() {
                    this.isAttacking = false;
                }, this);
            }
        }
        
        
        
        shouldJump() {
            //give 30% chance to jump
            
            if(!this.isJumpingLogic) {
                this.isJumpingLogic = true;
                this.game.time.events.add(2000, function() {
                    if(Math.floor(Math.random() * (6 + 1)) === 0) {
                        this.queuedJump = true;
                    }
                    
                    this.isJumpingLogic = false;
                }, this);
            }
            
            if(this.queuedJump) {
                this.queuedJump = false;
                return true;
            }
            
            return false;
        }
    }
}