/* =========================================================
   ほぐし整体 ゆるり — main.js（フレームワークなし）
   ========================================================= */
(() => {
  "use strict";

  const header = document.getElementById("header");
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("globalNav");
  const hero = document.querySelector(".hero");
  const fixedCta = document.getElementById("fixedCta");

  /* ---------- ヘッダー：スクロールで下線をつける ---------- */
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- スマホメニュー（右からのドロワー） ---------- */
  // オーバーレイは header 内に置く（header の重なり順の中で、ドロワーの下に敷くため）
  const overlay = document.createElement("div");
  overlay.className = "nav-overlay";
  header.appendChild(overlay);

  const setMenu = (open) => {
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    nav.classList.toggle("is-open", open);
    overlay.classList.toggle("is-show", open);
    document.body.classList.toggle("is-locked", open);
  };
  menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
  overlay.addEventListener("click", () => setMenu(false));
  nav.querySelectorAll("a, button").forEach((el) => el.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setMenu(false);
      menuBtn.focus();
    }
  });
  window.matchMedia("(min-width: 1024px)").addEventListener("change", (e) => {
    if (e.matches) setMenu(false);
  });

  /* ---------- スクロールでふわっと表示 ---------- */
  const fadeTargets = document.querySelectorAll(".fade-in");
  if ("IntersectionObserver" in window) {
    fadeTargets.forEach((el) => {
      const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("fade-in"));
      const i = siblings.indexOf(el);
      if (i > 0) el.style.transitionDelay = `${Math.min(i, 3) * 0.1}s`;
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );
    fadeTargets.forEach((el) => io.observe(el));
  } else {
    fadeTargets.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- お悩みチェックリスト ---------- */
  const checks = document.querySelectorAll(".checklist input");
  const countEl = document.getElementById("checkCount");
  const defaultCountText = countEl.textContent;
  checks.forEach((c) =>
    c.addEventListener("change", () => {
      const n = [...checks].filter((x) => x.checked).length;
      if (n === 0) {
        countEl.textContent = defaultCountText;
      } else {
        countEl.innerHTML = "";
        countEl.append("あてはまったのは ");
        const em = document.createElement("em");
        em.textContent = String(n);
        countEl.append(em, " 個。");
      }
    })
  );

  /* ---------- FAQ アコーディオン ---------- */
  document.querySelectorAll(".faq-item__q button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(open));
      btn.closest(".faq-item").classList.toggle("is-open", open);
    });
  });

  /* ---------- LINE予約（デモ用ダイアログ） ----------
     実際の店舗では、ボタンを公式LINEの友だち追加URL（https://lin.ee/...）へのリンクにする */
  const dialog = document.getElementById("lineDialog");
  const closeBtn = document.getElementById("lineDialogClose");
  document.querySelectorAll(".js-line").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (typeof dialog.showModal === "function") dialog.showModal();
      else window.alert("LINE予約（デモ）：実際の店舗では公式LINEの友だち追加画面に移動します。");
    });
  });
  closeBtn.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close(); // 背景クリックで閉じる
  });

  /* ---------- スマホ下部の固定予約ボタン ----------
     ファーストビューを過ぎたら表示し、予約セクション・フッターが見えている間は隠す */
  if ("IntersectionObserver" in window && fixedCta) {
    let heroVisible = true;
    const ctaAreas = new Set();
    const update = () => {
      const show = !heroVisible && ctaAreas.size === 0;
      fixedCta.classList.toggle("is-show", show);
      fixedCta.setAttribute("aria-hidden", String(!show));
      fixedCta.querySelectorAll("a, button").forEach((el) => (el.tabIndex = show ? 0 : -1));
    };
    new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      update();
    }, { threshold: 0.1 }).observe(hero);

    const areaObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? ctaAreas.add(entry.target) : ctaAreas.delete(entry.target)));
      update();
    });
    document.querySelectorAll("#reserve, .footer").forEach((el) => areaObserver.observe(el));
  }
})();
