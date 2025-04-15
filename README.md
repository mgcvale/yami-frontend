# yami-frontend

### Running
To run, run:
```
npm install
npm run dev
```

## Deploying

### Android
To deploy for android, run:
```
npm run build
npx cap add android
npx cap sync android
cd android
```

Then open app/build.gradle, and add the following lines to andoid {}:
```
lintOptions {
    disable 'Instantiatable'
    checkReleaseBuilds false
    abortOnError false
}
```

then, run:

```./gradlew assembleRelease```

Then, navigate to app/build/outputs/apk/release. Sign the apk (with keytool and apksigner), and you're done.


### Web
To deploy for the web, run:
```
npm run build
```