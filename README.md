# Spooktacular Trick 🎃👻

An interactive Halloween-themed educational math game teaching 3-digit subtraction with regrouping across zeros (**500 − 53 = 447**) through living haunted houses and candy borrowing!

🔗 **Live Game URL**: [https://lucky-pluton.github.io/spooktacular-trick/](https://lucky-pluton.github.io/spooktacular-trick/)  
📦 **GitHub Repository**: [https://github.com/lucky-pluton/spooktacular-trick](https://github.com/lucky-pluton/spooktacular-trick)

---

## 📖 The Story & Core Concept

**Problem: 500 − 53 = ?**

Three living haunted houses stand along a moonlit street holding 500 candies:
- **Hundreds House (5)**: 500 candies
- **Tens House (0)**: 0 candies
- **Ones House (0)**: 0 candies

Two cute trick-or-treaters (Ghostie & Witchy) arrive needing **53 candies** (5 tens and 3 single candies).

1. **Step 1: The Ones House Needs Help**: The Ones House has 0 candies and knocks on its neighbor, the Tens House.
2. **Step 2: The Chain of Borrowing**: The Tens House also has 0, so it asks the kindly Hundreds House. The Hundreds House generously gives **1 Hundred (= 10 Tens = 100 candies)**. The Hundreds house becomes 4, and the Tens house now has 10 tens.
3. **Step 3: Pass 1 Ten to Ones**: The Tens House passes **1 Ten (= 10 candies)** to the Ones House. The Tens house now has 9 tens remaining, and the Ones house has 10 ones!
   - Total check: 400 + 90 + 10 = 500 candies. Not a single candy was lost!
4. **Step 4: Trick or Treat!**:
   - Ones: 10 − 3 = **7**
   - Tens: 9 − 5 = **4**
   - Hundreds: 4 − 0 = **4**
   - **Final Answer: 500 − 53 = 447**!

---

## 🏰 Module 1: Trick-or-Think
Subtitle: *"Borrow, regroup, and help the houses share their candies!"*

Teaches traditional 3-digit subtraction through base-10 candy sharing, haunted-house place-value regrouping, and borrowing across zeros:
- **Game Mode**: 5 progressive levels with level progression, points, candies, and 3-star ratings.
- **Notebook Mode**: Math sandbox, 5 problems, and printable A4 math worksheets.
- **Trick-or-Treat Candy Story**: Illustrated comic showing the candy borrowing process.

---

## 🏮 Module 2: Math O' Lantern
Subtitle: *"Help Ghostie collect lanterns and discover the distance between numbers!"*

Teaches subtraction through counting up, number jumps, and reaching friendly benchmark numbers (finding the distance between two numbers):
- **Core Concept**: To solve $500 - 36$, Ghostie begins at $36$ and travels forward along the magical Lantern Trail to $500$:
  - Jump 1: $36 \to 40$ ($+4$ lanterns)
  - Jump 2: $40 \to 100$ ($+60$ lanterns)
  - Jump 3: $100 \to 500$ ($+400$ lanterns)
  - Total collected: $4 + 60 + 400 = 464$ lanterns! Therefore, $500 - 36 = 464$.
- **Guided Journey**: Structured step-by-step sequence with Witchy's questions, randomized options, gentle hints, and celebration of the final difference.
- **Lantern Sandbox**: Free exploratory jumping where children can choose custom benchmark targets (e.g. jumping to 50 first instead of 40), execute valid jumps, and see how all valid sequences sum to the exact difference!
- **Five Subtraction Challenges**: Reusable for $500 - 53 = 447$, $400 - 65 = 335$, $300 - 28 = 272$, $600 - 84 = 516$, and $700 - 49 = 651$.
- **Ghostie & Witchy's Story**: Illustrated storybook introducing the characters and method.

---

## ✨ Features

- 🎃 **Two Distinct Modules**: Module selection screen cleanly separating Trick-or-Think and Math O' Lantern.
- 🎮 **Interactive Play Mode**: Story-driven game scenes with interactive decisions and mathematical feedback.
- 📖 **Illustrated Storybooks**: Comics and story modals for both learning methods.
- 🧪 **Lantern Sandbox & Math Sandbox**: Multiple valid jumping paths and practice problems.
- 🔊 **Pure Web Audio API Sound Effects**: Magical lantern hop whooshes, chime pings, and victory fanfares (100% offline).
- 🗣️ **Voice Narration**: Web Speech API voice synthesis with toggle for young learners.
- 🖨️ **Printable Worksheet**: Formatted for `@media print` paper math worksheets.
- 🔗 **Share Game**: Built-in Web Share API with 1-click clipboard copy fallback.

---

## 🛠️ Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 🚀 Deployment

- **Vercel**: Configured with `vercel.json` and relative `base: './'` in `vite.config.js`. Connect the GitHub repository directly to Vercel for instant deployments.
- **GitHub Pages**: Configured with GitHub Actions / Pages on branch `main` or `gh-pages`.
