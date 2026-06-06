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
      no_classes: "Tidak ada kelas yang cocok.",
      logout: "Keluar",
      forgot_password: "Lupa password?",
      forgot_password_title: "Reset Password",
      forgot_password_subtitle: "Masukkan email untuk mereset password",
      forgot_password_btn: "Kirim Link Reset",
      forgot_password_success: "Jika email terdaftar, link reset telah dikirim",
      reset_password_title: "Buat Password Baru",
      reset_password_subtitle: "Masukkan token dan password baru",
      reset_token_label: "Token Reset",
      reset_password_btn: "Reset Password",
      reset_password_success: "Password berhasil direset",
      new_password: "Password Baru",
      confirm_password: "Konfirmasi Password",
      password_mismatch: "Password tidak cocok",
      create_meeting_title: "Buat Meeting Baru",
      create_meeting_placeholder: "Judul meeting...",
      create_meeting_cancel: "Batal",
      create_meeting_confirm: "Buat",
      class_scheduled: "Terjadwal",
      class_completed: "Kelas telah selesai",
      class_schedule_info: "Kelas akan dimulai",
      no_live_class_info_upcoming: "Kelas ini belum dimulai. Jadwal: ",
      no_live_class_info_idle: "Kelas ini sudah selesai. Tidak ada meeting aktif.",
      loading_courses: "Memuat kelas...",
      loading_meetings: "Memuat meeting...",
      notifications: "Notifikasi",
      no_notifications: "Tidak ada notifikasi.",
      all_role: "Semua Role",
      lecturer: "Dosen",
      student: "Mahasiswa",
      attendance: "Absensi",
      timesheet: "Timesheet",
      not_checked_in: "Belum check-in",
      checked_in: "Sedang check-in",
      check_in: "Check In",
      check_out: "Check Out",
      today_hours: "Jam Hari Ini",
      week_hours: "Jam Minggu Ini",
      month_hours: "Jam Bulan Ini",
      recent_activity: "Aktivitas Terbaru",
      export_report: "Export Laporan",
      no_attendance_history: "Belum ada riwayat absensi.",
      check_in_success: "Check-in berhasil pada",
      check_out_success: "Check-out berhasil. Total:",
      notif_just_now: "Baru saja",
      notif_m_ago: "m lalu",
      notif_h_ago: "j lalu",
      notif_d_ago: "h lalu",
      notif_priority_urgent: "Urgent",
      notif_priority_important: "Penting",
      notif_priority_normal: "Normal",
      notif_role_all: "Semua",
      notif_role_lecturer: "Dosen",
      notif_role_student: "Mahasiswa"
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
      no_classes: "No matching classes found.",
      logout: "Log out",
      forgot_password: "Forgot password?",
      forgot_password_title: "Reset Password",
      forgot_password_subtitle: "Enter your email to reset password",
      forgot_password_btn: "Send Reset Link",
      forgot_password_success: "If email is registered, a reset link has been sent",
      reset_password_title: "Create New Password",
      reset_password_subtitle: "Enter token and new password",
      reset_token_label: "Reset Token",
      reset_password_btn: "Reset Password",
      reset_password_success: "Password reset successfully",
      new_password: "New Password",
      confirm_password: "Confirm Password",
      password_mismatch: "Passwords do not match",
      create_meeting_title: "Create New Meeting",
      create_meeting_placeholder: "Meeting title...",
      create_meeting_cancel: "Cancel",
      create_meeting_confirm: "Create",
      class_scheduled: "Scheduled",
      class_completed: "Class completed",
      class_schedule_info: "Class will start",
      no_live_class_info_upcoming: "This class hasn't started yet. Schedule: ",
      no_live_class_info_idle: "This class has ended. No active meeting.",
      loading_courses: "Loading courses...",
      loading_meetings: "Loading meetings...",
      notifications: "Notifications",
      no_notifications: "No notifications.",
      all_role: "All Roles",
      lecturer: "Lecturer",
      student: "Student",
      attendance: "Attendance",
      timesheet: "Timesheet",
      not_checked_in: "Not checked in",
      checked_in: "Checked in",
      check_in: "Check In",
      check_out: "Check Out",
      today_hours: "Today Hours",
      week_hours: "Week Hours",
      month_hours: "Month Hours",
      recent_activity: "Recent Activity",
      export_report: "Export Report",
      no_attendance_history: "No attendance history.",
      check_in_success: "Check-in successful at",
      check_out_success: "Check-out successful. Total:",
      notif_just_now: "Just now",
      notif_m_ago: "m ago",
      notif_h_ago: "h ago",
      notif_d_ago: "d ago",
      notif_priority_urgent: "Urgent",
      notif_priority_important: "Important",
      notif_priority_normal: "Normal",
      notif_role_all: "All",
      notif_role_lecturer: "Lecturer",
      notif_role_student: "Student"
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
      no_classes: "No se encontraron clases coincidentes.",
      logout: "Cerrar sesión",
      forgot_password: "¿Olvidaste tu contraseña?",
      forgot_password_title: "Restablecer Contraseña",
      forgot_password_subtitle: "Ingresa tu email para restablecer la contraseña",
      forgot_password_btn: "Enviar Enlace",
      forgot_password_success: "Si el email está registrado, se ha enviado un enlace",
      reset_password_title: "Crear Nueva Contraseña",
      reset_password_subtitle: "Ingresa el token y la nueva contraseña",
      reset_token_label: "Token de Restablecimiento",
      reset_password_btn: "Restablecer Contraseña",
      reset_password_success: "Contraseña restablecida exitosamente",
      new_password: "Nueva Contraseña",
      confirm_password: "Confirmar Contraseña",
      password_mismatch: "Las contraseñas no coinciden",
      create_meeting_title: "Crear Nueva Reunión",
      create_meeting_placeholder: "Título de la reunión...",
      create_meeting_cancel: "Cancelar",
      create_meeting_confirm: "Crear",
      class_scheduled: "Programado",
      class_completed: "Clase finalizada",
      class_schedule_info: "La clase comenzará",
      no_live_class_info_upcoming: "Esta clase aún no ha comenzado. Horario: ",
      no_live_class_info_idle: "Esta clase ha finalizado. No hay reunión activa.",
      loading_courses: "Cargando cursos...",
      loading_meetings: "Cargando reuniones...",
      notifications: "Notificaciones",
      no_notifications: "Sin notificaciones.",
      all_role: "Todos los Roles",
      lecturer: "Profesor",
      student: "Estudiante",
      attendance: "Asistencia",
      timesheet: "Hoja de Tiempo",
      not_checked_in: "Sin registrar",
      checked_in: "Registrado",
      check_in: "Registrar Entrada",
      check_out: "Registrar Salida",
      today_hours: "Horas Hoy",
      week_hours: "Horas Semana",
      month_hours: "Horas Mes",
      recent_activity: "Actividad Reciente",
      export_report: "Exportar Informe",
      no_attendance_history: "Sin historial de asistencia.",
      check_in_success: "Registro de entrada exitoso a las",
      check_out_success: "Registro de salida exitoso. Total:",
      notif_just_now: "Ahora mismo",
      notif_m_ago: "m atrás",
      notif_h_ago: "h atrás",
      notif_d_ago: "d atrás",
      notif_priority_urgent: "Urgente",
      notif_priority_important: "Importante",
      notif_priority_normal: "Normal",
      notif_role_all: "Todos",
      notif_role_lecturer: "Profesor",
      notif_role_student: "Estudiante"
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

  /* -------------------- skeleton loading -------------------- */
  function showSkeleton(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'block';
  }
  function hideSkeleton(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }

  /* -------------------- custom modal -------------------- */
  const modalOverlay = document.getElementById('modalOverlay');
  const customModal = document.getElementById('customModal');
  const modalInput = document.getElementById('modalInput');
  const modalTitle = document.getElementById('modalTitle');
  const modalCancelBtn = document.getElementById('modalCancelBtn');
  const modalConfirmBtn = document.getElementById('modalConfirmBtn');

  let modalResolve = null;

  function showModal({ title, placeholder, confirmText, cancelText }) {
    return new Promise((resolve) => {
      modalResolve = resolve;
      if (modalTitle) modalTitle.textContent = title || '';
      if (modalInput) {
        modalInput.value = '';
        modalInput.placeholder = placeholder || '';
        setTimeout(() => modalInput.focus(), 100);
      }
      if (modalConfirmBtn) modalConfirmBtn.textContent = confirmText || 'OK';
      if (modalCancelBtn) modalCancelBtn.textContent = cancelText || 'Batal';
      if (modalOverlay) modalOverlay.classList.add('show');
      if (customModal) customModal.classList.add('show');
    });
  }

  function hideModal(value) {
    if (modalOverlay) modalOverlay.classList.remove('show');
    if (customModal) customModal.classList.remove('show');
    if (modalResolve) {
      modalResolve(value);
      modalResolve = null;
    }
  }

  modalConfirmBtn?.addEventListener('click', () => {
    hideModal(modalInput?.value || '');
  });
  modalCancelBtn?.addEventListener('click', () => {
    hideModal(null);
  });
  modalOverlay?.addEventListener('click', () => {
    hideModal(null);
  });
  modalInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') hideModal(modalInput.value);
    if (e.key === 'Escape') hideModal(null);
  });

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
    updateUserDisplay();
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
    showSkeleton('skeletonList');
    try {
      const data = await api('/api/courses');
      hideSkeleton('skeletonList');
      renderCourses(data.courses);
    } catch {
      hideSkeleton('skeletonList');
      /* use fallback static data */
    }
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

  /* -------------------- forgot / reset password -------------------- */
  document.querySelector('[data-action="forgot-password"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    show('forgotPassword');
  });

  $('#forgotPasswordForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = $('#forgotEmail').value.trim();
    const errEl = $('#forgotPasswordForm .auth-error');
    try {
      if (errEl) errEl.classList.remove('show');
      await api('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      toast(t('forgot_password_success'));
      show('resetPassword');
      // For demo: auto-fill email and show a toast with token info
      const resetEmailInput = $('#resetEmail');
      if (resetEmailInput) resetEmailInput.value = email;
    } catch (err) {
      if (errEl) { errEl.textContent = err.message; errEl.classList.add('show'); }
    }
  });

  $('#resetPasswordForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = $('#resetEmail').value.trim();
    const token = $('#resetToken').value.trim();
    const password = $('#resetNewPassword').value;
    const confirm = $('#resetConfirmPassword').value;
    const errEl = $('#resetPasswordForm .auth-error');
    try {
      if (errEl) errEl.classList.remove('show');
      if (password !== confirm) throw new Error(t('password_mismatch'));
      if (password.length < 6) throw new Error('Password minimal 6 karakter');
      await api('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, token, password })
      });
      toast(t('reset_password_success'));
      show('loginScreen');
    } catch (err) {
      if (errEl) { errEl.textContent = err.message; errEl.classList.add('show'); }
    }
  });

  /* -------------------- screen navigation -------------------- */
  const screens = $$(".screen");
  const initialScreen = isLoggedIn() ? 'dashboard' : 'loginScreen';
  const history = [initialScreen];

  const PROTECTED = new Set(['dashboard', 'detail', 'prejoin', 'meetingLobby', 'meetingRoom', 'absensi']);

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
      const infoEl = document.getElementById('nonLiveInfo');
      detailJoinBtn.removeAttribute('data-i18n');
      if (status === 'live') {
        detailJoinBtn.style.display = '';
        detailJoinBtn.textContent = t('join_now');
        detailJoinBtn.className = 'btn primary';
        if (infoEl) infoEl.style.display = 'none';
      } else if (status === 'upcoming') {
        detailJoinBtn.style.display = '';
        detailJoinBtn.textContent = t('class_scheduled');
        detailJoinBtn.className = 'btn ghost';
        if (infoEl) {
          infoEl.style.display = 'block';
          infoEl.innerHTML = `<span class="nonlive-info-icon">📅</span> ${t('no_live_class_info_upcoming')}${sub}`;
        }
      } else {
        detailJoinBtn.style.display = '';
        detailJoinBtn.textContent = t('class_completed');
        detailJoinBtn.className = 'btn ghost';
        if (infoEl) {
          infoEl.style.display = 'block';
          infoEl.innerHTML = `<span class="nonlive-info-icon">✅</span> ${t('no_live_class_info_idle')}`;
        }
      }
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
  const prejoinLoader = document.getElementById('prejoinLoader');
  let prejoinMediaStarted = false;

  async function startPrejoinMedia() {
    if (prejoinMediaStarted) return;
    prejoinMediaStarted = true;
    if (prejoinLoader) prejoinLoader.hidden = false;
    if (state.mic) await startMic();
    if (state.cam) await startCam();
    if (prejoinLoader) prejoinLoader.hidden = true;
  }

  const prejoinObserver = new MutationObserver(() => {
    if (prejoinEl?.classList.contains('active')) {
      prejoinMediaStarted = false;
      startPrejoinMedia();
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

  /* -------------------- Smart Notification -------------------- */
  const notifFab = document.getElementById('notifFab');
  const notifDropdown = document.getElementById('notifDropdown');
  const notifList = document.getElementById('notifList');
  const notifRoleFilter = document.getElementById('notifRoleFilter');
  const notifLangFilter = document.getElementById('notifLangFilter');
  const notifSearchInput = document.getElementById('notifSearchInput');
  const notifCloseBtn = document.getElementById('notifCloseBtn');
  const notifCount = document.getElementById('notifCount');

  const mockNotifications = [
    { id: 1, icon: '📢', title: 'Pengumuman UAS', desc: 'Jadwal UAS Semester Genap 2025/2026 telah dirilis.', priority: 'urgent', role: 'all', time: new Date(Date.now() - 1000 * 60 * 15), read: false },
    { id: 2, icon: '📝', title: 'Tugas Akhir', desc: 'Batas submit proposal tugas akhir diperpanjang hingga 20 Juni.', priority: 'urgent', role: 'mahasiswa', time: new Date(Date.now() - 1000 * 60 * 60 * 2), read: false },
    { id: 3, icon: '📅', title: 'Rapat Dosen', desc: 'Rapat koordinasi dosen setiap hari Jumat pukul 13:00.', priority: 'important', role: 'dosen', time: new Date(Date.now() - 1000 * 60 * 60 * 5), read: false },
    { id: 4, icon: '✅', title: 'Nilai Diupload', desc: 'Nilai mata kuliah IMK sudah bisa dilihat di portal.', priority: 'important', role: 'mahasiswa', time: new Date(Date.now() - 1000 * 60 * 60 * 24), read: false },
    { id: 5, icon: '📚', title: 'Perubahan Ruang', desc: 'Kelas Praktikum IMK pindah ke Lab A-203 mulai pekan depan.', priority: 'normal', role: 'all', time: new Date(Date.now() - 1000 * 60 * 60 * 48), read: false },
    { id: 6, icon: '🎓', title: 'Wisuda Periode II', desc: 'Pendaftaran wisuda dibuka hingga 30 Juni 2026.', priority: 'important', role: 'mahasiswa', time: new Date(Date.now() - 1000 * 60 * 60 * 72), read: true },
    { id: 7, icon: '🔔', title: 'Pengisian RPS', desc: 'Dosen diharapkan mengisi RPS sebelum perkuliahan dimulai.', priority: 'urgent', role: 'dosen', time: new Date(Date.now() - 1000 * 60 * 30), read: false },
    { id: 8, icon: '📋', title: 'Survey Kepuasan', desc: 'Mohon mengisi survey kepuasan pembelajaran semester ini.', priority: 'normal', role: 'all', time: new Date(Date.now() - 1000 * 60 * 60 * 12), read: false },
  ];

  function getNotifPriorityLabel(p) {
    const key = { urgent: 'notif_priority_urgent', important: 'notif_priority_important', normal: 'notif_priority_normal' }[p];
    return key ? t(key) : p;
  }

  function timeAgo(date) {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t('notif_just_now');
    if (mins < 60) return mins + t('notif_m_ago');
    const hours = Math.floor(mins / 60);
    if (hours < 24) return hours + t('notif_h_ago');
    const days = Math.floor(hours / 24);
    return days + t('notif_d_ago');
  }

  function renderNotifications() {
    if (!notifList) return;
    const role = notifRoleFilter?.value || 'all';
    const query = (notifSearchInput?.value || '').trim().toLowerCase();
    let filtered = mockNotifications.filter(n => n.role === 'all' || n.role === role);
    if (query) {
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(query) ||
        n.desc.toLowerCase().includes(query)
      );
    }
    filtered.sort((a, b) => {
      const order = { urgent: 0, important: 1, normal: 2 };
      if (order[a.priority] !== order[b.priority]) return order[a.priority] - order[b.priority];
      return b.time - a.time;
    });

    notifList.innerHTML = '';
    if (notifCount) {
      const unread = filtered.filter(n => !n.read).length;
      notifCount.textContent = filtered.length > 0 ? `${unread}/${filtered.length}` : '';
    }
    if (filtered.length === 0) {
      notifList.innerHTML = '<p class="notif-empty">Tidak ada notifikasi.</p>';
      return;
    }

    filtered.forEach(n => {
      const item = document.createElement('div');
      item.className = `notif-item ${n.priority}${n.read ? ' read' : ''}`;
      item.innerHTML = `
        <div class="notif-item-icon">${n.icon}</div>
        <div class="notif-item-body">
          <div class="notif-item-title">
            ${n.title}
            <span class="notif-item-priority ${n.priority}">${getNotifPriorityLabel(n.priority)}</span>
          </div>
          <p class="notif-item-desc">${n.desc}</p>
          <div class="notif-item-time">
            ${timeAgo(n.time)}
            <span class="notif-item-role">${n.role === 'all' ? t('notif_role_all') : n.role === 'dosen' ? t('notif_role_lecturer') : t('notif_role_student')}</span>
          </div>
        </div>
      `;
      item.addEventListener('click', () => {
        n.read = true;
        renderNotifications();
        updateNotifBadge();
      });
      notifList.appendChild(item);
    });
  }

  function updateNotifBadge() {
    const unread = mockNotifications.filter(n => !n.read).length;
    const existing = notifFab?.querySelector('.notif-badge');
    if (unread > 0) {
      if (existing) {
        existing.textContent = unread > 9 ? '9+' : unread;
      } else if (notifFab) {
        const badge = document.createElement('span');
        badge.className = 'notif-badge';
        badge.textContent = unread > 9 ? '9+' : unread;
        notifFab.appendChild(badge);
        notifFab.classList.add('notif-fab');
      }
    } else {
      if (existing) existing.remove();
      notifFab?.classList.remove('notif-fab');
    }
  }

  function openNotifPanel() {
    notifDropdown?.classList.add('open');
    if (notifLangFilter) notifLangFilter.value = getLang();
    renderNotifications();
    if (notifSearchInput) {
      notifSearchInput.value = '';
      notifSearchInput.focus();
    }
  }

  function closeNotifPanel() {
    notifDropdown?.classList.remove('open');
  }

  notifFab?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (notifDropdown?.classList.contains('open')) {
      closeNotifPanel();
    } else {
      openNotifPanel();
    }
  });

  notifCloseBtn?.addEventListener('click', closeNotifPanel);

  notifRoleFilter?.addEventListener('change', renderNotifications);

  notifLangFilter?.addEventListener('change', () => {
    const lang = notifLangFilter.value;
    const globalSelect = document.getElementById('langSelect');
    if (globalSelect) {
      globalSelect.value = lang;
      globalSelect.dispatchEvent(new Event('change'));
    }
  });

  notifSearchInput?.addEventListener('input', renderNotifications);

  document.addEventListener('click', (e) => {
    if (notifDropdown?.classList.contains('open') && !notifDropdown.contains(e.target) && e.target !== notifFab) {
      closeNotifPanel();
    }
  });

  updateNotifBadge();

  /* -------------------- keyboard nav for role="button" elements -------------------- */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const trigger = e.target.closest('[data-keynav="true"]');
    if (!trigger) return;
    e.preventDefault();
    trigger.click();
  });

  /* -------------------- avatar / logout -------------------- */
  const avatarBtn = $('#avatarBtn');
  const profileDropdown = $('#profileDropdown');

  avatarBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown?.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (profileDropdown?.classList.contains('open') && !profileDropdown.contains(e.target) && e.target !== avatarBtn) {
      profileDropdown.classList.remove('open');
    }
  });

  $('#logoutBtn')?.addEventListener('click', () => {
    profileDropdown?.classList.remove('open');
    logout();
  });

  function updateUserDisplay() {
    if (authUser && authUser.name) {
      const nameEl = $('#userName');
      if (nameEl) nameEl.textContent = authUser.name;
      const letter = $('#avatarLetter');
      if (letter) letter.textContent = authUser.name.charAt(0).toUpperCase();
      const dName = $('#dropdownName');
      if (dName) dName.textContent = authUser.name;
      const dEmail = $('#dropdownEmail');
      if (dEmail) dEmail.textContent = authUser.email || '';
    }
  }

  /* -------------------- initial paint -------------------- */
  if (isLoggedIn()) {
    updateUserDisplay();
    loadDashboard();
  }
  updateI18n();
  applyFilter();
  /* ==================== MEETING / WEBRTC ==================== */
  let socket = null;
  let localStream = null;
  const peerConnections = {};
  const STUN = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
  let currentMeetingId = null;
  let currentRoomId = null;
  let meetTimerInterval = null;
  let meetSeconds = 0;

  /* ---------- API calls ---------- */
  async function createMeeting(title) {
    const data = await api('/api/meetings', {
      method: 'POST',
      body: JSON.stringify({ title })
    });
    return data.meeting;
  }

  async function getMeetingByCode(code) {
    const data = await api(`/api/meetings/${code}`);
    return data.meeting;
  }

  async function listActiveMeetings() {
    const data = await api('/api/meetings');
    return data.meetings;
  }

  async function endMeetingApi(id) {
    await api(`/api/meetings/${id}/end`, { method: 'POST' });
  }

  /* ---------- Socket ---------- */
  function connectSocket() {
    if (socket?.connected) return;
    socket = io({ auth: { token: authToken } });
    socket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
    });
    setupSocketListeners();
  }

  function disconnectSocket() {
    if (!socket) return;
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  function setupSocketListeners() {
    socket.on('room-joined', ({ roomId, participants }) => {
      currentRoomId = roomId;
      for (const p of participants) {
        if (p.socketId !== socket.id) createPeerConnection(p.socketId, false);
      }
    });

    socket.on('user-joined', ({ socketId, userId, name }) => {
      createPeerConnection(socketId, false);
      addRemoteTile(socketId, name);
    });

    socket.on('user-left', ({ socketId }) => {
      if (peerConnections[socketId]) {
        peerConnections[socketId].close();
        delete peerConnections[socketId];
      }
      removeRemoteTile(socketId);
      updatePeopleCount();
    });

    socket.on('offer', async ({ from, offer }) => {
      await createPeerConnection(from, true);
      try {
        await peerConnections[from].setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnections[from].createAnswer();
        await peerConnections[from].setLocalDescription(answer);
        socket.emit('answer', { to: from, answer });
      } catch (err) {
        console.error('Error handling offer:', err);
      }
    });

    socket.on('answer', async ({ from, answer }) => {
      try {
        if (peerConnections[from]?.currentRemoteDescription) return;
        await peerConnections[from]?.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (err) {
        console.error('Error handling answer:', err);
      }
    });

    socket.on('ice-candidate', ({ from, candidate }) => {
      try {
        if (candidate && peerConnections[from]) {
          peerConnections[from].addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.error('Error adding ICE candidate:', err);
      }
    });
  }

  /* ---------- Peer Connections ---------- */
  async function createPeerConnection(socketId, isInitiator) {
    if (peerConnections[socketId]) return;
    const pc = new RTCPeerConnection(STUN);
    peerConnections[socketId] = pc;

    if (localStream) {
      localStream.getTracks().forEach(t => pc.addTrack(t, localStream));
    }

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit('ice-candidate', { to: socketId, candidate: e.candidate });
      }
    };

    pc.ontrack = (e) => {
      const videoEl = document.getElementById(`remote-video-${socketId}`);
      if (videoEl) {
        videoEl.srcObject = e.streams[0];
        videoEl.classList.add('active');
        const avatar = document.getElementById(`remote-avatar-${socketId}`);
        if (avatar) avatar.classList.add('hidden');
      }
    };

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
        pc.close();
        delete peerConnections[socketId];
      }
    };

    if (isInitiator) {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('offer', { to: socketId, offer });
      } catch (err) {
        console.error('Error creating offer:', err);
      }
    }
  }

  /* ---------- Remote Tiles ---------- */
  function addRemoteTile(socketId, name) {
    const grid = document.getElementById('meetGrid');
    if (!grid || document.getElementById(`remote-tile-${socketId}`)) return;
    const tile = document.createElement('div');
    tile.className = 'meet-tile';
    tile.id = `remote-tile-${socketId}`;
    tile.innerHTML = `
      <div class="meet-video-wrap">
        <video id="remote-video-${socketId}" class="remote-video" autoplay playsinline></video>
        <div class="meet-avatar-placeholder" id="remote-avatar-${socketId}">
          <span class="meet-avatar-letter">${(name || '?').charAt(0).toUpperCase()}</span>
        </div>
      </div>
      <div class="meet-tile-label">
        <span>${name || 'Pengguna'}</span>
      </div>
    `;
    grid.appendChild(tile);
    updatePeopleCount();
  }

  function removeRemoteTile(socketId) {
    const tile = document.getElementById(`remote-tile-${socketId}`);
    if (tile) tile.remove();
    updatePeopleCount();
  }

  function updatePeopleCount() {
    const countEl = document.getElementById('meetPeopleCount');
    if (!countEl) return;
    const tiles = document.querySelectorAll('#meetGrid .meet-tile');
    countEl.textContent = `👥 ${tiles.length}`;
  }

  /* ---------- Local Media ---------- */
  async function startLocalMedia() {
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const video = document.getElementById('localVideo');
      if (video) {
        video.srcObject = localStream;
        video.classList.add('active');
      }
      const avatar = document.getElementById('localAvatar');
      if (avatar) avatar.classList.add('hidden');
      return true;
    } catch (err) {
      console.warn('Local media error:', err);
      const video = document.getElementById('localVideo');
      if (video) video.classList.remove('active');
      return false;
    }
  }

  function stopLocalMedia() {
    if (localStream) {
      localStream.getTracks().forEach(t => t.stop());
      localStream = null;
    }
    const video = document.getElementById('localVideo');
    if (video) {
      video.srcObject = null;
      video.classList.remove('active');
    }
    const avatar = document.getElementById('localAvatar');
    if (avatar) avatar.classList.remove('hidden');
  }

  /* ---------- Meeting Actions ---------- */
  async function enterMeetingRoom(meeting) {
    currentMeetingId = meeting.id;
    show('meetingRoom');
    document.getElementById('meetCodeDisplay').textContent = meeting.code;

    const letterEl = document.getElementById('localAvatar')?.querySelector('.meet-avatar-letter');
    if (letterEl && authUser?.name) letterEl.textContent = authUser.name.charAt(0).toUpperCase();
    const nameEl = document.getElementById('localTileName');
    if (nameEl) nameEl.textContent = authUser?.name || 'Anda';

    await startLocalMedia();
    connectSocket();
    socket.emit('join-room', { roomId: `meeting-${meeting.id}` });

    startMeetTimer();
  }

  function startMeetTimer() {
    meetSeconds = 0;
    clearInterval(meetTimerInterval);
    const el = document.getElementById('meetTimer');
    meetTimerInterval = setInterval(() => {
      meetSeconds++;
      const m = String(Math.floor(meetSeconds / 60)).padStart(2, '0');
      const s = String(meetSeconds % 60).padStart(2, '0');
      if (el) el.textContent = `${m}:${s}`;
    }, 1000);
  }

  function leaveMeeting() {
    clearInterval(meetTimerInterval);
    if (socket && currentMeetingId) {
      socket.emit('leave-room', { roomId: `meeting-${currentMeetingId}` });
    }
    for (const id of Object.keys(peerConnections)) {
      peerConnections[id].close();
      delete peerConnections[id];
    }
    stopLocalMedia();
    disconnectSocket();
    document.querySelectorAll('[id^="remote-tile-"]').forEach(el => el.remove());
    currentMeetingId = null;
    currentRoomId = null;
    show('meetingLobby');
  }

  /* ---------- Meeting Lobby ---------- */
  async function loadActiveMeetings() {
    showSkeleton('skeletonActiveMeetings');
    try {
      const meetings = await listActiveMeetings();
      hideSkeleton('skeletonActiveMeetings');
      const container = document.getElementById('activeMeetingCards');
      const empty = document.getElementById('noActiveMeetings');
      if (!container) return;
      container.innerHTML = '';
      if (!meetings || meetings.length === 0) {
        if (empty) empty.hidden = false;
        return;
      }
      if (empty) empty.hidden = true;
      meetings.forEach(m => {
        const item = document.createElement('div');
        item.className = 'active-meeting-item';
        item.innerHTML = `
          <div class="active-meeting-icon">📹</div>
          <div class="active-meeting-info">
            <h4>${m.title}</h4>
            <p>oleh ${m.host_name}</p>
          </div>
          <div class="active-meeting-code">${m.code}</div>
        `;
        item.addEventListener('click', async () => {
          try {
            const meeting = await getMeetingByCode(m.code);
            await enterMeetingRoom(meeting);
          } catch (err) {
            toast(err.message);
          }
        });
        container.appendChild(item);
      });
    } catch (err) {
      hideSkeleton('skeletonActiveMeetings');
      console.warn('Failed to load active meetings:', err);
    }
  }

  /* ---------- Event Bindings ---------- */
  /* Auto-load active meetings when meetingLobby becomes active */
  const lobbyEl = document.getElementById('meetingLobby');
  const lobbyObserver = new MutationObserver(() => {
    if (lobbyEl?.classList.contains('active')) {
      loadActiveMeetings();
    }
  });
  if (lobbyEl) lobbyObserver.observe(lobbyEl, { attributes: true, attributeFilter: ['class'] });

  document.getElementById('meetFab')?.addEventListener('click', () => {
    if (!isLoggedIn()) {
      toast('Silakan masuk terlebih dahulu');
      return;
    }
    show('meetingLobby');
  });

  document.getElementById('createMeetingBtn')?.addEventListener('click', async () => {
    const title = await showModal({
      title: t('create_meeting_title'),
      placeholder: t('create_meeting_placeholder'),
      confirmText: t('create_meeting_confirm'),
      cancelText: t('create_meeting_cancel')
    });
    if (!title || !title.trim()) return;
    try {
      const meeting = await createMeeting(title.trim());
      await enterMeetingRoom(meeting);
    } catch (err) {
      toast(err.message);
    }
  });

  document.getElementById('joinMeetingBtn')?.addEventListener('click', async () => {
    const input = document.getElementById('meetingCodeInput');
    const code = input?.value.trim().toUpperCase();
    if (!code) { toast('Masukkan kode meeting'); return; }
    try {
      const meeting = await getMeetingByCode(code);
      await enterMeetingRoom(meeting);
    } catch (err) {
      toast(err.message);
    }
  });

  document.getElementById('meetingCodeInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('joinMeetingBtn')?.click();
  });

  document.getElementById('meetLeaveBtn')?.addEventListener('click', () => {
    if (currentMeetingId) {
      endMeetingApi(currentMeetingId).catch(() => {});
    }
    leaveMeeting();
  });

  document.getElementById('meetShareBtn')?.addEventListener('click', () => {
    const code = document.getElementById('meetCodeDisplay')?.textContent;
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      toast('Kode meeting disalin: ' + code);
    }).catch(() => {
      toast('Kode meeting: ' + code);
    });
  });

  /* Meeting room mic/cam toggles */
  document.getElementById('meetMicBtn')?.addEventListener('click', () => {
    if (!localStream) return;
    const enabled = !document.getElementById('meetMicBtn')?.classList.contains('active');
    localStream.getAudioTracks().forEach(t => t.enabled = enabled);
    document.getElementById('meetMicBtn')?.classList.toggle('active', enabled);
    document.getElementById('meetMicBtn')?.setAttribute('aria-pressed', enabled);
    const dot = document.getElementById('localMicDot');
    if (dot) dot.classList.toggle('muted', !enabled);
  });

  document.getElementById('meetCamBtn')?.addEventListener('click', () => {
    if (!localStream) return;
    const enabled = !document.getElementById('meetCamBtn')?.classList.contains('active');
    localStream.getVideoTracks().forEach(t => t.enabled = enabled);
    document.getElementById('meetCamBtn')?.classList.toggle('active', enabled);
    document.getElementById('meetCamBtn')?.setAttribute('aria-pressed', enabled);
    const video = document.getElementById('localVideo');
    const avatar = document.getElementById('localAvatar');
    if (video && avatar) {
      video.classList.toggle('active', enabled);
      avatar.classList.toggle('hidden', enabled);
    }
  });

  /* -------------------- Absensi & Timesheet -------------------- */
  const ABSENSI_KEY = 'vc_absensi';
  let absensiTimer = null;

  function getAbsensiData() {
    try {
      return JSON.parse(localStorage.getItem(ABSENSI_KEY)) || [];
    } catch { return []; }
  }

  function saveAbsensiData(data) {
    localStorage.setItem(ABSENSI_KEY, JSON.stringify(data));
  }

  function formatTime(d) {
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  function formatDate(d) {
    return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  function formatHours(ms) {
    const totalMinutes = Math.floor(ms / 60000);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}j ${m}m`;
  }

  function getTodayRecords(data) {
    const today = new Date();
    const todayStr = today.toDateString();
    return data.filter(r => new Date(r.date).toDateString() === todayStr);
  }

  function getActiveSession() {
    const data = getAbsensiData();
    const todayRecords = getTodayRecords(data);
    return todayRecords.find(r => !r.checkout) || null;
  }

  function calcHours(records) {
    return records.reduce((total, r) => {
      const start = new Date(r.checkin);
      const end = r.checkout ? new Date(r.checkout) : new Date();
      return total + (end.getTime() - start.getTime());
    }, 0);
  }

  function getWeekRecords(data) {
    const now = new Date();
    const day = now.getDay();
    const diff = day === 0 ? 6 : day - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diff);
    monday.setHours(0, 0, 0, 0);
    return data.filter(r => new Date(r.date) >= monday);
  }

  function getMonthRecords(data) {
    const now = new Date();
    return data.filter(r => {
      const d = new Date(r.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
  }

  function updateAbsensiDisplay() {
    const session = getActiveSession();
    const statusIcon = document.getElementById('absensiStatusIcon');
    const statusText = document.getElementById('absensiStatusText');
    const timeDisplay = document.getElementById('absensiTimeDisplay');
    const checkinBtn = document.getElementById('absensiCheckinBtn');
    const checkoutBtn = document.getElementById('absensiCheckoutBtn');
    const quickStatus = document.getElementById('absensiQuickStatus');

    if (session) {
      if (statusIcon) statusIcon.textContent = '📥';
      if (statusText) statusText.textContent = t('checked_in') || 'Sedang check-in';
      if (quickStatus) {
        quickStatus.textContent = (t('checked_in') || 'Sedang check-in') + ' ' + formatTime(new Date(session.checkin));
        quickStatus.style.color = 'var(--success)';
      }
      checkinBtn?.setAttribute('disabled', 'true');
      checkoutBtn?.removeAttribute('disabled');
    } else {
      if (statusIcon) statusIcon.textContent = '⏳';
      if (statusText) statusText.textContent = t('not_checked_in') || 'Belum check-in';
      if (quickStatus) {
        quickStatus.textContent = t('not_checked_in') || 'Belum check-in';
        quickStatus.style.color = '';
      }
      checkinBtn?.removeAttribute('disabled');
      checkoutBtn?.setAttribute('disabled', 'true');
    }
  }

  function updateAbsensiTimer() {
    const session = getActiveSession();
    const timeDisplay = document.getElementById('absensiTimeDisplay');
    if (session && timeDisplay) {
      const elapsed = Date.now() - new Date(session.checkin).getTime();
      const totalMinutes = Math.floor(elapsed / 60000);
      const h = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
      const m = String(totalMinutes % 60).padStart(2, '0');
      const s = String(Math.floor((elapsed % 60000) / 1000)).padStart(2, '0');
      timeDisplay.textContent = `${h}:${m}:${s}`;
    } else if (timeDisplay) {
      timeDisplay.textContent = '--:--:--';
    }
  }

  function updateAbsensiStats() {
    const data = getAbsensiData();
    const todayRecords = getTodayRecords(data);
    const weekRecords = getWeekRecords(data);
    const monthRecords = getMonthRecords(data);

    document.getElementById('absensiTodayHours').textContent = formatHours(calcHours(todayRecords));
    document.getElementById('absensiWeekHours').textContent = formatHours(calcHours(weekRecords));
    document.getElementById('absensiMonthHours').textContent = formatHours(calcHours(monthRecords));
  }

  function renderAbsensiHistory() {
    const list = document.getElementById('absensiHistoryList');
    if (!list) return;
    const data = getAbsensiData();
    const sorted = [...data].sort((a, b) => new Date(b.checkin) - new Date(a.checkin));
    const empty = document.getElementById('absensiEmpty');

    list.innerHTML = '';
    if (sorted.length === 0) {
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;

    sorted.slice(0, 20).forEach(r => {
      const start = new Date(r.checkin);
      const end = r.checkout ? new Date(r.checkout) : null;
      const hours = end ? formatHours(end.getTime() - start.getTime()) : 'Berlangsung';
      const item = document.createElement('div');
      item.className = 'absensi-history-item';
      item.innerHTML = `
        <div class="absensi-history-icon">${end ? '✅' : '🟢'}</div>
        <div class="absensi-history-body">
          <div class="absensi-history-date">${formatDate(start)}</div>
          <div class="absensi-history-detail">${formatTime(start)}${end ? ' — ' + formatTime(end) : ' — ...'}</div>
        </div>
        <div class="absensi-history-hours">${hours}</div>
      `;
      list.appendChild(item);
    });
  }

  function absensiCheckin() {
    const data = getAbsensiData();
    const now = new Date();
    data.push({ id: Date.now(), date: now.toISOString(), checkin: now.toISOString(), checkout: null });
    saveAbsensiData(data);
    updateAbsensiDisplay();
    updateAbsensiStats();
    renderAbsensiHistory();
    toast((t('check_in_success') || 'Check-in berhasil pada') + ' ' + formatTime(now));

    startAbsensiTimer();
  }

  function absensiCheckout() {
    const session = getActiveSession();
    if (!session) return;
    const data = getAbsensiData();
    const now = new Date();
    const record = data.find(r => r.id === session.id);
    if (record) {
      record.checkout = now.toISOString();
      saveAbsensiData(data);
    }
    updateAbsensiDisplay();
    updateAbsensiStats();
    renderAbsensiHistory();
    toast((t('check_out_success') || 'Check-out berhasil. Total:') + ' ' + formatHours(now.getTime() - new Date(session.checkin).getTime()));
  }

  function absensiExportReport() {
    const data = getAbsensiData();
    if (data.length === 0) {
      toast('Belum ada data absensi untuk diexport.');
      return;
    }
    const rows = [['Tanggal', 'Check In', 'Check Out', 'Durasi']];
    data.forEach(r => {
      const start = new Date(r.checkin);
      const end = r.checkout ? new Date(r.checkout) : null;
      const dur = end ? formatHours(end.getTime() - start.getTime()) : 'Berlangsung';
      rows.push([
        formatDate(start),
        formatTime(start),
        end ? formatTime(end) : '-',
        dur
      ]);
    });
    const csv = rows.map(row => row.map(f => `"${f}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'laporan_absensi_' + new Date().toISOString().slice(0, 10) + '.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast('Laporan berhasil diunduh.');
  }

  document.getElementById('absensiCheckinBtn')?.addEventListener('click', absensiCheckin);
  document.getElementById('absensiCheckoutBtn')?.addEventListener('click', absensiCheckout);
  document.getElementById('absensiExportBtn')?.addEventListener('click', absensiExportReport);

  let absensiTimerActive = false;

  function startAbsensiTimer() {
    if (absensiTimerActive) return;
    absensiTimerActive = true;
    absensiTimer = setInterval(updateAbsensiTimer, 1000);
  }

  function stopAbsensiTimer() {
    absensiTimerActive = false;
    if (absensiTimer) {
      clearInterval(absensiTimer);
      absensiTimer = null;
    }
  }

  const absensiObserver = new MutationObserver(() => {
    const el = document.getElementById('absensi');
    if (el?.classList.contains('active')) {
      updateAbsensiDisplay();
      updateAbsensiStats();
      renderAbsensiHistory();
      const session = getActiveSession();
      if (session) {
        startAbsensiTimer();
        updateAbsensiTimer();
      } else {
        stopAbsensiTimer();
        updateAbsensiTimer();
      }
    } else {
      stopAbsensiTimer();
    }
  });
  const absensiEl = document.getElementById('absensi');
  if (absensiEl) absensiObserver.observe(absensiEl, { attributes: true, attributeFilter: ['class'] });

  // Init absensi state if timer needed from a prior session
  (function initAbsensi() {
    const session = getActiveSession();
    if (session) {
      startAbsensiTimer();
      updateAbsensiTimer();
    }
  })();

  window.translations = translations;
})();
