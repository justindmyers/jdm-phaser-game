module PhaserGame {
    export class Game extends Phaser.Game {
        constructor() {
            super(800, 600, Phaser.AUTO, 'content', null);
            
            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);
            this.state.add('MainMenu', MainMenu, false);
            this.state.add('Level1', TestLevel, false);
            this.state.start('Boot');
        }
        
        create() {
            console.log(this.canvas);
            console.log(this.context);
            
            Phaser.Canvas.setImageRenderingCrisp(this.canvas);  //for Canvas, modern approach
    		Phaser.Canvas.setSmoothingEnabled(this.context, false);  //also for Canvas, legacy approach
    		PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST; //for WebGL
        }
    }
} 

window.onload = () => {
    window['game'] = new PhaserGame.Game();
    angular.bootstrap(document, ['app']);
};