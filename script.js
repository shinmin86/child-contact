(() => {
  const modal = document.getElementById("wechat-modal");
  const openWechatButton = document.getElementById("open-wechat");
  const copyWechatButton = document.getElementById("copy-wechat-id");
  const locationButton = document.getElementById("share-location");
  const toast = document.getElementById("toast");
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle.querySelector(".theme-toggle-icon");
  const themeText = themeToggle.querySelector(".theme-toggle-text");
  const themeColorMeta = document.getElementById("theme-color-meta");
  let toastTimer;

  function getCurrentTheme() {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  }

  function applyTheme(theme, persist = true) {
    const isDark = theme === "dark";
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "라이트 모드로 전환" : "다크 모드로 전환");
    themeIcon.textContent = isDark ? "☀️" : "🌙";
    themeText.textContent = isDark ? "라이트 모드" : "다크 모드";
    themeColorMeta.setAttribute("content", isDark ? "#08111f" : "#f5f8ff");

    if (persist) {
      localStorage.setItem("child-contact-theme", isDark ? "dark" : "light");
    }
  }

  applyTheme(getCurrentTheme(), false);

  themeToggle.addEventListener("click", () => {
    const nextTheme = getCurrentTheme() === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  });

  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("show");
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2400);
  }

  function openModal() {
    modal.hidden = false;
    document.body.classList.add("modal-open");
    const closeButton = modal.querySelector(".modal-close");
    window.setTimeout(() => closeButton.focus(), 0);
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    openWechatButton.focus();
  }

  openWechatButton.addEventListener("click", openModal);

  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-modal]")) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });

  copyWechatButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("shinmin");
      showToast("WeChat ID가 복사되었습니다. / 已複製 / 已复制");
    } catch {
      showToast("WeChat ID: shinmin");
    }
  });

  locationButton.addEventListener("click", () => {
    if (!("geolocation" in navigator)) {
      showToast("이 브라우저에서는 위치 기능을 지원하지 않습니다.");
      return;
    }

    const originalStrong = locationButton.querySelector("strong").textContent;
    const originalSmall = locationButton.querySelector("small").textContent;
    locationButton.disabled = true;
    locationButton.querySelector("strong").textContent = "현재 위치를 확인 중입니다";
    locationButton.querySelector("small").textContent = "잠시만 기다려 주세요";

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const mapUrl = `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`;
        const text = `미아 보호 연락입니다. 송아이의 현재 위치: ${mapUrl}`;

        try {
          if (navigator.share) {
            await navigator.share({
              title: "송아이 현재 위치",
              text
            });
            showToast("공유 화면을 열었습니다.");
          } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(text);
            showToast("현재 위치 링크가 복사되었습니다.");
          } else {
            window.location.href = `sms:?body=${encodeURIComponent(text)}`;
          }
        } catch (error) {
          if (error.name !== "AbortError") showToast("위치 공유를 완료하지 못했습니다.");
        } finally {
          restoreLocationButton();
        }
      },
      (error) => {
        const messages = {
          1: "위치 권한이 허용되지 않았습니다.",
          2: "현재 위치를 확인할 수 없습니다.",
          3: "위치 확인 시간이 초과되었습니다."
        };
        showToast(messages[error.code] || "현재 위치를 확인하지 못했습니다.");
        restoreLocationButton();
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 30000
      }
    );

    function restoreLocationButton() {
      locationButton.disabled = false;
      locationButton.querySelector("strong").textContent = originalStrong;
      locationButton.querySelector("small").textContent = originalSmall;
    }
  });

  if ("serviceWorker" in navigator && location.protocol === "https:") {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js?v=3").catch(() => {});
    });
  }
})();
