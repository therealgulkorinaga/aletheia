# Aletheia Screen Reference

Visual description of each screen in Phase 1.

## 1. Landing Page (`/`)

```
┌────────────────────────────────────────────────────────┐
│  Aletheia                              [Sign In]        │
├────────────────────────────────────────────────────────┤
│                                                         │
│                                                         │
│        Turn board authority into                       │
│        executable AI governance                        │
│                                                         │
│     Aletheia bridges accountability and execution.     │
│     Policy becomes code. Every AI action generates     │
│     defensible evidence.                               │
│                                                         │
│                    [Sign In]                           │
│                                                         │
│                                                         │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐         │
│  │           │  │           │  │           │         │
│  │ The       │  │ What      │  │ Who       │         │
│  │ Problem   │  │ Aletheia  │  │ It's For  │         │
│  │           │  │ Does      │  │           │         │
│  └───────────┘  └───────────┘  └───────────┘         │
│                                                         │
│                                                         │
│  Aletheia — Confidential          © 2026 Aletheia     │
└────────────────────────────────────────────────────────┘
```

**Colors**: Gradient background (slate-50 → slate-200), white cards, slate-900 text, amber accent bars

---

## 2. Login Page (`/auth/login`)

```
┌────────────────────────────────────────────────────────┐
│                                                         │
│                      Aletheia                          │
│                 Sign in to your account                │
│                                                         │
│           ┌─────────────────────────┐                 │
│           │  Sign In                │                 │
│           │  Enter your credentials │                 │
│           │                          │                 │
│           │  Email:                  │                 │
│           │  [________________]      │                 │
│           │                          │                 │
│           │  Password:               │                 │
│           │  [________________]      │                 │
│           │                          │                 │
│           │       [Sign In]          │                 │
│           │                          │                 │
│           │  ─────────────────────── │                 │
│           │  Demo Credentials:       │                 │
│           │  ┌─────┐ ┌─────┐        │                 │
│           │  │OPER.│ │APPR.│        │                 │
│           │  └─────┘ └─────┘        │                 │
│           │  ┌─────┐ ┌─────┐        │                 │
│           │  │COMP.│ │ADMIN│        │                 │
│           │  └─────┘ └─────┘        │                 │
│           └─────────────────────────┘                 │
│                                                         │
│              Aletheia — Confidential                   │
└────────────────────────────────────────────────────────┘
```

**Interaction**: Click demo credential button → auto-fills email/password

---

## 3. Dashboard (`/dashboard`)

```
┌───────────┬────────────────────────────────────────────┐
│           │  Aletheia          Sarah Chen [OPERATOR] ▼ │
│ Aletheia  ├────────────────────────────────────────────┤
│ Govern... │                                             │
│           │  Dashboard                                  │
│ ● Dashboard│  Overview of governance activity and       │
│ ● Workflows│  workflow status                           │
│ ● New      │                                             │
│   Workflow │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│           │  │ 12   │ │ 3    │ │ 2    │ │ 4.2h │    │
│           │  │Wrkfl.│ │Pend. │ │Excpt.│ │Avg   │    │
│           │  └──────┘ └──────┘ └──────┘ └──────┘    │
│           │                                             │
│           │  ┌─────────────────────────────────────┐   │
│           │  │ Recent Activity                     │   │
│           │  │                                     │   │
│           │  │ Activity feed will be populated...  │   │
│           │  │                                     │   │
│           │  └─────────────────────────────────────┘   │
│           │                                             │
│  v1.0.0   │                                             │
└───────────┴────────────────────────────────────────────┘
```

**Sidebar Colors**: Dark slate-900 background, slate-100 text, slate-800 active state

**Metric Cards**: Blue (workflows), Amber (pending), Red (exceptions), Green (avg time)

---

## 4. Navigation Variations by Role

### Operator Sidebar
```
● Dashboard
● Workflows
● New Workflow
```

### Approver Sidebar
```
● Dashboard
● Approval Inbox
```

### Compliance Sidebar
```
● Dashboard
● Workflows
● Ledger
● Reports
```

### Admin Sidebar
```
● Dashboard
● Policies
● Users
● Authorities
```

---

## 5. User Menu (Topbar Dropdown)

```
Click user button in top right:

┌────────────────────────┐
│ Sarah Chen             │
│ operator@demo.com      │
├────────────────────────┤
│ 🚪 Log out             │
└────────────────────────┘
```

---

## Design Notes

### Spacing
- Container padding: 24px (p-6)
- Card padding: 32px (p-8)
- Component gaps: 24px (gap-6)

### Borders
- Card borders: 1px slate-200
- Subtle shadows: shadow-sm to shadow-lg
- Rounded corners: minimal (rounded-sm) for authoritative feel

### Font Sizes
- Hero: 6xl-7xl (Crimson Pro)
- Page titles: 4xl (Crimson Pro)
- Card titles: 2xl (Crimson Pro)
- Body: base-xl (IBM Plex Sans)
- Captions: sm-xs (IBM Plex Sans)
- Monospace: sm (JetBrains Mono)

### Animation
- Hover states: subtle color transitions
- Button hover: bg-slate-800 → bg-slate-900
- Link hover: text-slate-300 → text-white

---

**This is not consumer SaaS. This is software for board rooms and audits.**

Aletheia — Confidential
