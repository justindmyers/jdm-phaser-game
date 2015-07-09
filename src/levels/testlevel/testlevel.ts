module PhaserGame {
    export class TestLevel extends jdmGameState {
        map: Phaser.Tilemap;
        cursor: Phaser.CursorKeys;
        layer: Object;
        player: Player;
        enemy: Enemy;
        spawns: Object;
        background: Phaser.TileSprite;
        background2: Phaser.TileSprite;
        maxCamera: number;
        backgroundCameraPosition: number;
        backgroundCameraPosition2: number;
        worldObjects: Phaser.Sprite[] = [];
        movingPlatforms: Phaser.Group;
        
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
                objects = this.getObjectsByName(mapObjects, 'Objects'),
                triggers = this.getObjectsByName(mapObjects, 'Triggers'),
                enemies = this.getObjectsByName(mapObjects, 'Enemies'),
                platforms = this.getObjectsByName(mapObjects, 'Platforms'),
                playerData = this.getObjectsByName(Lazy(spawns.pluck('objects').value()[0]), 'PlayerStart').value()[0],
                objectData = objects.pluck('objects'),
                platformData = platforms.pluck('objects');
                
            //Add any game objects to the world, you must manually define the key in the properties using Tiled
                    
            this.cursor = this.input.keyboard.createCursorKeys();
            this.stage.backgroundColor = "#3fc1fb";
            this.player = new Player(this.game, 'simon', playerData.x, playerData.y); //Player creates the physics, make sure to create if it doesn't already exist
            this.enemy = new Enemy(this.game, 'simon', 500, 1000);
            
            this.createGameObjects(objectData);
            this.createPlatforms(platformData); //setup the platforms
            
            this.game.physics.p2.convertTiledCollisionObjects(this.map, 'collision');
            this.game.physics.p2.enable(this.worldObjects);
         
            this.maxCamera = this.game.world.height - (this.game.height);
        }

        update() {
           this.backgroundCameraPosition = (this.game.camera.y * .15) - (this.maxCamera * .15);
           this.background.tilePosition.set(this.game.camera.x * -0.5, -this.backgroundCameraPosition + (this.game.height * 2) - (this.background.height));
           
           this.backgroundCameraPosition2 = (this.game.camera.y * .15) - (this.maxCamera * .15);
           this.background2.tilePosition.set(this.game.camera.x * -0.15, -this.backgroundCameraPosition + (this.game.height * 2) - (this.background.height));
            
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
            
            this.movingPlatforms.forEach(this.movePlatforms, this);   //call movePlatforms function every step on all members
        } 
        
        private getObjectsByName(object, name) {
            return object.filter(function(object) { return object.name === name; })
        }
        
        private createPlatforms(platformData) {
            var platform;
            
            this.movingPlatforms = this.game.add.group();    // add a group for our moving platforms
            
            platformData.each((function(platformObject) {  
                console.log(platformObject);
                platform = this.movingPlatforms.create(platformObject[0].x,  platformObject[0].y, platformObject[0].properties.key);  //add first platform to group
                platform.name = 'vertical';   //name it either vertical or horizontal 
                this.game.physics.p2.enable(platform, false);  //enable physics
                platform.body.setRectangle(64, 64, 0, 0);
                platform.body.kinematic = true;       // set body to kinematic (movable static body)
                platform.topbounds = platformObject[0].y;       //set bounds for later calculations
                platform.bottombounds = platformObject[0].y + platformObject[0].height;      //128 defines the distance the platform will move down
                platform.velo = platformObject[0].properties.velocity;   //define the speed for the moving platform
            }).bind(this));
        }
        
        private createGameObjects(objectData) {
            objectData.each((function(gameObject) {
                this.worldObjects.push(this.game.add.tileSprite(gameObject[0].x, gameObject[0].y, gameObject[0].width, gameObject[0].height, gameObject[0].properties.key));
            }).bind(this));
        }
        
        private movePlatforms(platform){
            if (platform.body.sprite.name == 'horizontal'){   //check for the moving direction 
                if (platform.body.x > platform.body.sprite.rightbounds){  platform.body.sprite.velo *= -1;} //if reached bounds reverse speed
                if (platform.body.x < platform.body.sprite.leftbounds) { platform.body.sprite.velo *= -1;}  // reverse speed
                platform.body.velocity.x = platform.body.sprite.velo;
            } else if (platform.body.sprite.name == 'vertical'){
                if (Math.ceil(platform.body.y) > platform.body.sprite.bottombounds){  platform.body.sprite.velo *= -1;}
                if (Math.ceil(platform.body.y) < platform.body.sprite.topbounds) { platform.body.sprite.velo *= -1;}
                platform.body.velocity.y = platform.body.sprite.velo;
            } 
        }
    }
} 