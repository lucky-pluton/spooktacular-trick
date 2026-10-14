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

## ✨ Features

- 🎮 **Interactive Play Mode**: 5 sequential story-driven game scenes with interactive decisions, flying candy bags, and mathematical feedback.
- 📖 **"Learn the Trick" Storybook Comic**: Self-paced illustrated comic story for relaxed reading without test anxiety.
- 🧪 **Math Practice Sandbox**: Try out other 3-digit subtraction across zeros (e.g. 400 − 65, 300 − 28, 600 − 84).
- 🔊 **Pure Web Audio API Sound Effects**: Spooky night breeze, magical candy borrowing twinkles, candy bag drops, and cheering victory fanfare (100% offline).
- 🗣️ **Voice Narration**: Built-in Web Speech API voice synthesis with toggle for young learners.
- 🖨️ **Printable Worksheet**: Formatted for `@media print` so teachers and parents can print out paper math worksheets.
- 🔗 **Share Game**: Built-in Web Share API with 1-click clipboard copy fallback and social preview tags.

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
