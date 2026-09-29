/* 异环勤务录 · 打卡核心
   数据模型：按 日 / ISO 周 / 自然月 三个周期分别记录已勾选项。
   存储键：ananta-ledger-v1（localStorage 自动持久化）。
   音效：打勾时 Web Audio 合成「笔尖划纸」，无外部音频文件；刊况栏「音」印可静音（键 ananta-sound）。 */
'use strict';

(function () {
  var STORAGE_KEY = 'ananta-ledger-v1';
  var DAILY_TOTAL = 4;
  var WEEKLY_TOTAL = 4;
  var MONTHLY_TOTAL = 3;
  var KNOWN_IDS = {
    day: { d1: 1, d2: 1, d3: 1, d4: 1 },
    week: { w1: 1, w2: 1, w3: 1, w6: 1 },
    month: { m1: 1, m2: 1, m3: 1 }
  };

  var DAILY_ITEMS = [
    { id: 'd1', no: '01', title: '影院约会', meta: '斑蝶传送点 · 前台购票观影，+200 好感，开场可退' },
    { id: 'd2', no: '02', title: '羁遇送礼', meta: '每日十份，每角色至多三份' },
    { id: 'd3', no: '03', title: '许愿池', meta: '未成选「虔诚许愿」，已成选「捞硬币」' },
    { id: 'd4', no: '04', title: '魔女之家', meta: '桥间地对话选「卜运」，推进占卜成就' }
  ];

  var WEEKLY_ITEMS = [
    { id: 'w1', no: '01', title: '玛门挑战', meta: '维纳公寓 · 存金最高一次结算方斯，顺路逛拍卖行凯觎钱市' },
    { id: 'w2', no: '02', title: '棉棉领礼', meta: '异象家具找棉棉 · 按产出效率领 400 好感度送礼道具' },
    { id: 'w3', no: '03', title: '异象巡礼', meta: '探索指南周本 ×3 · 角色技能材料，进阶后再打收益更高' },
    /* id 用 w6：避开旧版 w4（同城派送）/ w5（粉爪银行）在本地存档里的勾选残留 */
    { id: 'w6', no: '04', title: '排球锦标赛', meta: '奥利哈刚理想馆 · 每期 100 万方斯' }
  ];

  var MONTHLY_ITEMS = [
    { id: 'm1', no: '01', title: '迷迭兑换', meta: '集市兑换 · 限定常驻与武器抽数优先，共需 2100 积分' },
    { id: 'm2', no: '02', title: '猎人交易所', meta: '每版本刷新 · 只推荐环石与武器抽数，好感度礼物亦具性价比' },
    { id: 'm3', no: '03', title: '异境回收站', meta: '玩法商店 · 优先方斯其次甲硬币，经验不推荐' }
  ];

  /* ---------- 工具 ---------- */

  function $(sel) { return document.querySelector(sel); }

  function pad(n) { return String(n).padStart(2, '0'); }

  function dayKey(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function monthKey(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1);
  }

  function isoWeekKey(d) {
    var t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    var day = (t.getUTCDay() + 6) % 7;
    t.setUTCDate(t.getUTCDate() - day + 3);
    var firstThu = new Date(Date.UTC(t.getUTCFullYear(), 0, 4));
    var fday = (firstThu.getUTCDay() + 6) % 7;
    firstThu.setUTCDate(firstThu.getUTCDate() - fday + 3);
    var week = 1 + Math.round((t - firstThu) / (7 * 86400000));
    return t.getUTCFullYear() + '-W' + pad(week);
  }

  function dayOfYear(d) {
    var start = new Date(d.getFullYear(), 0, 0);
    return Math.floor((d - start) / 86400000);
  }

  var CN_DIGITS = '〇一二三四五六七八九';

  function cnUnit(n) { return CN_DIGITS[n] || String(n); }

  function cnSmall(n) {
    if (n <= 9) return cnUnit(n);
    if (n === 10) return '十';
    if (n < 20) return '十' + cnUnit(n % 10);
    var tens = Math.floor(n / 10);
    var ones = n % 10;
    return cnUnit(tens) + '十' + (ones ? cnUnit(ones) : '');
  }

  function cnDateLine(d) {
    var year = CN_DIGITS[Math.floor(d.getFullYear() / 1000)]
      + CN_DIGITS[Math.floor(d.getFullYear() / 100) % 10]
      + CN_DIGITS[Math.floor(d.getFullYear() / 10) % 10]
      + CN_DIGITS[d.getFullYear() % 10] + '年';
    var weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return year + cnSmall(d.getMonth() + 1) + '月' + cnSmall(d.getDate()) + '日' + ' 星期' + weekdays[d.getDay()];
  }

  function countdownText(ms) {
    var totalMin = Math.max(1, Math.ceil(ms / 60000));
    var h = Math.floor(totalMin / 60);
    var m = totalMin % 60;
    if (h === 0) return '不足一小时';
    if (m === 0) return '约' + cnSmall(h) + '小时';
    return '约' + cnSmall(h) + '小时' + cnSmall(m) + '分';
  }

  function updateCountdown() {
    var now = new Date();
    var next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    if (now >= next) {
      location.reload();
      return;
    }
    var txt = countdownText(next - now);
    var el = $('#countdown');
    if (el && el.textContent !== txt) el.textContent = txt;
  }

  /* ---------- 存储 ---------- */

  var storageOk = true;
  var state = loadState();

  function emptyState() {
    return { v: 1, meta: { firstDay: dayKey(new Date()) }, days: {}, weeks: {}, months: {} };
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.v === 1 && typeof parsed.days === 'object') {
          return sanitizeState(parsed);
        }
      }
    } catch (err) {
      storageOk = false;
    }
    return emptyState();
  }

  function sanitizeState(parsed) {
    var clean = emptyState();
    if (parsed.meta && typeof parsed.meta.firstDay === 'string'
      && /^\d{4}-\d{2}-\d{2}$/.test(parsed.meta.firstDay)) {
      clean.meta.firstDay = parsed.meta.firstDay;
    }
    ['days', 'weeks', 'months'].forEach(function (field) {
      var bucket = parsed[field];
      if (!bucket || typeof bucket !== 'object') return;
      Object.keys(bucket).forEach(function (k) {
        var arr = bucket[k];
        if (!Array.isArray(arr)) return;
        var kind = field === 'days' ? 'day' : field === 'weeks' ? 'week' : 'month';
        var ids = arr.filter(function (id) { return typeof id === 'string' && KNOWN_IDS[kind][id]; });
        clean[field][k] = Array.from(new Set(ids));
      });
    });
    return clean;
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      storageOk = false;
      showStorageWarn();
    }
  }

  function showStorageWarn() {
    var warn = $('#storageWarn');
    if (warn) warn.hidden = false;
  }

  function periodIds(field, key) {
    if (!state[field][key]) state[field][key] = [];
    return state[field][key];
  }

  /* ---------- 渲染 ---------- */

  function periodKey(kind) {
    var now = new Date();
    if (kind === 'week') return isoWeekKey(now);
    if (kind === 'month') return monthKey(now);
    return dayKey(now);
  }

  function renderList(items, listSel, field, kind) {
    var list = $(listSel);
    if (!list) return;
    var doneNow = state[field][periodKey(kind)] || [];
    list.innerHTML = '';
    items.forEach(function (item, i) {
      var li = document.createElement('li');
      li.style.setProperty('--i', i);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'entry';
      btn.setAttribute('aria-pressed', doneNow.indexOf(item.id) !== -1 ? 'true' : 'false');
      btn.dataset.id = item.id;

      var no = document.createElement('span');
      no.className = 'entry-no';
      no.setAttribute('aria-hidden', 'true');
      no.textContent = item.no;

      var body = document.createElement('span');
      body.className = 'entry-body';

      var title = document.createElement('span');
      title.className = 'entry-title';
      title.textContent = item.title;

      var strike = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      strike.setAttribute('class', 'strike');
      strike.setAttribute('viewBox', '0 0 320 44');
      strike.setAttribute('preserveAspectRatio', 'none');
      strike.setAttribute('aria-hidden', 'true');
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('class', 'strike-line');
      path.setAttribute('d', 'M8 27 C 80 17, 180 31, 312 15');
      path.setAttribute('pathLength', '1');
      var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('class', 'strike-dot');
      dot.setAttribute('cx', '312');
      dot.setAttribute('cy', '15');
      dot.setAttribute('r', '5');
      strike.appendChild(path);
      strike.appendChild(dot);
      title.appendChild(strike);

      var meta = document.createElement('span');
      meta.className = 'entry-meta';
      meta.textContent = item.meta;

      body.appendChild(title);
      body.appendChild(meta);

      var check = document.createElement('span');
      check.className = 'check';
      check.setAttribute('aria-hidden', 'true');

      btn.appendChild(no);
      btn.appendChild(body);
      btn.appendChild(check);
      li.appendChild(btn);
      list.appendChild(li);
    });
  }

  function countDone(field, key) {
    var arr = state[field][key];
    return arr ? arr.length : 0;
  }

  function openDays() {
    var first = new Date(state.meta.firstDay + 'T00:00:00');
    var today = new Date();
    var diff = Math.floor((new Date(today.getFullYear(), today.getMonth(), today.getDate()) - first) / 86400000);
    return diff + 1;
  }

  function streakDays() {
    var cursor = new Date();
    var full = function (d) { return countDone('days', dayKey(d)) >= DAILY_TOTAL; };
    if (!full(cursor)) cursor.setDate(cursor.getDate() - 1);
    var n = 0;
    while (full(cursor)) {
      n += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return n;
  }

  var prevCounts = null;

  function showSeal(seal, show) {
    if (!seal) return;
    if (show && seal.hidden) {
      seal.hidden = false;
      seal.classList.remove('stamp');
      void seal.offsetWidth;
      seal.classList.add('stamp');
    } else if (!show && !seal.hidden) {
      seal.hidden = true;
    }
  }

  function updateRail(pulse, announce) {
    var today = new Date();
    var done = countDone('days', dayKey(today));
    var weekDone = countDone('weeks', isoWeekKey(today));
    var monthDone = countDone('months', monthKey(today));

    var num = $('#doneCount');
    num.textContent = String(done);
    var figure = num.parentElement;
    if (figure) figure.classList.toggle('is-complete', done >= DAILY_TOTAL);
    if (pulse) {
      num.classList.remove('pulse');
      void num.offsetWidth;
      num.classList.add('pulse');
    }

    showSeal($('#daySeal'), done >= DAILY_TOTAL);

    $('#streakNum').textContent = String(streakDays());
    $('#sinceNum').textContent = String(openDays());
    $('#weekProgress').textContent = weekDone + ' / ' + WEEKLY_TOTAL;
    $('#monthProgress').textContent = monthDone + ' / ' + MONTHLY_TOTAL;

    var weekNote = $('#weekNote');
    if (weekNote) {
      weekNote.textContent = '已勾 ' + weekDone + '/' + WEEKLY_TOTAL;
      weekNote.classList.toggle('is-done', weekDone >= WEEKLY_TOTAL);
    }
    var monthNote = $('#monthNote');
    if (monthNote) {
      monthNote.textContent = '已勾 ' + monthDone + '/' + MONTHLY_TOTAL;
      monthNote.classList.toggle('is-done', monthDone >= MONTHLY_TOTAL);
    }

    showSeal($('#weekSeal'), weekDone >= WEEKLY_TOTAL);
    showSeal($('#monthSeal'), monthDone >= MONTHLY_TOTAL);

    if (announce) {
      var msgs = [];
      if (done >= DAILY_TOTAL) {
        msgs.push('今日四件全部完成，已盖全勤章');
      } else {
        msgs.push('今日已勾 ' + done + ' / ' + DAILY_TOTAL);
      }
      if (prevCounts) {
        if (weekDone === WEEKLY_TOTAL && prevCounts.week !== weekDone) msgs.push('周刊四件全部完成');
        if (monthDone === MONTHLY_TOTAL && prevCounts.month !== monthDone) msgs.push('月刊三件全部完成');
      }
      var live = $('#liveStatus');
      if (live) live.textContent = msgs.join('；');
    }
    prevCounts = { day: done, week: weekDone, month: monthDone };
  }

  function updateMasthead() {
    var today = new Date();
    $('#issueNo').textContent = String(dayOfYear(today));
    $('#issueDate').textContent = cnDateLine(today);
  }

  /* ---------- 音效：笔尖划纸（Web Audio 合成，无外部音频文件） ---------- */

  var SOUND_KEY = 'ananta-sound';
  var soundOn = true;
  try {
    soundOn = localStorage.getItem(SOUND_KEY) !== '0';
  } catch (err) { /* 读不到就默认开 */ }

  var audioCtx = null;
  var scratchBuffer = null;

  function getAudioCtx() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!audioCtx) audioCtx = new AC();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function getScratchBuffer(ctx) {
    if (scratchBuffer) return scratchBuffer;
    var dur = 0.3;
    scratchBuffer = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * dur)), ctx.sampleRate);
    var data = scratchBuffer.getChannelData(0);
    for (var i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return scratchBuffer;
  }

  function playScratch() {
    if (!soundOn) return;
    try {
      var ctx = getAudioCtx();
      if (!ctx || ctx.state === 'closed') return;
      var dur = 0.3;
      var t = ctx.currentTime;

      var src = ctx.createBufferSource();
      src.buffer = getScratchBuffer(ctx);

      var bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.Q.value = 1.1;
      bp.frequency.setValueAtTime(1500, t);                      // 落笔
      bp.frequency.setValueAtTime(950, t + 0.08);                // 第一笔下压，音色变沉
      bp.frequency.exponentialRampToValueAtTime(4200, t + 0.27); // 第二笔上挑，音色变亮

      var hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 750;

      var g = ctx.createGain();
      var N = 56;
      var curve = new Float32Array(N);
      for (var i = 0; i < N; i++) {
        var ts = i / (N - 1) * dur;
        var v = 0;
        if (ts < 0.09) {                        // 第一笔：短促下压
          v = 0.55 * Math.sin(Math.PI * Math.min(1, ts / 0.075));
        } else if (ts >= 0.11 && ts <= 0.29) {  // 第二笔：上挑收笔
          v = 0.40 * Math.sin(Math.PI * Math.min(1, (ts - 0.11) / 0.18));
        }
        curve[i] = Math.max(0, v * (0.65 + 0.7 * Math.random())); // 纸面颗粒抖动
      }
      curve[N - 1] = 0;
      g.gain.setValueCurveAtTime(curve, t, dur);

      src.connect(bp);
      bp.connect(hp);
      hp.connect(g);
      g.connect(ctx.destination);
      src.start(t);
      src.stop(t + dur);
    } catch (err) {
      /* 音效失败不影响打卡 */
    }
  }

  /* ---------- 交互 ---------- */

  function onToggle(kind) {
    return function (ev) {
      var btn = ev.target.closest('.entry');
      if (!btn) return;
      var field = kind === 'week' ? 'weeks' : kind === 'month' ? 'months' : 'days';
      var key = periodKey(kind);
      var arr = periodIds(field, key);
      var id = btn.dataset.id;
      var idx = arr.indexOf(id);
      var turningOn = idx === -1;
      if (turningOn) {
        arr.push(id);
        playScratch();
      } else {
        arr.splice(idx, 1);
      }
      if (arr.length === 0) delete state[field][key];
      saveState();
      btn.setAttribute('aria-pressed', turningOn ? 'true' : 'false');
      updateRail(turningOn, true);
      if (kind === 'day') updateCountdown();
    };
  }

  /* ---------- 启动 ---------- */

  function init() {
    updateMasthead();
    renderList(DAILY_ITEMS, '#dailyList', 'days', 'day');
    renderList(WEEKLY_ITEMS, '#weeklyList', 'weeks', 'week');
    renderList(MONTHLY_ITEMS, '#monthlyList', 'months', 'month');
    updateRail(false, false);
    updateCountdown();
    if (!storageOk) showStorageWarn();

    var soundToggle = $('#soundToggle');
    if (soundToggle) {
      soundToggle.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
      soundToggle.addEventListener('click', function () {
        soundOn = !soundOn;
        try {
          localStorage.setItem(SOUND_KEY, soundOn ? '1' : '0');
        } catch (err) { /* 存不进就本次会话内生效 */ }
        soundToggle.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
        if (soundOn) playScratch();
      });
    }

    var lists = [
      ['#dailyList', 'day'],
      ['#weeklyList', 'week'],
      ['#monthlyList', 'month']
    ];
    lists.forEach(function (pair) {
      var list = $(pair[0]);
      if (list) list.addEventListener('click', onToggle(pair[1]));
    });

    setInterval(updateCountdown, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
