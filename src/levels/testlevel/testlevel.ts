module PhaserGame {
    export class TestLevel extends jdmGameState {
        map: Phaser.Tilemap;
        cursor: Phaser.CursorKeys;
        layer: Object;
        player: Player;
        spawns: Object;
        
        preload() {
            // the key will be the filename of the map without the extension.
            this.game.load.pack('test', '/assets/tilemap-assets.json');
        }
        
        create() {
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
        }
        
        update() {
            //this.game.physics.p2.convertTiledmap(map, 'tilelayer-name');
            
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