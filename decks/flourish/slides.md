---
theme: ../../themes/flourish
titleTemplate: '%s'
layout: cover
title: Original # display as html title
subtitle: 這是簡報的副標題
preview: [1, 8, 12, 19]
---

# 這是簡報的標題

---
layout: intro
image: /avatar.jpg
---

# whoami

○○○ / Yuto

- <span class="i-ph:graduation-cap" /> TTU CSE <span class="i-ph:arrow-right" /> <span class="i-ph:book-open" /> NTHU IIS
- TeamT5 Detection Team Intern

對系統攻防、程式安全、惡意程式分析、紅隊工程有興趣。

<https://blog.yuto0226.dev>

---
layout: outline
---

# Outline

1. 標題
2. 標題
3. 標題
4. 標題
5. 標題
6. 標題
7. 標題
8. 標題
9. 標題
10. 標題

---
layout: outline
---

# Outline

1. 文字
   - 標題
   - Markdown
   - Markdown 擴充
   - 字級
   - 顏色與線條
2. 區塊
   - Callout
   - 水平比較
   - 垂直比較
3. 圖與程式
   - Code Section
   - Stack 與記憶體
   - Figure
4. 大字報
   - statement
   - fact
   - quote
   - none

---
layout: section
---

# 文字

行內標記、字級、顏色與線型

---
layout: default
---

# 標題

新增少量內文

- List item
- List item
  - Sub item
  - Sub item

<Banner v-click>Pwned</Banner>

---
layout: default
---

# Markdown

內文可以用 **粗體** 和 `inline code`，連結寫成 [sli.dev](https://sli.dev)，補充放在註腳[^1]。

| 元素       | 寫法           | 用在哪             |
| ---------- | -------------- | ------------------ |
| 行內程式碼 | `` `memcpy` `` | 函式名、flag、路徑 |
| 引用       | `> 文字`       | 別人的敘述         |
| 清單       | `- 項目`       | 並列的項目         |
| 註腳       | `[^1]`         | 出處、補充說明     |

> 引用會長這樣

[^1]: 註腳排在整頁最後，字級小一級，顏色是次級字色。

---
layout: default
---

# Markdown 擴充

| 寫法            | 結果               | 來自                          |
| --------------- | ------------------ | ----------------------------- |
| `==文字==`      | ==螢光筆==         | `markdown-it-mark`            |
| `++文字++`      | ++波浪線++         | `markdown-it-ins`             |
| `~~文字~~`      | ~~刪除線~~         | markdown-it 內建              |
| `[文字]{.info}` | [色字]{.info}      | `markdown-it-bracketed-spans` |
| `2^32^`         | 2^32^ 個位址       | `markdown-it-sup`             |
| `H~2~O`         | H~2~O              | `markdown-it-sub`             |
| `$O(n\log n)$`  | $O(n\log n)$       | KaTeX，Slidev 內建            |
| `*文字*`        | _著重點_，不是斜體 | 這個主題，中文沒有斜體        |
| `<hr />`        | 分隔線             | `---` 在 Slidev 裡是換頁      |

{.font-note}

---
layout: two-cols
left: auto
---

# 顏色與線條

`{.class}` 來自 `markdown-it-attrs`。同一個 class 在標記上都一樣，也可以組合使用。

::left::

### 顏色

| 寫法         | 螢光筆           | 波浪             | 實線                    | 點線                     | 刪除線           | 色字           |
| ------------ | ---------------- | ---------------- | ----------------------- | ------------------------ | ---------------- | -------------- |
| `{.primary}` | ==紫=={.primary} | ++紫++{.primary} | ++紫++{.solid .primary} | ++紫++{.dotted .primary} | ~~紫~~{.primary} | [紫]{.primary} |
| `{.info}`    | ==藍=={.info}    | ++藍++{.info}    | ++藍++{.solid .info}    | ++藍++{.dotted .info}    | ~~藍~~{.info}    | [藍]{.info}    |
| `{.success}` | ==綠=={.success} | ++綠++{.success} | ++綠++{.solid .success} | ++綠++{.dotted .success} | ~~綠~~{.success} | [綠]{.success} |
| `{.warning}` | ==黃=={.warning} | ++黃++{.warning} | ++黃++{.solid .warning} | ++黃++{.dotted .warning} | ~~黃~~{.warning} | [黃]{.warning} |
| `{.danger}`  | ==紅=={.danger}  | ++紅++{.danger}  | ++紅++{.solid .danger}  | ++紅++{.dotted .danger}  | ~~紅~~{.danger}  | [紅]{.danger}  |
| `{.muted}`   | ==灰=={.muted}   | ++灰++{.muted}   | ++灰++{.solid .muted}   | ++灰++{.dotted .muted}   | ~~灰~~{.muted}   | [灰]{.muted}   |

{.font-note}

::right::

### 線條

| 寫法                | 結果              |
| ------------------- | ----------------- |
| `++文字++`          | ++波浪++          |
| `++文字++{.solid}`  | ++實線++{.solid}  |
| `++文字++{.dotted}` | ++點線++{.dotted} |

{.font-note}

虛線沒列進來，它是[連結](https://yuto0226.dev)專用的。

---
layout: default
---

# 字級

七個字級。`{.font-<level>}` 可以把任一段或一整塊設定到指定的大小。

display · 3rem · fact 的數字{.font-display}

title · 2.25rem · 頁標題{.font-title}

subtitle · 1.5rem · 封面副標、節標{.font-subtitle}

body · 1.25rem · 內文{.font-body}

aside · 1rem · 提示框{.font-aside}

note · 0.875rem · 參照表、註腳{.font-note}

page · 0.75rem · 頁碼{.font-caption}

<style>
/* A specimen is one line per step, so the body leading only adds space
   between them. */
.tmpl-body p {
  line-height: 1.2;
}
</style>

---
layout: section
---

# 區塊

提示框、表格以及左右與上下的版面

---
layout: two-cols
---

# Callout

Graph Theory 的概念，常被拿來討論偵測工程和 ML 偵測模型的訓練。

::left::

> [!DEFINITION] 割
> 給定 $G=(V,E)$ 與 $s,t \in V$，割 $(S,T)$ 把 $V$ 分成兩個不相交的集合，$s \in S$、$t \in T$。

> [!LEMMA]
> 任何一個割的容量，都不小於 $s$-$t$ 流的值：$|f|\le c(S,T)$。

::right::

> [!THEOREM] Max-flow min-cut
> $$\max_{f}\;|f| \;=\; \min_{(S,T)}\;c(S,T)$$

> [!PROOF]
> 流必須完整穿過每一個割，因此上界成立；殘餘網路無增廣路徑時可取到等號。

---
layout: full
---

# Callout 的類型

### 寫文章用，與 Obsidian 同名

<div class="catalogue">

> [!NOTE]

> [!TIP]

> [!IMPORTANT]

> [!WARNING]

> [!CAUTION]

> [!ABSTRACT]

> [!INFO]

> [!TODO]

> [!SUCCESS]

> [!QUESTION]

> [!FAILURE]

> [!DANGER]

> [!BUG]

> [!EXAMPLE]

> [!QUOTE]

</div>

### 寫筆記用

<div class="catalogue">

> [!DEFINITION]

> [!THEOREM]

> [!LEMMA]

> [!PROOF]

> [!COROLLARY]

> [!PROPOSITION]

> [!AXIOM]

> [!CONJECTURE]

> [!NOTATION]

> [!REMARK]

> [!INTUITION]

> [!RECALL]

> [!EXPLANATION]

> [!EXERCISE]

> [!PROBLEM]

> [!ANSWER]

> [!SOLUTION]

</div>

<style>
.catalogue {
  columns: 5;
  column-gap: var(--tmpl-cell);
  margin-bottom: var(--tmpl-half);
}

.catalogue .markdown-alert {
  break-inside: avoid;
  margin-bottom: 0.25rem;
  padding: 0.125rem 0 0.125rem var(--tmpl-half);
  background: none;
}

.catalogue .markdown-alert-title {
  margin: 0;
}

.catalogue .markdown-alert > p:empty {
  display: none;
}
</style>

---
layout: two-cols-header
---

# 水平比較

偵測方法與繞過方法，常常是同一群人隔一年發表的。

::left::

### 靜態分析建模[^1]

- 從二進位推導出程式**合法的系統呼叫序列**
- 執行時偏離模型即視為入侵
- 不需要訓練資料，誤報率可證明為零

::right::

### 模仿攻擊[^2]

- 把惡意行為==塞進模型允許的序列裡==
- 模型越寬鬆，可塞的空間越大
- 偵測問題就化約成自動機的語言包含問題

::bottom::

防禦方法發表的那一刻，就定義了攻擊方要繞過的目標。

[^1]: D. Wagner and D. Dean, ["Intrusion Detection via Static Analysis"](https://people.eecs.berkeley.edu/~daw/papers/ids-oakland01.pdf), _Proc. IEEE S&P_, 2001.

[^2]: D. Wagner and P. Soto, ["Mimicry Attacks on Host-Based Intrusion Detection Systems"](https://www.cs.purdue.edu/homes/ninghui/readings/AccessControl/wagner_soto_ccs02.pdf), _Proc. ACM CCS_, 2002.

---
layout: two-rows
top: 7
---

# 垂直比較

欄寬不夠時換成上下。兩塊都是整個版心寬，適合放句子長、或是要並排一行程式碼的比較。

::top::

### 偵測寫在行為上

- `Image/Load` 只說模組被載入，不說誰載入、為了什麼
- 要和前一個 `Process/Start` 串起來，事件才有語意

::bottom::

### 繞過寫在同一層

- 不呼叫 `LoadLibrary`，自己把 PE 映射進記憶體，`Image/Load` 就不會發
- 偵測只好往下移到==記憶體頁的屬性變化==

---
layout: section
---

# 圖與程式

程式碼、記憶體圖與圖片

---
layout: default
transition: view-transition
---

# Code Section

```cpp {all|3|4-7|9-10} {class:'code-gutter code-morph'}
// 函式用於將資料寫入檔案
bool writeFile(…) {
    std::ofstream file(filename, std::ios::binary);
    if (!file) {
        std::cout << "無法打開檔案寫入: " << filename << std::endl;
        return false;
    }

    file.write(reinterpret_cast<const char*>(data.data()), data.size());
    return true;
}
```

---
layout: default
---

# Debug

```cpp {3|4|5} {class:'code-debug code-morph'}
// 函式用於將資料寫入檔案
bool writeFile(…) {
    std::ofstream file(filename, std::ios::binary); // [!code bp]
    if (!file) {
        std::cout << "無法打開檔案寫入: " << filename << std::endl;
        return false;
    }

    file.write(reinterpret_cast<const char*>(data.data()), data.size());
    return true;
}
```

---
layout: two-cols-header
clicks: 6
---

# Stack 與記憶體

::left::

frame 往低位址長，`buf` 往高位址寫。

32 個位元組之後沒有東西擋著，再四個就是 `ret` 會載入的位址。

::right::

<StackFrame
  base="0x400100d0"
  :regions="[
    { size: 32, label: 'char buf[32]' },
    { size: 4, label: 'Caller ebp', pointer: 'ebp', overflow: '0x41414141' },
    { size: 4, label: 'Ret Addr', overflow: '0x400100d0' },
  ]"
  steps
  sp="esp"
  :from-click="4"
/>

::bottom::

<MemoryDump
  base="0x400100d0"
  :size="40"
  :writes="[
    { at: 36, bytes: '3C 1A 40 00' },
    { at: 32, bytes: '18 01 01 40' },
    { at: 0, bytes: '48 65 6C 6C 6F 2C 20 77 6F 72 6C 64 21' + ' 00'.repeat(19) },
    { at: 0, size: 32 },
    { at: 32, size: 4, overflow: true },
    { at: 36, bytes: 'D0 00 01 40', overflow: true },
  ]"
  :from-click="1"
  ascii
/>

---
layout: figure
---

# Figure

TONESHELL 是 Mustang Panda 的後門，公開報告裡的落地流程固定是：

- ==側載==：壓縮檔內放合法簽章的 EXE 與同名惡意 DLL[^1]
- ==持久化==：用 Task Scheduler 的 COM 介面建排程，刻意不碰 Run key 與服務[^2]
- ==注入==：C2 下發的 payload 以 DLL injection 執行[^1]

[^1]: Zscaler ThreatLabz, ["Latest Mustang Panda Arsenal: ToneShell and StarProxy"](https://www.zscaler.com/blogs/security-research/latest-mustang-panda-arsenal-toneshell-and-starproxy-p1), 2025.

[^2]: Intezer, ["Frankenstein Variant of the ToneShell Backdoor Targeting Myanmar"](https://intezer.com/blog/frankenstein-variant-of-the-toneshell-backdoor-targeting-myanmar/).

::figure::

<Figure src="/sample.jpg" alt="執行鏈示意" credit="示意圖，非真實樣本" />

---
layout: image-left
image: /sample.jpg
credit: 攝於東京都市大学，作者自攝
---

# Windows 上的 telemetry

行為資料從核心與系統元件送出：

- `ETW`[^2] 讓核心與服務即時送出事件
- 行程建立由==核心回呼==[^1]通知
- `minifilter`[^3] 攔截檔案 I/O 操作
- `AMSI`[^4] 讓防毒檢查腳本內容

[^1]: Microsoft, ["PsSetCreateProcessNotifyRoutineEx function"](https://learn.microsoft.com/windows-hardware/drivers/ddi/ntddk/nf-ntddk-pssetcreateprocessnotifyroutineex), Windows Driver Documentation.

[^2]: Microsoft, ["Event Tracing"](https://learn.microsoft.com/windows/win32/etw/event-tracing-portal), Windows Win32 Documentation.

[^3]: Microsoft, ["Filter Manager Concepts"](https://learn.microsoft.com/windows-hardware/drivers/ifs/filter-manager-concepts), Windows Driver Documentation.

[^4]: Microsoft, ["Antimalware Scan Interface (AMSI)"](https://learn.microsoft.com/windows/win32/amsi/antimalware-scan-interface-portal), Windows Win32 Documentation.

---
layout: image-right
image: /sample.jpg
credit: 攝於東京都市大学，作者自攝
---

# Linux 上的 telemetry

行為資料來自核心的掛鉤點：

- `eBPF` 掛進核心函式與事件點
- `auditd` 記錄系統呼叫稽核事件
- `fanotify` 可在開檔時==放行或拒絕==
- `LSM` hook 讓 eBPF 擋下操作[^1]

[^1]: Linux kernel developers, ["LSM BPF Programs"](https://docs.kernel.org/bpf/prog_lsm.html), The Linux Kernel documentation.

---
layout: image
image: /sample.jpg
credit: 攝於東京都市大学，作者自攝
---

# 櫻花科學計畫 SAKURA Science Program

2025/12 去日本 ==東京都市大学== 體驗了一周交換，滿滿快樂的回憶

---
layout: section
---

# 大字報

一頁給一個大的

---
layout: statement
---

==Buffer Overflow=={.warning}早就死了。

---
layout: fact
---

# 70%

嚴重漏洞裡，記憶體安全問題佔的比例

Microsoft MSRC 2019 與 Chromium 2020 各自統計，兩邊得到同一個數字

---
layout: quote
---

> 程式碼是寫給人看的，順便讓機器執行。

Harold Abelson

---
layout: none
---

<div style="padding: 2rem">
  <p>layout: none 不套用任何樣式，連版心都沒有。</p>
  <p>它存在的目的就是讓你自己接手。</p>
</div>

---
layout: references
---

# 參考資料

1. D. Wagner and D. Dean, ["Intrusion Detection via Static Analysis"](https://people.eecs.berkeley.edu/~daw/papers/ids-oakland01.pdf), in _Proc. IEEE S&P_, 2001, pp. 156–168.
2. D. Wagner and P. Soto, ["Mimicry Attacks on Host-Based Intrusion Detection Systems"](https://www.cs.purdue.edu/homes/ninghui/readings/AccessControl/wagner_soto_ccs02.pdf), in _Proc. ACM CCS_, 2002, pp. 255–264.
3. S. M. Milajerdi et al., ["HOLMES: Real-Time APT Detection through Correlation of Suspicious Information Flows"](https://doi.org/10.1109/SP.2019.00026), in _Proc. IEEE S&P_, 2019, pp. 1137–1152.
4. F. Barr-Smith et al., ["Survivalism: Systematic Analysis of Windows Malware Living-Off-The-Land"](https://doi.org/10.1109/SP40001.2021.00047), in _Proc. IEEE S&P_, 2021, pp. 1557–1574.
5. J. Starink et al., ["Understanding and Measuring Inter-process Code Injection in Windows Malware"](https://doi.org/10.1007/978-3-031-64954-7_25), in _Proc. SecureComm_, 2023, pp. 490–514.
6. R. Sekar, H. Kimm, and R. Aich, ["eAudit: A Fast, Scalable and Deployable Audit Data Collection System"](https://doi.org/10.1109/SP54263.2024.00087), in _Proc. IEEE S&P_, 2024, pp. 3571–3589.

---
layout: statement
---

# Q&A

---
layout: end
---

## ○○○ / Yuto

- <me@yuto0226.dev>
- <https://blog.yuto0226.dev>
- <https://github.com/yuto0226>
