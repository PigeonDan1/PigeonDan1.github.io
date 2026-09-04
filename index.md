---
layout: page
title: ""
permalink: /
lang: en
---

<div style="text-align: right; margin-bottom: 20px;">
  <strong>English</strong> | <a href="/zh/">中文</a>
</div>

## News 🎉

<div style="margin-bottom:1rem;padding:0.7rem 1rem;background:linear-gradient(90deg,#fff3bf 0%,#e7f5ff 100%);border-radius:10px;border-left:4px solid #fab005;font-size:0.88rem;">
  🌟 <strong>Story begins at 2024/5/20</strong> — The first self-recommendation letter I wrote to <a href="https://x-lance.sjtu.edu.cn/~kaiyu/" target="_blank">Prof. Kai Yu</a>
</div>

<div class="news-section">
  <div class="news-carousel-wrapper">
    <button class="news-nav news-nav-prev" onclick="document.getElementById('newsCarousel').scrollBy({left:-300,behavior:'smooth'})" aria-label="Previous">&#10094;</button>
    <div class="news-carousel" id="newsCarousel">
      <div class="news-card">
        <div class="news-card-date">🎉 Sep 2026</div>
        <div class="news-card-title">Seven papers accepted to <a href="https://www.ncmmsc.org.cn/" target="_blank" rel="noopener"><strong>NCMMSC 2026</strong></a>!</div>
        <ul class="news-card-list">
          <li>SURE-EVAL — <em>Oral</em></li>
          <li>Multilingual TASU — <em>Oral</em></li>
          <li>MoE EEND — <em>Oral</em></li>
          <li>SCORE — <em>Poster</em></li>
          <li>DiS-TSE — <em>Poster</em></li>
          <li>Agentic Data Sample — <em>Poster</em></li>
          <li>PA-TSE — <em>Poster</em></li>
        </ul>
      </div>
      <div class="news-card">
        <div class="news-card-date">🎉 Sep 2026</div>
        <div class="news-card-title">Two papers to <strong>EMNLP 2026</strong> (Findings)</div>
        <ul class="news-card-list">
          <li>G-STAR</li>
          <li>TC-BiMamba</li>
        </ul>
      </div>
      <div class="news-card">
        <div class="news-card-date">🚀 Jul 2026</div>
        <div class="news-card-title">Open-sourced <a href="https://github.com/QwenAudio/qwen-audio-agent" target="_blank"><strong>Qwen-Audio-Agent</strong></a></div>
        <ul class="news-card-list">
          <li>Audio agent framework</li>
          <li>Architecture optimization & backend model expansion</li>
        </ul>
      </div>
      <div class="news-card">
        <div class="news-card-date">🥳 May 2026</div>
        <div class="news-card-title">Four papers accepted to <strong>Interspeech 2026</strong>!</div>
        <ul class="news-card-list">
          <li>TASU2</li>
          <li>SURE</li>
          <li>RAS</li>
          <li>VISA (Agent Track)</li>
        </ul>
      </div>
      <div class="news-card">
        <div class="news-card-date">📖 Nov 2025</div>
        <div class="news-card-title">Survey published in <strong>IEEE JSTSP</strong></div>
        <ul class="news-card-list">
          <li>A Survey on Speech Large Language Models for Understanding</li>
        </ul>
      </div>
      <div class="news-card">
        <div class="news-card-date">🎊 Oct 2025</div>
        <div class="news-card-title">Three papers accepted to <strong>ICASSP 2026</strong>!</div>
        <ul class="news-card-list">
          <li>TASU — <em>Oral</em></li>
          <li>MOSA — <em>Poster</em></li>
          <li>ISA-Bench — <em>Oral</em></li>
        </ul>
      </div>
      <div class="news-card">
        <div class="news-card-date">🔥 Aug 2025</div>
        <div class="news-card-title">Two papers accepted to <strong>ASRU 2025</strong>!</div>
        <ul class="news-card-list">
          <li>Low-Resource Domain Adaptation</li>
          <li>Fewer Hallucinations, More Verification</li>
        </ul>
      </div>
    </div>
    <button class="news-nav news-nav-next" onclick="document.getElementById('newsCarousel').scrollBy({left:300,behavior:'smooth'})" aria-label="Next">&#10095;</button>
  </div>
</div>

<div class="section-spacer"></div>

I am now a Zhiyuan Honor Ph.D. Student at **Shanghai Jiao Tong University (SJTU)**, **[X-LANCE Lab](https://x-lance.sjtu.edu.cn/)**, advised by **[Prof. Kai Yu](https://x-lance.sjtu.edu.cn/~kaiyu/)** (and co-advised by **[Prof. Shinji Watanabe](https://sites.google.com/view/shinjiwatanabe)**), closely collaborating with **[Prof. Shuai Wang](https://shuaiwang-nju.github.io/)**.

My research focuses on **Speech Large Language Models (Speech LLMs)**, with an emphasis on building **well-aligned speech understanding systems** that are robust to **domain shift** and **multi-speaker conditions**.

<div class="section-spacer"></div>

## Research Interests

My research centers on building robust and practical speech understanding systems, spanning from foundational ASR to modern Speech Large Language Models.

<div class="theme-section">
  <div class="theme-section-title">🧠 Speech Large Language Models for Understanding</div>
  <div class="subtheme-grid">
    <div class="subtheme-card">
      <div class="subtheme-title">📊 Survey & Benchmark</div>
      <p class="subtheme-desc">Building reproducible experimentation frameworks and benchmarks to measure what speech understanding systems can and cannot do.</p>
      <div class="subtheme-papers">
        <span class="paper-label">Representative:</span>
        <span class="paper-tag">SURE</span>
        <span class="paper-tag">ISA-Bench</span>
        <span class="paper-tag">Survey</span>
      </div>
    </div>
    <div class="subtheme-card">
      <div class="subtheme-title">🔗 Speech-Text Alignment</div>
      <p class="subtheme-desc">Aligning speech representations with language models through controllable simulation and text-only adaptation techniques.</p>
      <div class="subtheme-papers">
        <span class="paper-label">Representative:</span>
        <span class="paper-tag">TASU</span>
        <span class="paper-tag">TASU2</span>
      </div>
    </div>
    <div class="subtheme-card">
      <div class="subtheme-title">🤖 Agentic Systems</div>
      <p class="subtheme-desc">Equipping speech and audio systems with agentic reasoning, multi-modal evidence, and reliable multi-agent collaboration.</p>
      <div class="subtheme-papers">
        <span class="paper-label">Representative:</span>
        <span class="paper-tag">Audio-Mind</span>
        <span class="paper-tag">VISA</span>
        <span class="paper-tag">XFlow</span>
      </div>
    </div>
    <div class="subtheme-card">
      <div class="subtheme-title">🌍 Multilingual and Multispeaker</div>
      <p class="subtheme-desc">Tackling complex real-world scenarios with multiple speakers and multiple languages under unified frameworks.</p>
      <div class="subtheme-papers">
        <span class="paper-label">Representative:</span>
        <span class="paper-tag">G-STAR</span>
        <span class="paper-tag">MOSA</span>
      </div>
    </div>
  </div>
</div>

<div class="theme-section">
  <div class="theme-section-title">🎙️ Automatic Speech Recognition (Traditional)</div>
  <p>Alongside Speech LLM research, I continue to work on foundational ASR problems.</p>
  <div class="subtheme-grid">
    <div class="subtheme-card">
      <div class="subtheme-title">🎙️ Streaming & Non-streaming ASR</div>
      <p class="subtheme-desc">Unified architectures such as TC-BiMamba that bridge streaming and non-streaming recognition.</p>
      <div class="subtheme-papers">
        <span class="paper-label">Representative:</span>
        <span class="paper-tag">TC-BiMamba</span>
      </div>
    </div>
    <div class="subtheme-card">
      <div class="subtheme-title">✍️ ASR Error Correction & Controllability</div>
      <p class="subtheme-desc">LLM-based error correction and controllable contextual speech recognition.</p>
      <div class="subtheme-papers">
        <span class="paper-label">Representative:</span>
        <span class="paper-tag">Fewer Hallucinations</span>
        <span class="paper-tag">Joint Decoding</span>
      </div>
    </div>
    <div class="subtheme-card">
      <div class="subtheme-title">📏 Reliability & Evaluation</div>
      <p class="subtheme-desc">Metrics like RAS that focus on the reliability of ASR outputs beyond simple word-error rates.</p>
      <div class="subtheme-papers">
        <span class="paper-label">Representative:</span>
        <span class="paper-tag">RAS</span>
      </div>
    </div>
  </div>
</div>

<div class="section-spacer"></div>

## Research Experience

<div class="research-grid">
  <div class="research-card">
    <div class="research-card-title">🎙️ Speech LLMs for Speech Understanding</div>
    <p class="research-card-desc"><strong>AISpeech</strong>, Suzhou, Jiangsu<br>I work on ASR and multimodal alignment methods that connect speech representations with language model reasoning and instruction following.</p>
  </div>
  <div class="research-card">
    <div class="research-card-title">🗣️ SA-ASR with Speech LLMs</div>
    <p class="research-card-desc"><strong>Shenzhen Research Institute of Big Data</strong>, Remote<br>I explore Speech LLM-based frameworks for <strong>speaker-attributed transcription</strong>, aiming to improve <strong>speaker consistency</strong> and <strong>controllability</strong> in multi-speaker scenarios.</p>
  </div>
  <div class="research-card">
    <div class="research-card-title">👥 Speaker Discrimination on Omni/SLM</div>
    <p class="research-card-desc"><strong>Hi Lab, Xiaohongshu</strong>, Shanghai<br>I study <strong>explicit speaker discrimination</strong> and <strong>implicit speaker selection</strong> strategies for multi-speaker understanding, with an eye toward robust speaker identity modeling under real-world conditions.</p>
  </div>
</div>

<div class="section-spacer"></div>

## Open Source Projects

<div class="oss-section">
  <div class="oss-role">
    <div class="oss-role-title">🚀 Lead</div>
    <div class="oss-grid">
      <a href="https://www.open-bench.net" class="oss-card" target="_blank" rel="noopener">
        <div class="oss-card-title">Open-Bench</div>
        <div class="oss-card-desc">Systematic and Unified Reproduible Experimentation Framework.</div>
        <div class="oss-card-links"><span class="oss-card-link">🌐 Website</span></div>
      </a>
      <a href="https://sure-eval.com/" class="oss-card" target="_blank" rel="noopener">
        <div class="oss-card-title">sure demo</div>
        <div class="oss-card-desc">Interactive demo platform for the Open-Bench evaluation framework.</div>
        <div class="oss-card-links"><span class="oss-card-link">🌐 Website</span></div>
      </a>
      <a href="https://github.com/PigeonDan1/sure" class="oss-card" target="_blank" rel="noopener">
        <div class="oss-card-title">sure-eval</div>
        <div class="oss-card-desc">Open-source evaluation framework.</div>
        <div class="oss-card-links">
          <span class="oss-card-link">📂 GitHub</span>
          <img src="https://img.shields.io/github/stars/PigeonDan1/sure?style=social&logo=github" alt="GitHub stars" class="oss-card-badge">
        </div>
      </a>
      <a href="https://github.com/PigeonDan1/sure-evaluation" class="oss-card" target="_blank" rel="noopener">
        <div class="oss-card-title">sure-evaluation</div>
        <div class="oss-card-desc">Integrated open-source evaluation pipeline.</div>
        <div class="oss-card-links">
          <span class="oss-card-link">📂 GitHub</span>
          <img src="https://img.shields.io/github/stars/PigeonDan1/sure-evaluation?style=social&logo=github" alt="GitHub stars" class="oss-card-badge">
        </div>
      </a>
      <a href="https://github.com/PigeonDan1/paper_claw" class="oss-card" target="_blank" rel="noopener">
        <div class="oss-card-title">paper_claw</div>
        <div class="oss-card-desc">Lightweight paper crawling utilities.</div>
        <div class="oss-card-links">
          <span class="oss-card-link">📂 GitHub</span>
          <img src="https://img.shields.io/github/stars/PigeonDan1/paper_claw?style=social&logo=github" alt="GitHub stars" class="oss-card-badge">
        </div>
      </a>
      <a href="https://github.com/PigeonDan1/ps-slm" class="oss-card" target="_blank" rel="noopener">
        <div class="oss-card-title">ps-slm</div>
        <div class="oss-card-desc">Speech and language modeling utilities.</div>
        <div class="oss-card-links">
          <span class="oss-card-link">📂 GitHub</span>
          <img src="https://img.shields.io/github/stars/PigeonDan1/ps-slm?style=social&logo=github" alt="GitHub stars" class="oss-card-badge">
        </div>
      </a>
    </div>
  </div>
  <div class="oss-role">
    <div class="oss-role-title">🔧 Core Contributor</div>
    <div class="oss-grid">
      <a href="https://github.com/QwenAudio/qwen-audio-agent" class="oss-card" target="_blank" rel="noopener">
        <div class="oss-card-title">Qwen-Audio-Agent</div>
        <div class="oss-card-desc">Audio agent framework. Core contributor: architecture & backend models.</div>
        <div class="oss-card-links">
          <span class="oss-card-link">📂 GitHub</span>
          <img src="https://img.shields.io/github/stars/QwenAudio/qwen-audio-agent?style=social&logo=github" alt="GitHub stars" class="oss-card-badge">
        </div>
      </a>
    </div>
  </div>
  <div class="oss-role">
    <div class="oss-role-title">🤝 Contributor</div>
    <div class="oss-grid">
      <a href="https://github.com/X-LANCE/SLAM-LLM" class="oss-card" target="_blank" rel="noopener">
        <div class="oss-card-title">SLAM-LLM</div>
        <div class="oss-card-desc">Unified SLM training framework. Contributor: NPU support.</div>
        <div class="oss-card-links">
          <span class="oss-card-link">📂 GitHub</span>
          <img src="https://img.shields.io/github/stars/X-LANCE/SLAM-LLM?style=social&logo=github" alt="GitHub stars" class="oss-card-badge">
        </div>
      </a>
      <a href="https://github.com/huggingface/speech-to-speech" class="oss-card" target="_blank" rel="noopener">
        <div class="oss-card-title">speech-to-speech</div>
        <div class="oss-card-desc">CJK punctuation preservation and codec-token budgeting for Chinese TTS.</div>
        <div class="oss-card-links">
          <span class="oss-card-link">📂 GitHub</span>
          <img src="https://img.shields.io/github/stars/huggingface/speech-to-speech?style=social&logo=github" alt="GitHub stars" class="oss-card-badge">
        </div>
      </a>
    </div>
  </div>
</div>

<div class="section-spacer"></div>

## Publications (Selected)

> * indicates equal contribution. <a href="/publications/">See the full list →</a>

<div class="pub-scroll-section">
  <div class="pub-scroll-container">
    <div class="pub-scroll-wrapper" id="pubScroll">
      <a href="https://arxiv.org/abs/2604.08384" class="pub-card" target="_blank" rel="noopener">
        <div class="pub-card-title">TASU2: Controllable CTC Simulation for Alignment and Low-Resource Adaptation of Speech LLMs</div>
        <div class="pub-card-authors">Jing Peng*, C. Wang*, Y. Yang, L. Qian, J. Li, Y. Xi, S. Wang, K. Yu</div>
        <div class="pub-card-venue">arXiv:2604.08384 · Accepted by Interspeech 2026</div>
      </a>
      <a href="https://arxiv.org/abs/2605.28480" class="pub-card" target="_blank" rel="noopener">
        <div class="pub-card-title">Audio-Mind: An Auditable Agentic Framework for Audio Understanding</div>
        <div class="pub-card-authors">Y. Wang*, Jing Peng*, H. Li, C. Wang, W. Tu, Y. Xi, Z. Sun, K. Yu, S. Wang</div>
        <div class="pub-card-venue">arXiv:2605.28480 · Submitted to EMNLP 2026</div>
      </a>
      <a href="https://arxiv.org/abs/2606.14790" class="pub-card" target="_blank" rel="noopener">
        <div class="pub-card-title">XFlow: An Executable Protocol Programming System for Reliable Multi-Agent Workflows</div>
        <div class="pub-card-authors">H. Li*, Jing Peng*, Z. Wang, L. Chen, K. Yu</div>
        <div class="pub-card-venue">arXiv:2606.14790</div>
      </a>
      <a href="https://arxiv.org/abs/2603.10468" class="pub-card" target="_blank" rel="noopener">
        <div class="pub-card-title">G-STAR: End-to-End Global Speaker-Tracking Attributed Recognition</div>
        <div class="pub-card-authors">Jing Peng*, Z. Chen*, H. Li*, Y. Wang, D. Ma, M. Li, Y. Du, D. Xu, K. Yu, S. Wang</div>
        <div class="pub-card-venue">arXiv:2603.10468 · Accepted by EMNLP 2026</div>
      </a>
      <a href="https://arxiv.org/abs/2602.11546" class="pub-card" target="_blank" rel="noopener">
        <div class="pub-card-title">TC-BiMamba: Trans-Chunk bidirectionally within BiMamba for unified streaming and non-streaming ASR</div>
        <div class="pub-card-authors">Jing Peng*, Q. She*, Y. Fang, Y. Xi, K. Yu</div>
        <div class="pub-card-venue">arXiv:2602.11546 · Accepted by EMNLP 2026</div>
      </a>
      <a href="https://arxiv.org/abs/2605.30899" class="pub-card" target="_blank" rel="noopener">
        <div class="pub-card-title">A Unified and Reproducible Experimentation Framework for Speech Understanding</div>
        <div class="pub-card-authors">Jing Peng*, J. Du*, C. Wang*, H. Li*, Y. Yang*, et al.</div>
        <div class="pub-card-venue">arXiv:2605.30899 · Accepted by Interspeech 2026</div>
      </a>
      <a href="https://arxiv.org/abs/2604.24278" class="pub-card" target="_blank" rel="noopener">
        <div class="pub-card-title">RAS: a Reliability Oriented Metric for Automatic Speech Recognition</div>
        <div class="pub-card-authors">W. Huang, Y. Qiu, B. Li, Y. Guo, Jing Peng, H. Wang, X. Chen, K. Yu</div>
        <div class="pub-card-venue">arXiv:2604.24278 · Accepted by Interspeech 2026</div>
      </a>
      <a href="https://arxiv.org/abs/2410.18908" class="pub-card" target="_blank" rel="noopener">
        <div class="pub-card-title">A Survey on Speech Large Language Models for Understanding</div>
        <div class="pub-card-authors">Jing Peng*, Y. Wang*, Y. Fang, Y. Xi, X. Li, X. Zhang, K. Yu</div>
        <div class="pub-card-venue">arXiv:2410.18908 · Accepted by IEEE JSTSP</div>
      </a>
      <a href="https://arxiv.org/abs/2511.03310" class="pub-card" target="_blank" rel="noopener">
        <div class="pub-card-title">TASU: Text-Only Alignment for Speech Understanding</div>
        <div class="pub-card-authors">Jing Peng, Y. Yang, X. Li, Y. Xi, Q. Tang, Y. Fang, J. Li, K. Yu</div>
        <div class="pub-card-venue">arXiv:2511.03310 · Accepted by ICASSP 2026</div>
      </a>
      <a href="https://arxiv.org/abs/2506.05671" class="pub-card" target="_blank" rel="noopener">
        <div class="pub-card-title">Low-Resource Domain Adaptation for Speech LLMs via Text-Only Fine-Tuning</div>
        <div class="pub-card-authors">Y. Fang*, Jing Peng*, X. Li, Y. Xi, C. Zhang, G. Zhong, K. Yu</div>
        <div class="pub-card-venue">arXiv:2506.05671 · Accepted by ASRU 2025</div>
      </a>
      <a href="https://arxiv.org/abs/2508.18998" class="pub-card" target="_blank" rel="noopener">
        <div class="pub-card-title">MOSA: Mixtures of Simple Adapters Outperform Monolithic Approaches in LLM-based Multilingual ASR</div>
        <div class="pub-card-authors">Junjie Li, Jing Peng, Yangui Fang, Shuai Wang, Kai Yu</div>
        <div class="pub-card-venue">arXiv:2508.18998 · Accepted by ICASSP 2026</div>
      </a>
    </div>
    <div class="pub-scroll-nav">
      <button class="pub-scroll-btn" onclick="document.getElementById('pubScroll').scrollBy({top:-150,behavior:'smooth'})" aria-label="Scroll up">▲</button>
      <button class="pub-scroll-btn" onclick="document.getElementById('pubScroll').scrollBy({top:150,behavior:'smooth'})" aria-label="Scroll down">▼</button>
    </div>
  </div>
</div>

<div class="section-spacer"></div>

## Contact Information

I am so happy to chat and collaborate on the topics above and you can contact me by:

- **Email:** [jing.peng@sjtu.edu.cn](mailto:jing.peng@sjtu.edu.cn)
- **GitHub:** [https://github.com/PigeonDan1](https://github.com/PigeonDan1)
- **Google Scholar:** [https://scholar.google.com/citations?user=Uo0mj0AAAAAJ&hl=en](https://scholar.google.com/citations?user=Uo0mj0AAAAAJ&hl=en)
- **Semantic Scholar:** [https://www.semanticscholar.org/author/Jing-Peng/2327961941](https://www.semanticscholar.org/author/Jing-Peng/2327961941)
- **LinkedIn:** [https://www.linkedin.com/in/jing-peng-7ab8682a4/](https://www.linkedin.com/in/jing-peng-7ab8682a4/)
