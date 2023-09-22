// ng serve --open --live-reload false
export const environment = {
  env: "local",
  production: false,
  protocol: "http",
  hostLocal : "localhost:4220",
  host : {
    ovnMain : "localhost:8443/",
    ovnADM  : "localhost:8444/",
    ovnBUI  : "localhost:8445/",
    ovnDES  : "localhost:8448/"
  },
  hostType : 2,
  hostBefore : "", 
  hostAfter : "", 
  firebase_coleccion_base : "OVN_DESA",
  rest: "/Inlandnet", 
  service : "Business",
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
  maps :{
    key : "AIzaSyDSaO4789Zco5fy-wd4VrgAsYcMalNfKMM",
  },
  version : "1.0.0",
  systemId : 5,
  mainModuleFree : true,
  default_languaje: "es"
};