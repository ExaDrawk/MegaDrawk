(() => {
  const runway = document.querySelector("[data-runway]");
  const track = runway?.querySelector("[data-runway-track]");
  const progress = runway?.querySelector("[data-runway-progress]");
  const captionName = runway?.querySelector("[data-runway-name]");
  const captionDescription = runway?.querySelector("[data-runway-description]");
  const thumbs = Array.from(
    runway?.querySelectorAll("[data-runway-thumb]") ?? [],
  );
  const desktop = window.matchMedia(
    "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
  );

  if (!runway || !track) return;

  let max = 0;
  let ticking = false;

  const setActive = (index) => {
    thumbs.forEach((thumb, thumbIndex) => {
      const active = thumbIndex === index;
      thumb.classList.toggle("is-active", active);
      thumb.setAttribute("aria-current", active ? "true" : "false");
    });
    const activeThumb = thumbs[index];
    if (activeThumb) {
      if (captionName) {
        captionName.textContent = activeThumb.dataset.name ?? "";
        captionName.setAttribute("href", activeThumb.dataset.href ?? "#");
      }
      if (captionDescription) {
        captionDescription.textContent = activeThumb.dataset.description ?? "";
      }
    }
  };

  const measure = () => {
    max = Math.max(0, track.scrollWidth - track.clientWidth);
  };

  const update = () => {
    if (desktop.matches) {
      const rect = runway.getBoundingClientRect();
      const total = Math.max(1, runway.offsetHeight - window.innerHeight);
      const progressValue = Math.min(1, Math.max(0, -rect.top / total));
      track.style.transform = `translate3d(${-max * progressValue}px, 0, 0)`;
      if (progress) {
        progress.style.transform = `scaleX(${progressValue})`;
      }
      setActive(Math.round(progressValue * Math.max(0, thumbs.length - 1)));
    } else {
      const scrollable = track.scrollWidth - track.clientWidth;
      const progressValue = scrollable > 0 ? track.scrollLeft / scrollable : 0;
      if (progress) {
        progress.style.transform = `scaleX(${progressValue})`;
      }
      setActive(Math.round(progressValue * Math.max(0, thumbs.length - 1)));
    }
    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  const goTo = (index) => {
    if (desktop.matches) {
      const total = Math.max(1, runway.offsetHeight - window.innerHeight);
      const target =
        runway.offsetTop + total * (index / Math.max(1, thumbs.length - 1));
      window.scrollTo({ top: target, behavior: "smooth" });
    } else {
      const slide = track.children[index];
      if (slide instanceof HTMLElement) {
        slide.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  };

  const enable = () => {
    const enhanced = desktop.matches;
    runway.classList.toggle("is-enhanced", enhanced);
    if (enhanced) {
      measure();
    } else {
      track.style.transform = "";
    }
    update();
  };

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => goTo(index));
  });

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener(
    "resize",
    () => {
      measure();
      requestUpdate();
    },
    { passive: true },
  );
  track.addEventListener("scroll", requestUpdate, { passive: true });
  desktop.addEventListener("change", enable);
  enable();
})();
