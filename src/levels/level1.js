var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>
var PhaserGame;
(function (PhaserGame) {
    var Level1 = (function (_super) {
        __extends(Level1, _super);
        function Level1() {
            _super.apply(this, arguments);
        }
        Level1.prototype.create = function () {
            this.background = this.add.sprite(0, 0, 'level1');
            this.music = this.add.audio('music', 1, false);
            this.music.play();
            this.player = new PhaserGame.Player(this.game, 130, 284);
        };
        return Level1;
    })(Phaser.State);
    PhaserGame.Level1 = Level1;
})(PhaserGame || (PhaserGame = {}));
//# sourceMappingURL=level1.js.map