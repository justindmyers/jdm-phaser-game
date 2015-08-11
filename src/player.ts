module PhaserGame {
    export class Player extends Character {
        attackButton: Phaser.Key = this.game.input.keyboard.addKey(this.game.CONFIG.INPUT.ATTACK);
        jumpButton: Phaser.Key = this.game.input.keyboard.addKey(this.game.CONFIG.INPUT.JUMP);
        facingDirection: string = 'right';
        weapon: Phaser.Sprite;
        
        constructor(game: PhaserGame.Game, spriteKey: string, x: number, y: number) {
            super(game, x, y, spriteKey, 0);         
            
            game.physics.startSystem(Phaser.Physics.P2JS);
            game.add.existing(this);
            this.smoothed = false;
            
            this.weapon = this.game.add.sprite(this.x + 50, this.y, null);
            game.add.existing(this.weapon);

            //TODO: Load animations from level
            this.animations.add('walk', [0, 1, 2, 3, 4], 10, true);
            this.animations.add('climb', [12, 13], 10, true);
            var attackAnimation = this.animations.add('attack', [6, 7, 8, 9, 10], 20, false);
            this.animations.add('jump', [5], 10, true);
            
            attackAnimation.onComplete.add(this.attackAnimationStopped, this);
            
            this.addChild(this.weapon);
            
            game.physics.p2.enable([this]);
            game.physics.p2.gravity.y = 1200;
            
            this.body.fixedRotation = true;
            this.body.clearShapes(); //clear the default collision shap
            this.body.addRectangle(38, 62, 4, 0);
              
            //setup the weapon
            this.weapon.body.clearShapes();
            this.weapon.body.addRectangle(10, 50, 20, 0);
            this.weapon.body.angle = 20;
            //this.testBody.body.gravity = 0;
            this.weapon.body.mass = 0.1;
            
            //Set the weapon as a sensor so it doesn't act on physics
            this.weapon.body.data.shapes[0].sensor = true;
            
            //Attach the weapon to the player
            game.physics.p2.createRevoluteConstraint(this, [ 50, 0 ], this.weapon, [ 0, 0 ])
       
            game.camera.follow(this);
            
            this.body.onBeginContact.add(this.blockHit, this);
        }
                        
        update() {         
            super.update();
            
            this.weapon.body.x = this.body.x;
            this.weapon.body.y = this.body.y;
               
            this.body.velocity.x = 0;
                  
            if (this.game.input.keyboard.isDown(this.game.CONFIG.INPUT.LEFT)) {
                this.body.moveLeft(200);
                this.facingDirection = 'left'
                
                if(!this.isAttacking) {
                    this.animations.play('walk');
                }

                if (this.scale.x == 1) {
                    this.scale.x = -1;
                }
            } else if (this.game.input.keyboard.isDown(this.game.CONFIG.INPUT.RIGHT)) {
                this.body.moveLeft(-200);
                this.facingDirection = 'right';
                
                if(!this.isAttacking) {
                    this.animations.play('walk');
                }

                if (this.scale.x == -1) {
                    this.scale.x = 1;
                }
            } else {
                if(!this.isAttacking && !this.isJumping) {
                    this.animations.frame = 0;
                }
            }
            
            if(this.isJumping && !this.isAttacking) {
                this.animations.play('jump');
            }
                  
            
            //The buttons below only register once per keypress
            this.attackButton.onDown.add(function(key) {
                this.attack();
            }, this);
            
            this.jumpButton.onDown.add(function(key) {
                this.jump();
            }, this);
            
            if(this.checkIfWallCollision()) {
                //test auto jumping if we hit a wall
                //this.jump();
            }
            
            
            if(this.facingDirection == 'right') {
                this.anchor.setTo(.3, .5);
            } else {
                this.anchor.setTo(.45, .5);
            }
        }
        
        attack() {
            if (!this.isAttacking) {
                this.animations.play('attack');
                this.isAttacking = true;
                this.isJumping = false;
                this.game.time.events.add(250, function() {
                    this.isAttacking = false;
                }, this);
            }
        }
        
        attackAnimationStopped(sprite, animation) {
            this.animations.frame = 0;
        }
        
        blockHit (body, shapeA, shapeB, equation) {        
            if(body !== null && body.sprite !== null) {
        	   console.log('You last hit: ' + body.sprite.key);
            }
        }
    }
}