module PhaserGame {
    export class Snake extends Character {        
        queuedJump: Boolean = false;
        trackedPlayers: Character[] = [];
        
        constructor(game: PhaserGame.Game, spriteKey: string, x: number, y: number) {
            super(game, x, y, spriteKey, 0);
            
            game.add.existing(this);
            this.smoothed = false;

            //TODO: Load animations from level
            this.animations.add('wiggle', [0, 1], 7, true);
                               
            game.physics.p2.enable(this);
            
            this.body.fixedRotation = true;
            game.physics.p2.gravity.y = 1200;
        }
                
        update() {           
            this.body.velocity.x = 0;
            this.animations.play('wiggle');    
            
            
            if(this.trackedPlayers.length !== 0) {
                if(this.trackedPlayers[0].body.x - this.body.x > 0) {
                    this.scale.x = 1; 
                } else {
                    this.scale.x = -1;
                }
            }
            
            if(this.shouldJump()) {
                if(this.game.time.now > this.jumpTimer && this.checkIfCanJump()) {
                    this.body.moveUp(450);
                    this.jumpTimer = this.game.time.now + 750;
                }
            }
            
            
        }
        
        shouldJump() {
            //every 6 & 8 seconds, jump
            
            if(!this.isJumpingLogic) {
                this.isJumpingLogic = true;
                this.game.time.events.add(6000, function() {
                    this.queuedJump = true;
                    this.isJumpingLogic = false;
                }, this);
            }
            
            if(this.queuedJump) {
                this.queuedJump = false;
                return true;
            }
            
            return false;
        }
        
        checkDirection(object) {
            
        }
        
        addPlayerToTrack(player) {
            this.trackedPlayers.push(player);
        }
    }
}