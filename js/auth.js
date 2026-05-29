// ⚠️ COLE AQUI A SUA URL COPIADA DO GOOGLE APPS SCRIPT
const URL_API_PLANILHA = "https://script.google.com/macros/s/AKfycbz4QJOIeDNm9yfWYK1onbsEuvpE_DmITuJqoAVB_o9MGj3DkOxpHY_8FFUooO1JXoXp/exec"; 

// Função para verificar permissões do aluno na Planilha Google
function verificarPermissoesPlanilha(user) {
    const emailUsuario = user.email;

    fetch(`${URL_API_PLANILHA}?email=${encodeURIComponent(emailUsuario)}`)
        .then(response => response.json())
        .then(resultado => {
            if (resultado.autorizado === true) {
                // Guarda as permissões localmente no navegador para usar no Dashboard
                localStorage.setItem("permissoes_minerva", JSON.stringify(resultado.permissoes));
                
                // Se o usuário estiver na tela de login, manda ele para o Dashboard
                if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
                    window.location.href = "dashboard.html";
                }
            } else {
                // Se não estiver autorizado na planilha, desloga do Firebase por segurança
                firebase.auth().signOut();
                localStorage.removeItem("permissoes_minerva");
                
                alert(`Acesso Negado: ${resultado.motivo}`);
                
                // Manda de volta para a tela de login se já não estiver nela
                if (!window.location.pathname.endsWith("index.html") && window.location.pathname !== "/") {
                    window.location.href = "index.html";
                }
            }
        })
        .catch(erro => {
            console.error("Erro ao validar acesso na planilha:", erro);
            alert("Erro ao verificar suas permissões de acesso. Tente novamente.");
        });
}

// Monitora o estado do login (Roda automaticamente em todas as páginas)
firebase.auth().onAuthStateChanged((user) => {
    const naTelaDeLogin = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";

    if (user) {
        // Usuário está logado no Firebase, agora valida na Planilha
        verificarPermissoesPlanilha(user);
    } else {
        // Usuário NÃO está logado
        localStorage.removeItem("permissoes_minerva");
        if (!naTelaDeLogin) {
            // Se tentar acessar o dashboard ou slides sem logar, é expulso para o login
            window.location.href = "index.html";
        }
    }
});

// Função global para o botão de Logout (Sair)
window.fazerLogout = function() {
    firebase.auth().signOut().then(() => {
        localStorage.removeItem("permissoes_minerva");
        window.location.href = "index.html";
    });
};