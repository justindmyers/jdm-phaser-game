module PhaserGame {
    export class jdmGameState extends Phaser.State {
        allowPause: Boolean = true;
        game: PhaserGame.Game = this.game;
        
        constructor() {
            super();
        }
        
        init() {
            window['state'] = this.game.state;
            
            if(typeof window['myVarWatch'] !== 'undefined') {
                window['myVarWatch'].trigger();
            }
        }
    }
}

module PhaserGame {
    export class jdmGameSprite extends Phaser.Sprite {
        game: PhaserGame.Game = this.game;
    }
}