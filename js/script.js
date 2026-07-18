/**
 * 그린테이블 프리미엄 반응형 홈페이지 스크립트
 * 구현 내용: 스마트 스티키 GNB, 히어로 슬라이더, 메뉴 필터, 에코 카운터/게이지, 스크롤 리빌, 문의 폼 제어
 * 최종 수정일: 2026-07-18
 */

// 페이지 로드 후 스켈레톤 화면 제어
document.addEventListener("DOMContentLoaded", () => {
  // 1초 후 스켈레톤 로딩 오버레이 서서히 제거
  setTimeout(() => {
    const overlay = document.getElementById("page-skeleton-overlay");
    if (overlay) {
      overlay.classList.add("fade-out");
      document.body.classList.remove("loading");
      document.body.classList.add("loaded");
    }
  }, 1000);

  // 초기 스크립트 로드 호출
  initSmartHeader();
  initMobileMenu();
  initHeroSlider();
  initMenuFilter();
  initScrollReveal();
});

// 이미지 개별 로드 완료 시 스켈레톤 해제 함수
function removeSkeleton(imgElement) {
  const card = imgElement.closest('.menu-card');
  if (card) {
    card.classList.remove('skeleton-loading');
    card.classList.add('loaded');
  }
}

/**
 * 1. 스마트 스티키 헤더 (Smart Sticky GNB)
 * 스크롤 내릴 때 헤더 숨김, 올릴 때 노출
 */
function initSmartHeader() {
  const header = document.getElementById("header");
  let lastScrollTop = 0;
  const delta = 10; // 헤더 동작 반응 스크롤 임계치

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // 헤더 백그라운드 색상 음영 변경 (미세 스크롤 시)
    if (scrollTop > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // 스크롤 상/하 방향 감지
    if (Math.abs(lastScrollTop - scrollTop) <= delta) return;

    if (scrollTop > lastScrollTop && scrollTop > 150) {
      // 스크롤 다운 -> 헤더 숨김
      header.classList.add("hide");
    } else {
      // 스크롤 업 -> 헤더 노출
      header.classList.remove("hide");
    }

    lastScrollTop = scrollTop;
  });
}

/**
 * 2. 모바일 햄버거 토글 메뉴
 */
function initMobileMenu() {
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const mobileOverlay = document.querySelector(".mobile-nav-overlay");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  function toggleMenu() {
    hamburgerBtn.classList.toggle("active");
    mobileOverlay.classList.toggle("active");
    
    // 메뉴 열릴 때 바디 스크롤 차단
    if (mobileOverlay.classList.contains("active")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }

  hamburgerBtn.addEventListener("click", toggleMenu);

  // 링크 클릭 시 메뉴 닫기 및 스크롤 이동
  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      hamburgerBtn.classList.remove("active");
      mobileOverlay.classList.remove("active");
      document.body.style.overflow = "";
    });
  });
}

/**
 * 3. 메인 비주얼 슬라이더 (Hero Rolling Banner)
 * images/hero-banner1.png, images/hero-banner2.png 롤링
 */
function initHeroSlider() {
  const slides = document.querySelectorAll(".hero-slide");
  const indicators = document.querySelectorAll(".indicator");
  let currentSlide = 0;
  let sliderInterval;
  const slideDuration = 4000; // 4초 변경

  function goToSlide(n) {
    // 활성화된 클래스 제거
    slides[currentSlide].classList.remove("active");
    indicators[currentSlide].classList.remove("active");

    // 인덱스 갱신
    currentSlide = (n + slides.length) % slides.length;

    // 활성화 클래스 부여
    slides[currentSlide].classList.add("active");
    indicators[currentSlide].classList.add("active");
  }

  function startAutoplay() {
    sliderInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, slideDuration);
  }

  function resetAutoplay() {
    clearInterval(sliderInterval);
    startAutoplay();
  }

  // 인디케이터 클릭 이벤트
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      goToSlide(index);
      resetAutoplay();
    });
  });

  // 슬라이더 자동 회전 시작
  startAutoplay();
}

/**
 * 4. 메뉴 카테고리 필터링
 * 전체 / 정기구독 / 단품 / 샐러드
 */
function initMenuFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const menuCards = document.querySelectorAll(".menu-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      // 활성화된 버튼 표시 변경
      filterBtns.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");

      const filterValue = e.target.getAttribute("data-filter");

      menuCards.forEach(card => {
        // 일단 모든 카드 페이드 아웃 모션
        card.style.opacity = "0";
        card.style.transform = "scale(0.95)";
        card.style.pointerEvents = "none";
        
        setTimeout(() => {
          const cardCategory = card.getAttribute("data-category");
          
          if (filterValue === "all" || cardCategory === filterValue) {
            card.style.display = "flex";
            // 디스플레이 블록 후 다음 프레임에 부드럽게 복구
            requestAnimationFrame(() => {
              card.style.opacity = "1";
              card.style.transform = "scale(1)";
              card.style.pointerEvents = "auto";
            });
          } else {
            card.style.display = "none";
          }
        }, 300);
      });
    });
  });
}

/**
 * 5. 스크롤 애니메이션 및 에코 인포그래픽 수치 증가 효과
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".scroll-reveal");
  const carbonGauge = document.getElementById("carbon-gauge");
  const carbonCounter = document.getElementById("carbon-counter");
  let animatedEco = false; // 에코 애니메이션 중복 실행 방지 플래그

  const observerOptions = {
    root: null,
    threshold: 0.15, // 15% 정도 화면에 보이면 작동
    rootMargin: "0px"
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 스크롤 페이드인-업 활성화
        entry.target.classList.add("active");

        // 만약 에코 섹션이고 애니메이션 전이라면 게이지 & 카운터 가동
        if (entry.target.id === "eco" && !animatedEco) {
          triggerEcoAnimation();
          animatedEco = true;
        }

        // 관찰 완료 후 해제 (1회용 모션)
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    observer.observe(el);
  });

  // 에코 섹션 게이지 바 및 누적 탄소 절감량 숫자 카운팅
  function triggerEcoAnimation() {
    // 1. 게이지 채우기
    carbonGauge.style.width = "85%";

    // 2. 숫자 카운트업
    const targetValue = parseInt(carbonCounter.getAttribute("data-target"), 10);
    const duration = 2000; // 2초
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing out quadratic
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * targetValue);
      
      // 천 단위 콤마 추가하여 출력
      carbonCounter.textContent = currentValue.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        carbonCounter.textContent = targetValue.toLocaleString();
      }
    }

    requestAnimationFrame(updateCounter);
  }
}

/**
 * 6. 주문 문의 폼 유효성 검사 및 전송 얼럿 메시지
 */
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault(); // 기본 전송 방지

    // 입력 필드 추출
    const nameInput = document.getElementById("userName");
    const emailInput = document.getElementById("userEmail");
    const phoneInput = document.getElementById("userPhone");
    const typeSelect = document.getElementById("contactType");
    const contentText = document.getElementById("messageContent");
    const consentCheck = document.getElementById("personalConsent");

    // 간단한 정규식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/; // 010-1234-5678 형태

    // 1. 필수 값 입력 확인
    if (!nameInput.value.trim()) {
      alert("이름 또는 기업명을 입력해주세요. 🌿");
      nameInput.focus();
      return;
    }

    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      alert("올바른 이메일 주소를 입력해주세요. 📧\n예: hello@greentable.com");
      emailInput.focus();
      return;
    }

    // 연락처 형식 유연화 (하이픈 제거하고 입력했어도 자동 수정해주거나 경고)
    let phoneVal = phoneInput.value.trim();
    if (!phoneVal) {
      alert("연락처를 입력해주세요. 📞");
      phoneInput.focus();
      return;
    }

    if (!phoneRegex.test(phoneVal)) {
      // 숫자만 있는 경우 하이픈 포맷팅 시도
      const cleanPhone = phoneVal.replace(/[^0-9]/g, '');
      if (cleanPhone.length === 10 || cleanPhone.length === 11) {
        // 정상적인 연락처 길이이므로 포맷 정정
        phoneVal = cleanPhone.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
        phoneInput.value = phoneVal;
      } else {
        alert("올바른 연락처 형식을 확인해 주세요. 📞\n예: 010-1234-5678");
        phoneInput.focus();
        return;
      }
    }

    if (!typeSelect.value) {
      alert("문의 종류를 선택해 주세요. 🥦");
      typeSelect.focus();
      return;
    }

    if (!contentText.value.trim()) {
      alert("문의하실 상세 내용을 입력해 주세요. 📝");
      contentText.focus();
      return;
    }

    if (!consentCheck.checked) {
      alert("개인정보 수집 및 이용 동의는 필수입니다. 🔍");
      consentCheck.focus();
      return;
    }

    // 전송 성공 시나리오 (사용자 안내 알림창)
    const successMessage = `
    [그린테이블 문의가 접수되었습니다]

    • 예약자/기업명: ${nameInput.value.trim()}
    • 연락처: ${phoneVal}
    • 문의 유형: ${typeSelect.options[typeSelect.selectedIndex].text}

    🌿 초록빛 건강한 만남이 곧 시작됩니다! 
    담당 영양사와 상담원이 작성해주신 내용을 꼼꼼히 검토한 후, 
    기재해주신 메일(${emailInput.value.trim()})과 연락처로 15분 내외에 연락해 드리겠습니다.
    `;

    alert(successMessage);

    // 폼 초기화 및 새로고침 효과 방지
    contactForm.reset();
  });
}
