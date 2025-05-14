### In order to at the REACT frontend
```
cd frontend
```
```
npm install  
```
```
npm install react-router-dom@6
```
```
cd ..  
```
```
npm install  
```
(At the root, open the app; if we're in the frontend folder, launch in dev mode (live editing).)
```
npm run start
```


## In order to launch the backend :

### Install the following librairies

```
npm install csv-parse  
```
```
npm install --save-dev @types/csv-parse  
```
```
npm install express
```
```
npm install fast-levenshtein  
```

### In order to launch it :
```
npm run start
```

### Packaging :
for linux:
- `sudo apt install rpm`
- [wine](https://gitlab.winehq.org/wine/wine/-/wikis/Debian-Ubuntu) is required
- [mono](https://www.mono-project.com/download/stable/#download-lin-ubuntu) too

then :
```
npm install --save-dev @electron-forge/cli
```

```
npm install --save-dev @electron-forge/maker-squirrel
```

```
npx electron-forge import
```

```
npm run make
```