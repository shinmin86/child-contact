(() => {
  const locationButton = document.getElementById("share-location");
  const toast = document.getElementById("toast");
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle.querySelector(".theme-toggle-icon");
  const themeText = themeToggle.querySelector(".theme-toggle-text");
  const themeColorMeta = document.getElementById("theme-color-meta");
  let toastTimer;

  const TEXT = {
    darkMode: { ko: "다크 모드", en: "Dark mode" },
    lightMode: { ko: "라이트 모드", en: "Light mode" },
    switchToDark: { ko: "다크 모드로 전환", en: "Switch to dark mode" },
    switchToLight: { ko: "라이트 모드로 전환", en: "Switch to light mode" },

    noGeolocation: {
      ko: "이 브라우저에서는 위치 기능을 지원하지 않습니다.",
      en: "This browser does not support location services.",
      zhHant: "此瀏覽器不支援定位功能。",
      zhHans: "此浏览器不支持定位功能。"
    },
    checkingLocationTitle: {
      ko: "현재 위치를 확인 중입니다",
      en: "Checking current location",
      zhHant: "正在確認目前位置",
      zhHans: "正在确认当前位置"
    },
    checkingLocationHelp: {
      ko: "잠시만 기다려 주세요",
      en: "Please wait a moment",
      zhHant: "請稍候",
      zhHans: "请稍候"
    },
    shareOpened: {
      ko: "공유 화면을 열었습니다.",
      en: "The sharing screen has opened.",
      zhHant: "已開啟分享畫面。",
      zhHans: "已打开分享页面。"
    },
    locationCopied: {
      ko: "현재 위치 링크가 복사되었습니다.",
      en: "The current location link has been copied.",
      zhHant: "目前位置連結已複製。",
      zhHans: "当前位置链接已复制。"
    },
    locationShareFailed: {
      ko: "위치 공유를 완료하지 못했습니다.",
      en: "The location could not be shared.",
      zhHant: "無法完成位置分享。",
      zhHans: "无法完成位置分享。"
    },
    permissionDenied: {
      ko: "위치 권한이 허용되지 않았습니다.",
      en: "Location permission was not granted.",
      zhHant: "未允許定位權限。",
      zhHans: "未授予位置权限。"
    },
    positionUnavailable: {
      ko: "현재 위치를 확인할 수 없습니다.",
      en: "The current location is unavailable.",
      zhHant: "無法確認目前位置。",
      zhHans: "无法确认当前位置。"
    },
    positionTimeout: {
      ko: "위치 확인 시간이 초과되었습니다.",
      en: "Location request timed out.",
      zhHant: "定位請求逾時。",
      zhHans: "位置请求超时。"
    },
    unknownLocationError: {
      ko: "현재 위치를 확인하지 못했습니다.",
      en: "The current location could not be determined.",
      zhHant: "無法取得目前位置。",
      zhHans: "无法获取当前位置。"
    }
  };

  function multilingualLines(item) {
    return [item.ko, item.en, item.zhHant, item.zhHans].filter(Boolean).join("\n");
  }

  function koEnInline(item) {
    return [item.ko, item.en].join(" · ");
  }

  function multilingualHtml(item) {
    return [
      `<span lang="ko">${item.ko}</span>`,
      `<span lang="en">${item.en}</span>`,
      `<span lang="zh-Hant">${item.zhHant}</span>`,
      `<span lang="zh-Hans">${item.zhHans}</span>`
    ].join("");
  }

  function getCurrentTheme() {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  }

  function applyTheme(theme, persist = true) {
    const isDark = theme === "dark";
    const visibleText = isDark ? TEXT.lightMode : TEXT.darkMode;
    const ariaText = isDark ? TEXT.switchToLight : TEXT.switchToDark;

    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", koEnInline(ariaText));
    themeToggle.setAttribute("title", [ariaText.ko, ariaText.en].join("\n"));
    themeIcon.textContent = isDark ? "☀️" : "🌙";
    themeText.textContent = koEnInline(visibleText);
    themeColorMeta.setAttribute("content", isDark ? "#08111f" : "#f5f8ff");

    if (persist) {
      localStorage.setItem("child-contact-theme", isDark ? "dark" : "light");
    }
  }

  function showToast(item) {
    window.clearTimeout(toastTimer);
    toast.textContent = typeof item === "string" ? item : multilingualLines(item);
    toast.classList.add("show");
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 4200);
  }

  applyTheme(getCurrentTheme(), false);

  themeToggle.addEventListener("click", () => {
    applyTheme(getCurrentTheme() === "dark" ? "light" : "dark");
  });

  locationButton.addEventListener("click", () => {
    if (!("geolocation" in navigator)) {
      showToast(TEXT.noGeolocation);
      return;
    }

    const strongElement = locationButton.querySelector("strong");
    const smallElement = locationButton.querySelector("small");
    const originalStrongHtml = strongElement.innerHTML;
    const originalSmallHtml = smallElement.innerHTML;

    locationButton.disabled = true;
    strongElement.innerHTML = multilingualHtml(TEXT.checkingLocationTitle);
    smallElement.innerHTML = multilingualHtml(TEXT.checkingLocationHelp);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const mapUrl = `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`;
        const shareText = [
          `미아 발견 관련 연락입니다. 송가빈(SONG GABEEN / 宋嘉彬)의 현재 위치: ${mapUrl}`,
          `Child safety contact. Current location of SONG GABEEN (송가빈 / 宋嘉彬): ${mapUrl}`,
          `走失兒童安全聯絡。宋嘉彬（송가빈 / SONG GABEEN）的目前位置：${mapUrl}`,
          `走失儿童安全联系。宋嘉彬（송가빈 / SONG GABEEN）的当前位置：${mapUrl}`
        ].join("\n");

        try {
          if (navigator.share) {
            await navigator.share({
              title: "송가빈 현재 위치 · SONG GABEEN current location · 宋嘉彬目前位置 · 宋嘉彬当前位置",
              text: shareText
            });
            showToast(TEXT.shareOpened);
          } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(shareText);
            showToast(TEXT.locationCopied);
          } else {
            window.location.href = `sms:?body=${encodeURIComponent(shareText)}`;
          }
        } catch (error) {
          if (error.name !== "AbortError") showToast(TEXT.locationShareFailed);
        } finally {
          restoreLocationButton();
        }
      },
      (error) => {
        const messages = {
          1: TEXT.permissionDenied,
          2: TEXT.positionUnavailable,
          3: TEXT.positionTimeout
        };
        showToast(messages[error.code] || TEXT.unknownLocationError);
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
      strongElement.innerHTML = originalStrongHtml;
      smallElement.innerHTML = originalSmallHtml;
    }
  });

  if ("serviceWorker" in navigator && location.protocol === "https:") {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js?v=8").catch(() => {});
    });
  }
})();
