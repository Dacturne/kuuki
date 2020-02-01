[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
![GitHub](https://img.shields.io/github/license/dacturne/kuuki)

<p align="center"><img src="./kuuki.svg" width="150" alt="Kuuki logo"></p>
<h1 align="center"><pre>@kuuki</pre></h1>

A project that aims to improve the accessibility to open data APIs in the environmental sector regarding air quality.

### Features
Gather measurements from multiple providers and data sources with the usage of strictly typed libraries.
React to events instead of manually polling external APIs.
Have everything in one place and easily configurable.
- type definitions
- listen to changes via events
- narrow down the requests to what suits your needs
- choose your own storage method (hook up an event consumer)

### Packages
- 📦[`@kuuki/gios`](https://github.com/Dacturne/kuuki/tree/master/packages/gios/) - a simple GIOS API wrapper
- 📦[`@kuuki/gios-events`](https://github.com/Dacturne/kuuki/tree/master/packages/gios-events/) - listen to changes in `gios`
- 📦[`@kuuki/luftdaten`](https://github.com/Dacturne/kuuki/tree/master/packages/luftdaten/) - a simple Luftdaten API wrapper
- 📦[`@kuuki/luftdaten-events`](https://github.com/Dacturne/kuuki/tree/master/packages/luftdaten-events/) - listen to changes in `luftdaten`

### Brief overview of the folder structure
```
📂kuuki
 ┣ 📄docs                     # Root docs folder
 ┃ ┣ 📂gios
 ┃ ┣ 📂gios-events
 ┃ ┣ 📂luftdaten
 ┃ ┣ 📂luftdaten-events
 ┣ 📂packages
 ┃ ┣ 📦gios                   # Package name
 ┃ ┃ ┣ 💾dist                 # Compiled files are placed in dist
 ┃ ┃ ┣ 📂examples             # Examples folder
 ┃ ┃ ┃ ┗ 📂basic-example
 ┃ ┃ ┣ 💻src                  # Source code folder
 ┃ ┣ 📦gios-events
 ┃ ┃ ┣ 💾dist
 ┃ ┃ ┣ 📂examples
 ┃ ┃ ┃ ┗ 📂basic-example
 ┃ ┃ ┣ 💻src
 ┃ ┣ 📦luftdaten
 ┃ ┃ ┣ 💾dist
 ┃ ┃ ┣ 💻src
 ┃ ┣ 📦luftdaten-events
 ┃ ┃ ┣ 💾dist
 ┃ ┃ ┣ 📂examples
 ┃ ┃ ┃ ┗ 📂basic-example
 ┃ ┃ ┣ 💻src
```
