document.addEventListener('DOMContentLoaded', () => {
    const userNameInput = document.getElementById('userNameInput');
    const loginButton = document.getElementById('loginButton');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const startQuizButton = document.getElementById('startQuizButton');

    if (loginButton && userNameInput && welcomeMessage && startQuizButton) {
        loginButton.addEventListener('click', () => {
            const userName = userNameInput.value.trim();

            if (userName) {
                // Salva o nome do usuário no localStorage
                localStorage.setItem('devquizUserName', userName);

                welcomeMessage.textContent = `Bem-vindo(a), ${userName}!`;
                welcomeMessage.style.display = 'block'; 
                
                // Oculta o input e o botão de login
                userNameInput.style.display = 'none';
                loginButton.style.display = 'none';

                startQuizButton.style.display = 'inline-block'; // Mostra o botão "Iniciar Quiz"
            } else {
                alert('Por favor, digite seu nome para continuar.');
            }
        });
    }
});