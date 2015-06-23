module PhaserGame {
    export class jdmGameState extends Phaser.State {
        allowPause: Boolean = true;
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