(() => {
  const dialog = document.querySelector('#project-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const content = dialog.querySelector('.project-dialog-content');
  const closeButton = dialog.querySelector('.project-dialog-close');
  let activeTrigger = null;
  let scrollPosition = 0;

  function openProject(card, trigger, detail) {
    const fragment = document.createDocumentFragment();
    const heading = card.querySelector('.project-heading').cloneNode(true);
    const title = document.createElement('h2');
    title.className = 'project-title';
    title.id = 'project-dialog-title';
    title.textContent = heading.querySelector('.project-title').textContent;
    heading.querySelector('.project-title').replaceWith(title);
    fragment.append(heading);

    for (const selector of ['.project-meta', '.project-tech-stack', '.project-description']) {
      const element = card.querySelector(selector);
      if (element) fragment.append(element.cloneNode(true));
    }
    fragment.append(detail.content.cloneNode(true));
    content.replaceChildren(fragment);
    activeTrigger = trigger;
    scrollPosition = window.scrollY;
    document.body.style.top = `-${scrollPosition}px`;
    document.body.classList.add('project-dialog-open');
    dialog.showModal();
    dialog.scrollTop = 0;
    closeButton.focus({ preventScroll: true });
  }

  for (const card of document.querySelectorAll('.project-card[data-detail]')) {
    const detail = document.getElementById(card.dataset.detail);
    if (!(detail instanceof HTMLTemplateElement)) continue;
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'project-open';
    trigger.textContent = '상세 보기';
    trigger.setAttribute('aria-label', `${card.querySelector('.project-title').textContent} 상세 보기`);
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', 'project-dialog');
    trigger.addEventListener('click', () => openProject(card, trigger, detail));
    card.append(trigger);
    card.dataset.interactive = 'true';
  }

  closeButton.addEventListener('click', () => dialog.close());

  // Only close when both the press and release occur on the backdrop.
  function isBackdrop(event) {
    const bounds = dialog.getBoundingClientRect();
    return event.target === dialog && (
      event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom
    );
  }
  let pressedBackdrop = false;
  dialog.addEventListener('pointerdown', event => { pressedBackdrop = isBackdrop(event); });
  dialog.addEventListener('click', event => {
    if (pressedBackdrop && isBackdrop(event)) dialog.close();
    pressedBackdrop = false;
  });

  dialog.addEventListener('close', () => {
    document.body.classList.remove('project-dialog-open');
    document.body.style.removeProperty('top');
    window.scrollTo({ top: scrollPosition, behavior: 'instant' });
    activeTrigger?.focus({ preventScroll: true });
    content.replaceChildren();
  });
})();
