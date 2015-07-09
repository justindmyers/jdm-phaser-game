module PhaserGame {
    export class Player extends Character {
        attackButton: Phaser.Key = this.game.input.keyboard.addKey(this.game.CONFIG.INPUT.ATTACK);
        jumpButton: Phaser.Key = this.game.input.keyboard.addKey(this.game.CONFIG.INPUT.JUMP);
        
        constructor(game: PhaserGame.Game, spriteKey: string, x: number, y: number) {
            super(game, x, y, spriteKey, 0);         
            
            game.physics.startSystem(Phaser.Physics.P2JS);
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
                    
            game.camera.follow(this);
        }
                
        update() {            
            this.body.velocity.x = 0;
            this.anchor.setTo(.3, .5);
                        
            if (this.game.input.keyboard.isDown(this.game.CONFIG.INPUT.LEFT)) {
                this.body.moveLeft(200);
                
                if(!this.isAttacking) {
                    this.animations.play('walk');
                }

                if (this.scale.x == 1) {
                    this.scale.x = -1;
                }
            } else if (this.game.input.keyboard.isDown(this.game.CONFIG.INPUT.RIGHT)) {
                this.body.moveLeft(-200);
                
                if(!this.isAttacking) {
                    this.animations.play('walk');
                }

                if (this.scale.x == -1) {
                    this.scale.x = 1;
                }
            } else {
                if(!this.isAttacking) {
                    this.animations.frame = 0;
                }
            }
            
            //The buttons below only register once per keypress
            this.attackButton.onDown.add(function(key) {
                this.attack();
            }, this);
            
            this.jumpButton.onDown.add(function(key) {
                if(this.game.time.now > this.jumpTimer && this.checkIfCanJump()) {
                    this.body.moveUp(600);
                    this.jumpTimer = this.game.time.now + 750;
                }
            }, this)
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
        
        

    }
}