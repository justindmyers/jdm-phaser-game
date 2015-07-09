module PhaserGame {
    export class Character extends jdmGameSprite {
        jumpTimer: Number = 0;
        isAttacking: Boolean = false; 
        isMovingLeft: Boolean = false;
        isMovingRight: Boolean = false;
        isJumpingLogic: Boolean = false;
        
        update() {
            this.body.velocity.x = 0;
        }
        
        attack() {
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
                
        shouldMove(direction: string) {
            /*this.game.time.events.add(3000, function() {
                this.isMovingLeft = true;
            }, this);      */   

            return false;
        }
        
        shouldAttack() {
            return false;
        }
    }
}