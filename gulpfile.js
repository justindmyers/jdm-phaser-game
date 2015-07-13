var gulp = require('gulp'),
    typescript = require('gulp-typescript'),
    typescriptConfig = require('./tsconfig.json'),
    tiledmapPack = require('gulp-phaser-tiled-pack'),
    install = require("gulp-install"),
    tsd = require('gulp-tsd');

/*****
 * Assets Phaser packs task, creates phaser asset loader packs for tilemaps
 *****/
gulp.task('default', ['build', 'tsd', 'pack']); 
 
gulp.task('pack', function () {
    pack();
    copyLevels();
});

gulp.task('compile', function() {
    return compile();
});

gulp.task('build', function() {
    return build();
});

gulp.task('tsd', function(callback) {
    return tsd({
        command: 'reinstall',
        config: './tsd.json'
    }, callback);
});

function build() {
    gulp.src(['./bower.json', './package.json'])
        .pipe(install());    
}

function compile() {    
    var tsResult = gulp.src('src/**/*.ts')
        .pipe(typescript(typescriptConfig.compilerOptions));
        
    tsResult.js.pipe(gulp.dest(''));
}

function pack() {
    return gulp.src('./src/levels/**/*.json')
               .pipe(tiledmapPack({ baseUrl: 'assets/levels' }))
               .pipe(gulp.dest('./public/assets')); 
}

function copyLevels() {
    return gulp.src('./src/levels/**/*.json', { "base" : "./src" })
        .pipe(gulp.dest('public/assets'));
}