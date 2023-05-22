
Når du skifter mellem ruter i Vue.js, bliver data i komponenterne ikke automatisk nulstillet, da Vue.js genbruger komponenter for at optimere ydelsen. Hvis du vil nulstille data, når du skifter rute, har du flere muligheder:

    Watch route changes: Du kan bruge Vue Router's watch for at overvåge ruteændringer og derefter nulstille dataene. Her er et eksempel:

javascript

import { watch } from 'vue';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();

    watch(route, () => {
      // reset data her
    });

    // ...
  }
}

    beforeRouteLeave og beforeRouteEnter: Du kan bruge Vue Router's navigation guards, beforeRouteLeave og beforeRouteEnter, til at nulstille dataene, når du forlader eller går ind på en rute. For eksempel:

javascript

import { onBeforeRouteLeave, onBeforeRouteEnter } from 'vue-router';

export default {
  setup() {
    onBeforeRouteLeave(() => {
      // reset data her
    });

    onBeforeRouteEnter(() => {
      // reset data her
    });

    // ...
  }
}

    Key attribute: Du kan give dine rute-komponenter en unik nøgle, som ændrer sig, når ruten ændres. Dette får Vue.js til at genoprette komponenterne fra bunden, når ruten ændres, i stedet for at genbruge dem.

html

<router-view :key="$route.fullPath" />

Vær opmærksom på, at denne metode kan påvirke appens ydeevne negativt, da det forhindrer genbrug af komponenter. Den bør kun bruges, hvis de andre metoder ikke fungerer for dit use case.


Hvis du ønsker at funktionen kaldes hver gang der mødes en taskUnix i en v-for løkke, kan du bruge en computed property eller en metode til at generere en ny liste af objekter, som indeholder det opdaterede data. Du kan derefter bruge denne nye liste i din v-for løkke.

Her er et eksempel, hvor vi bruger en metode til at generere en ny liste af objekter med det opdaterede data, når node.type er 'taskUnix':

html

<template>
  <div v-for="updatedNode in updatedNodes" :key="updatedNode.id">
    {{ updatedNode }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      nodes: [
        { id: 1, type: 'taskUnix', /* other properties */ },
        { id: 2, type: 'otherType', /* other properties */ },
        { id: 3, type: 'taskUnix', /* other properties */ },
        // other nodes
      ]
    }
  },
  methods: {
    setTaskNode(node) {
      if (node.type === 'taskUnix') {
        return 'Task Unix Node'
      } else {
        return null
      }
    },
    generateUpdatedNodes() {
      const updatedNodes = []
      for (const node of this.nodes) {
        const updatedNode = { ...node }
        updatedNode.taskNode = this.setTaskNode(node)
        updatedNodes.push(updatedNode)
      }
      return updatedNodes
    }
  },
  computed: {
    updatedNodes() {
      return this.generateUpdatedNodes()
    }
  }
}
</script>

I dette eksempel bruger vi en nodes data property til at gemme en liste af objekter med forskellige typer. Vi har også en setTaskNode metode, som returnerer 'Task Unix Node' hvis node.type er 'taskUnix', og ellers returnerer null.
-------------
loop gennem array
function closeSubtree(node: ItreeNode) {
  node.isVisible = false;
  if (node.type === "taskWorkflow") {
    for (const e: ItreeNode of node.workflow) {
      closeSubtree(e)
    }
  }
}
---------------

Iterate on your code faster with the new multi-line editor mode. Use Enter to add new lines and Ctrl+Enter to run.

----------------
Problemet med Vue løsningen er at der skal være et eventnavn.
Jeg har en træstruktur, og når man søger efter et element skal den aktuelle parent struktur folde sig ud. Og resten af træstrukturen skal stadig være foldet sammen

I denne situation kan du bruge Vue's reaktive data for at holde styr på de udvidede elementer i træstrukturen. Når du søger efter et element, kan du opdatere denne data for at folde den relevante parent-struktur ud. Her er et eksempel på, hvordan du kan gøre dette:

    Tilføj en data property expandedNodes i din komponent, der holder træstrukturen:

javascript

data() {
  return {
    treeData: [/* dit trædata her */],
    expandedNodes: new Set(),
  };
},

    Opret en metode til at udvide et specifikt element i træstrukturen ved at tilføje dets id til expandedNodes:

javascript

methods: {
  expandNode(nodeId) {
    this.expandedNodes.add(nodeId);
  },
},

    Opret en rekursiv komponent, der gengiver træstrukturen. Brug v-show direktivet til at kontrollere, om et element skal være synligt eller ej baseret på dets id i expandedNodes:

html

<template>
  <ul>
    <li v-for="node in treeData" :key="node.id">
      <span @click="$emit('expand', node.id)">{{ node.label }}</span>
      <TreeComponent
        v-if="node.children"
        :treeData="node.children"
        v-show="expandedNodes.has(node.id)"
        @expand="$emit('expand', $event)"
      ></TreeComponent>
    </li>
  </ul>
</template>

<script>
export default {
  name: "TreeComponent",
  props: {
    treeData: Array,
    expandedNodes: Object,
  },
  components: {
    TreeComponent: () => import("./TreeComponent.vue"),
  },
};
</script>

    For at udvide den relevante parent-struktur, når du søger efter et element, skal du først finde det element, du leder efter, og derefter udvide alle dets forældre ved at kalde expandNode metoden for hver af dem:

javascript

methods: {
  expandNode(nodeId) {
    this.expandedNodes.add(nodeId);
  },
  searchAndExpandNode(searchValue) {
    const foundNode = this.findNode(this.treeData, searchValue);

    if (foundNode) {
      // Udvid alle forældrene til det fundne element
      foundNode.path.forEach((nodeId) => {
        this.expandNode(nodeId);
      });
    }
  },
  findNode(treeData, searchValue) {
    for (const node of treeData) {
      if (node.label === searchValue) {
        return { node, path: [] };
      }

      if (node.children) {
        const result = this.findNode(node.children, searchValue);
        if (result) {
          result.path.unshift(node.id);
          return result;
        }
      }
    }

    return null;
  },
},

    Tilføj en søgefunktion i din komponent, der aktiverer searchAndExpandNode metoden, når en søgning udføres:

html

<template>
  <div>
    <input type="text" v-model="searchValue" @input="searchAndExpandNode(searchValue)" />
    <TreeComponent
      :treeData="treeData"
      :expandedNodes="expandedNodes"
      @expand="expandNode($event)"
    ></TreeComponent>

----------------------
forklar hvad der sker her:
    <TreeComponent
        v-if="node.children"
        :treeData="node.children"
        v-show="expandedNodes.has(node.id)"
        @expand="$emit('expand', $event)"
      ></TreeComponent>

Dette er en del af en rekursiv komponent, der gengiver en træstruktur. Her er en forklaring af hver linje:

    <TreeComponent v-if="node.children">: Dette tjekker, om det nuværende node objekt har en children property, hvilket betyder, at det har underordnede elementer. Hvis det har underordnede elementer, vil en ny TreeComponent blive oprettet for at gengive disse elementer.

    :treeData="node.children": Dette binder node.children arrayet til treeData property'en i den næste TreeComponent. Den næste TreeComponent vil bruge dette array til at gengive de underordnede elementer.

    v-show="expandedNodes.has(node.id)": Dette bruger Vue's v-show direktiv til at styre synligheden af den underordnede TreeComponent. Hvis expandedNodes indeholder node.id, betyder det, at denne node er udvidet, og den underordnede TreeComponent skal vises. Hvis ikke, vil den underordnede TreeComponent være skjult.

    @expand="$emit('expand', $event)": Dette lytter efter expand event'en udsendt af den underordnede TreeComponent. Når denne event udløses, udsender denne TreeComponent også en expand event med den samme værdi (node id). Dette gør det muligt for forælder-komponenterne at reagere på expand event'en, uanset hvor dybt i træstrukturen den udløses.

Så for at opsummere: denne kode opretter rekursive TreeComponent instanser for hver node, der har underordnede elementer. Den viser eller skjuler underordnede TreeComponent instanser baseret på, om den tilsvarende node er udvidet eller ej. Den håndterer også expand event'en og videregiver den til forælder-komponenterne.
peter@heick.dk
Vil det sige at forældre komponenten skal kende alle sub komponenter

Nej, forælder-komponenten behøver ikke at kende alle sub-komponenter direkte. I det givne eksempel bruges en rekursiv komponent, hvilket betyder, at den samme komponent bruges til at gengive både parent og sub-komponenter. Dette gør det muligt for træstrukturen at blive gengivet, uanset hvor dybt den er, uden at skulle oprette separate komponenter for hvert niveau.

Forælder-komponenten har dog viden om den overordnede træstruktur og styrer, hvilke noder der er udvidet ved hjælp af expandedNodes data property. Når du udløser en expand event i en sub-komponent, bruger Vue's event system til at videregive denne event op i komponent-hierarkiet, så forælder-komponenten kan reagere på det.

I det givne eksempel er event-håndteringen gjort ved at bruge @expand="$emit('expand', $event)" i TreeComponent. Dette gør, at event'en expand bliver udsendt fra sub-komponenten til dens forælder-komponent, som derefter kan udføre den ønskede handling (i dette tilfælde udvide eller skjule det pågældende sub-træ).

Så selvom forælder-komponenten har viden om den overordnede træstruktur og styrer, hvilke noder der er udvidet, er det ikke nødvendigt at kende hver enkelt sub-komponent direkte. Den rekursive komponent og Vue's event system tager sig af denne kommunikation mellem forældre- og sub-komponenterne.
peter@heick.dk
Ok så en event bliver kun sendt op igennem forældre træet og ikke til alle elementer i dom'en

Korrekt! I Vue bliver custom events, såsom den expand event, vi har talt om, kun sendt op igennem forældretræet og ikke til alle elementer i DOM'en.

Når en Vue-komponent udsender en event ved hjælp af $emit, vil denne event blive fanget af den nærmeste forælder-komponent, der lytter til denne event. Forælder-komponenten kan derefter vælge at reagere på denne event og eventuelt udsende sine egne events op i forældretræet, hvis det er nødvendigt.

Dette gør det muligt for Vue-komponenter at kommunikere med deres forældre-komponenter på en struktureret og afkoblet måde, uden at skulle kende til andre elementer i DOM'en. Det hjælper med at opretholde en ren og forståelig komponentarkitektur og gør det lettere at vedligeholde og udvide din applikation.
peter@heick.dk
Jeg vil gerne have at træet klpper sammen når man klikker en gang mere på et topelelment.

For at få træstrukturen til at klappe sammen, når du klikker på et top-element igen, kan du ændre expandNode metoden til at skifte tilstanden for den pågældende node, i stedet for altid at udvide den. Du kan gøre dette ved at tjekke, om expandedNodes allerede indeholder node-id'et, og hvis det gør det, skal du fjerne det i stedet for at tilføje det.

Opdater expandNode metoden som følger:

javascript

methods: {
  toggleNodeExpansion(nodeId) {
    if (this.expandedNodes.has(nodeId)) {
      this.expandedNodes.delete(nodeId);
    } else {
      this.expandedNodes.add(nodeId);
    }
  },
},

Og ændre navnet på event-handleren i TreeComponent til @expand="toggleNodeExpansion($event)":

html

<TreeComponent
  v-if="node.children"
  :treeData="node.children"
  v-show="expandedNodes.has(node.id)"
  @expand="toggleNodeExpansion($event)"
></TreeComponent>

Nu vil træstrukturen klappe sammen, når du klikker på et top-element igen. Hvis du klikker på et top-element, der allerede er udvidet, vil det klappe sammen og skjule dets underordnede elementer. Hvis du klikker på et top-element, der er skjult, vil det udvide og vise dets underordnede elementer.

Aktiver event fra typescript
const clickEvent = new Event('click');
button.dispatchEvent(clickEvent);
Generelt anbefales det at undgålobale variabler, da de kan føil utilsigtet adfæ og gøode svære at vedligeholde. I stedet for at bruge globale variabler i Vue 3 med Composition API, kan du overveje at bruge enten en lokal tilstand i setup() funktionen eller en global tilstand ved hjæ af Vuex.

Lokal tilstand i setup() funktionen:
For at oprette en lokal variabel i setup() funktionen, kan du bruge ref() eller reactive() funktionerne:

javascript
Copy code
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const localVar = ref(0);

    return {
      localVar
    };
  },
});

<pre>
Global tilstand med Vuex:
Hvis du vil have en global tilstand, der kan deles mellem forskellige komponenter, bø bruge Vuex. Vuex er en state management library, der er designet til at arbejde med Vue og gøt nemt at håtere global tilstand pån struktureret må.

Her er et eksempel påhvordan du kan oprette en global tilstand ved hjæ af Vuex:

javascript
Copy code
// store.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    globalVariable: 0
  },
  mutations: {
    increment(state) {
      state.globalVariable++;
    }
  }
});
javascript
Copy code
// main.js
import { createApp } from 'vue';
import App from './App.vue';
import store from './store';

createApp(App).use(store).mount('#app');
javascript
Copy code
// Component.vue
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore();

    const globalVariable = computed(() => store.state.globalVariable);

    return {
      globalVariable
    };
  },
});
I dette tilfæe er globalVariable gemt i Vuex store, hvilket gøt nemt at håtere og dele mellem forskellige komponenter. Dette er en bedre praksis end at bruge globale variabler, da det giver en mere struktureret og vedligeholdelsesvenlig må at håtere global tilstand på

</pre>

<pre>
Moduler i Vuex refererer til en må at dele og organisere din store i mindre, mere vedligeholdelige dele. Dette er sæigt nyttigt i støapplikationer, hvor kompleksiteten i en enkelt store kan blive overvæende. Hvert modul kan indeholde sin egen state, mutations, actions og getters.


Det tidligere eksempel, jeg gav, indeholdt ikke et modul. Det var et simpelt Vuex store eksempel. Her er et eksempel påhvordan man opretter en Vuex store med moduler:

Opret en hoved Vuex store-fil src/store/index.ts:

import { createStore } from 'vuex';
import userModule from './modules/user';

export default createStore({
  modules: {
    user: userModule,
  },
});

Opret et modul i src/store/modules/user.ts:

const state = () => ({
  name: '',
  age: 0,
});

const mutations = {
  setName(state, name) {
    state.name = name;
  },
  setAge(state, age) {
    state.age = age;
  },
};

const actions = {
  updateUser({ commit }, { name, age }) {
    commit('setName', name);
    commit('setAge', age);
  },
};

const getters = {
  fullName(state) {
    return `${state.name} Smith`;
  },
  isAdult(state) {
    return state.age >= 18;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

I dette eksempel opretter vi et user modul, der håterer brugerrelaterede data og logik. Vi bruger namespaced: true for at undgåavnekonflikter mellem moduler. For at fådgang til modulernes data og metoder, bruger du modulnavnet som et namespace, f.eks. store.getters['user/fullName'] eller store.dispatch('user/updateUser', { name: 'John', age: 30 }).

</pre>

eklager ulejligheden. Det kan muligvis have noget at gøre med teleport. 
Lad os prøve en anden tilgang. 
I stedet for at bruge v-if direkte på TaskComponent, 
kan vi oprette en beregnet egenskab, der returnerer den valgte taskUnix 
og derefter bruge denne egenskab som taskNode prop i TaskComponent.

    Fjern v-if fra TaskComponent:

html

<teleport to="#middle">
  <TaskComponent
    :taskNode="selectedTaskNode"
    :shownNode="shownNode"
    :key="selectedTaskNode.id">
  </TaskComponent>
</teleport>

    Tilføj en beregnet egenskab selectedTaskNode:

javascript

computed: {
  selectedTaskNode() {
    if (this.selectedNode) {
      return this.selectedNode;
    } else {
      return null;
    }
  },
},

    Opdater handleTaskClick metoden for at opdatere selectedNode:

javascript

methods: {
  handleTaskClick(node) {
    this.selectedNode = node;
  },
},

Nu, når du klikker på en taskUnix, vil selectedNode blive opdateret,
og den beregnede egenskab selectedTaskNode vil returnere den valgte taskUnix.
Den valgte taskUnix vil blive sendt som taskNode prop til TaskComponent.
Dette skulle løse problemet med, at den tidligere TaskComponent fortsat vises.