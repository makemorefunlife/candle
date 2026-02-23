# Your Personal Operating Manual

A data-driven career intelligence platform that optimizes decision-making for high-performing professionals by synchronizing behavioral patterns with chronological baseline data.

---

## Service Overview

This platform provides a **Personal Operating Manual** for top 1% professionals in Tech (FAANG) and Finance (Wall Street). By combining behavioral survey analysis with chronological data interpretation, we deliver actionable insights that help you understand your performance architecture, decision patterns, and strategic positioning.

**Core Philosophy:** Your career performance isn't about willpower—it's about understanding your inherent operating system and optimizing it for maximum leverage.

---

## Complete Service Flow

```mermaid
flowchart LR
    Landing --> ClerkLogin["Login (Clerk)"]
    ClerkLogin --> SurveyA["A: Behavioral Survey\n18 Questions"]
    SurveyA --> ResultA["A Result:\nPerformance Identity"]
    ResultA --> SurveyB["B: Chronological Input\nBirth Data"]
    SurveyB --> FreeResult["Free Result:\nB-0 Snapshot + B-1 Cards"]
    FreeResult --> Payment["Payment (Stripe)"]
    Payment --> PremiumReport["B-2: Premium PDF\nvia Email"]
    PremiumReport --> NextService["Next Service"]
```

---

## A Logic: Behavioral Survey Analysis

### Overview

The A Logic analyzes **conscious adaptation patterns** through an 18-question behavioral survey. This captures how you operate in your current professional environment.

### Survey Structure

**5 Core Dimensions:**

1. **Initiation** (Starting Patterns) — How you begin new projects
2. **Sustain** (Focus Maintenance) — How you maintain momentum
3. **Switching** (Transition Ability) — How you handle context switching
4. **Closure** (Completion Patterns) — How you finish work
5. **Bio-Physical** (Energy Management) — Physical energy feedback data

### Energy Model Translation

Traditional energy concepts are translated into modern performance terminology:

| Traditional | Modern Performance Term |
|------------|------------------------|
| Wood (木) | Initial Drive |
| Fire (火) | Expression Intensity |
| Earth (土) | Process Continuity |
| Metal (金) | Closure Precision |
| Water (水) | Strategic Fluidity |

### Output Format

The A Logic generates a 4-section analysis:

1. **Summary Identity** — Your performance archetype (2-3 sentences)
2. **Core Driver** — Your strongest competitive advantage
3. **Operational Logic** — Interaction between highest/lowest energies
4. **Bio-Physical Feedback** — Physical environment optimization recommendations

### Implementation

- **Prompt:** [`prompts/A_SURVEY_ANALYSIS_PROMPT.md`](prompts/A_SURVEY_ANALYSIS_PROMPT.md)
- **Survey Source:** [`prompts/survey_questions.txt`](prompts/survey_questions.txt)
- **Analysis Table:** [`prompts/survey_analysis_table.txt`](prompts/survey_analysis_table.txt)

---

## B Logic: Chronological Data Analysis

### Overview

The B Logic analyzes **innate baseline patterns** using chronological timestamp data (birth date, time, location). This reveals your default operating system under high pressure.

### The Bridge Logic

> "Behavioral surveys (18 questions) capture your **conscious adaptation**—how you operate now. Chronological data (birth time) reveals your **innate baseline**—your default setting under high pressure. By synchronizing these two data points, we identify your 'Performance Gap' and 'Strategic Edge'."

### Input Requirements

- Birth date (year, month, day)
- Birth time (hour, minute)
- Gender
- Birth location (latitude/longitude)

### Calculation Engine

The B Logic uses the [`@orrery/core`](packages/core) package, which provides:

- **Four Pillars (四柱八字)** — 60-ganzhi cycle, Ten Gods, 12-stage analysis, Daewoon cycles
- **Ziwei Doushu (紫微斗數)** — Palace chart generation, Daxian, Liunian/Liuyue analysis
- **Natal Chart (Western Astrology)** — Planet positions, houses, aspects (pure TypeScript)

All calculations run client-side—no backend required.

### Analysis Components

#### B-0: Performance Architecture Snapshot

A concise executive identity snapshot displayed in a Bento Grid format.

**Output:** 6 JSON fields
- `core_engine` — How you naturally produce results
- `decision_os` — Your decision-making architecture
- `unfair_advantage` — Where you outperform disproportionately
- `wealth_strategy` — How you create wealth most effectively
- `risk_pattern` — Predictable failure mode
- `optimal_role` — Best career positioning

**Prompt:** [`prompts/B0_SNAPSHOT_PROMPT.md`](prompts/B0_SNAPSHOT_PROMPT.md)

#### B-1: Day Master Career Intelligence Cards (Free)

Five strategic career intelligence cards based on Day Master analysis only.

**Cards:**
1. **Core Career Weapon** — Primary competitive advantage
2. **Optimal Career Positioning** — Where you generate the most leverage
3. **Decision-Making Style** — How you make decisions under pressure
4. **Hidden Career Risk** — Blind spot analysis
5. **Wealth Strategy Alignment** — How you create wealth most effectively

**Prompt:** [`prompts/B1_DAYMASTER_ANALYSIS_PROMPT.md`](prompts/B1_DAYMASTER_ANALYSIS_PROMPT.md)  
**Engine:** [`engine/B1_CARD_GENERATOR.js`](engine/B1_CARD_GENERATOR.js)

#### B-2: Premium Executive Career Intelligence Report (Paid)

A comprehensive 10-section executive report (4,000-6,000 words) delivered as a PDF via email.

**Sections:**
1. Executive System Overview
2. Your Unfair Advantage
3. Decision OS
4. Role Fit & Positioning
5. Wealth & Compounding Strategy
6. Timing & Career Transition Windows
7. Pressure Pattern & Failure Mode
8. Energy Curve & Sustainability
9. Relationship & Collaboration Map
10. 10-Year Strategic Trajectory

**Prompt:** [`prompts/B2_PREMIUM_FULL_REPORT_PROMPT.md`](prompts/B2_PREMIUM_FULL_REPORT_PROMPT.md)  
**Engine:** [`engine/B2_REPORT_GENERATOR.js`](engine/B2_REPORT_GENERATOR.js)  
**Template:** [`templates/REPORT_TEMPLATE.html`](templates/REPORT_TEMPLATE.html)

**Workflow Documents:**
- [`PDF_GENERATION_WORKFLOW.md`](PDF_GENERATION_WORKFLOW.md)
- [`EMAIL_DELIVERY_WORKFLOW.md`](EMAIL_DELIVERY_WORKFLOW.md)

---

## System Prompt & Communication Guidelines

### Core Identity

**Role:** High-Performance Career Strategist  
**Target Audience:** Top 1% professionals in Tech (FAANG) and Finance (Goldman Sachs, Hedge Funds)  
**Mission:** Provide competitive edge by identifying "Inherent Patterns" and "Strategic Cycles" that behavioral tests alone cannot capture

### Tone & Manner

- **Analytical & Objective** — Avoid emotional or mystical language. Use precision terms (e.g., "High-resolution profiling," "Data-point synchronization")
- **Strategic & Action-Oriented** — Every insight must lead to a "So what?" (e.g., "Therefore, prioritize high-leverage decision-making in Q3")
- **Authoritative yet Sophisticated** — Speak like a McKinsey consultant or top-tier performance coach. Use "We" and "Our analysis" to imply a robust system

### Vocabulary Reframing

**Critical:** These words must be systematically replaced.

| ❌ Avoid (Superstitious) | ✅ Use (Professional) |
|-------------------------|----------------------|
| Fate, Destiny, Luck | Market-Sync Cycles, Strategic Window, High-Probability Periods |
| Energy, Cosmic | Subconscious Drivers, Latent Cognitive Assets, Core Volatility |
| Saju, Fortune, Astrology | Innate Blueprint, Baseline Propensity, Chronological Patterning |
| Birth Time | Chronological Timestamp, Temporal Data-point |

### Privacy & Control

**Privacy Statement:**
> "Personal data (birth date, etc.) is encrypted or discarded immediately after analysis. It is used solely for algorithmic calculation purposes."

**Control Principle:**
Never say "Your fate is X." Instead: "Your data signals currently point to [A], therefore use [B] strategy to maximize career value." The most important thing for this audience is **Sense of Control**—they must feel they hold the steering wheel of their career.

---

## Technology Stack

### Core Calculation
- **`@orrery/core`** — Four Pillars, Ziwei Doushu, Natal Chart calculations (pure TypeScript, client-side)

### AI & Analysis
- **Claude / OpenAI API** — Prompt-based analysis engine
- **Prompt-driven architecture** — All analysis logic in `/prompts` folder

### Infrastructure
- **Auth:** Clerk
- **Payment:** Stripe
- **PDF Generation:** Puppeteer
- **Email Delivery:** Resend

### Development
- **Package Manager:** pnpm
- **Language:** TypeScript (core), JavaScript (engines)

---

## Project Structure

```
HRSaaS/
├── prompts/                    # All AI prompts (core logic)
│   ├── A_SURVEY_ANALYSIS_PROMPT.md
│   ├── B0_SNAPSHOT_PROMPT.md
│   ├── B1_DAYMASTER_ANALYSIS_PROMPT.md
│   └── B2_PREMIUM_FULL_REPORT_PROMPT.md
│
├── engine/                      # Analysis engines & generators
│   ├── baziAnalyzer.js          # Master integration engine
│   ├── B1_CARD_GENERATOR.js     # Free card generator
│   ├── B2_REPORT_GENERATOR.js   # Premium report generator
│   └── [calculation modules]
│
├── packages/core/                # Chronological calculation library
│   ├── src/
│   │   ├── saju.ts              # Four Pillars
│   │   ├── ziwei.ts             # Ziwei Doushu
│   │   ├── natal.ts             # Western Astrology
│   │   └── pillars.ts           # Low-level API
│   └── README.md
│
├── templates/                    # PDF HTML templates
│   └── REPORT_TEMPLATE.html
│
├── docs/                         # Documentation and examples
│   └── examples/                 # Code examples and reference
│       ├── fourPillarsCalculator.md
│       └── twelveStageCalculator.md
│
├── PDF_GENERATION_WORKFLOW.md    # PDF generation process
├── EMAIL_DELIVERY_WORKFLOW.md    # Email delivery process
└── README.md                     # This file
```

---

## Key Concepts

### Prompt-Based Architecture

This service is **not code-based**—it's **prompt-based**. The `/prompts` folder contains the core business logic. All analysis is driven by carefully crafted prompts that translate raw data into strategic insights.

### Data Synchronization

The power of this platform comes from synchronizing two data points:

1. **Behavioral Data (A)** — How you consciously adapt to your environment
2. **Chronological Data (B)** — Your innate baseline under pressure

When these align, you get maximum performance. When they conflict, you get stress patterns and energy drains.

### Evidence-Based Approach

We treat chronological analysis as **alternative data**—not mysticism, but a statistical pattern recognition system. Think of it as "ancient algorithmic modeling" that provides insights behavioral tests cannot capture.

---

## Development Workflow

### Running Locally

```bash
# Install dependencies
pnpm install

# Development server (user runs manually)
pnpm run dev
```

### Git & Deployment

After completing a feature:

```bash
git add .
git commit -m "feat: [description]"
git push
```

Vercel automatically deploys on push.

---

## License

See [`packages/core/LICENSE`](packages/core/LICENSE) for details.

---

## Credits

- **Four Pillars Calculation** — Based on Koh Young-chang's [진짜만세력](http://afnmp3.homeip.net/~kohyc/calendar/cal20000.html), ported to TypeScript
- **Ziwei Doushu** — Based on [lunar-javascript](https://www.npmjs.com/package/lunar-javascript)
- **Natal Chart** — Pure TypeScript port of [Swiss Ephemeris](https://www.astro.com/swisseph/) Moshier theory

---

**Built for professionals who demand precision, evidence, and strategic clarity.**

