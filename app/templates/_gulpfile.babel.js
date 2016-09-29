import babelify   from 'babelify';
import browserify from 'browserify';
import buffer     from 'vinyl-buffer';
import del        from 'del';
import gulp       from 'gulp';
import gulpif     from 'gulp-if';
import source     from 'vinyl-source-stream';
import uglify     from 'gulp-uglify';

const config = {
    filename: 'app',
    scripts: {
        input: ['./src/app.js'],
        out: 'dist/',
        watch: ['./src/**/*.js']
    },
    isDev : process.env.NODE_ENV === 'dev'
};

/**
 * Deletes the /dist/ folder
 */
gulp.task('clean', () => {
    del(config.scripts.out);
});


/**
 * Builds all of our scripts
 */
gulp.task('scripts', () => {
    // console.log(CONFIG)

    const entries = config.scripts.input;

    entries.map( (entry) => {
        // Browserfy Object
        const bundler = browserify({
            entries: entry,
            debug: config.isDev
        });

        // Transform through Babel
        bundler.transform( 'babelify', {
            presets: ['es2015']
        });

        return bundler.bundle().on('error', (err) => {
            console.error(err);
            this.emit('end');
        })
        // Convert Stream to buffer
        .pipe(source(config.filename + '.js'))
        .pipe(buffer())
        // if not dev, uglify the code
        .pipe(gulpif(!config.isDev, uglify()))
        .pipe(gulp.dest(config.scripts.out));
    });
});


/**
 * Watches for changes and calls the correct task
 */
gulp.task('watch', ['scripts'], () => {
    gulp.watch(config.scripts.watch, ['scripts']);
});


/**
 * Our Default task gets executed when calling gulp.
 */
gulp.task('default', ['clean'], () => {
    if (config.isDev) {
        gulp.start('watch');

    }
    else {
        gulp.start('scripts');
    }
});
