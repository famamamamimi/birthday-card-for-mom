document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const envelope = document.getElementById('envelope');
    const card = document.getElementById('card');
    const heartsBtn = document.getElementById('heartsBtn');
    const moreHeartsBtn = document.getElementById('moreHeartsBtn');
    const heartsContainer = document.getElementById('heartsContainer');
    const additionalMessage = document.getElementById('additionalMessage');
    const clickMessage = document.getElementById('clickMessage');

    let heartCount = 0;
    const maxHearts = 150; // Максимальное количество сердечек одновременно

    // 1. Открытие конверта
    envelope.addEventListener('click', function() {
        // Анимация открытия конверта
        const flap = document.querySelector('.flap');
        flap.style.transform = 'rotateX(180deg)';

        // Скрываем сообщение о клике
        clickMessage.style.opacity = '0';
        clickMessage.style.transition = 'opacity 0.5s ease';

        // Показываем открытку через задержку
        setTimeout(() => {
            card.classList.remove('hidden');
            card.classList.add('show');

            // Показываем дополнительные элементы
            setTimeout(() => {
                additionalMessage.classList.remove('hidden');
            }, 1000);
        }, 500);

        // Запускаем сердечки при открытии
        setTimeout(() => createRandomHearts(15, 'float'), 300);
    });

    // 2. Создание одного сердечка
    function createHeart(x, y, type = 'float') {
        if (heartCount >= maxHearts) return null;

        const heart = document.createElement('div');
        heart.className = 'heart';

        // Случайный вид сердечка
        const useIcon = Math.random() > 0.5;
        if (useIcon) {
            const icon = document.createElement('i');
            icon.className = 'fas fa-heart';
            heart.appendChild(icon);
        } else {
            const heartTypes = ['❤️', '💖', '💗', '💓', '💕', '💞'];
            const heartType = heartTypes[Math.floor(Math.random() * heartTypes.length)];
            heart.textContent = heartType;
        }

        // Случайный цвет сердечка
        const colors = [
            '#ff6b6b', '#ff4757', '#ff3838',
            '#ff9f43', '#ffaf40',
            '#ff7675', '#fd79a8', '#e84393',
            '#a29bfe', '#6c5ce7'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Позиционирование
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.color = color;

        // Случайный размер
        const size = Math.random() * 25 + 20;
        heart.style.fontSize = size + 'px';

        heartsContainer.appendChild(heart);
        heartCount++;

        // Параметры анимации
        let animationName, duration, moveX, moveY, rotate;

        if (type === 'fall') {
            // Сердечки падают вниз
            moveX = (Math.random() - 0.5) * 80;
            moveY = 500 + Math.random() * 300;
            rotate = Math.random() * 720;
            duration = 2000 + Math.random() * 2000;
            animationName = 'heartFallDown';
        } else if (type === 'explode') {
            // Сердечки разлетаются от центра (для кликов)
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 70;
            moveX = Math.cos(angle) * distance;
            moveY = Math.sin(angle) * distance;
            rotate = Math.random() * 360;
            duration = 1200 + Math.random() * 800;
            animationName = 'heartExplodeOut';
        } else {
            // Сердечки плавно всплывают вверх (по умолчанию)
            moveX = (Math.random() - 0.5) * 50;
            moveY = -180 - Math.random() * 180;
            rotate = Math.random() * 360;
            duration = 2200 + Math.random() * 1300;
            animationName = 'heartFloatUp';
        }

        // Устанавливаем CSS переменные для анимации
        heart.style.setProperty('--move-x', moveX + 'px');
        heart.style.setProperty('--move-y', moveY + 'px');
        heart.style.setProperty('--rotate', rotate + 'deg');

        // Начальная прозрачность
        const startOpacity = 0.8 + Math.random() * 0.2;

        // Запускаем анимацию
        const animation = heart.animate([
            {
                transform: `translate(-50%, -50%) scale(${type === 'explode' ? 0 : 0.6}) rotate(0deg)`,
                opacity: startOpacity
            },
            {
                transform: `translate(
                    calc(-50% + var(--move-x)),
                    calc(-50% + var(--move-y))
                ) rotate(var(--rotate)) scale(${type === 'fall' ? 1.2 : 1})`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: type === 'explode' ? 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' :
                   type === 'fall' ? 'cubic-bezier(0.55, 0.085, 0.68, 0.53)' :
                   'cubic-bezier(0.215, 0.610, 0.355, 1)'
        });

        // Удаление сердечка после анимации
        animation.onfinish = () => {
            if (heart.parentNode) {
                heart.remove();
                heartCount--;
            }
        };

        return heart;
    }

    // 3. Создание нескольких сердечек в случайных местах
    function createRandomHearts(count, type = 'float') {
        for (let i = 0; i < count && heartCount < maxHearts; i++) {
            setTimeout(() => {
                const x = 50 + Math.random() * (window.innerWidth - 100);
                const y = type === 'fall' ? -30 : window.innerHeight + 30;
                createHeart(x, y, type);
            }, i * 60);
        }
    }

    // 4. Дождь из сердечек сверху
    function createHeartRain(count) {
        for (let i = 0; i < count && heartCount < maxHearts; i++) {
            setTimeout(() => {
                const x = 50 + Math.random() * (window.innerWidth - 100);
                createHeart(x, -30, 'fall');
            }, i * 90);
        }
    }

    // 5. Обработчики кнопок
    heartsBtn.addEventListener('click', () => {
        createRandomHearts(25, 'float');

        // Небольшая анимация кнопки
        heartsBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            heartsBtn.style.transform = 'scale(1)';
        }, 150);
    });

    moreHeartsBtn.addEventListener('click', () => {
        createRandomHearts(40, 'float');
        setTimeout(() => createHeartRain(15), 400);

        // Небольшая анимация кнопки
        moreHeartsBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            moreHeartsBtn.style.transform = 'scale(1)';
        }, 150);
    });

    // 6. Создание сердечек при клике в любом месте
    document.addEventListener('click', function(e) {
        // Игнорируем клики по кнопкам
        if (e.target.closest('.btn')) {
            return;
        }

        if (heartCount < maxHearts - 2) {
            const x = e.clientX;
            const y = e.clientY;

            // Создаем 2-4 сердечка при клике
            const count = 2 + Math.floor(Math.random() * 3);
            for (let i = 0; i < count; i++) {
                setTimeout(() => {
                    createHeart(x, y, 'explode');
                }, i * 70);
            }
        }
    });

    // 7. Автоматическое создание сердечек в фоне (редко)
    setInterval(() => {
        if (heartCount < maxHearts - 5 && Math.random() > 0.7) {
            createRandomHearts(1, 'float');
        }
    }, 3000);

    // 8. Сердечки при наведении на кнопки
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (heartCount < maxHearts - 1) {
                const rect = this.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;

                // Создаем сердечко при наведении
                createHeart(x, y, 'float');
            }
        });
    });

    // 9. Обработка изменения размера окна
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Автоматически удаляем сердечки далеко за пределами экрана
            const hearts = document.querySelectorAll('.heart');
            hearts.forEach(heart => {
                const rect = heart.getBoundingClientRect();
                if (rect.bottom < -100 || rect.top > window.innerHeight + 100 ||
                    rect.right < -100 || rect.left > window.innerWidth + 100) {
                    heart.remove();
                    heartCount--;
                }
            });
        }, 500);
    });

    // 10. Начальные сердечки для красоты
    setTimeout(() => {
        createRandomHearts(3, 'float');
    }, 800);

    // 11. Автоматическая очистка старых сердечек (если вдруг накопится много)
    setInterval(() => {
        if (heartCount > maxHearts * 0.8) {
            const hearts = document.querySelectorAll('.heart');
            // Удаляем самые старые сердечки (первые в списке)
            const toRemove = Math.min(10, hearts.length);
            for (let i = 0; i < toRemove; i++) {
                if (hearts[i]) {
                    hearts[i].remove();
                    heartCount--;
                }
            }
        }
    }, 10000);
});