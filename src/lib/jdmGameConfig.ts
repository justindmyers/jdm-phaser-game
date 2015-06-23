module PhaserGame {
    export class jdmGameConfig {
        INPUT: InputConfig; 
        
        constructor(config?) {
            this.INPUT = {
                LEFT:  Phaser.Keyboard.LEFT,
                RIGHT: Phaser.Keyboard.RIGHT,
                UP: Phaser.Keyboard.UP,
                DOWN: Phaser.Keyboard.DOWN,
                JUMP: Phaser.Keyboard.SPACEBAR,
                ATTACK: Phaser.Keyboard.E
            };
        }
    }
}