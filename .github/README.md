La configuration de la pipeline se trouve dans `.github/workflows/merge_main.yml`.

## Runner GitHub

GitHub met à disposition des runners gratuits et hébergés par leur soin pour exécuter les pipelines.

## Empaquetage pour Linux

```
npm install --save-dev @electron-forge/cli
```

```
npm exec --package=@electron-forge/cli -c "electron-forge import"
```

```
npm run make
```
