# Security Policy

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

We take the security of this prompt injection detection extension seriously. If you've discovered a security vulnerability, we appreciate your help in disclosing it to us responsibly.

### How to Report

1. **Email**: Send details to the repository owner via GitHub private message or email (check profile)
2. **Expected Response Time**: You should receive an acknowledgment within 48 hours
3. **Disclosure Timeline**: We aim to provide a fix within 30 days for critical vulnerabilities

### What to Include

- **Type of vulnerability** (e.g., XSS, pattern bypass, permission escalation)
- **Step-by-step reproduction** instructions
- **Potential impact** assessment
- **Proof of concept** (if applicable)
- **Suggested fix** (optional but appreciated)

### Vulnerability Severity Classification

#### Critical (P0)
- Remote code execution in extension context
- Ability to steal user data from other tabs
- Complete bypass of all prompt injection detection
- Permission escalation allowing unauthorized actions

#### High (P1)
- Persistent XSS in extension UI
- Partial bypass of detection for major attack patterns
- Unauthorized access to extension storage
- Privacy leaks of user input data

#### Medium (P2)
- DOM-based XSS in specific contexts
- Bypass of specific pattern categories
- Performance-based DoS of extension
- Minor information disclosure

#### Low (P3)
- UI spoofing without data compromise
- Non-security bugs affecting UX
- Documentation issues

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| main    | :white_check_mark: |
| < 1.0   | :x: (pre-release)  |

## Security Measures Currently Implemented

### Extension Security
- **Manifest V3** compliance with minimal permissions
- **Content Security Policy** (CSP) enforcement
- **No remote code execution**: All code is bundled
- **Limited permissions**: Only activeTab and storage
- **No external API calls**: All processing is local

### Code Security
- **TypeScript** for type safety
- **ESLint** for static code analysis
- **Input sanitization** for pattern matching
- **DOM XSS prevention** via safe rendering practices

### Build & Supply Chain
- **Vite build system** with tree-shaking
- **No CDN dependencies** - all bundled locally
- **Lockfile** (package-lock.json) for dependency integrity
- **.gitignore** prevents sensitive file commits

## Known Limitations & Attack Surface

### Current Limitations

1. **Pattern-based Detection Only**
   - The extension uses regex and keyword matching
   - Sophisticated obfuscation can bypass detection
   - No ML/AI-based contextual analysis yet
   - False positives and false negatives are possible

2. **Browser Extension Attack Surface**
   - Vulnerable to extension permission model attacks
   - Can be disabled/removed by user or malware
   - Subject to browser extension store policies
   - No protection against browser-level exploits

3. **Pattern Database Maintenance**
   - Patterns must be manually updated
   - New attack techniques require pattern additions
   - Community-sourced patterns need verification
   - No auto-update mechanism for patterns currently

4. **Performance Constraints**
   - Large inputs may cause detection delays
   - Complex regex patterns can impact performance
   - No rate limiting on detection calls

### Not Covered / Out of Scope

- **Server-side prompt injection**: This tool only works client-side
- **AI model vulnerabilities**: We detect patterns, not model flaws
- **Network-level attacks**: Extension doesn't inspect network traffic
- **Phishing/social engineering**: Not designed to detect these
- **Browser vulnerabilities**: Outside extension scope

## Security Roadmap

### Planned Improvements

- [ ] **Automated dependency scanning** (Dependabot)
- [ ] **CodeQL static analysis** workflow
- [ ] **Security.txt** file for standardized reporting
- [ ] **Cryptographic signing** of releases
- [ ] **Subresource Integrity (SRI)** for any external resources
- [ ] **Content Security Policy hardening**
- [ ] **Privilege minimization** - review all permissions
- [ ] **Automated security testing** in CI/CD

### Future Security Features

- [ ] **ML-based detection** to reduce bypass rates
- [ ] **Community pattern database** with vetted submissions
- [ ] **Telemetry** (opt-in, privacy-preserving) for attack trends
- [ ] **Real-time pattern updates** via secure channel
- [ ] **Sandboxed pattern execution** for custom user patterns

## Responsible Disclosure Recognition

We believe in acknowledging security researchers who help improve our security:

- Public acknowledgment in CHANGELOG (with your permission)
- Credit in release notes
- Listed in a future SECURITY_CONTRIBUTORS.md file

## Security Best Practices for Users

1. **Install from official sources only** (GitHub releases or official extension stores)
2. **Review permissions** before installing
3. **Keep updated** to latest version
4. **Report suspicious behavior** immediately
5. **Don't modify extension code** unless you know what you're doing
6. **Use alongside other security tools**, not as sole defense

## Additional Resources

- [OWASP LLM Top 10](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [Chrome Extension Security](https://developer.chrome.com/docs/extensions/mv3/security/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

## Contact

For security concerns: Use GitHub private vulnerability reporting (preferred) or contact repository owner directly.

For general issues: Open a public GitHub issue.

---

**Last Updated**: November 2025
**Policy Version**: 1.0
