module PhaserGame {
    export class Game extends Phaser.Game {
        CONFIG: jdmGameConfig = new jdmGameConfig(); //merge from json file later
        
        constructor() {
            super(800, 600, Phaser.AUTO, 'content', null);
            
            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);
            this.state.add('MainMenu', MainMenu, false);
            this.state.add('Level1', TestLevel, false);
            this.state.start('Boot');
        }
        
        create() {            
            Phaser.Canvas.setImageRenderingCrisp(this.canvas);  //for Canvas, modern approach
    		Phaser.Canvas.setSmoothingEnabled(this.context, false);  //also for Canvas, legacy approach
    		//PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST; //for WebGL
        }
    }
} 

window.onload = () => {
    window['game'] = new PhaserGame.Game();
    angular.bootstrap(document, ['app']);
};