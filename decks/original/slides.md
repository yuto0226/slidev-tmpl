---
theme: ../../themes/original
title: Original
layout: cover
subtitle: 這是簡報的副標題
# Shown on the theme index: a cover, a banner over body copy, a code
# block, a diagram component.
preview: [1, 4, 6, 8]
---

# 這是簡報的標題

---
layout: two-cols
---

# Outline

1. 標題
2. 標題
3. 標題
4. 標題
5. 標題

::right::

6. 標題
7. 標題
8. 標題
9. 標題
10. 標題

<style>
li {
  font-size: 36px;
  font-weight: 700;
}
</style>

---
layout: content
---

# 標題

新增少量內文

- List item
- List item
  - Sub item
  - Sub item

---
layout: content
---

# 標題

新增少量內文

- List item
- List item
  - Sub item
  - Sub item

<Banner>Pwned</Banner>

---
layout: section
---

# 這是章節標題

哈哈想不到吧

---
layout: content
---

# Code Section

```cpp {all|3|4-7|9-10}
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
layout: content
---

# Debug

```cpp {3|4|5} {class:'code-debug'}
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
layout: two-cols
---

# 棧 Stack

一個 frame 往低位址長：先推入返回位址，接著是呼叫者的 frame pointer，最後才配置區域變數。

::right::

<StackFrame
  base="0x400100d0"
  :regions="[
    { size: 32, label: 'char buf[32]' },
    { size: 4, label: 'Caller ebp' },
    { size: 4, label: 'Ret Addr', mark: true },
  ]"
  steps
/>

---
layout: content
---

# 記憶體 Memory

<MemoryDump
  base="0x0000"
  bytes="48 65 6C 6C 6F 2C 20 77 6F 72 6C 64 21 00 00 00
         41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
         41 41 41 41 41 41 41 41 F4 00 01 40 00 00 00 00"
  :mark="[24, 36]"
  ascii
/>

---
layout: two-cols
---

# 參考資料

- List item
- List item
  - Sub item
  - Sub item

::right::

- List item
- List item
  - Sub item
  - Sub item

---
layout: section
---

# Happy Hacking

you@example.com
