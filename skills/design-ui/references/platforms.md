# Platforms and companion skills

This skill holds the rules that apply on every platform. Platform conventions come from the platform owners'
guidelines; read the relevant pages before designing for a platform, and cite them in reviews.

## Contents

- Official guidelines
- Web
- iOS and macOS
- Android
- Desktop frameworks
- Companion skills

## Official guidelines

| Platform | Guidelines |
|---|---|
| Web accessibility | WCAG 2.2: https://www.w3.org/TR/WCAG22/ |
| Web platform | MDN Web Docs: https://developer.mozilla.org/ and web.dev: https://web.dev/ |
| iOS, iPadOS, macOS | Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/ |
| Android | Material Design 3: https://m3.material.io/ and Android design: https://developer.android.com/design |
| Windows | Fluent 2: https://fluent2.microsoft.design/ |

## Web

- Use modern platform features before libraries: native dialog and popover, CSS grid and container queries,
  `prefers-color-scheme` and `prefers-reduced-motion`, view transitions where supported.
- Performance is part of design: Core Web Vitals targets (LCP under 2.5 s, INP under 200 ms, CLS under 0.1),
  sized images in modern formats, fonts that do not block text.
- No horizontal scroll at 360 px; respect safe areas on mobile browsers.

## iOS and macOS

- Follow the platform's navigation patterns (tab bar, navigation stack, sidebar), system typography with
  Dynamic Type, SF Symbols where suitable, and system materials as the guidelines describe.
- Use the platform's own controls for payments, sign-in and sharing where the guidelines require them.
- Support Dark Mode, Dynamic Type sizes and VoiceOver on every screen.

## Android

- Follow Material 3 components, navigation (navigation bar, rail, drawer), dynamic colour where the brand
  allows, and the system back behaviour, including predictive back.
- Support font scaling, dark theme and TalkBack.

## Desktop frameworks

Electron, Tauri and cross-platform toolkits should feel native on each operating system: native menus and
shortcuts, window controls in the expected place, system fonts, and keyboard-first workflows.

## Companion skills

These are separate projects with their own licences. They are not bundled with this pack; install the ones that
fit your platform, and this skill will defer to them for platform detail. See the repository's
`docs/companion-skills.md` for install commands.

| Need | Companion |
|---|---|
| Apple platform design review grounded in the HIG | an Apple design or HIG review skill |
| Distinctive web front ends | the `frontend-design` plugin from the official Claude Code plugins marketplace |
| Current web platform features instead of legacy patterns | Modern Web Guidance by the Chrome team |
| SwiftUI code quality | a SwiftUI review skill |
| React view transitions and motion | a React view-transitions or motion skill |
