/// <reference path="../bower_components/phaser/typescript/phaser.d.ts"/>
module PhaserGame {
    export class Game extends Phaser.Game {
        constructor() {
            super(800, 600, Phaser.AUTO, 'content', null);
            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);
            this.state.add('MainMenu', MainMenu, false);
            this.state.add('Level1', Level1, false);
            this.state.start('Boot');
        }
    }
} 

window.onload = () => {
    var game = new PhaserGame.Game();
};

/*class SimpleGame {
    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
    }

    game: Phaser.Game;

    preload() {
        this.game.load.image('logo', '/game/images/Phaser-Logo-Small.png');
    }

    create() {
        var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);
    }
}

window.onload = () => {
    var game = new SimpleGame();
};*/