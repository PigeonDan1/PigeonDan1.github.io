---
layout: page
title: ""
permalink: /zh/
lang: zh
---

<div style="text-align: right; margin-bottom: 20px;">
  <a href="/">English</a> | <strong>中文</strong>
</div>

## 最新动态 🎉

<div style="margin-bottom:1rem;padding:0.7rem 1rem;background:linear-gradient(90deg,#fff3bf 0%,#e7f5ff 100%);border-radius:10px;border-left:4px solid #fab005;font-size:0.88rem;">
  🌟 <strong>故事开始于 2024/5/20</strong> — 我给<a href="https://x-lance.sjtu.edu.cn/~kaiyu/" target="_blank">俞凯教授</a>写的第一封自荐信
</div>

<div class="news-section">
  <div class="news-carousel-wrapper">
    <button class="news-nav news-nav-prev" onclick="document.getElementById('newsCarouselZh').scrollBy({left:-300,behavior:'smooth'})" aria-label="Previous">&#10094;</button>
    <div class="news-carousel" id="newsCarouselZh">
      <div class="news-card">
        <div class="news-card-date">🥳 2026年5月</div>
        <div class="news-card-title">四篇论文被 <strong>Interspeech 2026</strong> 接收！</div>
        <ul class="news-card-list">
          <li>TASU2</li>
          <li>SURE</li>
          <li>RAS</li>
          <li><em>另有一篇（待定）</em></li>
        </ul>
      </div>
      <div class="news-card">
        <div class="news-card-date">📖 2025年11月</div>
        <div class="news-card-title">Survey 发表于 <strong>IEEE JSTSP</strong></div>
        <ul class="news-card-list">
          <li>A Survey on Speech Large Language Models for Understanding</li>
        </ul>
      </div>
      <div class="news-card">
        <div class="news-card-date">🎊 2025年10月</div>
        <div class="news-card-title">三篇论文被 <strong>ICASSP 2026</strong> 接收！</div>
        <ul class="news-card-list">
          <li>TASU — <em>Oral</em></li>
          <li>MOSA — <em>Poster</em></li>
          <li>ISA-Bench — <em>Oral</em></li>
        </ul>
      </div>
      <div class="news-card">
        <div class="news-card-date">🔥 2025年8月</div>
        <div class="news-card-title">两篇论文被 <strong>ASRU 2025</strong> 接收！</div>
        <ul class="news-card-list">
          <li>Low-Resource Domain Adaptation</li>
          <li>Fewer Hallucinations, More Verification</li>
        </ul>
      </div>
    </div>
    <button class="news-nav news-nav-next" onclick="document.getElementById('newsCarouselZh').scrollBy({left:300,behavior:'smooth'})" aria-label="Next">&#10095;</button>
  </div>
</div>

---

我是 **上海交通大学 (SJTU)** **[X-LANCE Lab](https://x-lance.sjtu.edu.cn/)** 的致远荣誉博士生，导师是 **[俞凯教授](https://x-lance.sjtu.edu.cn/~kaiyu/)**（联合导师是 **[Shinji Watanabe 教授](https://sites.google.com/view/shinjiwatanabe)**），并与 **[王帅教授](https://shuaiwang-nju.github.io/)** 紧密合作。

我的研究专注于**语音大语言模型 (Speech LLMs)**，重点是构建对**领域迁移**和**多说话人场景**具有鲁棒性的**良好对齐的语音理解系统**。

---

## 研究兴趣

总体而言，我专注于用于语音理解和推理的**语音大语言模型 (Speech LLMs)**：

- 语音和文本之间的**多模态对齐**，用于指令跟随语音系统
- 低资源/跨领域场景的**高效自适应**
- **说话人归属 ASR (SA-ASR)** 和多说话人理解
  
---

## 研究经历

我的近期工作跨越学术实验室和工业研究：

- **用于语音理解的语音大模型 (AISpeech, 苏州, 江苏)**  
  我从事 ASR 和多模态对齐方法的研究，将语音表示与语言模型推理和指令跟随连接起来。

- **基于语音大模型的 SA-ASR (深圳大数据研究院, 远程)**  
  我探索基于语音大模型的**说话人归属转录**框架，旨在改善多说话人场景中的**说话人一致性**和**可控性**。

- **Omni/SLM 上的说话人区分 (小红书, 上海)**  
  我研究多说话人理解中的**显式说话人区分**和**隐式说话人选择**策略，关注真实世界条件下的鲁棒说话人身份建模。

---

## 发表论文 (精选)

完整列表请见 **[发表论文](/publications/)**。
> * 表示同等贡献。

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

## 联系方式

我非常乐意就上述话题进行交流和合作，您可以通过以下方式联系我：

- **邮箱:** [jing.peng@sjtu.edu.cn](mailto:jing.peng@sjtu.edu.cn)
- **GitHub:** [https://github.com/PigeonDan1](https://github.com/PigeonDan1)
- **Google Scholar:** [https://scholar.google.com/citations?user=Uo0mj0AAAAAJ&hl=en](https://scholar.google.com/citations?user=Uo0mj0AAAAAJ&hl=en)
- **Semantic Scholar:** [https://www.semanticscholar.org/author/Jing-Peng/2327961941](https://www.semanticscholar.org/author/Jing-Peng/2327961941)
- **LinkedIn:** [https://www.linkedin.com/in/jing-peng-7ab8682a4/](https://www.linkedin.com/in/jing-peng-7ab8682a4/)
