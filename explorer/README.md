
# initialisering
Når systemet startes op skal initialiseringen ske inden de forskellige komponenter renderes.
Det klares ved at der i config.ts er en ref variabel "isLoading" som defautl er sat til true.
Og som sættes til false når initialisering er udført.
I app.vue "hentes" / "kopieres" denne ref variabel over i en ny ref "isLoading".
de komponenter der er afhængig af initialisering renderes kun når isLoading er false.
<pre>
  <ExplorerComponent v-if="!isLoading"></ExplorerComponent>
</pre>
Det drejer sig om config. config skal læses ind on vi skal finde default env.
og slå op i config.environments "arrayet" (Det er ikke et array men et objekt)
Først derefter kan vi begynde at læse workflow data ind.

Så rækkefølgen er:
1. Læs config.json
2. Find default env
3. Læs default token
Det sker i server.ts under opstart så websiden kommer ikke igang før serveren er klar.
app.vue kalder så config.init som kalde api.getDefaultEnv der fetcher api.getDefaultEnv 
der på dette tidpunkt ligger klar.

# explorer

Setup development
cd projects/wkfexplorer
./setup

cd explorer
npm run build

Start en ny terminal: ctrl alt t
cd projects/wkfexplorer/server
npm start


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
