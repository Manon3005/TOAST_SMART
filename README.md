## Get the App

### Windows

On the GitHub page, go to `Actions` tab.  
Click on the last workflow run.  
In the `Artifacts`, download the windows package.  
Unzip the package.  
Enter the unzipped package and go to `TOAST.../Toast.exe`.  
Because of the Antivirus, you may need to indicate that it is a safe program (the way of doing depends on your antivirus).

### Linux

On the GitHub page, go to `Actions` tab.  
Click on the last workflow run.  
In the `Artifacts`, download the linux package.  
Unzip the package.  
Enter the unzipped package and go to `TOAST.../toast` (Can take few seconds to open).  
Maybe you should execute `chmod +x toast` before.

### MacOS

On the GitHub page, go to `Actions` tab.  
Click on the last workflow run.  
In the `Artifacts`, download the macos package.  
Unzip the package and execute toast.

## Dev SetUp

In order to launch the REACT frontend :

```bash
$ cd frontend
$ npm install
$ npm install react-router-dom@6
$ cd ..
$ npm install
$ npm run start # At the root, open the app ; if we're in the frontend folder, launch in dev mode (live editing)
```

In order to launch the backend :

- Install the following librairies :

```bash
$ npm install csv-parse
$ npm install --save-dev @types/csv-parse
$ npm install express
$ npm install fast-levenshtein
```

- In order to launch it :

```bash
$ npm run start
```
