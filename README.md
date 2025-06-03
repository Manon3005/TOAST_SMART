This branch is only usefull for the packaging steps of the app in order to deploy it.

### Requirements for linux developers :
- `sudo apt install rpm`
- [wine](https://gitlab.winehq.org/wine/wine/-/wikis/Debian-Ubuntu) is required
- [mono](https://www.mono-project.com/download/stable/#download-lin-ubuntu) too

### then :
```
npm install --save-dev @electron-forge/cli
```

```
npm install --save-dev @electron-forge/maker-squirrel
```

```
npx electron-forge import
```

### Now to build local backend and frontend: 

```
npm run build-prod
```

### To bundle the app for windows targets:

```
npm run make-windows
```



### To bundle the app for linux targets:

```
npm run make-linux
```
