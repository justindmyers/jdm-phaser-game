module PhaserGame {
    export class Player extends Phaser.Sprite {
        jumpButton: Phaser.Key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        jumpTimer: Number = 0;
        isAttacking: Boolean = false;
        
        constructor(game: Phaser.Game, x: number, y: number) {
            super(game, x, y, 'simon', 0);

            game.physics.startSystem(Phaser.Physics.P2JS);
            game.add.existing(this);
            this.smoothed = false;

            this.animations.add('walk', [0, 1, 2, 3, 4], 15, true);
            this.animations.add('climb', [12, 13], 10, true);
            this.animations.add('attack', [6, 7, 8, 9, 10], 10, false);
            this.animations.add('duck', [5], 10, false);
            
            //animations (walk, duck, attack, duck/attack, damage, climb)                        
            game.physics.p2.enable(this);
            
            this.body.fixedRotation = true;
            game.physics.p2.gravity.y = 500;
                    
            game.camera.follow(this);
        }
                
        update() {
            this.body.velocity.x = 0;
            this.anchor.setTo(.3, .5);
            
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.E)) {
                this.attack();
            }
            
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.body.moveLeft(200);
                
                if(!this.isAttacking) {
                    this.animations.play('walk');
                }

                if (this.scale.x == 1) {
                    this.scale.x = -1;
                }
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
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
            
            if (this.jumpButton.isDown && this.game.time.now > this.jumpTimer && this.checkIfCanJump())
            {
                this.body.moveUp(300);
                this.jumpTimer = this.game.time.now + 750;
            }
        }
        
        attack() {
            if (!this.isAttacking)
            {
                this.animations.play('attack');
                this.isAttacking = true;
                this.game.time.events.add(250, function() {
                    this.isAttacking = false;
                }, this);
            }
        }
        
        checkIfCanJump() {
        
            var yAxis = p2.vec2.fromValues(0, 1);
            var result = false;
        
            for (var i = 0; i < this.game.physics.p2.world.narrowphase.contactEquations.length; i++)
            {
                var c = this.game.physics.p2.world.narrowphase.contactEquations[i];
        
                if (c.bodyA === this.body.data || c.bodyB === this.body.data)
                {
                    var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
                    if (c.bodyA === this.body.data) d *= -1;
                    if (d > 0.5) result = true;
                }
            }
            
            return result;
        }

    }
}