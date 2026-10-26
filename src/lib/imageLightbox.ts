/** One delegated viewer for static articles and React previews, including private pages. */
document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const image = event.target.closest<HTMLImageElement>(".prose-content img");
  const link = event.target.closest<HTMLAnchorElement>(".prose-content a");
  if (
    !image &&
    !(link && /\.(png|jpe?g|webp|gif|svg)(?:[?#]|$)/i.test(link.href))
  )
    return;
  if (image && link && !/\.(png|jpe?g|webp|gif|svg)(?:[?#]|$)/i.test(link.href))
    return;
  const source = link?.href ?? image?.currentSrc ?? image?.src;
  if (!source) return;
  const url = new URL(source, location.href);
  if (!["http:", "https:", "data:"].includes(url.protocol)) return;
  event.preventDefault();
  const previous = link ?? image ?? document.activeElement;
  const dialog = document.createElement("dialog");
  dialog.className = "image-lightbox";
  dialog.setAttribute("aria-label", image?.alt || "画像の拡大表示");
  const header = document.createElement("header");
  const zoom = document.createElement("button");
  zoom.type = "button";
  zoom.textContent = "原寸表示";
  zoom.onclick = () => {
    const original = dialog.dataset.original !== "true";
    dialog.dataset.original = String(original);
    zoom.textContent = original ? "画面に合わせる" : "原寸表示";
  };
  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "閉じる";
  const finish = () => {
    if (dialog.open) dialog.close();
    dialog.remove();
    if (previous instanceof HTMLElement)
      previous.focus({ preventScroll: true });
  };
  close.onclick = finish;
  header.appendChild(zoom);
  header.appendChild(close);
  const figure = document.createElement("figure"),
    enlarged = document.createElement("img");
  enlarged.src = url.href;
  enlarged.alt = image?.alt ?? "拡大画像";
  enlarged.onerror = () => {
    const message = document.createElement("p");
    message.textContent =
      "画像を読み込めませんでした。閉じてもう一度お試しください。";
    figure.replaceChildren(message);
  };
  figure.appendChild(enlarged);
  dialog.appendChild(header);
  dialog.appendChild(figure);
  document.body.appendChild(dialog);
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog || e.target === figure) finish();
  });
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    finish();
  });
  dialog.addEventListener("close", finish, { once: true });
  dialog.showModal();
  close.focus();
});

function prepareImages() {
  for (const image of document.querySelectorAll<HTMLImageElement>(
    ".prose-content img",
  )) {
    if (image.closest("a")) continue;
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `${image.alt || "画像"}を拡大`);
  }
}
prepareImages();
new MutationObserver(prepareImages).observe(document.body, {
  childList: true,
  subtree: true,
});
document.addEventListener("keydown", (event) => {
  if (
    (event.key === "Enter" || event.key === " ") &&
    event.target instanceof HTMLImageElement &&
    event.target.matches(".prose-content img[role=button]")
  ) {
    event.preventDefault();
    event.target.click();
  }
});
