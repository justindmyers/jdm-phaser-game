/// <reference path="interfaces/level.ts"/>

module PhaserGame {

    enum OBJECT_TYPE {
        SPRITE = 0,
		GROUP = 1,
		TEXT = 2,
		TILE_LAYER = 3
    }
        
    export class PhaserGameLevel extends Phaser.State {
        levelPath: string;
        levelData: Level;
        assetsPath: string;
        assets: Object;
        loadedData: Object;
           
        constructor() {
            super();
            this.assets = {};
        }
        
		init() {
			this.game.load.crossOrigin = "anonymous";
            
            window['state'] = this.game.state;
            window['myVarWatch'].trigger();
			
			/*if(Phaser.VERSION == "2.0.7"){
				this.game.load.script("hacks", "js/lib/phaserHacks2.0.7.js");
			}
			else if(Phaser.VERSION == "2.1.3"){
				this.game.load.script("hacks", "js/lib/phaserHacks2.1.3.js");
			}
			else{
				this.game.load.script("hacks", "js/lib/phaserHacks.js");
			}*/
		}
        
        preload() {
            this.load.onFileComplete.add(function(progress, key, success) {
                if (success && key === 'data') {
                    this.levelData = this.cache.getJSON(key);
                    this._loadAssets(this.levelData.assets.contents, this.assets, "");
                }
            }, this);
            
            this.load.json('data', this.levelPath + '/level.json');
        }
        
        create() {
            this.game.world.setBounds(0, 0, this.levelData.map.worldWidth, this.levelData.map.worldHeight);
            this.loadedData = this.createAll();
        }
        
        //Renamed this function to not conflict with 
        addObject(name, parent) {
            
			parent = parent || this.game.world;
			var data = this.getObjectGroupByName(name);
			if(!data){
				console.error("failed to find the object: ", name);
				return;
			}
			
			return this._add(data, parent, "");
		}
        
		setBackgroundColor(appendToBody){
			if(this.levelData.map.backgroundColor){
				var tmp = this.levelData.map.backgroundColor.substring(1);
				var bg = parseInt(tmp, 16);
				
				if(this.game.stage.backgroundColor != bg){
					this.game.stage.setBackgroundColor(bg);
				}
			}
			
			if(appendToBody){
				document.body.style.backgroundColor = this.levelData.map.backgroundColor;
			}
		}
 
		loadGroup(name) {
			var toLoad = {};
			var group = this.getObjectGroupByName(name);
			if(!group){
				console.error("failed to load group: ", name);
				return;
			}
			this._collectAssets(group, toLoad);
			this._loadAssetBuffer(toLoad);
			
			//this._loadFonts(group);
			
		}
		
		// create full map
		createAll() {
			var all = {};
			this._loadObjects(this.levelData.objects.contents, this.game.world, "", all, true);
			
			//for(var i in all)
                //TODO: Fix createTweens function
				//this.createTweens(all[i], this.mainMovie);
			//}
			
			return all;
		}
		
		createTweens(phaserObject, name) {
			var movies, mdata;
			var obj = phaserObject.mt;
			obj.movies = {};
			
			movies = obj.movies;
			mdata = obj.data.movies;
			if(name == void(0)){
				for(var mov in mdata){
					if(mov == this.mainMovie){
						continue;
					}
					movies[mov] = new mt.TweenCollection(mov, obj);
				}
			}
			else{
				movies[name] = new mt.TweenCollection(name, obj);
			}
		}
		
	
		createGroup(name, parent) {
			return this.addObject(name, parent);
		}
		
		// create slope map for tilelayer
		createSlopeMap(layer) {
			var map = {};
			var data = layer.layer.data;
			var i=0, j=0;
			
			for( ;i<data.length; i++){
				for(j=0; j<data[i].length; j++){
					if(data[i][j].index > 0){
						map[i*data[i].length + j] = data[i][j].index;
					}
				}
			}
			return map;
		}

		getObjectData(name, container) {
			if(typeof name == "object"){
				name = name.name;
			}
			
			container = container || this.levelData.objects;
			
			if(container.contents){
				for(var i=0; i<container.contents.length; i++){
					if(container.contents[i].contents){
						this.getObjectData(name, container.contents[i]);
					}
					else{
						if(container.contents[i].name == name){
							return container.contents[i];
						}
					}
				}
			}
			if(container.name == name){
				return container;
			}
		}
 
		getAssetPath(asset) {
			return this.assetsPath + asset.fullPath;
		}
		
		getObjectGroupByName(name, container?) {
			container = container || this.levelData.objects.contents;
			var ret;
			for(var i = 0; i < container.length; i++){
				if(container[i].name == name){
					return container[i];
				}
				if(container[i].contents){
					ret = this.getObjectGroupByName(name, container[i].contents);
					if(ret){
						return ret;
					}
				}
			}
		}
		
		getAssetByName(name, container){
			container = container || this.levelData.assets.contents;
            var ret;
			for(var i in container){
				if(container[i].name == name){
					return container[i];
				}
				if(container[i].contents){
					ret = this.getAssetById(id, container[i].contents);
					if(ret){
						return ret;
					}
				}
			}
			
			return ret;
		}
		
		getAssetById(id, container){
			container = container || this.levelData.assets.contents;
			var ret = null;
			
			for(var i in container){
				if(container[i].id == id){
					return container[i];
				}
				if(container[i].contents){
					ret = this.getAssetById(id, container[i].contents);
					if(ret){
						return ret;
					}
				}
			}
			
			return ret;
		}
		
		getObjectByName(name, container) {
			container = container || this.data.objects.contents;
            var ret; 
			for(var i in container){
				if(container[i].name == name){
					return container[i];
				}
				if(container[i].contents){
					ret = this.getObjectById(id, container[i].contents);
					if(ret){
						return ret;
					}
				}
			}
			
			return ret;
		}
		
		/*physics: {
			ninja: {
				enableTileLayer: function (layer) {
					layer = layer.layer;
					for (var y = 0, h = layer.height; y < h; y++){
						for (var x = 0, w = layer.width; x < w; x++){
							var tile = layer.data[y][x];
							if (tile && tile.index > 0){
								var body = new Phaser.Physics.Ninja.Body(this, null, 3, tile.index, 0, tile.worldX + tile.centerX, tile.worldY + tile.centerY, tile.width, tile.height);
								layer.bodies.push(body);
							}
						}
					}
					return layer.bodies;
				}
			}
		},*/
 
		_loadAssetBuffer(buffer) {
			var container;
			var asset = null;
			for(var i in buffer){
				asset = buffer[i];
				
				container = this._getAssetContainer(asset);
				this._addAsset(asset, container);
			}
		}
 		
		/*_loadFonts(group) {
			var object;
			for(var i=0; i<group.contents.length; i++){
				object = group.contents[i];
				if(object.contents){
					this._loadFonts(object);
					continue;
				}
				if(object.type == OBJECT_TYPE.TEXT){
					if(this.knownFonts.indexOf(object.style.fontFamily) != -1){
						continue;
					}
					this.game.load.font(object.style.fontFamily);
				}
			}
		},*/
 
		_mkDiff(o1, o2) {
			var out = {};
			for(var i in o1){
				if(i == "keyframe"){
					continue;
				}
				if(typeof o1[i] === "object"){
					continue;
				}
				if(o1[i] === void(0)){
					continue;
				}
				if(o1[i] != o2[i]){
					out[i] = o2[i] - o1[i] + "";
				}
			}
			for(var i in o2){
				if(i == "keyframe"){
					continue;
				}
				if(typeof o2[i] === "object"){
					continue;
				}
				if(o1[i] === void(0)){
					continue;
				}
				if(o1[i] != o2[i]){
					out[i] = o2[i] - o1[i] + "";
				}
			}
			return out;
		}

		_getAssetContainer(asset) {
			var cont = this.assets;
			var path = asset.fullPath.split("/");
			path.shift();
			for(var i=0; i<path.length-1; i++){
				cont[path[i]] = cont[path[i]] || {};
				cont = cont[path[i]];
			}
			return cont;
		}
 
		_getObjectContainer(object) {
			var cont = this.objects;
			var path = object.fullPath.split("/");
			path.shift();
			for(var i=0; i<path.length-1; i++){
				cont[path[i]] = cont[path[i]] || {};
				cont = cont[path[i]];
			}
			return cont;
		}
 
		_collectAssets(group, buffer) {
			var id, object, asset;
			for(var i=0; i<group.contents.length; i++){
				object = group.contents[i];
				if(object.contents){
					this._collectAssets(object, buffer);
				}
				id = object.assetId;
				asset = this.getAssetById(id);
				if(asset){
					buffer[id] = asset;
				}
			}
		}
 
		_loadAssets(data, container) {
			var asset = null;
			
			for(var i = 0, l = data.length; i<l; i++){
				asset = data[i];
				if(asset.contents && asset.contents.length){
					if(container[asset.name] === void(0)){
						container[asset.name] = {};
					}
					this._loadAssets(asset.contents, container[asset.name]);
				}
				else{
					this._addAsset(asset, container);
				}
			}
		}
	
		_addAsset(asset, container) {
			if(!asset.key){
				return;
			}
			
			// is already loaded ?
			if(container[asset.name]){
				return;
			}
			
			if(asset.atlas){
				this.game.load.atlas(asset.key, this.assetsPath + asset.fullPath, this.assetsPath + asset.atlas, null,  asset.type);
			}
			else if(asset.width != asset.frameWidth || asset.height != asset.frameHeight){
				this.game.load.spritesheet(asset.key, this.assetsPath + asset.fullPath, asset.frameWidth, asset.frameHeight, asset.frameMax, asset.margin, asset.spacing);
			}
			else{
				this.game.load.image(asset.key, this.assetsPath + asset.fullPath);
			}
			
			
			Object.defineProperty(container, asset.name, {
				get : function(){ 
					return asset;
				},
				enumerable: true
			});	
		}
		
		_loadObjects(children, parent, path, ref, keepVisibility) {
			parent = parent || this.game.world;
			path = path !== "" ? "." + path : path;
			
			for(var i = children.length - 1; i > -1; i--){
				ref[children[i].name] = this._add(children[i], parent, path, keepVisibility);
			}
		}
		
		_add(data, parent, path, keepVisibility?) {
			var createdObject = null;
			
			if(data.type == OBJECT_TYPE.GROUP){
				createdObject = this._addGroup(data);
				
				if(data.physics && data.physics.enable){
					createdObject.enableBody = true;
				}
				parent.add(createdObject);
				
				createdObject.mt = {
					self: createdObject,
					data: data,
					children: {}
				};
				
				this._updateCommonProperties(data, createdObject, keepVisibility);
				this._loadObjects(data.contents, createdObject, path + data.name, createdObject.mt.children, keepVisibility);
			}
			else{
				if(data.type == OBJECT_TYPE.TEXT){
					createdObject = this._addText(data, parent);
				}
				else if(data.type == OBJECT_TYPE.TILE_LAYER){
					createdObject = this._addTileLayer(data, parent);
					if(data.physics && data.physics.enable){
						createdObject.map.setCollisionByExclusion([-1]);
					}
				}
				else{
					createdObject = this._addObject(data, parent);
					
					this.addPhysics(data, createdObject, (parent.mt ? parent.mt.data : null));
				}
				
				this._updateCommonProperties(data, createdObject, keepVisibility);
				
				createdObject.mt = {
					self: createdObject,
					data: data,
					children: {}
				};
				
				if(data.contents){
					this._loadObjects(data.contents, createdObject, path + data.name, createdObject.mt.children, keepVisibility);
				}
			}
			
			createdObject.self = createdObject;
			createdObject.getData = function(){
				return this.mt.data;
			};
			return createdObject;
		}
		
		addPhysics(tpl, sprite, parent) {
			var p = tpl.physics;
			if(!p || !p.enable){
				if(parent && parent.physics && parent.physics.enable){
					p = parent.physics;
				}
			}
			if(p && p.enable){
				this.game.physics.arcade.enable(sprite);
				
				sprite.body.allowGravity = p.gravity.allow;
				sprite.body.gravity.x = p.gravity.x;
				sprite.body.gravity.y = p.gravity.y;
				
				sprite.body.immovable = p.immovable;
				
				sprite.body.bounce = p.bounce;
				
				sprite.body.maxAngular = p.rotation.maxAngular;
				sprite.body.allowRotation = p.rotation.allowRotation;
				
				sprite.body.maxVelocity = p.maxVelocity;
				
				sprite.body.mass = p.mass;
				sprite.body.collideWorldBounds = p.collideWorldBounds;
				
				var w = sprite.width;
				var h = sprite.height;
				if(p.size.width > 0){
					w = p.size.width;
				}
				if(p.size.height > 0){
					h = p.size.height;
				}
				
				sprite.body.setSize(w, h, p.size.offsetX, p.size.offsetY);
			}
		}
 
		_addGroup(object) {
			var group = this.game.add.group();

			group.x = object.x;
			group.y = object.y;
			group.fixedToCamera = !!object.fixedToCamera;
			
			if(object.angle){
				group.angle = object.angle;
			}
			group.alpha = object.alpha || 1;
			
			return group;
		}
		
		_addText(object, group) {
			group = group || this.game.world;
			var t = this.game.add.text(object.x, object.y, object.text || object.name, object.style);
			group.add(t);
			return t;
		}
		
		_addTileLayer(object, group) {
			group = group || this.game.world;
			var map = this.game.add.tilemap(null, object.tileWidth, object.tileHeight, object.widthInTiles, object.heightInTiles);
			var tl = map.createBlankLayer(object.name, object.widthInTiles, object.heightInTiles, object.tileWidth, object.tileHeight);
			
			var nextId = 0;
			var im = null;
			var asset;
            if(typeof object.images !== 'undefined') {
    			for(var i=0; i<object.images.length; i++){
    				asset = this.getAssetById(object.images[i]);
    				
    				if(asset){
    					im = map.addTilesetImage(asset.key, asset.key, asset.frameWidth, asset.frameHeight, asset.margin, asset.spacing, nextId);
    					nextId += im.total;
    				}
    				else{
    					console.warn("cannot find image", object.images[i]);
    				}
    			}
            }
			
			var tiles = object.tiles;
			var tile = null;
			for(var y in tiles){
				for(var x in tiles[y]){
					tile = map.putTile(tiles[y][x], parseInt(x, 10), parseInt(y, 10), tl);
				}
			}
			tl.fixedToCamera = object.isFixedToCamera;
			return tl;
		}
		
		_addObject(object, group) {
			var sp = null;
			group = group || this.game.world;
			
			if(group.type == Phaser.GROUP){
				sp = group.create(object.x, object.y, object.assetKey);
			}
			else{
				sp = this.game.add.sprite(object.x, object.y, object.assetKey);
				
				this.game.world.removeChild(sp);
				group.addChild(sp);
			}
			
			
			var frameData = this.game.cache.getFrameData(object.assetKey);
			
			if(frameData){
				var arr = [];
				for(var i=0; i<frameData.total; i++){
					arr.push(i);
				}
				sp.animations.add("default", arr, (object.fps !== void(0) ? object.fps : 10) , false);
				sp.frame = object.frame;
			}
			return sp;
		}
 
		_updateCommonProperties(template, object, keepVisibility) {
			
			if(template.angle){
				object.angle = template.angle;
			}
			
			if(template.type !== OBJECT_TYPE.GROUP && object.type != Phaser.GROUP){
				object.anchor.x = template.anchorX;
				object.anchor.y = template.anchorY;
				if(template.scaleX != void(0)){
					object.scale.x = template.scaleX;
					object.scale.y = template.scaleY;
				}
			}
			
			object.x = template.x;
			object.y = template.y;
			object.alpha = template.alpha || 1;
			
			if(keepVisibility){
				object.visible = template.isVisible;
			}
		}
		
		//mark all texts dirty to force redraw
		_markDirty(group) {
			group = group || this.game.world.children;
			
			var child = null;
			for(var i=0; i<group.length; i++){
				child = group[i];
				
				if(child.type == Phaser.TEXT){
					child.dirty = true;
					continue;
				}
				
				if(child.type == Phaser.GROUP){
					this.markDirty(child.children);
				}
			}
		}

        
    }
}