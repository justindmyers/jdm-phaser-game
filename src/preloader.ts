module PhaserGame {
    export class Preloader extends jdmGameState {
        preloadBar: Phaser.Sprite;
        
        preload() {
            // Set-up our preloader sprite
            this.preloadBar = this.add.sprite(200, 250, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);

            // Load our actual games assets
            this.load.image('titlepage', 'assets/titlepage.jpg');
            this.load.image('logo', 'assets/logo.png');
            this.load.audio('music', 'assets/title.mp3', true);
            this.load.spritesheet('simon', 'assets/character.png', 64, 64, 13);
        }
         
        create() {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
        }
         
        startMainMenu() {
            this.game.state.start('MainMenu', true, false);
        }
    }
}