/// <reference path="../bower_components/phaser/typescript/phaser.d.ts"/>
module PhaserGame {
    export class Player extends Phaser.Sprite {
        constructor(game: Phaser.Game, x: number, y: number) {
            super(game, x, y, 'simon', 0);

            game.physics.enable(this);
            game.add.existing(this);

            this.anchor.setTo(0.5, 0);
            this.animations.add('walk', [0, 1, 2, 3, 4], 10, true);
            
            this.body.bounce.y = 0.2;
            this.body.gravity.y = 300;
            this.body.collideWorldBounds = true;
        }

        update() {
            this.body.velocity.x = 0;
            
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.body.velocity.x = -150;
                this.animations.play('walk');

                if (this.scale.x == 1) {
                    this.scale.x = -1;
                }
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                this.body.velocity.x = 150;
                this.animations.play('walk');

                if (this.scale.x == -1) {
                    this.scale.x = 1;
                }
            } else {
                this.animations.frame = 0;
            }
            
            //  Allow the player to jump if they are touching the ground.
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP) && this.body.touching.down)
            {
                this.body.velocity.y = -350;
            }
        }
    }
}