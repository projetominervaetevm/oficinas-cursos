// Configuração do Firebase do seu projeto Minerva
const firebaseConfig = {
    apiKey: "AIzaSyDnzxP7kc-qEKumUqyNAlVA_zCqgz3s4qU",
    authDomain: "oficina-3d-minerva.firebaseapp.com",
    projectId: "oficina-3d-minerva",
    storageBucket: "oficina-3d-minerva.firebasestorage.app",
    messagingSenderId: "241260901502",
    appId: "1:241260901502:web:63fb6e57a446eea876142f",
};

// Inicializa o Firebase apenas se ainda não tiver sido inicializado
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

