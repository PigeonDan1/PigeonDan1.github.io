const state = {
  data: null,
  filters: {
    phase1: { view: 'featured', track: 'all', dataset: 'all' },
    phase2: { view: 'featured', track: 'all', contract: 'all' },
  },
};

const datasetLabels = {
  ami: 'AMI',
  alimeeting: 'AliMeeting',
  aishell4: 'AISHELL-4',
  magicdata: 'MagicData',
  aishell3: 'AISHELL-3',
  emilia_zh: 'Emilia-ZH',
  emilia_en: 'Emilia-EN',
};

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupFilters();
  loadBenchmark();
});

async function loadBenchmark() {
  try {
    const response = await fetch('assets/data/benchmark.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.data = await response.json();
    hydrateSummary(state.data);
    renderDemos();
  } catch (error) {
    ['phase1', 'phase2'].forEach((phase) => {
      const container = document.getElementById(`${phase}-demo-container`);
      if (!container) return;
      container.innerHTML = `
        <div class="empty-state">
          <strong>Demo bundle unavailable</strong>
          <span>${escapeHtml(error.message)}</span>
        </div>`;
    });
  }
}

function hydrateSummary(data) {
  Object.entries(data.stats || {}).forEach(([key, value]) => {
    document.querySelectorAll(`[data-stat="${key}"]`).forEach((element) => {
      element.textContent = Number(value).toLocaleString('en-US');
    });
  });

  Object.entries(data.clue_distribution || {}).forEach(([key, value]) => {
    document.querySelectorAll(`[data-clue-count="${key}"]`).forEach((element) => {
      element.textContent = Number(value).toLocaleString('en-US');
    });
  });

  const phase1Demos = data.demos.filter((demo) => phaseForDemo(demo) === 'phase1');
  const phase2Demos = data.demos.filter((demo) => phaseForDemo(demo) === 'phase2');
  setText('[data-phase-count="phase1"]', phase1Demos.length);
  setText('[data-phase-count="phase2"]', phase2Demos.length);
  setText('#phase1-demo-total', phase1Demos.length);
  setText('#phase2-demo-total', phase2Demos.length);
  renderDatasetChart(data.dataset_distribution || {});
}

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = String(value);
  });
}

function renderDatasetChart(distribution) {
  const chart = document.getElementById('dataset-chart');
  if (!chart) return;

  const rows = Object.entries(distribution).map(([dataset, counts]) => ({
    dataset,
    ...counts,
    total: counts.sa_asr + counts.target_asr,
  }));
  const maxTotal = Math.max(...rows.map((row) => row.total), 1);

  chart.innerHTML = rows.map((row) => `
    <div class="dataset-row">
      <div class="dataset-row-header">
        <strong>${escapeHtml(datasetLabels[row.dataset] || row.dataset)}</strong>
        <span>${row.total.toLocaleString('en-US')} questions</span>
      </div>
      <div class="dataset-bar" title="${row.sa_asr} all-speaker and ${row.target_asr} target-speaker questions">
        <i class="bar-sa" style="width:${(row.sa_asr / maxTotal) * 100}%"></i>
        <i class="bar-target" style="width:${(row.target_asr / maxTotal) * 100}%"></i>
      </div>
    </div>
  `).join('') + `
    <div class="chart-legend">
      <span><i class="bar-sa"></i>All-Speaker ASR</span>
      <span><i class="bar-target"></i>Target-Speaker ASR</span>
    </div>`;
}

function setupFilters() {
  document.querySelectorAll('[data-filter-group]').forEach((group) => {
    const phase = group.dataset.phase;
    const key = group.dataset.filterGroup;
    group.addEventListener('click', (event) => {
      const button = event.target.closest('[data-filter]');
      if (!button || !phase || !state.filters[phase]) return;
      group.querySelectorAll('[data-filter]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      state.filters[phase][key] = button.dataset.filter;
      renderDemos();
    });
  });

  document.querySelectorAll('[data-phase-filter]').forEach((select) => {
    select.addEventListener('change', () => {
      const phase = select.dataset.phase;
      const key = select.dataset.phaseFilter;
      if (!phase || !key || !state.filters[phase]) return;
      state.filters[phase][key] = select.value;
      renderDemos();
    });
  });
}

function renderDemos() {
  if (!state.data) return;
  renderPhaseDemos('phase1');
  renderPhaseDemos('phase2');
}

function phaseForDemo(demo) {
  if (String(demo.phase).startsWith('1')) return 'phase1';
  if (String(demo.phase) === '2') return 'phase2';
  return null;
}

function renderPhaseDemos(phase) {
  const container = document.getElementById(`${phase}-demo-container`);
  if (!container) return;
  const filters = state.filters[phase];
  const phaseDemos = state.data.demos.filter((demo) => phaseForDemo(demo) === phase);
  const demos = phaseDemos.filter((demo) => {
    if (filters.view === 'featured' && !demo.featured) return false;
    if (phase === 'phase1') {
      const trackMatch = filters.track === 'all'
        || demo.task === filters.track
        || (filters.track === 'speaker_timbre' && demo.sub_type === 'speaker_timbre');
      const datasetMatch = filters.dataset === 'all' || demo.dataset === filters.dataset;
      return trackMatch && datasetMatch;
    }
    const contract = demo.output_contract || 'timeline_preserved';
    const trackMatch = filters.track === 'all' || demo.task === filters.track;
    const contractMatch = filters.contract === 'all' || contract === filters.contract;
    return trackMatch && contractMatch;
  });

  document.getElementById(`${phase}-demo-count`).textContent = demos.length;
  if (!demos.length) {
    container.innerHTML = '<div class="empty-state"><strong>No demos match these filters.</strong><span>Change the track, dataset, contract, or view.</span></div>';
    return;
  }

  container.innerHTML = demos.map(renderDemoCard).join('');
  bindAudioInteractions(container);
}

function renderDemoCard(demo) {
  const isPhase2 = demo.phase === '2';
  const isSpeechOnly = demo.output_contract === 'speech_only_concatenation';
  const duration = demo.mixed_audio.duration || 1;
  const speakerMap = new Map(demo.speakers.map((speaker, index) => [speaker, index]));
  const clueText = demo.task === 'sa_asr'
    ? 'Transcribe every speaker in the mixed meeting audio.'
    : (demo.clue.text || 'Use the reference voice below to identify the target speaker.');
  const modality = demo.task === 'sa_asr' ? 'mixed audio' : demo.clue.modality;
  const targetOverlap = demo.task === 'target_asr' && demo.target_overlap_ratio != null;
  const overlapValue = targetOverlap ? demo.target_overlap_ratio : demo.overlap_ratio;
  const overlap = `${Math.round((overlapValue || 0) * 100)}% ${targetOverlap ? 'target overlap' : 'overlap'}`;
  const confidence = demo.profile_confidence == null
    ? ''
    : ` · ${Math.round(demo.profile_confidence * 100)}% profile confidence`;

  return `
    <article class="demo-card ${demo.featured ? 'featured' : ''}" data-demo-id="${escapeHtml(demo.id)}">
      <header class="demo-card-header">
        <div class="demo-tags">
          <span class="demo-tag demo-tag-primary">${escapeHtml(demo.task_label)}</span>
          <span class="demo-tag">${escapeHtml(datasetLabels[demo.dataset] || demo.dataset)}</span>
          <span class="demo-tag">${escapeHtml(demo.language)}</span>
          ${demo.phase === '1.3' ? '<span class="demo-tag demo-tag-phase">Phase 1.3</span>' : ''}
          ${isPhase2 ? `<span class="demo-tag demo-tag-phase2">${isSpeechOnly ? 'Phase 2 Speech-only' : 'Phase 2 Timeline'}</span>` : ''}
          ${demo.num_speakers ? `<span class="demo-tag">${demo.num_speakers} speakers</span>` : ''}
          ${demo.same_gender_distractor_count === 1 ? `<span class="demo-tag demo-tag-phase">same-gender gap ${demo.same_gender_pitch_distance} bands · ${Number(demo.same_gender_f0_semitone_distance).toFixed(1)} st</span>` : ''}
          <span class="demo-tag ${demo.difficulty === 'Hard' ? 'demo-tag-hard' : ''}">${escapeHtml(demo.difficulty)}</span>
        </div>
        <h3>${escapeHtml(demo.title)}</h3>
        <p class="demo-rationale">${escapeHtml(demo.why_selected)}</p>
      </header>

      <div class="audio-panel">
        <div class="audio-heading">
          <span>${isPhase2 ? 'Full mixed input' : 'Mixed multi-speaker audio'}</span>
          <small>${formatDuration(duration)} · ${escapeHtml(overlap)}</small>
        </div>
        <audio controls preload="metadata">
          <source src="${escapeHtml(demo.mixed_audio.path)}" type="audio/ogg">
        </audio>
        ${renderWaveform(demo.mixed_audio.waveform || [])}
        <div class="timeline-heading">
          <span>${demo.task === 'sa_asr' ? 'Reference turn map' : (isPhase2 ? 'Target activity in input' : 'Target turn map')}</span>
          <small>click a segment to seek</small>
        </div>
        <div class="timeline">
          ${renderTimeline(demo, duration, speakerMap)}
        </div>
      </div>

      <div class="demo-body">
        <div class="clue-box">
          <span>${escapeHtml(demo.subtype_label)} · ${escapeHtml(modality)}${escapeHtml(confidence)}</span>
          <p>${escapeHtml(clueText)}</p>
        </div>
        ${renderReferencePlayer(demo.reference_audio)}
        ${renderOraclePlayer(demo)}
        <div class="transcript-heading">
          <h4>${isPhase2 ? 'Target speech regions' : 'Ground-truth turns'}</h4>
          <span>${demo.answer.length} turn${demo.answer.length === 1 ? '' : 's'} · ${escapeHtml(demo.metric)}</span>
        </div>
        <div class="transcript-list">
          ${renderTranscript(demo, speakerMap)}
        </div>
        <details class="prompt-details">
          <summary>${isPhase2 ? 'View extraction instruction' : 'View evaluation prompt'}</summary>
          <pre>${escapeHtml(demo.question)}</pre>
        </details>
      </div>
    </article>`;
}

function renderWaveform(peaks) {
  return `<div class="waveform" aria-label="Audio waveform">
    ${peaks.map((peak, index) => `<i data-wave-index="${index}" style="height:${Math.max(8, peak * 100)}%"></i>`).join('')}
  </div>`;
}

function renderTimeline(demo, duration, speakerMap) {
  return demo.speakers.map((speaker) => {
    const turns = demo.answer.filter((turn) => demo.task === 'sa_asr' ? turn.speaker === speaker : true);
    const colorIndex = speakerMap.get(speaker) % 6;
    return `
      <div class="timeline-row">
        <span class="timeline-label">${escapeHtml(displaySpeaker(demo, speaker))}</span>
        <div class="timeline-track">
          ${turns.map((turn, index) => {
            const left = Math.max(0, (turn.start / duration) * 100);
            const width = Math.max(0.6, ((turn.end - turn.start) / duration) * 100);
            return `<button type="button" class="turn-segment speaker-color-${colorIndex}" style="left:${left}%;width:${width}%" data-start="${turn.start}" data-end="${turn.end}" aria-label="Seek to ${formatTime(turn.start)}"></button>`;
          }).join('')}
        </div>
      </div>`;
  }).join('');
}

function renderReferencePlayer(reference) {
  if (!reference) return '';
  return `
    <div class="reference-player">
      <span>Target voice reference · ${formatDuration(reference.duration)}</span>
      <audio controls preload="metadata">
        <source src="${escapeHtml(reference.path)}" type="audio/ogg">
      </audio>
    </div>`;
}

function renderOraclePlayer(demo) {
  if (!demo.oracle_audio) return '';
  const gap = demo.output_contract === 'speech_only_concatenation'
    ? ` · ${demo.removed_gap_count} gaps removed · ${demo.total_removed_gap_seconds.toFixed(1)}s removed`
    : (demo.internal_gap_count
      ? ` · ${demo.internal_gap_count} preserved gap${demo.internal_gap_count === 1 ? '' : 's'} · longest ${demo.max_internal_gap_seconds.toFixed(1)}s`
      : ' · one continuous target region');
  return `
    <div class="oracle-player">
      <div>
        <span>Oracle target output</span>
        <small>${formatDuration(demo.oracle_audio.duration)}${escapeHtml(gap)}</small>
      </div>
      <audio controls preload="metadata">
        <source src="${escapeHtml(demo.oracle_audio.path)}" type="audio/ogg">
      </audio>
    </div>`;
}

function renderTranscript(demo, speakerMap) {
  return demo.answer.map((turn) => {
    const speaker = demo.task === 'sa_asr' ? turn.speaker : demo.target_speaker_id;
    const colorIndex = speakerMap.get(speaker) % 6;
    return `
      <button type="button" class="transcript-turn" data-start="${turn.start}" data-end="${turn.end}">
        <span class="turn-meta">
          <strong class="speaker-text-${colorIndex}">${escapeHtml(displaySpeaker(demo, speaker))}</strong>
          ${formatTime(turn.start)}
        </span>
        <span class="turn-text">${escapeHtml(turn.text)}</span>
      </button>`;
  }).join('');
}

function bindAudioInteractions(container) {
  const mixedPlayers = [...container.querySelectorAll('.audio-panel > audio')];
  const allPlayers = [...container.querySelectorAll('audio')];

  allPlayers.forEach((player) => {
    player.addEventListener('play', () => {
      document.querySelectorAll('audio').forEach((other) => {
        if (other !== player) other.pause();
      });
    });
  });

  mixedPlayers.forEach((audio) => {
    const card = audio.closest('.demo-card');
    const waveform = card.querySelector('.waveform');
    const waveBars = [...waveform.querySelectorAll('i')];
    const timedElements = [...card.querySelectorAll('[data-start][data-end]')];

    waveform.addEventListener('click', (event) => {
      if (!audio.duration) return;
      const bounds = waveform.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
      audio.currentTime = ratio * audio.duration;
      audio.play().catch(() => {});
    });

    timedElements.forEach((element) => {
      element.addEventListener('click', () => {
        audio.currentTime = Number(element.dataset.start);
        audio.play().catch(() => {});
      });
    });

    audio.addEventListener('timeupdate', () => {
      const progress = audio.duration ? audio.currentTime / audio.duration : 0;
      waveBars.forEach((bar, index) => {
        bar.classList.toggle('played', index / waveBars.length <= progress);
      });
      timedElements.forEach((element) => {
        const active = audio.currentTime >= Number(element.dataset.start) && audio.currentTime <= Number(element.dataset.end);
        element.classList.toggle('active', active);
      });
    });
  });
}

function setupNavigation() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  links.addEventListener('click', (event) => {
    if (!event.target.closest('a')) return;
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
}

function normalizeSpeaker(speaker) {
  if (!speaker) return 'Target';
  return String(speaker).replace(/^speaker/i, 'Speaker ');
}

function displaySpeaker(demo, speaker) {
  return demo.task === 'sa_asr' ? normalizeSpeaker(speaker) : 'Target speaker';
}

function formatDuration(seconds) {
  const rounded = Math.round(Number(seconds) || 0);
  const minutes = Math.floor(rounded / 60);
  const remainder = String(rounded % 60).padStart(2, '0');
  return `${minutes}:${remainder}`;
}

function formatTime(seconds) {
  const value = Number(seconds) || 0;
  const minutes = Math.floor(value / 60);
  const remainder = (value % 60).toFixed(1).padStart(4, '0');
  return `${minutes}:${remainder}`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
