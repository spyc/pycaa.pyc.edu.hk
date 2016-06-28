import gulp from 'gulp';
import sass from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import imagemin from 'gulp-imagemin';
import svgmin from 'gulp-svgmin';
import gutil, {PluginError} from 'gulp-util';
import webpack, {optiminze} from 'webpack';

const baseSource = `${__dirname}/resources/assets`;
const baseTarget = `${__dirname}/public`;

gulp.task('css:dev', function () {
  gulp.src(`${baseSource}/scss/**/*.scss`)
    .pipe(sass())
    .pipe(gulp.dest(`${baseTarget}/css`));
});

gulp.task('css', function () {
  gulp.src(`${baseSource}/scss/**/*.scss`)
    .pipe(sass())
    .pipe(cleanCss({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest(`${baseTarget}/css`));
});

gulp.task('image:dev', function () {
  gulp.src(`${baseSource}/images/**/*.*`)
    .pipe(gulp.dest(`${baseTarget}/images`));

  gulp.src(`${baseSource}/images/**/*.svg`)
    .pipe(gulp.dest(`${baseTarge}/images`));
});

gulp.task('image', function () {
  gulp.src(`${baseSource}/images/**/*.*`)
    .pipe(imagemin())
    .pipe(gulp.dest(`${baseTarge}/images`));

  gulp.src(`${baseSource}/images/**/*.svg`)
    .pipe(svgmin())
    .pipe(gulp.dest(`${baseTarge}/images`));
});

const webpackConfig = {
  name: 'pycaa',
  context: `${baseSource}/js`,
  entry: 'app.js',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },
  externals: {},
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    filename: 'app.js',
    path: `${baseTarget}/js`,
    publicPath: '/js'
  }
};

gulp.task('js:dev', function () {
  webpack(webpackConfig, function (e, stats) {
    if (e) throw new PluginError('webpack', e);
    gutil.log('[webpack]', stats.toString({colors: true}));
  })
});

gulp.task('js', function () {
  const config = Object.assign({}, webpackConfig);
  config.plugins = [new optiminze.UglifyJsPlugin({minimize: true})];
  webpack(webpackConfig, function (e, stats) {
    if (e) throw new PluginError('webpack', e);
    gutil.log('[webpack]', stats.toString({colors: true}));
  })
});

gulp.task('watch:dev', function () {
  gulp.watch([
    `${baseSource}/scss/**/*.scss`
  ], ['css:dev']);

  gulp.watch([
    `${baseSource}/images/**/*.*`,
    `${baseSource}/images/**/*.svg`
  ], ['image:dev']);

  gulp.watch([
    `${baseSource}/js/*.js`
  ], ['js:dev'])
});

gulp.task('watch', function () {
  gulp.watch([
    `${baseSource}/scss/**/*.scss`
  ], ['css']);

  gulp.watch([
    `${baseSource}/images/**/*.*`,
    `${baseSource}/images/**/*.svg`
  ], ['image']);

  gulp.watch([
    `${baseSource}/js/*.js`
  ], ['js'])
});