document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('toTopBtn');
  const header = document.querySelector('.mainmenu');
  const sentinel = document.getElementById('menu-sentinel');

  if (!btn) {
    console.error('Кнопка toTopBtn не найдена');
    return;
  }
  if (!header) {
    console.error('Панель .mainmenu не найдена');
    // мы всё равно можем работать по высоте 0, но лучше вернуть
    return;
  }

  // Функция показа/скрытия
  const showBtn = () => btn.classList.add('show');
  const hideBtn = () => btn.classList.remove('show');

  // 1) Надёжная простая проверка по высоте панели
  const checkByHeight = () => {
    const panelHeight = header.offsetHeight || 0;
    // если прокрутка больше высоты панели => панель ушла за верх
    if (window.scrollY > panelHeight) showBtn(); else hideBtn();
  };

  // Выполним один раз (на случай, если страница открыта не вверху)
  checkByHeight();

  // 2) IntersectionObserver на sentinel — показываем кнопку, когда sentinel НЕ виден
  // (то есть содержимое прокрутилось выше sentinel)
  let observer;
  if ('IntersectionObserver' in window && sentinel) {
    observer = new IntersectionObserver((entries) => {
      // если sentinel перекрыт (не виден), то entries[0].isIntersecting === false
      const e = entries[0];
      if (!e.isIntersecting) {
        showBtn();
      } else {
        // Но если пользователь в самом верху — прячем
        // Также объединяем с высотой панели для надёжности
        checkByHeight();
      }
    }, {
      root: null,      // viewport
      threshold: 0
    });
    observer.observe(sentinel);
  } else {
    // если нет IntersectionObserver — повесим простой слушатель прокрутки
    window.addEventListener('scroll', checkByHeight, { passive: true });
  }

  // Также добавим слушатель на scroll, чтобы покрыть кейсы (fixed header, браузерные особенности)
  window.addEventListener('scroll', checkByHeight, { passive: true });

  // Клик по кнопке — плавно наверх
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Отладочная печать (можно удалить)
  // console.log('Инициализирован toTopBtn logic. panel height:', header.offsetHeight);
});