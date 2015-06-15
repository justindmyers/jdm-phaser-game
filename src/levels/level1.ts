/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>
/// <reference path="../lib/helpers.ts"/>
module PhaserGame {    
    export class Level1 extends PhaserGame.PhaserGameLevel {
        background: Phaser.Sprite;
        music: Phaser.Sound;
        player: PhaserGame.Player;
        platforms: Phaser.Group;
        
        constructor() {
            super();
            this.levelPath = 'src/levels/'; //set the level path
            this.assetsPath = 'public/assets';
        }

        create() {
            super.create();
            console.log(this.levelData);
            //this.background = this.add.sprite(0, 0, 'level1');
            this.music = this.add.audio('music', 1, false);
            this.music.play();
            this.player = new Player(this.game, 100, 0);
            
            this.platforms = this.add.group();
            
            //  We will enable physics for any object that is created in this group
            this.platforms.enableBody = true;
            
            // Here we create the ground.
            //var ground = this.platforms.create(0, this.world.height - 64, 'ground');
            
            //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
            //ground.scale.setTo(2, 2);
            
            //  This stops it from falling away when you jump on it
            //ground.body.immovable = true;
            
            //  Now let's create two ledges
            //var ledge =  this.platforms.create(400, 400, 'ground');
            
            //ledge.body.immovable = true;
            
            var ledge = this.platforms.create(-150, 250, 'ground');
            
            ledge.body.immovable = true;
        }
        
        update() {
            this.game.physics.arcade.collide(this.player, this.platforms);
        }
    }
} 