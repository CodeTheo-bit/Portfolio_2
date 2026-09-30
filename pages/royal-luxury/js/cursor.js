/* Custom cursor removed per user request - standard cursor restored */
(function() {
  ['cd', 'cr', 'cch', 'ccv'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
  document.body.style.cursor = 'default';
})();
