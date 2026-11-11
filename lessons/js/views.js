/* Class view / Full notes (pilot, 2026-11-10; only the 4.8 preview page uses this so far).
 * Ryan: the lessons run too long and repeat too much to go through with a whole class, but the extra material is worth
 * keeping for a student reading the notes alone. So every card or block marked data-extra is hidden in Class view and
 * shown in Full notes. Nothing is removed from the page.
 *   <section class="card" data-extra …>   a whole card that is only in Full notes
 *   <div data-extra>…</div>               a block inside a card
 *   <div data-view-switch></div>          where the Class / Full notes switch goes (the title card)
 * A hidden card gives up its data-section so the ••• "Jump to" list only shows what is on the page. The choice is
 * remembered on the device. views({ initial: 'class' | 'full' }) */
const KEY = 'm15:lessonView';
export function views({ initial = 'class' } = {}) {
  let view = initial;
  try { view = localStorage.getItem(KEY) || initial; } catch (e) {}
  const extras = [...document.querySelectorAll('[data-extra]')];
  extras.forEach((el) => { if (el.dataset.section) el.dataset.sectionFull = el.dataset.section; });
  const hosts = [...document.querySelectorAll('[data-view-switch]')];
  hosts.forEach((host) => {
    host.innerHTML = '<button type="button" data-v="class"><b>Class</b><span>the lesson we do together</span></button><button type="button" data-v="full"><b>Full notes</b><span>every explanation and extra example</span></button>';
    host.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => set(b.dataset.v, true)));
  });
  function set(v, user) {
    view = v === 'full' ? 'full' : 'class';
    document.body.classList.toggle('view-class', view === 'class');
    document.body.classList.toggle('view-full', view === 'full');
    extras.forEach((el) => {
      if (!el.dataset.sectionFull) return;
      if (view === 'class') el.removeAttribute('data-section'); else el.dataset.section = el.dataset.sectionFull;
    });
    hosts.forEach((host) => host.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.v === view ? 'true' : 'false')));
    if (user) { try { localStorage.setItem(KEY, view); } catch (e) {} }
    dispatchEvent(new Event('resize'));
  }
  set(view, false);
  return { set, get: () => view };
}
