const {src, dest, watch, parallel} = require("gulp"); //hacer una variable para llamar las funciones de gulp

//las siguientes dependencias son para CSS
const sass = require("gulp-sass")(require("sass")); // linea para mandar a llamar a sass
const plumber = require("gulp-plumber");// toca instalar la dependencia con (npm i --save-dev gulp-plumber)
const autoprefixer = require("autoprefixer");
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

//las siguientes dependencias son para IMAGENES
const cache = require("gulp-cache")
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp"); // funcion para comprimir imagenes en formato webp.
const avif = require("gulp-avif");

// Javascript
const terser = require('gulp-terser-js');

function css(done){

    src("src/scss/**/*.scss")//1 identificar el archivo de scss
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass())//Compilarlo o ejecutar la funciones de sass
        .pipe(postcss([autoprefixer(),cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest("build/css"));//Almacenarla en el disco duro

    done();// avisa a gulp que la funcion termina
}

function imagenes(done){

    const opciones = {
        optimizationLevel: 3
    }
    src("src/img/**/*.{png,jpg}")
        .pipe(cache(imagemin(opciones)))
        .pipe(dest("build/img"))
    done();
}

function versionWebp(done){

    const opciones={
        quality:50          //la variable opciones es para decidir que calidad queremos
    };

    src("src/img/**/*.{png,jpg}") //busca en la carpeta src/imagenes secolocan los asteriscons para seleccionar to .{png, jpg} eneste caso por que las imagenes se guardaron en ese formato

        .pipe(webp(opciones))
        .pipe(dest("build/img"))//esta linea es para almacenar las imagenes transformadas en la carpeta señalada
    done();
}
function versionAvif(done){

    const opciones={
        quality:50          //la variable opciones es para decidir que calidad queremos
    };
    src("src/img/**/*.{png,jpg}") //busca en la carpeta src/imagenes secolocan los asteriscons para seleccionar to .{png, jpg} eneste caso por que las imagenes se guardaron en ese formato

        .pipe(avif(opciones))
        .pipe(dest("build/img"))//esta linea es para almacenar las imagenes transformadas en la carpeta señalada
    done();
}
function javaScrip(done){
    src("src/js/**/*.js")
        .pipe(sourcemaps.init())
        .pipe( terser() )
        .pipe(sourcemaps.write('.'))
        .pipe(dest("build/js"))
    done()
}
function dev (done) {
    watch("src/scss/**/*.scss", css)
    watch("src/js/**/*.js", javaScrip)

    done()
}
exports.css = css
exports.js = javaScrip
exports.imagenes = imagenes
exports.versionAvif = versionAvif
exports.versionWebp = versionWebp
exports.dev = parallel(imagenes, versionWebp, versionAvif, javaScrip, dev)