(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const API_BASE = window.location.origin;

  /* -------------------- auth state -------------------- */
  let authToken = localStorage.getItem('vc_token');
  let authUser = null;

  if (authToken) {
    try {
      const payload = JSON.parse(atob(authToken.split('.')[1]));
      authUser = payload;
    } catch { authToken = null; }
  }

  function isLoggedIn() { return !!authToken; }

  function requireAuth() {
    if (!isLoggedIn()) show('loginScreen', { push: false });
  }

  function logout() {
    authToken = null;
    authUser = null;
    localStorage.removeItem('vc_token');
    show('loginScreen', { push: false });
  }

  /* -------------------- inline translations -------------------- */
  const translations = {
    id: {
      greeting: "Halo",
      dashboard_prompt: "Siap untuk kelas hari ini?",
      preview_tag_cam_active: "Kamera aktif",
      preview_tag_cam_off: "Kamera dimatikan",
      mic: "Mikrofon",
      cam: "Kamera",
      audio: "Audio",
      join_meeting: "Berhasil bergabung meeting",
      mic_off: "mic mati",
      cam_off: "kamera mati",
      audio_off: "audio mati",
      join_error: "Terjadi kesalahan saat bergabung",
      search_placeholder: "Cari kelas...",
      all: "Semua",
      live: "Live",
      upcoming: "Akan datang",
      idle: "Selesai",
      live_class: "Meeting aktif sekarang • Bergabung segera",
      no_meeting: "Tidak ada meeting saat ini",
      meeting_at: "Meeting pukul",
      participants: "peserta",
      view_detail: "Lihat detail",
      join_now: "Bergabung",
      other_options: "Opsi lainnya",
      preparing_meeting: "Persiapan Meeting",
      check_mic_cam: "Periksa mic dan kamera",
      device_microphone: "Mikrofon",
      device_camera: "Kamera",
      back_to_detail: "Kembali ke detail",
      back_to_dashboard: "Kembali ke dashboard",
      eyebrow_detail: "Rincian Kelas",
      title_detail: "Detail Meeting",
      instructor: "Dosen",
      participants_count: "Peserta",
      duration: "Durasi",
      room: "Ruang",
      joined: "Sudah bergabung",
      no_classes: "Tidak ada kelas yang cocok."
    },
    en: {
      greeting: "Hello",
      dashboard_prompt: "Ready for today's classes?",
      preview_tag_cam_active: "Camera active",
      preview_tag_cam_off: "Camera off",
      mic: "Microphone",
      cam: "Camera",
      audio: "Audio",
      join_meeting: "Successfully joined meeting",
      mic_off: "mic off",
      cam_off: "camera off",
      audio_off: "audio off",
      join_error: "Error joining meeting",
      search_placeholder: "Search classes...",
      all: "All",
      live: "Live",
      upcoming: "Upcoming",
      idle: "Completed",
      live_class: "Active meeting now • Join now",
      no_meeting: "No meeting currently",
      meeting_at: "Meeting at",
      participants: "participants",
      view_detail: "View details",
      join_now: "Join now",
      other_options: "Other options",
      preparing_meeting: "Meeting Preparation",
      check_mic_cam: "Check mic and camera",
      device_microphone: "Microphone",
      device_camera: "Camera",
      back_to_detail: "Back to detail",
      back_to_dashboard: "Back to dashboard",
      eyebrow_detail: "Class Details",
      title_detail: "Meeting Detail",
      participants_count: "Participants",
      duration: "Duration",
      room: "Room",
      instructor: "Dosen",
      joined: "Already joined",
      no_classes: "No matching classes found."
    },
    es: {
      greeting: "Hola",
      dashboard_prompt: "¿Listo para la clase hoy?",
      preview_tag_cam_active: "Cámara activa",
      preview_tag_cam_off: "Cámara desactivada",
      mic: "Micrófono",
      cam: "Cámara",
      audio: "Audio",
      join_meeting: "Únete exitosamente a la reunión",
      mic_off: "micrófono apagado",
      cam_off: "cámara apagada",
      audio_off: "audio apagado",
      join_error: "Error al unirse a la reunión",
      search_placeholder: "Buscar clases...",
      all: "Todo",
      live: "En vivo",
      upcoming: "Próximamente",
      idle: "Finalizado",
      live_class: "Reunión activa ahora • Únete inmediatamente",
      no_meeting: "No hay reunión actualmente",
      meeting_at: "Reunión a las",
      participants: "participantes",
      view_detail: "Ver detalles",
      join_now: "Unirse ahora",
      other_options: "Otras opciones",
      preparing_meeting: "Preparación de Reunión",
      check_mic_cam: "Verificar micrófono y cámara",
      device_microphone: "Micrófono",
      device_camera: "Cámara",
      back_to_detail: "Volver al detalle",
      back_to_dashboard: "Volver al panel",
      eyebrow_detail: "Detalles de la Clase",
      title_detail: "Detalles de la Reunión",
      instructor: "Instructor",
      participants_count: "Participantes",
      duration: "Duración",
      room: "Sala",
      joined: "Ya te has unido",
      no_classes: "No se encontraron clases coincidentes."
    }
  };

  const $langSelect = $('#langSelect');

  function getLang() {
    return $langSelect?.value || 'id';
  }

  function t(key) {
    const lang = getLang();
    return translations[lang]?.[key] || translations['id']?.[key] || key;
  }

  function updateI18n() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      el.textContent = t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      el.placeholder = t(key);
    });
  }

  if ($langSelect) {
    $langSelect.addEventListener('change', () => updateI18n());
  }

  /* -------------------- dynamic date -------------------- */
  const dateDisplay = $('#dateDisplay');

  function updateDate() {
    if (!dateDisplay) return;
    const lang = getLang();
    const now = new Date();
    const opts = { weekday: 'long', day: 'numeric', month: 'long' };
    dateDisplay.textContent = now.toLocaleDateString(lang === 'id' ? 'id-ID' : lang === 'es' ? 'es-ES' : 'en-US', opts);
  }
  updateDate();

  $langSelect?.addEventListener('change', updateDate);

  /* -------------------- API helpers -------------------- */
  async function api(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    if (res.status === 401) {
      logout();
      throw new Error('Sesi berakhir, silakan masuk kembali');
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  }

  /* -------------------- auth actions -------------------- */
  async function handleLogin(email, password) {
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    authToken = data.token;
    authUser = data.user;
    localStorage.setItem('vc_token', data.token);
    await loadDashboard();
    show('dashboard');
  }

  async function handleRegister(name, email, password) {
    await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    toast('Akun berhasil dibuat, silakan masuk');
    show('loginScreen');
  }

  async function loadDashboard() {
    try {
      const data = await api('/api/courses');
      renderCourses(data.courses);
    } catch { /* use fallback static data */ }
  }

  function renderCourses(courses) {
    const list = $('#classList');
    if (!list) return;
    list.innerHTML = '';
    courses.forEach(c => {
      const icon = c.icon || '📚';
      const sub = c.schedule || '';
      let metaHtml = '';
      let badgeHtml = '';
      let btnHtml = '';

      if (c.status === 'live') {
        metaHtml = `<p class="meta" data-i18n="live_class">Meeting aktif sekarang • Bergabung segera</p>`;
        badgeHtml = `<span class="badge badge-live"><span class="pulse"></span> <span data-i18n="live">Live</span></span>`;
        btnHtml = `<button class="btn primary" data-action="goto" data-target="detail" data-i18n="join_now">Bergabung</button>`;
      } else if (c.status === 'idle') {
        metaHtml = `<p class="meta" data-i18n="no_meeting">Tidak ada meeting saat ini</p>`;
        badgeHtml = `<span class="badge badge-idle"><span data-i18n="idle">Idle</span></span>`;
        btnHtml = `<button class="btn ghost" data-action="goto" data-target="detail" data-i18n="view_detail">Lihat detail</button>`;
      } else {
        metaHtml = `<p class="meta">${sub} • ${c.participants} <span data-i18n="participants">peserta</span></p>`;
        badgeHtml = `<span class="badge badge-soon">${sub.replace('Meeting pukul ', '')}</span>`;
        btnHtml = `<button class="btn ghost" data-action="goto" data-target="detail" data-i18n="view_detail">Lihat detail</button>`;
      }

      const card = document.createElement('article');
      card.className = 'card class-card';
      card.dataset.status = c.status;
      card.dataset.title = c.title;
      card.dataset.icon = icon;
      card.dataset.instructor = c.instructor;
      card.dataset.participants = c.participants;
      card.dataset.duration = c.duration;
      card.dataset.room = c.room;
      card.dataset.sub = sub;
      card.innerHTML = `
        <div class="card-shine"></div>
        <div class="class-row">
          <div class="class-icon${c.status === 'live' ? ' live' : ''}" aria-hidden="true"><span>${icon}</span></div>
          <div class="class-info"><h3>${c.title}</h3>${metaHtml}</div>
          ${badgeHtml}
        </div>
        ${btnHtml}
      `;
      list.appendChild(card);
    });
    applyFilter();
    updateI18n();
  }

  /* -------------------- screen navigation -------------------- */
  const screens = $$(".screen");
  const initialScreen = isLoggedIn() ? 'dashboard' : 'loginScreen';
  const history = [initialScreen];

  const PROTECTED = new Set(['dashboard', 'detail', 'prejoin']);

  function show(id, { push = true } = {}) {
    const target = document.getElementById(id);
    if (!target || target.classList.contains("active")) return;

    if (PROTECTED.has(id) && !isLoggedIn()) {
      show('loginScreen', { push: false });
      return;
    }

    screens.forEach((s) => s.classList.remove("active"));
    target.classList.add("active");
    target.scrollTop = 0;

    if (push && history[history.length - 1] !== id) {
      history.push(id);
    }
  }

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-action='goto']");
    if (!trigger) return;
    const target = trigger.dataset.target;

    if (target === 'detail') {
      const card = trigger.closest('.class-card');
      if (card) populateDetail(card);
    }

    if (target) show(target);
  });

  $('#loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = $('#loginEmail').value.trim();
    const password = $('#loginPassword').value;
    const errEl = $('#loginForm .auth-error');
    try {
      if (errEl) errEl.classList.remove('show');
      await handleLogin(email, password);
    } catch (err) {
      if (errEl) { errEl.textContent = err.message; errEl.classList.add('show'); }
    }
  });

  $('#registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = $('#regName').value.trim();
    const email = $('#regEmail').value.trim();
    const password = $('#regPassword').value;
    const errEl = $('#registerForm .auth-error');
    try {
      if (errEl) errEl.classList.remove('show');
      if (password.length < 6) throw new Error('Password minimal 6 karakter');
      await handleRegister(name, email, password);
    } catch (err) {
      if (errEl) { errEl.textContent = err.message; errEl.classList.add('show'); }
    }
  });

  function populateDetail(card) {
    const title = card.dataset.title || 'Kelas';
    const icon = card.dataset.icon || '📚';
    const status = card.dataset.status || 'idle';
    const instructor = card.dataset.instructor || '-';
    const participants = card.dataset.participants || '0';
    const duration = card.dataset.duration || '-';
    const room = card.dataset.room || '-';
    const sub = card.dataset.sub || '';

    const detailTitle = $('#detailTitle');
    const detailIcon = $('#detailIcon');
    const detailSub = $('#detailSub');
    const detailInstructor = $('#detailInstructor');
    const detailParticipants = $('#detailParticipants');
    const detailDuration = $('#detailDuration');
    const detailRoom = $('#detailRoom');
    const detailBadge = $('#detailBadge');
    const detailHero = $('#detailHero');
    const detailJoinBtn = $('#detailJoinBtn');

    if (detailTitle) detailTitle.textContent = title;
    if (detailIcon) {
      detailIcon.querySelector('span').textContent = icon;
      detailIcon.className = 'class-icon big';
      if (status === 'live') detailIcon.classList.add('live');
    }
    if (detailSub) detailSub.textContent = sub;
    if (detailInstructor) detailInstructor.textContent = instructor;
    if (detailParticipants) detailParticipants.textContent = participants + ' orang';
    if (detailDuration) detailDuration.textContent = duration;
    if (detailRoom) detailRoom.textContent = room;

    if (detailBadge) {
      const pulse = detailBadge.querySelector('.pulse');
      const textSpan = detailBadge.querySelector('[data-i18n]');
      detailBadge.className = 'badge';
      if (status === 'live') {
        detailBadge.classList.add('badge-live');
        if (pulse) pulse.style.display = '';
        if (textSpan) textSpan.textContent = t('live');
      } else if (status === 'upcoming') {
        detailBadge.classList.add('badge-soon');
        if (pulse) pulse.style.display = 'none';
        if (textSpan) textSpan.textContent = t('upcoming');
      } else {
        detailBadge.classList.add('badge-idle');
        if (pulse) pulse.style.display = 'none';
        if (textSpan) textSpan.textContent = t('idle');
      }
    }

    if (detailHero) {
      detailHero.classList.remove('live-mode', 'upcoming-mode', 'idle-mode');
      detailHero.classList.add(status + '-mode');
    }

    if (detailJoinBtn) {
      detailJoinBtn.style.display = status === 'live' ? '' : 'none';
    }
  }

  /* -------------------- live clock -------------------- */
  const clock = $("#clock");

  function tickClock() {
    if (!clock) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    clock.textContent = `${hh}:${mm}`;
  }
  tickClock();
  setInterval(tickClock, 30_000);

  /* -------------------- search + filter chips -------------------- */
  const search = $("#search");
  const classList = $("#classList");
  const emptyState = $("#emptyState");
  const chips = $$(".chip");
  let activeFilter = "all";

  function applyFilter() {
    if (!classList) return;
    const query = (search?.value || "").trim().toLowerCase();
    const cards = $$(".class-card", classList);
    let visible = 0;

    cards.forEach((card) => {
      const title = (card.dataset.title || "").toLowerCase();
      const status = card.dataset.status || "";
      const matchesQuery = !query || title.includes(query);
      const matchesFilter = activeFilter === "all" || status === activeFilter;
      const ok = matchesQuery && matchesFilter;
      card.style.display = ok ? "" : "none";
      if (ok) visible++;
    });

    if (emptyState) emptyState.hidden = visible !== 0;
  }

  search?.addEventListener("input", applyFilter);

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => {
        c.classList.remove("active");
        c.setAttribute("aria-selected", "false");
      });
      chip.classList.add("active");
      chip.setAttribute("aria-selected", "true");
      activeFilter = chip.dataset.filter || "all";
      applyFilter();
    });
  });

  /* -------------------- media device management -------------------- */
  const preview = $("#preview");
  const previewTag = $("#previewTag");
  const previewAvatar = $("#previewAvatar");
  const videoPreview = $("#videoPreview");
  const toggles = $$("[data-toggle]");
  const state = { mic: true, cam: true, audio: true };
  const streams = { mic: null, cam: null };
  const deviceLabels = { mic: "Memuat...", cam: "Memuat..." };

  function updateDeviceLabels() {
    const micRow = document.querySelector('.device-row:first-child .device-value');
    const camRow = document.querySelector('.device-row:last-child .device-value');
    if (micRow) micRow.textContent = deviceLabels.mic;
    if (camRow) camRow.textContent = deviceLabels.cam;
  }

  async function startMic() {
    try {
      if (streams.mic) return;
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      streams.mic = s;
      const track = s.getAudioTracks()[0];
      if (track) deviceLabels.mic = track.label || "Mikrofon terdeteksi";
      updateDeviceLabels();
      document.querySelector('.device-dot.mic')?.classList.add('active');
    } catch (err) {
      console.warn('Mic access denied:', err);
      deviceLabels.mic = "Tidak ada akses";
      updateDeviceLabels();
      state.mic = false;
      const btn = document.querySelector('[data-toggle="mic"]');
      if (btn) {
        btn.classList.remove("on");
        btn.setAttribute("aria-pressed", "false");
      }
    }
  }

  function stopMic() {
    if (streams.mic) {
      streams.mic.getTracks().forEach(t => t.stop());
      streams.mic = null;
    }
    document.querySelector('.device-dot.mic')?.classList.remove('active');
  }

  async function startCam() {
    try {
      if (streams.cam) return;
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      streams.cam = s;
      videoPreview.srcObject = s;
      videoPreview.classList.add('active');
      previewAvatar?.classList.add('hidden');
      const track = s.getVideoTracks()[0];
      if (track) deviceLabels.cam = track.label || "Kamera terdeteksi";
      updateDeviceLabels();
      document.querySelector('.device-dot.cam')?.classList.add('active');
      syncPreview();
    } catch (err) {
      console.warn('Camera access denied:', err);
      deviceLabels.cam = "Tidak ada akses";
      updateDeviceLabels();
      state.cam = false;
      const btn = document.querySelector('[data-toggle="cam"]');
      if (btn) {
        btn.classList.remove("on");
        btn.setAttribute("aria-pressed", "false");
      }
      syncPreview();
    }
  }

  function stopCam() {
    if (streams.cam) {
      streams.cam.getTracks().forEach(t => t.stop());
      streams.cam = null;
    }
    videoPreview.classList.remove('active');
    videoPreview.srcObject = null;
    previewAvatar?.classList.remove('hidden');
    document.querySelector('.device-dot.cam')?.classList.remove('active');
    syncPreview();
  }

  function syncPreview() {
    if (!preview) return;
    preview.classList.toggle("cam-off", !state.cam);
    if (previewTag) {
      previewTag.textContent = state.cam
        ? t("preview_tag_cam_active")
        : t("preview_tag_cam_off");
    }
  }

  // Start both devices on init (toggles are ON by default)
  startMic();
  startCam();

  toggles.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const key = btn.dataset.toggle;
      if (!(key in state)) return;
      state[key] = !state[key];
      btn.classList.toggle("on", state[key]);
      btn.setAttribute("aria-pressed", state[key]);

      if (key === 'mic') {
        if (state.mic) await startMic();
        else stopMic();
      } else if (key === 'cam') {
        if (state.cam) await startCam();
        else stopCam();
      } else if (key === 'audio') {
        syncPreview();
      }

      const labels = { mic: "mic", cam: "cam", audio: "audio" };
      toast(`${t(labels[key])} ${state[key] ? "aktif" : "nonaktif"}`);
    });
  });

  // Auto-start devices when prejoin screen becomes active (if toggles are ON)
  const prejoinEl = document.getElementById('prejoin');
  const prejoinObserver = new MutationObserver(() => {
    if (prejoinEl?.classList.contains('active')) {
      if (!streams.mic && state.mic) startMic();
      if (!streams.cam && state.cam) startCam();
    }
  });
  if (prejoinEl) prejoinObserver.observe(prejoinEl, { attributes: true, attributeFilter: ['class'] });

  /* -------------------- toast -------------------- */
  const toastEl = $("#toast");
  let toastTimer = null;

  function toast(msg) {
    if (!toastEl) return;
    const toastMsg = toastEl.querySelector('.toast-msg');
    if (toastMsg) toastMsg.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1800);
  }

  /* -------------------- join action -------------------- */
  $("#joinBtn")?.addEventListener("click", (e) => {
    try {
      const parts = [];

      if (!state.mic) parts.push(t("mic_off"));
      if (!state.cam) parts.push(t("cam_off"));
      if (!state.audio) parts.push(t("audio_off"));
      const detail = parts.length ? ` (${parts.join(", ")})` : "";
      toast(`${t("join_meeting")}${detail}`);
      e.target.disabled = true;
      setTimeout(() => {
        e.target.disabled = false;
      }, 2000);
    } catch (err) {
      console.error("Join error:", err);
      toast(t("join_error"));
    }
  });

  /* -------------------- subtle 3D tilt on phone -------------------- */
  const phone = $("#phone");
  if (phone && window.matchMedia("(hover: hover)").matches) {
    const max = 4;
    phone.addEventListener("mousemove", (e) => {
      try {
        const rect = phone.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        phone.style.transform = `rotateY(${x * max}deg) rotateX(${-y * max}deg)`;
      } catch (err) {
        console.error("Tilt error:", err);
      }
    });
    phone.addEventListener("mouseleave", () => {
      phone.style.transform = "";
    });
    phone.style.transition = "transform 0.3s ease";
  }

  /* -------------------- avatar / logout -------------------- */
  $('#avatarBtn')?.addEventListener('click', () => {
    if (confirm('Keluar dari akun?')) logout();
  });

  function updateUserDisplay() {
    if (authUser && authUser.name) {
      const nameEl = $('#userName');
      if (nameEl) nameEl.textContent = authUser.name;
      const letter = $('#avatarLetter');
      if (letter) letter.textContent = authUser.name.charAt(0).toUpperCase();
    }
  }

  /* -------------------- initial paint -------------------- */
  if (isLoggedIn()) {
    updateUserDisplay();
    loadDashboard();
  }
  updateI18n();
  applyFilter();
  window.translations = translations;
})();
