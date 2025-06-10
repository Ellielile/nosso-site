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
        const questionSections = document.querySelectorAll('.question-section');
        const prevButton = document.getElementById('prevQuestion');
        const nextButton = document.getElementById('nextQuestion');
        const submitButton = document.getElementById('submitQuiz');
        let currentQuestionIndex = 0;

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

        function showQuestion(index) {
            questionSections.forEach((section, i) => {
                if (i === index) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
            updateNavigationButtons();
        }

        function isCurrentQuestionAnswered() {
            const currentQuestionSection = questionSections[currentQuestionIndex];
            const radioButtons = currentQuestionSection.querySelectorAll('input[type="radio"]');
            for (const radioButton of radioButtons) {
                if (radioButton.checked) {
                    return true;
                }
            }
            return false;
        }

        function updateNavigationButtons() {
            prevButton.style.display = currentQuestionIndex === 0 ? 'none' : 'inline-block';
            if (currentQuestionIndex === questionSections.length - 1) {
                nextButton.style.display = 'none';
                submitButton.style.display = 'inline-block';
            } else {
                nextButton.style.display = 'inline-block';
                submitButton.style.display = 'none';
            }
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                if (!isCurrentQuestionAnswered()) {
                    alert('Por favor, selecione uma resposta antes de ir para a próxima pergunta!');
                    return;
                }
                if (currentQuestionIndex < questionSections.length - 1) {
                    currentQuestionIndex++;
                    showQuestion(currentQuestionIndex);
                }
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (currentQuestionIndex > 0) {
                    currentQuestionIndex--;
                    showQuestion(currentQuestionIndex);
                }
            });
        }

        quizForm.addEventListener('submit', (event) => {
            event.preventDefault();

            let allQuestionsAnswered = true;
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
                    showQuestion(i);
                    break;
                }
            }

            if (!allQuestionsAnswered) {
                return;
            }

            let score = 0;
            const totalQuestions = Object.keys(correctAnswers).length;
            const formData = new FormData(quizForm);
            const userAnswers = {};

            for (const [name, value] of formData.entries()) {
                userAnswers[name] = value;
            }

            for (const question in correctAnswers) {
                if (userAnswers[question] === correctAnswers[question]) {
                    score++;
                }
            }

            window.location.href = `formAction.html?score=${score}&total=${totalQuestions}`;
        });

        if (questionSections.length > 0) {
            showQuestion(currentQuestionIndex);
        }
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
            } else if (finalScore >= totalQuestions * 0.7) {
                message = `Excelente! Você acertou ${finalScore} de ${totalQuestions} perguntas (${formattedPercentage}%). Continue praticando! 👍`;
                paragrafoResultado.style.color = '#79c0ff';
            } else if (finalScore >= totalQuestions / 2) {
                message = `Muito bom! Você acertou ${finalScore} de ${totalQuestions} perguntas (${formattedPercentage}%). Você está no caminho certo!`;
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

    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = {
            x: undefined,
            y: undefined,
            radius: 100
        };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                if (this.x + this.size > canvas.width || this.x - this.size < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y + this.size > canvas.height || this.y - this.size < 0) {
                    this.directionY = -this.directionY;
                }

                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

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

                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function initParticles() {
            particles = [];
            let numberOfParticles = (canvas.width * canvas.height) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 5) + 1;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 0.5) - 0.25;
                let directionY = (Math.random() * 0.5) - 0.25;
                let color = 'rgba(88, 166, 255, 0.4)';
                particles.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        function connectParticles() {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) +
                                   ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = `rgba(88, 166, 255, ${opacityValue})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            connectParticles();
        }

        window.addEventListener('resize', resizeCanvas);
        canvas.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });
        canvas.addEventListener('mouseleave', () => {
            mouse.x = undefined;
            mouse.y = undefined;
        });

        resizeCanvas();
        animate();
    }
});