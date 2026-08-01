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
  acousticStatus: {
    acoustically_consistent: "声学一致",
    boundary_shift_candidate: "边界移动候选",
    excluded_non_acoustic: "非声学排除",
    needs_human_review: "待人工复核",
    new_acoustic_candidate: "新声学候选",
    target_not_verified: "目标未验证",
  },
  eligibility: {
    eligible: "声学目标",
    excluded_lexical: "排除：依赖词义",
    excluded_narrative: "排除：叙事推断",
    excluded_not_audible: "排除：不可直接听见",
    excluded_ambiguous: "排除：声学定义不明确",
  },
  soundFamily: {
    music_instrument: "音乐 / 乐器",
    nonverbal_vocal: "非语言人声",
    environmental_mechanical: "环境 / 机械",
    transient_signal: "瞬态 / 信号",
    ambience_soundscape: "环境声景",
    composite_acoustic: "复合声学事件",
    none: "非声学",
  },
  temporalForm: {
    transient: "瞬态",
    continuous: "持续",
    intermittent: "间歇",
    transition: "转折",
    composite: "复合",
    none: "无",
  },
  evidencePolicy: {
    continuous_window_gemini_clap: "固定窗 + Gemini 粗边界 + CLAP 覆盖",
    intermittent_window_clap: "固定窗 + CLAP 局部 occurrence",
    short_event_window_gemini_low_level: "固定窗 + Gemini 粗边界 + 低层声学事件",
  },
  boundarySource: {
    clap_extent_supported_by_gemini_window: "CLAP 持续区间",
    clap_occurrence_supported_by_gemini_window: "CLAP 局部 occurrence",
    gemini_full_audio_unconfirmed_by_clap_extent: "Gemini 全音频粗边界",
    gemini_full_audio_unconfirmed_by_clap_occurrence: "Gemini 全音频粗边界",
    gemini_boundary_supported_by_fixed_window: "固定窗支持的 Gemini 边界",
    low_level_change_near_fixed_window_onset: "固定窗起点附近声学变化",
    low_level_event_inside_fixed_window: "固定窗内低层声学事件",
    fixed_window_only: "Gemini 固定窗",
    gemini_full_audio_only: "Gemini 全音频粗边界",
  },
  reviewChoice: {
    keep_current: "保留当前 gold",
    accept_candidate: "采用声学候选",
    exclude_acoustic: "确认非声学排除",
    needs_manual: "需要人工精修",
  },
};

const reviewPriority = {
  needs_human_review: 0,
  boundary_shift_candidate: 1,
  new_acoustic_candidate: 2,
  acoustically_consistent: 3,
  excluded_non_acoustic: 4,
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
    renderMethodology(data);
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

function renderMethodology(data) {
  const pilot = data.acoustic_pilot || {};
  const eligibility = pilot.eligibility || {};
  const temporal = pilot.temporal_forms || {};
  const eligible = Number(eligibility.eligible || 0);
  const excluded = Math.max(0, Number(pilot.records || 0) - eligible);
  setText('[data-acoustic-stat="records"]', formatNumber(pilot.records));
  setText('[data-acoustic-stat="eligible"]', formatNumber(eligible));
  setText('[data-acoustic-stat="excluded"]', formatNumber(excluded));
  setText(
    '[data-temporal-total="sustained"]',
    formatNumber(Number(temporal.continuous || 0) + Number(temporal.intermittent || 0)),
  );
  setText(
    '[data-temporal-total="short"]',
    formatNumber(
      Number(temporal.transient || 0)
      + Number(temporal.transition || 0)
      + Number(temporal.composite || 0),
    ),
  );

  const outcomes = pilot.decision_status || {};
  const outcomeOrder = [
    "acoustically_consistent",
    "boundary_shift_candidate",
    "new_acoustic_candidate",
    "needs_human_review",
    "excluded_non_acoustic",
  ];
  const maximum = Math.max(1, ...Object.values(outcomes).map(Number));
  const outcomeContainer = document.querySelector("#outcome-bars");
  if (outcomeContainer) {
    outcomeContainer.innerHTML = outcomeOrder.map((status) => {
      const count = Number(outcomes[status] || 0);
      const width = `${Math.max(2, (count / maximum) * 100)}%`;
      return `
        <div class="outcome-row status-${escapeHtml(status)}">
          <span>${escapeHtml(labels.acousticStatus[status] || status)}</span>
          <i><b style="width:${width}"></b></i>
          <strong>${count}</strong>
        </div>
      `;
    }).join("");
  }

  const example = state.demos.find((demo) => demo.id === data.methodology_example_id);
  const container = document.querySelector("#method-example");
  if (!container || !example?.acoustic) return;
  const acoustic = example.acoustic;
  const lowLevel = acoustic.low_level_boundary_anchor;
  container.innerHTML = `
    <div class="method-example-head">
      <div>
        <span>REAL TRACE · ${escapeHtml(example.id)}</span>
        <strong>一次错误直报如何被固定窗与声学变化纠正</strong>
      </div>
      <button type="button" data-open-acoustic-review="${escapeHtml(example.id)}">打开该样本审核</button>
    </div>
    <div class="query-transform">
      <div><span>LAT ORIGINAL QUERY</span><p>${escapeHtml(example.query)}</p></div>
      <i aria-hidden="true">→</i>
      <div><span>ACOUSTIC QUERY</span><p>${escapeHtml(acoustic.acoustic_query)}</p></div>
    </div>
    <div class="method-timeline">
      <div class="method-track">
        ${methodInterval(acoustic.current_gold, example.duration, "method-current", "当前 gold")}
        ${methodInterval(acoustic.proposed, example.duration, "method-proposed", "声学候选")}
        ${methodInterval(acoustic.window_candidate, example.duration, "method-window", "固定窗")}
        ${methodInterval(acoustic.clap_candidate, example.duration, "method-clap", "CLAP 诊断")}
        ${lowLevel ? `<span class="method-onset" style="left:${clamp(Number(lowLevel.time) / example.duration, 0, 1) * 100}%" title="低层声学变化 ${formatTime(lowLevel.time)}"></span>` : ""}
      </div>
      <div class="method-track-axis"><span>00:00</span><span>00:30</span><span>01:00</span></div>
      <div class="method-track-legend">
        <span><i class="method-window"></i>固定窗 ${formatInterval(acoustic.window_candidate)}</span>
        <span><i class="method-clap"></i>CLAP ${formatInterval(acoustic.clap_candidate)}</span>
        <span><i class="method-onset-key"></i>声学变化 ${lowLevel ? formatTime(lowLevel.time) : "—"}</span>
        <span><i class="method-proposed"></i>候选 ${formatInterval(acoustic.proposed)}</span>
      </div>
    </div>
  `;
  container.querySelector("[data-open-acoustic-review]")?.addEventListener("click", () => {
    setReviewMode(true);
    const card = document.querySelector(`[data-demo-id="${example.id}"]`);
    card?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function methodInterval(value, duration, className, title) {
  if (!value) return "";
  const left = clamp(value.start / duration, 0, 1) * 100;
  const width = Math.max(0.5, clamp((value.end - value.start) / duration, 0, 1) * 100);
  return `<span class="method-interval ${className}" title="${escapeHtml(title)} ${formatInterval(value)}" style="left:${left}%;width:${width}%"></span>`;
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
  toggle.textContent = state.reviewMode ? "退出声学审核" : "进入声学审核";
}

function renderDemos() {
  const container = document.querySelector("#demo-container");
  if (!container) return;
  const demos = state.demos
    .filter((demo) => Object.entries(state.filters).every(([key, value]) => {
      if (value === "all") return true;
      if (key === "review_status") return !state.reviewMode || demo.acoustic?.status === value;
      return demo[key] === value;
    }))
    .sort((left, right) => {
      if (!state.reviewMode) return 0;
      return (reviewPriority[left.acoustic?.status] ?? 9) - (reviewPriority[right.acoustic?.status] ?? 9);
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
  const acoustic = demo.acoustic || {};
  const status = acoustic.status;
  const acousticTags = state.reviewMode
    ? `
      <span class="tag tag-acoustic">${escapeHtml(labels.soundFamily[acoustic.sound_family] || acoustic.sound_family)}</span>
      <span class="tag">${escapeHtml(labels.temporalForm[acoustic.temporal_form] || acoustic.temporal_form)}</span>
    `
    : "";
  const output = JSON.stringify({ start: round(demo.start), end: round(demo.end) });
  return `
    <article class="demo-card${demo.featured ? " featured" : ""}${state.reviewMode ? " audit-card" : ""}" data-demo-id="${escapeHtml(demo.id)}">
      <header class="demo-card-head">
        <div class="tag-row">
          <span class="tag tag-event">${escapeHtml(eventType)}</span>
          <span class="tag">${escapeHtml(language)}</span>
          <span class="tag${demo.difficulty === "hard" ? " tag-hard" : ""}">${escapeHtml(difficulty)}</span>
          <span class="tag">${formatDuration(demo.target_duration)} target</span>
          ${acousticTags}
          ${timestampReviewed ? '<span class="tag flag">人工复核时间戳</span>' : ""}
          ${state.reviewMode && status ? `<span class="tag review-status status-${escapeHtml(status)}">${escapeHtml(labels.acousticStatus[status] || status)}</span>` : ""}
        </div>
        <h3>${escapeHtml(demo.title)}</h3>
        <p class="demo-note">${escapeHtml(demo.note)}</p>
      </header>

      <div class="query-box">
        <span class="micro-label">${state.reviewMode ? "LAT SOURCE QUERY" : "NATURAL-LANGUAGE EVENT QUERY"}</span>
        <p>${escapeHtml(demo.query)}</p>
        ${state.reviewMode ? renderAcousticQuery(acoustic) : ""}
      </div>

      <div class="audio-workbench">
        <div class="audio-toolbar">
          <div><strong>MIXED AUDIO</strong><small>${formatDuration(demo.duration)}</small></div>
          ${intervalButton("只播当前 gold", demo.start, demo.end, "primary")}
        </div>
        ${renderWaveform(demo)}
        ${renderAxis(demo.duration, demo.start, demo.end)}
        <audio class="native-audio" controls preload="none" src="${escapeHtml(demo.audio.path)}"></audio>
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

function renderAcousticQuery(acoustic) {
  if (acoustic.eligibility !== "eligible") {
    return `
      <div class="acoustic-query excluded-query">
        <span>${escapeHtml(labels.eligibility[acoustic.eligibility] || acoustic.eligibility)}</span>
        <p>${escapeHtml(acoustic.classification_reason || "该目标不能脱离词义或叙事独立定位。")}</p>
      </div>
    `;
  }
  return `
    <div class="acoustic-query">
      <span>ACOUSTIC-ONLY QUERY</span>
      <p>${escapeHtml(acoustic.acoustic_query)}</p>
    </div>
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
  const acoustic = demo.acoustic || {};
  const windows = [];
  if (acoustic.lat && !sameInterval(acoustic.lat, acoustic.current_gold)) {
    windows.push(intervalWindow(acoustic.lat, duration, "lat-window", "LAT 原始"));
  }
  if (acoustic.proposed && !sameInterval(acoustic.proposed, acoustic.current_gold)) {
    windows.push(intervalWindow(acoustic.proposed, duration, "model-window", "声学候选"));
  }
  if (acoustic.window_candidate) {
    windows.push(intervalWindow(acoustic.window_candidate, duration, "fixed-window", "Gemini 固定窗"));
  }
  if (acoustic.clap_candidate) {
    windows.push(intervalWindow(acoustic.clap_candidate, duration, "clap-window", "CLAP 诊断"));
  }
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
  const acoustic = demo.acoustic;
  if (!acoustic) return '<section class="review-panel"><p>该样例暂无声学 Pilot 数据。</p></section>';
  const stored = state.reviewDecisions[demo.id] || {};
  const eligible = acoustic.eligibility === "eligible";
  const policy = labels.evidencePolicy[acoustic.evidence_policy] || acoustic.evidence_policy || "未进入证据融合";
  const boundarySource = labels.boundarySource[acoustic.boundary_source] || acoustic.boundary_source || "无候选边界";
  const lowLevelEvidence = acoustic.low_level_acoustic_evidence || [];
  const evidenceRows = [
    evidenceCandidateRow("Gemini 全音频粗边界", acoustic.gemini_candidate, demo.duration),
    evidenceCandidateRow("Gemini 固定窗", acoustic.window_candidate, demo.duration),
    evidenceCandidateRow("CLAP 诊断", acoustic.clap_candidate, demo.duration),
  ].filter(Boolean).join("");
  const decisionChoices = eligible
    ? [
      reviewChoiceButton("keep_current", stored.choice),
      reviewChoiceButton("accept_candidate", stored.choice),
      reviewChoiceButton("needs_manual", stored.choice),
    ].join("")
    : [
      reviewChoiceButton("exclude_acoustic", stored.choice),
      reviewChoiceButton("needs_manual", stored.choice),
    ].join("");

  return `
    <section class="review-panel">
      <div class="review-panel-head">
        <div>
          <span class="micro-label">ACOUSTIC GROUNDING PILOT · GEMINI 3 FLASH + CLAP</span>
          <h4>${escapeHtml(labels.acousticStatus[acoustic.status] || acoustic.status)}</h4>
        </div>
        <span>${escapeHtml(acoustic.reason || "候选仅供回检，不会自动写入 gold。")}</span>
      </div>

      <div class="sample-manufacture-flow">
        ${sampleFlowStep(
          "01 · ACOUSTIC GATE",
          labels.eligibility[acoustic.eligibility] || acoustic.eligibility,
          eligible ? "pass" : "stop",
        )}
        ${sampleFlowStep(
          "02 · EVENT SPEC",
          eligible
            ? `${labels.soundFamily[acoustic.sound_family] || acoustic.sound_family} · ${labels.temporalForm[acoustic.temporal_form] || acoustic.temporal_form}`
            : "不生成声学 query",
          eligible ? "pass" : "muted",
        )}
        ${sampleFlowStep(
          "03 · FIXED WINDOW",
          acoustic.window_candidate ? formatInterval(acoustic.window_candidate) : "未进入固定窗回检",
          acoustic.window_candidate ? "pass" : "muted",
        )}
        ${sampleFlowStep(
          "04 · BOUNDARY",
          boundarySource,
          acoustic.proposed ? "decision" : "muted",
        )}
      </div>

      ${eligible ? `
        <div class="acoustic-policy">
          <span>EVIDENCE POLICY</span>
          <strong>${escapeHtml(policy)}</strong>
          <small>Gemini 直报时间只作辅助；固定窗与形态匹配的声学证据必须参与。</small>
        </div>

        <div class="interval-comparison acoustic-intervals">
          ${reviewIntervalRow("LAT 原始", acoustic.lat, "lat", demo.duration)}
          ${reviewIntervalRow("当前 gold", acoustic.current_gold, "current", demo.duration)}
          ${reviewIntervalRow("声学候选", acoustic.proposed, "model", demo.duration, acoustic.boundary_source)}
        </div>

        ${acoustic.proposed ? `
          <div class="boundary-listen">
            <span>声学候选边界听测</span>
            <div class="interval-actions">
              ${intervalButton("PRE 2s", Math.max(0, acoustic.proposed.start - 2), acoustic.proposed.start)}
              ${intervalButton("TARGET", acoustic.proposed.start, acoustic.proposed.end)}
              ${intervalButton("POST 2s", acoustic.proposed.end, Math.min(demo.duration, acoustic.proposed.end + 2))}
            </div>
          </div>
        ` : ""}

        <details class="review-details">
          <summary>查看固定窗、独立证据与支持分数</summary>
          <div class="evidence-candidate-list">${evidenceRows}</div>
          <div class="support-matrix">
            ${supportMetric("Gemini ↔ fixed window", acoustic.support?.gemini_window)}
            ${supportMetric("CLAP ↔ fixed window", acoustic.support?.clap_window)}
            ${supportMetric("CLAP extent ratio", acoustic.support?.clap_extent_ratio)}
            ${supportMetric("Gemini ↔ CLAP IoU", acoustic.support?.model_iou)}
          </div>
          <div class="model-notes">
            ${acoustic.window_reason ? `<p><strong>固定窗回检：</strong>${escapeHtml(acoustic.window_reason)}</p>` : ""}
            ${acoustic.gemini_reason ? `<p><strong>Gemini 粗定位：</strong>${escapeHtml(acoustic.gemini_reason)}</p>` : ""}
            ${lowLevelEvidence.length ? `
              <div>
                <strong>邻近低层事件：</strong>
                <ul>${lowLevelEvidence.map((event) => `
                  <li>${escapeHtml(event.type)} · ${formatTime(event.time)} · score ${formatScore(event.score)}</li>
                `).join("")}</ul>
              </div>
            ` : ""}
          </div>
        </details>
      ` : `
        <div class="excluded-acoustic-detail">
          <span>EXCLUSION REASON</span>
          <p>${escapeHtml(acoustic.classification_reason || acoustic.reason)}</p>
        </div>
      `}

      <div class="human-review" data-review-id="${escapeHtml(demo.id)}">
        <div class="human-review-head">
          <div><span class="micro-label">HUMAN LISTENING DECISION</span><strong>你的听测结论</strong></div>
          <small>仅保存在当前浏览器，可导出 JSONL</small>
        </div>
        <div class="review-choice-group">
          ${decisionChoices}
        </div>
        <textarea class="review-note" rows="2" placeholder="可选：记录边界、声学线索或需要精修的位置">${escapeHtml(stored.note || "")}</textarea>
      </div>
    </section>
  `;
}

function sampleFlowStep(label, value, stateName) {
  return `
    <div class="sample-flow-step flow-${escapeHtml(stateName)}">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function evidenceCandidateRow(label, value, duration) {
  if (!value) return "";
  return `
    <article class="evidence-candidate-row">
      <div><span>${escapeHtml(label)}</span><strong>${formatInterval(value)}</strong></div>
      <div class="interval-actions">
        ${intervalButton("播放", value.start, value.end)}
        ${contextButton("上下文 ±2s", value, duration)}
      </div>
    </article>
  `;
}

function supportMetric(label, value) {
  const score = Number(value);
  const normalized = Number.isFinite(score) ? clamp(score, 0, 1) : 0;
  return `
    <div class="support-metric">
      <span>${escapeHtml(label)}</span>
      <i><b style="width:${normalized * 100}%"></b></i>
      <strong>${formatScore(value)}</strong>
    </div>
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
        button.classList.add("is-playing");
        button.textContent = "■ 正在加载";
        try {
          await ensureAudioMetadata(audio);
          await seekAudio(audio, start);
          await audio.play();
          button.textContent = "■ 正在播放";
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

function seekAudio(audio, targetTime) {
  return new Promise((resolve, reject) => {
    let timeoutId;
    const cleanup = () => {
      window.clearTimeout(timeoutId);
      audio.removeEventListener("seeked", handleSeeked);
      audio.removeEventListener("error", handleError);
    };
    const handleSeeked = () => {
      cleanup();
      resolve();
    };
    const handleError = () => {
      cleanup();
      reject(audio.error || new Error("Audio seek failed"));
    };
    audio.addEventListener("seeked", handleSeeked, { once: true });
    audio.addEventListener("error", handleError, { once: true });
    timeoutId = window.setTimeout(() => {
      cleanup();
      reject(new Error("Audio seek timed out"));
    }, 10000);
    audio.currentTime = targetTime;
    if (!audio.seeking && Math.abs(audio.currentTime - targetTime) < 0.05) {
      cleanup();
      resolve();
    }
  });
}

function ensureAudioMetadata(audio) {
  if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const handleLoaded = () => {
      audio.removeEventListener("error", handleError);
      resolve();
    };
    const handleError = () => {
      audio.removeEventListener("loadedmetadata", handleLoaded);
      reject(audio.error || new Error("Audio metadata failed to load"));
    };
    audio.addEventListener("loadedmetadata", handleLoaded, { once: true });
    audio.addEventListener("error", handleError, { once: true });
    audio.load();
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
      acoustic_status: demo.acoustic?.status,
      acoustic_eligibility: demo.acoustic?.eligibility,
      acoustic_query: demo.acoustic?.acoustic_query,
      evidence_policy: demo.acoustic?.evidence_policy,
      boundary_source: demo.acoustic?.boundary_source,
      lat: demo.acoustic?.lat,
      current_gold: demo.acoustic?.current_gold,
      acoustic_candidate: demo.acoustic?.proposed,
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
  if (!value) return "—";
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
