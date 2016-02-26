1. Firstly, install cordova and ionic-cli
    sudo npm install -g cordova
    sudo npm install -g ionic

2. package.json includes cordova project dependency, To initialize cordova platforms and plugins, just run
   ionic state restore

3. We use sass instead of css, To setup sass, run
   ionic setup sass

4. To install gulp task dependency, (This could be finished in 'ionic setup sass')
   npm install

5. About gulp tasks:
   i. Collect all .scss under ['scss/*'] and create 'www/css/ionic.app.min.scss'.
      gulp sass

   ii. Collect all ppmessageFiles included in './build.config.js', concat and unglify them into './www/build/ppmessage.min.js'
      gulp scripts
   
   iii. Collect all libFiles included in './build.config.js', concat and unglify them into './www/build/lib.min.js'
      gulp scripts-lib

   iiii. Process default task, include 'sass' , 'scripts' and 'scripts-lib' task above.
      gulp default

   v. Watch any change to *.js under ['www/js', './build.config.js'], and run 'gulp scripts', 'gulp scripts-lib' automaticly. This will also watch change to *.scss under ['scss/*.scss'].
      gulp watch

6. In development, to watch js and scss changes, run
   gulp watch
There is another way to watch js and scss changes. This will launch app in 'http://location:8100' with live-reload feature.
   ionic serve
If you add create new .js file, you must update 'build.config.js' to make it include that file.
