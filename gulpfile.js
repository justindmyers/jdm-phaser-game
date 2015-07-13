var gulp = require('gulp'),
    typescript = require('gulp-typescript'),
    typescriptConfig = require('./tsconfig.json'),
    tiledmapPack = require('gulp-phaser-tiled-pack');

/*****
 * Assets Phaser packs task, creates phaser asset loader packs for tilemaps
 *****/
gulp.task('pack', function () {
    pack();
    copyLevels();
});

gulp.task('build', function() {
    build();
});

function build() {    
    var tsResult = gulp.src('src/**/*.ts')
        .pipe(typescript(typescriptConfig.compilerOptions));
        
    return tsResult.js.pipe(gulp.dest(''));
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