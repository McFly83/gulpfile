import gulp from 'gulp';

// read files
import { globby } from 'globby';
import { readFile, writeFile } from 'fs/promises';

// concat
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';

// CSS
import cssnano from 'gulp-cssnano';
import dartSass from 'sass';
import gulpSass from "gulp-sass";
const sass = gulpSass(dartSass);

// images
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';

// tasks
gulp.task('sass', function(){
   return gulp.src('app/*.scss')
       .pipe(sass())
       .pipe(cssnano())
       .pipe(gulp.dest('dist/css'));
});

gulp.task('js', function(){
   return gulp.src(['app/*.js'])
       .pipe(concat('all.js'))
       .pipe(uglify())
       .pipe(gulp.dest('dist/js'));
});

gulp.task('imgMin', async function(){
   const files = await globby('app/img/*.{jpg,png}');
   await Promise.all(
       files.map(async (file) => {
          const buffer = await readFile(file);
          const optimized = await imagemin.buffer(buffer, {
             plugins: [
                imageminMozjpeg({ quality: 75 }),
                imageminPngquant({ quality: [0.6, 0.8] })
             ]
          });
          await writeFile(file.replace('app/img', 'dist/img'), optimized);
       })
   );
});

// file watcher
gulp.task('watch', function(){
    gulp.watch('app/*.scss', gulp.series('sass'));
    gulp.watch('app/*.js', gulp.series('js'));
    gulp.watch('app/img/*.{jpg,png}', gulp.series('imgMin'));
});
