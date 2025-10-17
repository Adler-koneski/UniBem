(async function() {
  async function inject(selector, file) {
    const res = await fetch(file);
    document.querySelector(selector).innerHTML = await res.text();
  }
  await inject('#__header', './partials/header.html');
  await inject('#__footer', './partials/footer.html');
})();
