# Companion skills and plugins

This pack covers the product workflow end to end and holds its own design rules (`design-ui`). Platform-specific
depth comes from other projects, which keep their own licences and are not bundled here. Install the ones that
fit your product; the skills in this pack defer to them for platform detail.

Review any third-party skill before installing it: skills can run commands with your permissions.

## Design and front end

| Companion | What it adds | Install |
|---|---|---|
| `frontend-design` (official Claude Code plugins marketplace) | Distinctive, non-generic web front ends | `/plugin install frontend-design@claude-plugins-official` |
| Modern Web Guidance (Chrome, Edge, Firefox and MDN teams, Apache-2.0) | Current web platform features instead of legacy patterns; a legacy-pattern scanner | `npx modern-web-guidance@latest install` ([source](https://github.com/GoogleChrome/modern-web-guidance-src)) |
| Apple design review skill ([dickwu/apple-design-skill](https://github.com/dickwu/apple-design-skill)) | Design review grounded in Apple's Human Interface Guidelines, for iOS, macOS and cross-platform apps | Copy its folder into `.claude/skills/` (no licence file upstream at the time of writing; check before redistributing) |
| SwiftUI Pro ([twostraws/SwiftUI-Agent-Skill](https://github.com/twostraws/SwiftUI-Agent-Skill)) | SwiftUI code quality and modern API use | `/plugin marketplace add twostraws/SwiftUI-Agent-Skill`, then `/plugin install swiftui-pro@swiftui-agent-skill` |
| React view transitions skill ([vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)) | Page and element transitions in React and Next.js | See its README |

## Testing and live checks

| Companion | What it adds | Install |
|---|---|---|
| Playwright MCP server | A real browser for the live check and design screenshots | `claude mcp add playwright npx @playwright/mcp@latest` |
| `playwright` plugin (official marketplace) | The same, as a plugin | `/plugin install playwright@claude-plugins-official` |

## Security

| Companion | What it adds | Install |
|---|---|---|
| `claude-security` (official Claude Code plugins marketplace) | Whole-repository and diff security scans with verified findings | `/plugin install claude-security@claude-plugins-official` |

## How precedence works

1. The project's `CLAUDE.md` and its design system page.
2. A platform companion skill, for its platform.
3. This pack's defaults.

Write the companions a project relies on under `Project rules` in the `Build workflow` section, so every session
and every builder uses them.
