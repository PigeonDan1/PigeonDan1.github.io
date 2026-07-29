const REVIEW_STORAGE_KEY = "lat-tag-phase0-review-v1";

const state = {
  demos: [],
  reviewMode: new URLSearchParams(window.location.search).get("review") === "1",
  reviewDecisions: {},
  filters: {
    language: "all",
    event_type: "all",
    difficulty: "all",
    review_status: "all",
  },
};

const labels = {
  language: { zh: "中文", en: "English" },
  eventType: { speech: "Speech", mixed: "Mixed", non_speech: "Non-speech" },
  difficulty: { easy: "Easy", medium: "Medium", hard: "Hard" },
  reviewStatus: {
    model_disagrees_with_accepted_review: "模型与人工冲突",
    needs_human_confirmation: "需要人工确认",
    pilot_recommendation: "稳定建议",
  },
  reviewChoice: {
    keep_current: "保留当前 gold",
    accept_model: "采用 Gemini 首选",
    needs_manual: "需要人工精修",
  },
};

const reviewPriority = {
  model_disagrees_with_accepted_review: 0,
  needs_human_confirmation: 1,
  pilot_recommendation: 2,
};

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupFilters();
  setupReviewMode();
  loadBenchmark();
});

async function loadBenchmark() {
  const container = document.querySelector("#demo-container");
  try {
    const response = await fetch("assets/data/benchmark.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    state.demos = data.demos || [];
    hydrateSummary(data);
    updateReviewProgress();
    renderDemos();
  } catch (error) {
    console.error(error);
    container.innerHTML = `<div class="error-card"><strong>样例加载失败</strong><p>${escapeHtml(error.message)}</p></div>`;
  }
}

function hydrateSummary(data) {
  const dataset = data.dataset || {};
  const demo = data.demo || {};
  setText('[data-stat="records"]', formatNumber(dataset.records));
  setText('[data-stat="languages"]', formatNumber(Object.keys(dataset.languages || {}).length));
  setText('[data-stat="event-types"]', formatNumber(Object.keys(dataset.event_types || {}).length));
  setText('[data-stat="max-duration"]', `≤${formatNumber(dataset.max_audio_seconds)}s`);
  setText('[data-stat="demo-records"]', formatNumber(demo.records));
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element && value !== undefined) element.textContent = value;
}

function setupFilters() {
  document.querySelectorAll(".filter-group").forEach((group) => {
    group.addEventListener("click", (event) => {
      const button = event.target.closest(".filter-button");
      if (!button) return;
      group.querySelectorAll(".filter-button").forEach((candidate) => {
        candidate.classList.toggle("active", candidate === button);
      });
      state.filters[group.dataset.filter] = button.dataset.value;
      renderDemos();
    });
  });
}

function setupReviewMode() {
  state.reviewDecisions = readStoredReviewDecisions();
  const toggle = document.querySelector("#review-mode-toggle");
  const exportButton = document.querySelector("#review-export");
  const clearButton = document.querySelector("#review-clear");

  toggle?.addEventListener("click", () => setReviewMode(!state.reviewMode));
  exportButton?.addEventListener("click", exportReviewDecisions);
  clearButton?.addEventListener("click", () => {
    if (!Object.keys(state.reviewDecisions).length) return;
    if (!window.confirm("清空当前浏览器中的全部审核记录？原始数据不会受影响。")) return;
    state.reviewDecisions = {};
    persistReviewDecisions();
    updateReviewProgress();
    renderDemos();
  });
  applyReviewModeState();
}

function setReviewMode(enabled) {
  state.reviewMode = enabled;
  if (!enabled) {
    state.filters.review_status = "all";
    const reviewFilter = document.querySelector('[data-filter="review_status"]');
    reviewFilter?.querySelectorAll(".filter-button").forEach((button) => {
      button.classList.toggle("active", button.dataset.value === "all");
    });
  }
  const url = new URL(window.location.href);
  if (enabled) url.searchParams.set("review", "1");
  else url.searchParams.delete("review");
  window.history.replaceState({}, "", url);
  applyReviewModeState();
  if (state.demos.length) renderDemos();
}

function applyReviewModeState() {
  document.body.classList.toggle("review-mode", state.reviewMode);
  const toggle = document.querySelector("#review-mode-toggle");
  if (!toggle) return;
  toggle.setAttribute("aria-pressed", String(state.reviewMode));
  toggle.textContent = state.reviewMode ? "退出审核模式" : "进入审核模式";
}

function renderDemos() {
  const container = document.querySelector("#demo-container");
  if (!container) return;
  const demos = state.demos
    .filter((demo) => Object.entries(state.filters).every(([key, value]) => {
      if (value === "all") return true;
      if (key === "review_status") return !state.reviewMode || demo.review?.status === value;
      return demo[key] === value;
    }))
    .sort((left, right) => {
      if (!state.reviewMode) return 0;
      return (reviewPriority[left.review?.status] ?? 9) - (reviewPriority[right.review?.status] ?? 9);
    });

  setText("#demo-count", demos.length);
  stopAllAudio();
  if (!demos.length) {
    container.innerHTML = '<div class="empty-state"><strong>没有符合当前筛选条件的样例</strong><p>请调整语言、事件类型、难度或审核状态。</p></div>';
    return;
  }

  container.innerHTML = demos.map(renderDemoCard).join("");
  bindAudioInteractions(container);
  if (state.reviewMode) bindReviewInteractions(container);
}

function renderDemoCard(demo) {
  const language = labels.language[demo.language] || demo.language;
  const eventType = labels.eventType[demo.event_type] || demo.event_type;
  const difficulty = labels.difficulty[demo.difficulty] || demo.difficulty;
  const occurrenceFlag = demo.query_flags?.has_occurrence_constraint;
  const timestampReviewed = demo.timestamp_review?.status === "boundary_adjustment";
  const status = demo.review?.status;
  const output = JSON.stringify({ start: round(demo.start), end: round(demo.end) });
  return `
    <article class="demo-card${demo.featured ? " featured" : ""}${state.reviewMode ? " audit-card" : ""}" data-demo-id="${escapeHtml(demo.id)}">
      <header class="demo-card-head">
        <div class="tag-row">
          <span class="tag tag-event">${escapeHtml(eventType)}</span>
          <span class="tag">${escapeHtml(language)}</span>
          <span class="tag${demo.difficulty === "hard" ? " tag-hard" : ""}">${escapeHtml(difficulty)}</span>
          <span class="tag">${formatDuration(demo.target_duration)} target</span>
          ${timestampReviewed ? '<span class="tag flag">人工复核时间戳</span>' : ""}
          ${state.reviewMode && status ? `<span class="tag review-status status-${escapeHtml(status)}">${escapeHtml(labels.reviewStatus[status] || status)}</span>` : ""}
        </div>
        <h3>${escapeHtml(demo.title)}</h3>
        <p class="demo-note">${escapeHtml(demo.note)}</p>
      </header>

      <div class="query-box">
        <span class="micro-label">NATURAL-LANGUAGE EVENT QUERY</span>
        <p>${escapeHtml(demo.query)}</p>
      </div>

      <div class="audio-workbench">
        <div class="audio-toolbar">
          <div><strong>MIXED AUDIO</strong><small>${formatDuration(demo.duration)}</small></div>
          ${intervalButton("只播当前 gold", demo.start, demo.end, "primary")}
        </div>
        ${renderWaveform(demo)}
        ${renderAxis(demo.duration, demo.start, demo.end)}
        <audio class="native-audio" controls preload="metadata" src="${escapeHtml(demo.audio.path)}"></audio>
      </div>

      <div class="answer-panel">
        <div>
          <span class="micro-label">EXPECTED OUTPUT</span>
          <pre><code>${escapeHtml(output)}</code></pre>
        </div>
        <div class="time-summary">
          <div><small>START</small><strong>${formatTime(demo.start)}</strong></div>
          <div><small>END</small><strong>${formatTime(demo.end)}</strong></div>
          <div><small>LENGTH</small><strong>${formatDuration(demo.target_duration)}</strong></div>
        </div>
      </div>

      ${state.reviewMode ? renderReviewPanel(demo) : ""}

      <footer class="card-footer">
        <span>${escapeHtml(demo.id)} · ${escapeHtml(demo.source.annotation_file)}:${demo.source.annotation_line}</span>
        <span class="${timestampReviewed || occurrenceFlag ? "flag" : ""}">${timestampReviewed ? "reviewed timestamp" : occurrenceFlag ? "occurrence constraint" : "LAT timestamp"}</span>
      </footer>
    </article>
  `;
}

function renderWaveform(demo) {
  const duration = demo.duration || demo.audio.duration;
  const current = { start: demo.start, end: demo.end };
  const startRatio = clamp(current.start / duration, 0, 1);
  const endRatio = clamp(current.end / duration, 0, 1);
  const bars = demo.audio.waveform.map((peak, index) => {
    const midpoint = (index + 0.5) / demo.audio.waveform.length;
    const inTarget = midpoint >= startRatio && midpoint <= endRatio;
    return `<i class="waveform-bar${inTarget ? " in-target" : ""}" style="height:${Math.max(4, peak * 100)}%"></i>`;
  }).join("");

  const reviewWindows = state.reviewMode ? renderReviewWindows(demo, duration) : "";
  return `
    <div class="waveform" role="slider" tabindex="0" aria-label="音频波形，点击跳转" aria-valuemin="0" aria-valuemax="${duration}" aria-valuenow="0">
      ${intervalWindow(current, duration, "current-window", "当前 gold")}
      ${reviewWindows}
      ${bars}
      <span class="playhead"></span>
    </div>
  `;
}

function renderReviewWindows(demo, duration) {
  const review = demo.review || {};
  const windows = [];
  if (review.lat && !sameInterval(review.lat, review.current_gold)) {
    windows.push(intervalWindow(review.lat, duration, "lat-window", "LAT 原始"));
  }
  if (review.model_recommended && !sameInterval(review.model_recommended, review.current_gold)) {
    windows.push(intervalWindow(review.model_recommended, duration, "model-window", "Gemini 首选"));
  }
  (review.alternatives || []).forEach((candidate) => {
    if (sameInterval(candidate, review.current_gold) || sameInterval(candidate, review.lat) || sameInterval(candidate, review.model_recommended)) return;
    windows.push(intervalWindow(candidate, duration, "alternative-window", candidate.candidate_id));
  });
  return windows.join("");
}

function intervalWindow(value, duration, className, title) {
  if (!value) return "";
  const left = clamp(value.start / duration, 0, 1) * 100;
  const width = Math.max(0.35, clamp((value.end - value.start) / duration, 0, 1) * 100);
  return `<span class="interval-window ${className}" title="${escapeHtml(title)} ${formatTime(value.start)}–${formatTime(value.end)}" style="left:${left}%;width:${width}%"></span>`;
}

function renderAxis(duration, start, end) {
  const markers = state.reviewMode
    ? [
      { value: 0, label: "00:00" },
      { value: duration, label: formatTime(duration) },
    ]
    : [
      { value: 0, label: "00:00" },
      { value: start, label: `S ${formatTime(start)}` },
      { value: end, label: `E ${formatTime(end)}` },
      { value: duration, label: formatTime(duration) },
    ];
  return `<div class="timeline-axis">${markers.map((marker) => {
    const position = clamp(marker.value / duration, 0, 1) * 100;
    return `<span style="left:${position}%">${escapeHtml(marker.label)}</span>`;
  }).join("")}</div>`;
}

function renderReviewPanel(demo) {
  const review = demo.review;
  if (!review) return '<section class="review-panel"><p>该样例暂无 Pilot 审核数据。</p></section>';
  const stored = state.reviewDecisions[demo.id] || {};
  const requiredCues = review.query_spec?.required_cues || [];
  const modelInterval = review.model_recommended || review.recommended;
  const alternatives = (review.alternatives || []).map((candidate, index) => `
    <article class="candidate-row">
      <div>
        <span class="candidate-rank">#${index + 1} · ${escapeHtml(candidate.candidate_id)}</span>
        <strong>${formatInterval(candidate)}</strong>
        <small>score ${formatScore(candidate.score)} · query ${formatScore(candidate.query_match)} · cue ${formatScore(candidate.cue_completeness)}</small>
      </div>
      <div class="interval-actions">
        ${intervalButton("播放候选", candidate.start, candidate.end)}
        ${contextButton("±2s", candidate, demo.duration)}
      </div>
      ${candidate.summary ? `<p>${escapeHtml(candidate.summary)}</p>` : ""}
    </article>
  `).join("");

  return `
    <section class="review-panel">
      <div class="review-panel-head">
        <div>
          <span class="micro-label">GEMINI 3 FLASH PILOT REVIEW</span>
          <h4>${escapeHtml(labels.reviewStatus[review.status] || review.status)}</h4>
        </div>
        <span>模型结果仅供回检，不会自动写入 gold</span>
      </div>

      <div class="interval-comparison">
        ${reviewIntervalRow("LAT 原始", review.lat, "lat", demo.duration)}
        ${reviewIntervalRow("当前 gold", review.current_gold, "current", demo.duration)}
        ${reviewIntervalRow("Gemini 首选", modelInterval, "model", demo.duration, review.model_recommended?.candidate_id)}
      </div>

      <div class="boundary-listen">
        <span>Gemini 首选边界听测</span>
        <div class="interval-actions">
          ${intervalButton("PRE 2s", Math.max(0, modelInterval.start - 2), modelInterval.start)}
          ${intervalButton("TARGET", modelInterval.start, modelInterval.end)}
          ${intervalButton("POST 2s", modelInterval.end, Math.min(demo.duration, modelInterval.end + 2))}
        </div>
      </div>

      <details class="review-details">
        <summary>查看 Top-${review.alternatives.length} 候选与 Gemini 理由</summary>
        <div class="candidate-list">${alternatives}</div>
        <div class="model-notes">
          ${review.comparison?.reason ? `<p><strong>候选比较：</strong>${escapeHtml(review.comparison.reason)}</p>` : ""}
          ${review.boundary_validation?.reason ? `<p><strong>边界回检：</strong>${escapeHtml(review.boundary_validation.reason)}</p>` : ""}
          ${requiredCues.length ? `<div><strong>必需线索：</strong><ul>${requiredCues.map((cue) => `<li>${escapeHtml(cue.description)} <small>${escapeHtml(cue.type)}</small></li>`).join("")}</ul></div>` : ""}
        </div>
      </details>

      <div class="human-review" data-review-id="${escapeHtml(demo.id)}">
        <div class="human-review-head">
          <div><span class="micro-label">HUMAN LISTENING DECISION</span><strong>你的听测结论</strong></div>
          <small>仅保存在当前浏览器，可导出 JSONL</small>
        </div>
        <div class="review-choice-group">
          ${reviewChoiceButton("keep_current", stored.choice)}
          ${reviewChoiceButton("accept_model", stored.choice)}
          ${reviewChoiceButton("needs_manual", stored.choice)}
        </div>
        <textarea class="review-note" rows="2" placeholder="可选：记录边界、声学线索或需要精修的位置">${escapeHtml(stored.note || "")}</textarea>
      </div>
    </section>
  `;
}

function reviewIntervalRow(label, value, className, duration, candidateId = "") {
  if (!value) return "";
  return `
    <article class="interval-row interval-${className}">
      <div><span>${escapeHtml(label)}</span><strong>${formatInterval(value)}</strong>${candidateId ? `<small>${escapeHtml(candidateId)}</small>` : ""}</div>
      <div class="interval-actions">
        ${intervalButton(`播放${label}`, value.start, value.end)}
        ${contextButton("上下文 ±2s", value, duration)}
      </div>
    </article>
  `;
}

function intervalButton(label, start, end, variant = "") {
  if (!(Number(start) < Number(end))) return "";
  return `<button class="interval-play ${variant}" type="button" data-label="${escapeHtml(label)}" data-start="${start}" data-end="${end}">▶ ${escapeHtml(label)}</button>`;
}

function contextButton(label, value, duration) {
  return intervalButton(label, Math.max(0, value.start - 2), Math.min(duration, value.end + 2));
}

function reviewChoiceButton(choice, selectedChoice) {
  return `<button class="review-choice${choice === selectedChoice ? " selected" : ""}" type="button" data-choice="${choice}">${escapeHtml(labels.reviewChoice[choice])}</button>`;
}

function bindAudioInteractions(container) {
  container.querySelectorAll(".demo-card").forEach((card) => {
    const audio = card.querySelector("audio");
    const waveform = card.querySelector(".waveform");
    const playhead = card.querySelector(".playhead");
    const bars = [...card.querySelectorAll(".waveform-bar")];
    const intervalButtons = [...card.querySelectorAll(".interval-play")];
    let intervalPlaybackEnd = null;
    let activeButton = null;

    const seekFromPointer = (clientX) => {
      const bounds = waveform.getBoundingClientRect();
      const ratio = clamp((clientX - bounds.left) / bounds.width, 0, 1);
      if (Number.isFinite(audio.duration)) audio.currentTime = ratio * audio.duration;
    };

    waveform.addEventListener("click", (event) => seekFromPointer(event.clientX));
    waveform.addEventListener("keydown", (event) => {
      if (!Number.isFinite(audio.duration)) return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        const delta = event.key === "ArrowRight" ? 1 : -1;
        audio.currentTime = clamp(audio.currentTime + delta, 0, audio.duration);
      }
    });

    intervalButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        stopAllAudio(audio);
        resetIntervalButton(activeButton);
        const start = Number(button.dataset.start);
        const end = Number(button.dataset.end);
        intervalPlaybackEnd = end;
        activeButton = button;
        audio.currentTime = start;
        button.classList.add("is-playing");
        button.textContent = "■ 正在播放";
        try {
          await audio.play();
        } catch (error) {
          intervalPlaybackEnd = null;
          resetIntervalButton(activeButton);
          activeButton = null;
          console.error(error);
        }
      });
    });

    audio.addEventListener("play", () => stopAllAudio(audio));
    audio.addEventListener("pause", () => {
      if (intervalPlaybackEnd !== null) {
        intervalPlaybackEnd = null;
        resetIntervalButton(activeButton);
        activeButton = null;
      }
    });
    audio.addEventListener("ended", () => {
      intervalPlaybackEnd = null;
      resetIntervalButton(activeButton);
      activeButton = null;
    });
    audio.addEventListener("timeupdate", () => {
      const ratio = audio.duration ? clamp(audio.currentTime / audio.duration, 0, 1) : 0;
      playhead.style.left = `${ratio * 100}%`;
      waveform.setAttribute("aria-valuenow", String(round(audio.currentTime)));
      bars.forEach((bar, index) => {
        bar.classList.toggle("played", (index + 1) / bars.length <= ratio);
      });
      if (intervalPlaybackEnd !== null && audio.currentTime >= intervalPlaybackEnd) {
        audio.pause();
        audio.currentTime = intervalPlaybackEnd;
        intervalPlaybackEnd = null;
        resetIntervalButton(activeButton);
        activeButton = null;
      }
    });
  });
}

function bindReviewInteractions(container) {
  container.querySelectorAll(".human-review").forEach((panel) => {
    const sampleId = panel.dataset.reviewId;
    panel.querySelectorAll(".review-choice").forEach((button) => {
      button.addEventListener("click", () => {
        const current = state.reviewDecisions[sampleId] || {};
        const choice = current.choice === button.dataset.choice ? "" : button.dataset.choice;
        saveReviewDecision(sampleId, { ...current, choice });
        panel.querySelectorAll(".review-choice").forEach((candidate) => {
          candidate.classList.toggle("selected", candidate.dataset.choice === choice);
        });
      });
    });
    panel.querySelector(".review-note")?.addEventListener("change", (event) => {
      const current = state.reviewDecisions[sampleId] || {};
      saveReviewDecision(sampleId, { ...current, note: event.target.value.trim() });
    });
  });
}

function saveReviewDecision(sampleId, value) {
  const normalized = {
    choice: value.choice || "",
    note: value.note || "",
    updated_at: new Date().toISOString(),
  };
  if (!normalized.choice && !normalized.note) delete state.reviewDecisions[sampleId];
  else state.reviewDecisions[sampleId] = normalized;
  persistReviewDecisions();
  updateReviewProgress();
}

function readStoredReviewDecisions() {
  try {
    return JSON.parse(window.localStorage.getItem(REVIEW_STORAGE_KEY) || "{}") || {};
  } catch (error) {
    console.warn("Failed to read local review decisions", error);
    return {};
  }
}

function persistReviewDecisions() {
  try {
    window.localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(state.reviewDecisions));
  } catch (error) {
    console.warn("Failed to persist local review decisions", error);
  }
}

function updateReviewProgress() {
  const reviewed = Object.values(state.reviewDecisions).filter((value) => value.choice).length;
  setText("#review-progress", `${reviewed} / ${state.demos.length || 20}`);
}

function exportReviewDecisions() {
  const rows = state.demos.flatMap((demo) => {
    const decision = state.reviewDecisions[demo.id];
    if (!decision?.choice && !decision?.note) return [];
    return [{
      id: demo.id,
      choice: decision.choice,
      choice_label: labels.reviewChoice[decision.choice] || decision.choice,
      note: decision.note,
      review_status: demo.review?.status,
      lat: demo.review?.lat,
      current_gold: demo.review?.current_gold,
      model_recommended: demo.review?.model_recommended,
      updated_at: decision.updated_at,
    }];
  });
  if (!rows.length) {
    window.alert("还没有可导出的审核记录。");
    return;
  }
  const content = `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`;
  const blob = new Blob([content], { type: "application/x-ndjson;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `lat_tag_phase0_human_review_${new Date().toISOString().slice(0, 10)}.jsonl`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

function stopAllAudio(except = null) {
  document.querySelectorAll("audio").forEach((audio) => {
    if (audio !== except && !audio.paused) audio.pause();
  });
}

function resetIntervalButton(button) {
  if (!button) return;
  button.classList.remove("is-playing");
  button.textContent = `▶ ${button.dataset.label}`;
}

function setupNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector("#nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const open = !links.classList.contains("open");
    links.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

function sameInterval(left, right, tolerance = 0.001) {
  if (!left || !right) return false;
  return Math.abs(left.start - right.start) <= tolerance && Math.abs(left.end - right.end) <= tolerance;
}

function formatInterval(value) {
  return `${formatTime(value.start)} – ${formatTime(value.end)}`;
}

function formatScore(value) {
  return Number.isFinite(Number(value)) ? Number(value).toFixed(2) : "—";
}

function formatTime(seconds) {
  const safeSeconds = Number.isFinite(Number(seconds)) ? Math.max(0, Number(seconds)) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds - minutes * 60;
  return `${String(minutes).padStart(2, "0")}:${remainder.toFixed(2).padStart(5, "0")}`;
}

function formatDuration(seconds) {
  const value = Number(seconds);
  if (!Number.isFinite(value)) return "—";
  return `${value.toFixed(value % 1 === 0 ? 0 : 1)}s`;
}

function formatNumber(value) {
  return Number.isFinite(Number(value)) ? Number(value).toLocaleString("en-US") : value;
}

function round(value) {
  return Math.round(Number(value) * 1000) / 1000;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  }[character]));
}
