document.addEventListener('DOMContentLoaded', () => {
    const colorChangeButton = document.getElementById('colorChangeButton');
    if (colorChangeButton) {
        colorChangeButton.addEventListener('click', () => {
            const currentColor = colorChangeButton.style.backgroundColor;
            if (currentColor === 'blue') {
                colorChangeButton.style.backgroundColor = 'green';
                colorChangeButton.style.color = 'white';
            } else {
                colorChangeButton.style.backgroundColor = 'blue';
                colorChangeButton.style.color = 'white';
            }
        });
    }

    const quizForm = document.getElementById('quizForm');

    if (quizForm) {
        const correctAnswers = {
            q1: 'p',
            q2: 'a',
            q3: 'color',
            q4: '.',
            q5: 'console.log()',
            q6: 'interatividade'
        };

        quizForm.addEventListener('submit', (event) => {
            event.preventDefault();

            let score = 0;
            const totalQuestions = Object.keys(correctAnswers).length;

            const formData = new FormData(quizForm);
            const userAnswers = {};

            for (const [name, value] of formData.entries()) {
                userAnswers[name] = value;
            }

            if (Object.keys(userAnswers).length !== totalQuestions) {
                alert('Por favor, responda a todas as perguntas antes de enviar o quiz!');
                return;
            }

            for (const question in correctAnswers) {
                if (userAnswers[question] === correctAnswers[question]) {
                    score++;
                }
            }

            console.log('Respostas do usuário:', userAnswers);
            console.log('Respostas corretas esperadas:', correctAnswers);
            console.log('Pontuação final calculada:', score);

            window.location.href = `formAction.html?score=${score}&total=${totalQuestions}`;
        });
    }

    const resultadoDiv = document.getElementById('resultado');
    const paragrafoResultado = document.querySelector('.paragrafo');

    if (resultadoDiv && paragrafoResultado) {
        const urlParams = new URLSearchParams(window.location.search);
        const score = urlParams.get('score');
        const total = urlParams.get('total');

        if (score !== null && total !== null) {
            const finalScore = parseInt(score);
            const totalQuestions = parseInt(total);

            const percentage = (finalScore / totalQuestions) * 100;
            const formattedPercentage = percentage.toFixed(0);

            let message = '';
            if (finalScore === totalQuestions) {
                
                message = `Parabéns! Você acertou todas as ${finalScore} perguntas (${formattedPercentage}%). 🎉`;
                paragrafoResultado.style.color = '#58a6ff';
            } else if (finalScore >= totalQuestions / 2) {
                
                message = `Muito bom! Você acertou ${finalScore} de ${totalQuestions} perguntas (${formattedPercentage}%). Continue praticando! 👍`;
                paragrafoResultado.style.color = '#c9d1d9';
            } else {
                
                message = `Você acertou ${finalScore} de ${totalQuestions} perguntas (${formattedPercentage}%). Não desanime, continue estudando! 💪`;
                paragrafoResultado.style.color = '#e74c3c';
            }

            paragrafoResultado.textContent = message;
            
            resultadoDiv.innerHTML = `<h2>Sua Pontuação: ${finalScore}/${totalQuestions} (${formattedPercentage}%)</h2>`;
        } else {
            paragrafoResultado.textContent = 'Nenhum resultado de quiz encontrado.';
        }
    }
});