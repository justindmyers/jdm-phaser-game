interface Level {
    assets: LevelAssets;
    objects: LevelObjects;
    map: MapSettings;
}

interface LevelAssets {
    name: string;
    contents: Object
}

interface LevelObjects {
    name: string;
    content: Object;
    count: number;
}

interface MapSettings {
    cameraX: number;
    cameraY: number;
    worldWidth: number;
    worldHeight: number;
    gridX: number;
    gridY: number;
    gridOffsetX: number;
    gridOffsetY: number;
    showGrid: number;
    backgroundColor: string;
}