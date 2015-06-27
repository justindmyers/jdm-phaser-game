module PhaserGame {
    export class TestLevel extends jdmGameState {
        map: Phaser.Tilemap;
        cursor: Phaser.CursorKeys;
        layer: Object;
        player: Player;
        spawns: Object;
        background: Phaser.TileSprite;
        background2: Phaser.TileSprite;
        maxCamera: number;
        backgroundCameraPosition: number;
        backgroundCameraPosition2: number;
        
        preload() {
            // the key will be the filename of the map without the extension.
            this.game.load.pack('test', '/assets/tilemap-assets.json');
            this.game.load.image('background', 'assets/background.png');
            this.game.load.image('background2', 'assets/background-2.png');
        }
        
        create() {
            this.stage.backgroundColor = "#4ac6fe";

            this.background2 = this.game.add.tileSprite(0, 0, 1920, 1600, 'background2'); //add the background            
            this.background = this.game.add.tileSprite(0, 0, 1920, 1600, 'background'); //add the background
            
            this.background.fixedToCamera = true;
            this.background2.fixedToCamera = true;
            
            this.background.tileScale.set(0.5, 0.5);
            this.background2.tileScale.set(0.5, 0.5);
            
            this.map = this.game.add.tiledmap('test');
            var mapObjects = Lazy(this.map.objects),
                spawns = this.getObjectsByName(mapObjects, 'Spawns'),
                triggers = this.getObjectsByName(mapObjects, 'Triggers'),
                enemies = this.getObjectsByName(mapObjects, 'Enemies'),
                playerData = this.getObjectsByName(Lazy(spawns.pluck('objects').value()[0]), 'PlayerStart').value()[0]
                            
            this.cursor = this.input.keyboard.createCursorKeys();
            this.stage.backgroundColor = "#3fc1fb";
            this.player = new Player(this.game, playerData.x, playerData.y); 
            this.game.physics.p2.convertTiledCollisionObjects(this.map, 'collision');
         
            this.maxCamera = this.game.world.height - (this.game.height);
        }

        update() {
           this.backgroundCameraPosition = (this.game.camera.y * .15) - (this.maxCamera * .15);
           this.background.tilePosition.set(this.game.camera.x * -0.25, -this.backgroundCameraPosition + (this.game.height * 2) - (this.background.height));
           
           this.backgroundCameraPosition2 = (this.game.camera.y * .15) - (this.maxCamera * .15);
           this.background2.tilePosition.set(this.game.camera.x * -0.35, -this.backgroundCameraPosition + (this.game.height * 2) - (this.background.height));
            
            //only move camera if character is over 50%
            if (this.cursor.up.isDown)
            {
                this.camera.y -= 4;
            } else if (this.cursor.down.isDown) {
                this.camera.y += 4;
            }
        
            if (this.cursor.left.isDown)
            {
                this.camera.x -= 4;
            } else if (this.cursor.right.isDown) {
                this.camera.x += 4;
            }
        } 
        
        private getObjectsByName(object, name) {
            return object.filter(function(object) { return object.name === name; })
        }
    }
} 