document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica para o Botão de Mudança de Cor ---
    // Seleciona o botão com o ID 'colorChangeButton'
    const colorChangeButton = document.getElementById('colorChangeButton');

    // Verifica se o botão existe antes de adicionar o event listener
    if (colorChangeButton) {
        // Adiciona um event listener para o evento de 'click' no botão
        colorChangeButton.addEventListener('click', () => {
            // Obtém a cor de fundo atual do botão
            const currentColor = colorChangeButton.style.backgroundColor;

            // Alterna a cor de fundo entre azul e verde
            if (currentColor === 'blue') {
                // Se for azul, muda para verde e define a cor do texto para branco
                colorChangeButton.style.backgroundColor = 'green';
                colorChangeButton.style.color = 'white';
            } else {
                // Caso contrário (se não for azul), muda para azul e define a cor do texto para branco
                colorChangeButton.style.backgroundColor = 'blue';
                colorChangeButton.style.color = 'white';
            }
        });
    }

    // --- Lógica para o Formulário do Quiz ---
    // Seleciona o formulário do quiz pelo ID 'quizForm'
    const quizForm = document.getElementById('quizForm');

    // Verifica se o formulário do quiz existe
    if (quizForm) {
        // Seleciona todas as seções de perguntas
        const questionSections = document.querySelectorAll('.question-section');
        // Seleciona os botões de navegação e o botão de submissão
        const prevButton = document.getElementById('prevQuestion');
        const nextButton = document.getElementById('nextQuestion');
        const submitButton = document.getElementById('submitQuiz');
        // Inicializa o índice da pergunta atual
        let currentQuestionIndex = 0;

        // Objeto que armazena as respostas corretas do quiz
        const correctAnswers = {
            q1: 'p',
            q2: 'a',
            q3: 'color',
            q4: '.',
            q5: 'console.log()',
            q6: 'interatividade',
            q7: 'img',
            q8: 'video',
            q9: 'table',
            q10: 'ul'
        };

        // Função para exibir a pergunta com base no índice
        function showQuestion(index) {
            // Itera sobre todas as seções de perguntas
            questionSections.forEach((section, i) => {
                // Se o índice da seção for igual ao índice atual, adiciona a classe 'active'
                if (i === index) {
                    section.classList.add('active');
                } else {
                    // Caso contrário, remove a classe 'active'
                    section.classList.remove('active');
                }
            });
            // Atualiza o estado dos botões de navegação
            updateNavigationButtons();
        }

        // Função para verificar se a pergunta atual foi respondida
        function isCurrentQuestionAnswered() {
            // Obtém a seção da pergunta atual
            const currentQuestionSection = questionSections[currentQuestionIndex];
            // Seleciona todos os radio buttons dentro da seção da pergunta atual
            const radioButtons = currentQuestionSection.querySelectorAll('input[type="radio"]');
            // Itera sobre os radio buttons para verificar se algum está marcado
            for (const radioButton of radioButtons) {
                if (radioButton.checked) {
                    return true; // Retorna true se uma resposta foi selecionada
                }
            }
            return false; // Retorna false se nenhuma resposta foi selecionada
        }

        // Função para atualizar a visibilidade dos botões de navegação
        function updateNavigationButtons() {
            // Esconde o botão "Anterior" se estiver na primeira pergunta
            prevButton.style.display = currentQuestionIndex === 0 ? 'none' : 'inline-block';
            // Se estiver na última pergunta, esconde "Próximo" e mostra "Finalizar"
            if (currentQuestionIndex === questionSections.length - 1) {
                nextButton.style.display = 'none';
                submitButton.style.display = 'inline-block';
            } else {
                // Caso contrário, mostra "Próximo" e esconde "Finalizar"
                nextButton.style.display = 'inline-block';
                submitButton.style.display = 'none';
            }
        }

        // Adiciona event listener ao botão "Próximo"
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                // Verifica se a pergunta atual foi respondida
                if (!isCurrentQuestionAnswered()) {
                    alert('Por favor, selecione uma resposta antes de ir para a próxima pergunta!');
                    return; // Interrompe a função se a pergunta não foi respondida
                }
                // Se não for a última pergunta, avança para a próxima
                if (currentQuestionIndex < questionSections.length - 1) {
                    currentQuestionIndex++;
                    showQuestion(currentQuestionIndex);
                }
            });
        }

        // Adiciona event listener ao botão "Anterior"
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                // Se não for a primeira pergunta, volta para a anterior
                if (currentQuestionIndex > 0) {
                    currentQuestionIndex--;
                    showQuestion(currentQuestionIndex);
                }
            });
        }

        // Adiciona event listener para o evento de 'submit' do formulário do quiz
        quizForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Previne o comportamento padrão de submissão do formulário

            let allQuestionsAnswered = true;
            // Loop para verificar se todas as perguntas foram respondidas
            for (let i = 0; i < questionSections.length; i++) {
                const questionName = `q${i + 1}`;
                const radios = document.querySelectorAll(`input[name="${questionName}"]`);
                let answered = false;
                for (const radio of radios) {
                    if (radio.checked) {
                        answered = true;
                        break;
                    }
                }
                if (!answered) {
                    allQuestionsAnswered = false;
                    alert(`Por favor, responda à pergunta ${i + 1} antes de finalizar o quiz!`);
                    showQuestion(i); // Mostra a pergunta não respondida
                    break;
                }
            }

            // Se nem todas as perguntas foram respondidas, interrompe a função
            if (!allQuestionsAnswered) {
                return;
            }

            let score = 0;
            // Obtém o número total de perguntas
            const totalQuestions = Object.keys(correctAnswers).length;
            // Cria um objeto FormData a partir do formulário
            const formData = new FormData(quizForm);
            const userAnswers = {};

            // Popula o objeto userAnswers com as respostas do usuário
            for (const [name, value] of formData.entries()) {
                userAnswers[name] = value;
            }

            // Compara as respostas do usuário com as respostas corretas e calcula a pontuação
            for (const question in correctAnswers) {
                if (userAnswers[question] === correctAnswers[question]) {
                    score++;
                }
            }

            // Redireciona para 'formAction.html' passando a pontuação e o total como parâmetros de URL
            window.location.href = `formAction.html?score=${score}&total=${totalQuestions}`;
        });

        // Exibe a primeira pergunta quando o quiz é carregado
        if (questionSections.length > 0) {
            showQuestion(currentQuestionIndex);
        }
    }

    // --- Lógica para Exibir o Resultado do Quiz (na página formAction.html) ---
    // Seleciona a div de resultado e o parágrafo de resultado
    const resultadoDiv = document.getElementById('resultado');
    const paragrafoResultado = document.querySelector('.paragrafo');

    // Verifica se os elementos de resultado existem na página
    if (resultadoDiv && paragrafoResultado) {
        // Obtém os parâmetros da URL
        const urlParams = new URLSearchParams(window.location.search);
        const score = urlParams.get('score'); // Obtém a pontuação
        const total = urlParams.get('total'); // Obtém o total de perguntas

        // Verifica se a pontuação e o total foram passados na URL
        if (score !== null && total !== null) {
            const finalScore = parseInt(score); // Converte a pontuação para inteiro
            const totalQuestions = parseInt(total); // Converte o total para inteiro

            // Calcula a porcentagem de acertos
            const percentage = (finalScore / totalQuestions) * 100;
            const formattedPercentage = percentage.toFixed(0); // Formata a porcentagem sem casas decimais

            let message = '';
            // Define a mensagem e a cor do texto com base na pontuação
            if (finalScore === totalQuestions) {
                message = `Parabéns! Você acertou todas as ${finalScore} perguntas (${formattedPercentage}%). 🎉`;
                paragrafoResultado.style.color = '#58a6ff'; // Azul vibrante
            } else if (finalScore >= totalQuestions * 0.7) {
                message = `Excelente! Você acertou ${finalScore} de ${totalQuestions} perguntas (${formattedPercentage}%). Continue praticando! 👍`;
                paragrafoResultado.style.color = '#79c0ff'; // Azul mais claro
            } else if (finalScore >= totalQuestions / 2) {
                message = `Muito bom! Você acertou ${finalScore} de ${totalQuestions} perguntas (${formattedPercentage}%). Você está no caminho certo!`;
                paragrafoResultado.style.color = '#c9d1d9'; // Cinza claro
            } else {
                message = `Você acertou ${finalScore} de ${totalQuestions} perguntas (${formattedPercentage}%). Não desanime, continue estudando! 💪`;
                paragrafoResultado.style.color = '#e74c3c'; // Vermelho
            }

            // Define o texto e o HTML dos elementos de resultado
            paragrafoResultado.textContent = message;
            resultadoDiv.innerHTML = `<h2>Sua Pontuação: ${finalScore}/${totalQuestions} (${formattedPercentage}%)</h2>`;
        } else {
            // Mensagem exibida se nenhum resultado for encontrado
            paragrafoResultado.textContent = 'Nenhum resultado de quiz encontrado.';
        }
    }

    // --- Lógica para o Efeito de Partículas (Canvas) ---
    // Seleciona o elemento canvas
    const canvas = document.getElementById('particleCanvas');

    // Verifica se o canvas existe
    if (canvas) {
        const ctx = canvas.getContext('2d'); // Obtém o contexto 2D do canvas
        let particles = []; // Array para armazenar as partículas
        // Objeto para rastrear a posição do mouse e o raio de interação
        let mouse = {
            x: undefined,
            y: undefined,
            radius: 100
        };

        // Função para redimensionar o canvas e reinicializar as partículas
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles(); // Re-inicializa as partículas para o novo tamanho
        }

        // Classe para representar uma partícula individual
        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            // Desenha a partícula no canvas
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            // Atualiza a posição da partícula e lida com a interação com o mouse e as bordas
            update() {
                // Inverte a direção se a partícula atingir as bordas do canvas
                if (this.x + this.size > canvas.width || this.x - this.size < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y + this.size > canvas.height || this.y - this.size < 0) {
                    this.directionY = -this.directionY;
                }

                // Calcula a distância entre a partícula e o mouse
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                // Se a partícula estiver dentro do raio de interação do mouse, ela é "empurrada"
                if (distance < mouse.radius + this.size) {
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                        this.x += 10;
                    }
                    if (mouse.x > this.x && this.x > this.size * 10) {
                        this.x -= 10;
                    }
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                        this.y += 10;
                    }
                    if (mouse.y > this.y && this.y > this.size * 10) {
                        this.y -= 10;
                    }
                }

                // Move a partícula
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw(); // Redesenha a partícula na nova posição
            }
        }

        // Função para inicializar (criar) as partículas
        function initParticles() {
            particles = []; // Limpa o array de partículas existente
            // Calcula o número de partículas com base no tamanho do canvas
            let numberOfParticles = (canvas.width * canvas.height) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 5) + 1; // Tamanho aleatório da partícula
                // Posição inicial aleatória, garantindo que não spawne nas bordas
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                // Direção aleatória de movimento
                let directionX = (Math.random() * 0.5) - 0.25;
                let directionY = (Math.random() * 0.5) - 0.25;
                let color = 'rgba(88, 166, 255, 0.4)'; // Cor das partículas (azul com transparência)
                particles.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        // Função para conectar as partículas com linhas
        function connectParticles() {
            let opacityValue = 1;
            // Itera sobre cada par de partículas
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    // Calcula a distância quadrada entre as duas partículas
                    let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) +
                                   ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                    // Se a distância for menor que um limite, desenha uma linha entre elas
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        // Calcula a opacidade da linha com base na distância
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = `rgba(88, 166, 255, ${opacityValue})`; // Define a cor da linha
                        ctx.lineWidth = 1; // Espessura da linha
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y); // Ponto inicial da linha
                        ctx.lineTo(particles[b].x, particles[b].y); // Ponto final da linha
                        ctx.stroke(); // Desenha a linha
                    }
                }
            }
        }

        // Função principal de animação
        function animate() {
            requestAnimationFrame(animate); // Solicita o próximo frame da animação
            ctx.clearRect(0, 0, innerWidth, innerHeight); // Limpa o canvas a cada frame

            // Atualiza e desenha cada partícula
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            connectParticles(); // Conecta as partículas
        }

        // Adiciona event listener para redimensionamento da janela
        window.addEventListener('resize', resizeCanvas);
        // Adiciona event listener para movimento do mouse no canvas
        canvas.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });
        // Reseta a posição do mouse quando ele sai do canvas
        canvas.addEventListener('mouseleave', () => {
            mouse.x = undefined;
            mouse.y = undefined;
        });

        resizeCanvas(); // Chama a função para redimensionar e inicializar as partículas ao carregar
        animate(); // Inicia a animação
    }
});