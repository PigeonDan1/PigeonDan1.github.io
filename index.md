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
        <div class="news-card-date">🥳 May 2026</div>
        <div class="news-card-title">Four papers accepted to <strong>Interspeech 2026</strong>!</div>
        <ul class="news-card-list">
          <li>TASU2</li>
          <li>SURE</li>
          <li>RAS</li>
          <li><em>One more (TBA)</em></li>
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

---

I am now a Zhiyuan Honor Ph.D. Student at **Shanghai Jiao Tong University (SJTU)**, **[X-LANCE Lab](https://x-lance.sjtu.edu.cn/)**, advised by **[Prof. Kai Yu](https://x-lance.sjtu.edu.cn/~kaiyu/)** (and co-advised by **[Prof. Shinji Watanabe](https://sites.google.com/view/shinjiwatanabe)**), closely collaborating with **[Prof. Shuai Wang](https://shuaiwang-nju.github.io/)**.

My research focuses on **Speech Large Language Models (Speech LLMs)**, with an emphasis on building **well-aligned speech understanding systems** that are robust to **domain shift** and **multi-speaker conditions**.

---

## Research Interests

Generally, I am focusing on **Speech Large Language Models (Speech LLMs)** for speech understanding and reasoning:

- **Multimodal alignment** between speech and text for instruction-following speech systems  
- **Efficient adaptation** for low-resource / cross-domain settings  
- **Speaker-attributed ASR (SA-ASR)** and multi-speaker understanding
  
---

## Research Experience

My recent work spans both academic labs and industry research:

- **Speech LLMs for Speech Understanding (AISpeech, Suzhou, Jiangsu)**  
  I work on ASR and multimodal alignment methods that connect speech representations with language model reasoning and instruction following.

- **SA-ASR with Speech LLMs (Shenzhen Research Institute of Big Data, Remote)**  
  I explore Speech LLM-based frameworks for **speaker-attributed transcription**, aiming to improve **speaker consistency** and **controllability** in multi-speaker scenarios.

- **Speaker Discrimination on Omni/SLM (Hi Lab, Xiaohongshu, Shanghai)**  
  I study **explicit speaker discrimination** and **implicit speaker selection** strategies for multi-speaker understanding, with an eye toward robust speaker identity modeling under real-world conditions.

---

## Publications (Selected)
You can see the full list on **[Publications](/publications/)**.
> * indicates equal contribution.

- **TASU2: Controllable CTC Simulation for Alignment and Low-Resource Adaptation of Speech LLMs**  
  Jing Peng*, C. Wang*, Y. Yang, L. Qian, J. Li, Y. Xi, S. Wang, K. Yu.  
  **arXiv:2604.08384**. *Accepted by Interspeech 2026.*  
  https://arxiv.org/abs/2604.08384

- **Audio-Mind: An Auditable Agentic Framework for Audio Understanding**  
  Y. Wang*, Jing Peng*, H. Li, C. Wang, W. Tu, Y. Xi, Z. Sun, K. Yu, S. Wang.  
  **arXiv:2605.28480**. *Submitted to EMNLP 2026.*  
  https://arxiv.org/abs/2605.28480

- **G-STAR: End-to-End Global Speaker-Tracking Attributed Recognition**  
  Jing Peng*, Z. Chen*, H. Li*, Y. Wang, D. Ma, M. Li, Y. Du, D. Xu, K. Yu, S. Wang.  
  **arXiv:2603.10468**. *Submitted to EMNLP 2026.*  
  https://arxiv.org/abs/2603.10468

- **TC-BiMamba: Trans-Chunk bidirectionally within BiMamba for unified streaming and non-streaming ASR**  
  Jing Peng*, Q. She*, Y. Fang, Y. Xi, K. Yu.  
  **arXiv:2602.11546**. *Submitted to EMNLP 2026.*  
  https://arxiv.org/abs/2602.11546

- **A Unified and Reproducible Experimentation Framework for Speech Understanding**  
  Jing Peng*, J. Du*, C. Wang*, H. Li*, Y. Yang*, Y. Wang, X. Gu, G. Chen, Y. Wang, J. Li, Z. Zhao, H. Wang, W. Tu, H. Li, D. Ma, L. Qian, Y. Xi, W. Wen, J. Guo, H. Zhang, S. Fan, W. Jiang, S. Wang, K. Yu.  
  **arXiv:2605.30899**. *Accepted by Interspeech 2026.*  
  https://arxiv.org/abs/2605.30899

- **RAS: a Reliability Oriented Metric for Automatic Speech Recognition**  
  W. Huang, Y. Qiu, B. Li, Y. Guo, Jing Peng, H. Wang, X. Chen, K. Yu.  
  **arXiv:2604.24278**. *Accepted by Interspeech 2026.*  
  https://arxiv.org/abs/2604.24278

- **A Survey on Speech Large Language Models for Understanding**  
  Jing Peng*, Y. Wang*, Y. Fang, Y. Xi, X. Li, X. Zhang, K. Yu.  
  **arXiv:2410.18908**. *Accepted by IEEE JSTSP.*  
  https://arxiv.org/abs/2410.18908

- **TASU: Text-Only Alignment for Speech Understanding**  
  Jing Peng, Y. Yang, X. Li, Y. Xi, Q. Tang, Y. Fang, J. Li, K. Yu.  
  **arXiv:2511.03310**. *Accepted by ICASSP 2026.*  
  https://arxiv.org/abs/2511.03310

- **Low-Resource Domain Adaptation for Speech LLMs via Text-Only Fine-Tuning**  
  Y. Fang*, Jing Peng*, X. Li, Y. Xi, C. Zhang, G. Zhong, K. Yu.  
  **arXiv:2506.05671**. *Accepted by ASRU 2025.*  
  https://arxiv.org/abs/2506.05671

- **MOSA: Mixtures of Simple Adapters Outperform Monolithic Approaches in LLM-based Multilingual ASR**  
  Junjie Li, Jing Peng, Yangui Fang, Shuai Wang, Kai Yu.  
  **arXiv:2508.18998**. *Accepted by ICASSP 2026.*  
  https://arxiv.org/abs/2508.18998

---

## Contact Information

I am so happy to chat and collaborate on the topics above and you can contact me by:

- **Email:** [jing.peng@sjtu.edu.cn](mailto:jing.peng@sjtu.edu.cn)
- **GitHub:** [https://github.com/PigeonDan1](https://github.com/PigeonDan1)
- **Google Scholar:** [https://scholar.google.com/citations?user=Uo0mj0AAAAAJ&hl=en](https://scholar.google.com/citations?user=Uo0mj0AAAAAJ&hl=en)
- **Semantic Scholar:** [https://www.semanticscholar.org/author/Jing-Peng/2327961941](https://www.semanticscholar.org/author/Jing-Peng/2327961941)
- **LinkedIn:** [https://www.linkedin.com/in/jing-peng-7ab8682a4/](https://www.linkedin.com/in/jing-peng-7ab8682a4/)
