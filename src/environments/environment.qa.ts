// ng build --configuration=qa
export const environment = {
  env: "production",
  production: true,
  protocol: "https",
  hostLocal : "ovndesqa.web.app",
  host : {
    ovnMain : "ovndesqa.web.app/",
    ovnADM  : "ovndesqa.web.app/",
    ovnDES  : "ovndesqa.web.app/"
  },
  hostType : 2,
  hostBefore : "", 
  hostAfter : "", 
  firebase_coleccion_base : "OVN_QA",
  rest: "", 
  service : "",
  firebase: {
    apiKey: "AIzaSyDSaO4789Zco5fy-wd4VrgAsYcMalNfKMM",
    authDomain: "stone-net-265023.firebaseapp.com",
    databaseURL: "https://stone-net-265023.firebaseio.com",
    projectId: "stone-net-265023",
    storageBucket: "stone-net-265023.appspot.com",
    messagingSenderId: "706486790340",
    appId: "1:706486790340:web:f489c27ee05b67138fc191",
    measurementId: "G-Y1PN9XVFXR"
  },
  version : "1.0.0",
  systemId : 5,
  mainModuleFree : true,
  default_languaje: "es"
};