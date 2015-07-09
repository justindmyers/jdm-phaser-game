module PhaserGame {
    export class Character extends jdmGameSprite {
        jumpTimer: Number = 0;
        isAttacking: Boolean = false; 
        isMovingLeft: Boolean = false;
        isMovingRight: Boolean = false;
        isJumpingLogic: Boolean = false;
        
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