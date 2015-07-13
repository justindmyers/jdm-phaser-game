module PhaserGame {
    export class Character extends jdmGameSprite {
        jumpTimer: number = 0;
        isAttacking: Boolean = false;
        isJumping: Boolean = false;
        isMovingLeft: Boolean = false;
        isMovingRight: Boolean = false;
        isJumpingLogic: Boolean = false;
        
        update() {
            if(this.isJumping && (this.game.time.now > this.jumpTimer + 50) && this.checkIfCanJump()) {
                this.isJumping = false;
            }
        }
        
        attack() {
        }
        
        moveLeft() {            
        }
        
        moveRight() {            
        }
        
        jump() {
            if(this.game.time.now > this.jumpTimer && this.checkIfCanJump()) {
                this.body.moveUp(600);
                this.jumpTimer = this.game.time.now + 750;
                this.isJumping = true;
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
        
        checkIfWallCollision() {
            var xAxis = p2.vec2.fromValues(1, 0);
            var result = false;
        
            for (var i = 0; i < this.game.physics.p2.world.narrowphase.contactEquations.length; i++)
            {
                var c = this.game.physics.p2.world.narrowphase.contactEquations[i];
        
                if (c.bodyA === this.body.data || c.bodyB === this.body.data)
                {
                    var d = p2.vec2.dot(c.normalA, xAxis); // Normal dot Y-axis
                    if (Math.abs(d) >= 0.999) {
                        result = true;
                    }
                }
            }
            
            return result;
        }
        
        shouldJump() {            
        }
                
        shouldMove() {
        }
        
        shouldAttack() {
            return false;
        }
    }
}