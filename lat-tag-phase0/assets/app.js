const state = {
  demos: [],
  filters: {
    language: "all",
    event_type: "all",
    difficulty: "all",
  },
};

const labels = {
  language: { zh: "中文", en: "English" },
  eventType: { speech: "Speech", mixed: "Mixed", non_speech: "Non-speech" },
  difficulty: { easy: "Easy", medium: "Medium", hard: "Hard" },
};

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupFilters();
  loadBenchmark();
});

async function loadBenchmark() {
  const container = document.querySelector("#demo-container");
  try {
    const response = await fetch("./assets/data/benchmark.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    state.demos = data.demos;
    hydrateSummary(data);
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
  if (element && value !== undefined) {
    element.textContent = value;
  }
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

function renderDemos() {
  const container = document.querySelector("#demo-container");
  const demos = state.demos.filter((demo) => {
    return Object.entries(state.filters).every(([key, value]) => value === "all" || demo[key] === value);
  });

  document.querySelector("#demo-count").textContent = demos.length;
  stopAllAudio();
  if (!demos.length) {
    container.innerHTML = '<div class="empty-state"><strong>没有符合当前筛选条件的样例</strong><p>请调整语言、事件类型或难度。</p></div>';
    return;
  }

  container.innerHTML = demos.map(renderDemoCard).join("");
  bindAudioInteractions(container);
}

function renderDemoCard(demo) {
  const language = labels.language[demo.language] || demo.language;
  const eventType = labels.eventType[demo.event_type] || demo.event_type;
  const difficulty = labels.difficulty[demo.difficulty] || demo.difficulty;
  const occurrenceFlag = demo.query_flags?.has_occurrence_constraint;
  const output = JSON.stringify({ start: round(demo.start), end: round(demo.end) });
  return `
    <article class="demo-card${demo.featured ? " featured" : ""}" data-demo-id="${escapeHtml(demo.id)}">
      <header class="demo-card-head">
        <div class="tag-row">
          <span class="tag tag-event">${escapeHtml(eventType)}</span>
          <span class="tag">${escapeHtml(language)}</span>
          <span class="tag${demo.difficulty === "hard" ? " tag-hard" : ""}">${escapeHtml(difficulty)}</span>
          <span class="tag">${formatDuration(demo.target_duration)} target</span>
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
          <button class="target-play" type="button" data-start="${demo.start}" data-end="${demo.end}">▶ 只播目标</button>
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

      <footer class="card-footer">
        <span>${escapeHtml(demo.id)} · ${escapeHtml(demo.source.annotation_file)}:${demo.source.annotation_line}</span>
        <span class="${occurrenceFlag ? "flag" : ""}">${occurrenceFlag ? "occurrence constraint" : "LAT timestamp"}</span>
      </footer>
    </article>
  `;
}

function renderWaveform(demo) {
  const duration = demo.duration || demo.audio.duration;
  const startRatio = clamp(demo.start / duration, 0, 1);
  const endRatio = clamp(demo.end / duration, 0, 1);
  const bars = demo.audio.waveform.map((peak, index) => {
    const midpoint = (index + 0.5) / demo.audio.waveform.length;
    const inTarget = midpoint >= startRatio && midpoint <= endRatio;
    return `<i class="waveform-bar${inTarget ? " in-target" : ""}" style="height:${Math.max(4, peak * 100)}%"></i>`;
  }).join("");

  return `
    <div class="waveform" role="slider" tabindex="0" aria-label="音频波形，点击跳转" aria-valuemin="0" aria-valuemax="${duration}" aria-valuenow="0">
      <span class="target-window" style="left:${startRatio * 100}%;width:${Math.max(0.35, (endRatio - startRatio) * 100)}%"></span>
      ${bars}
      <span class="playhead"></span>
    </div>
  `;
}

function renderAxis(duration, start, end) {
  const markers = [
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

function bindAudioInteractions(container) {
  container.querySelectorAll(".demo-card").forEach((card) => {
    const audio = card.querySelector("audio");
    const waveform = card.querySelector(".waveform");
    const playhead = card.querySelector(".playhead");
    const bars = [...card.querySelectorAll(".waveform-bar")];
    const targetButton = card.querySelector(".target-play");
    let targetPlaybackEnd = null;

    const seekFromPointer = (clientX) => {
      const bounds = waveform.getBoundingClientRect();
      const ratio = clamp((clientX - bounds.left) / bounds.width, 0, 1);
      if (Number.isFinite(audio.duration)) {
        audio.currentTime = ratio * audio.duration;
      }
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

    targetButton.addEventListener("click", async () => {
      stopAllAudio(audio);
      const start = Number(targetButton.dataset.start);
      const end = Number(targetButton.dataset.end);
      targetPlaybackEnd = end;
      audio.currentTime = start;
      targetButton.classList.add("is-playing");
      targetButton.textContent = "■ 正在播放目标";
      try {
        await audio.play();
      } catch (error) {
        targetPlaybackEnd = null;
        resetTargetButton(targetButton);
        console.error(error);
      }
    });

    audio.addEventListener("play", () => stopAllAudio(audio));
    audio.addEventListener("pause", () => {
      if (targetPlaybackEnd !== null) {
        targetPlaybackEnd = null;
        resetTargetButton(targetButton);
      }
    });
    audio.addEventListener("ended", () => {
      targetPlaybackEnd = null;
      resetTargetButton(targetButton);
    });
    audio.addEventListener("timeupdate", () => {
      const ratio = audio.duration ? clamp(audio.currentTime / audio.duration, 0, 1) : 0;
      playhead.style.left = `${ratio * 100}%`;
      waveform.setAttribute("aria-valuenow", String(round(audio.currentTime)));
      bars.forEach((bar, index) => {
        bar.classList.toggle("played", (index + 1) / bars.length <= ratio);
      });
      if (targetPlaybackEnd !== null && audio.currentTime >= targetPlaybackEnd) {
        audio.pause();
        audio.currentTime = targetPlaybackEnd;
        targetPlaybackEnd = null;
        resetTargetButton(targetButton);
      }
    });
  });
}

function stopAllAudio(except = null) {
  document.querySelectorAll("audio").forEach((audio) => {
    if (audio !== except && !audio.paused) {
      audio.pause();
    }
  });
}

function resetTargetButton(button) {
  button.classList.remove("is-playing");
  button.textContent = "▶ 只播目标";
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
