# CGPA Calculator

A free, mobile-friendly SGPA and CGPA calculator for college students on the 10-point grading scale.

**Live demo:** https://vikaskapuganti.github.io/cgpa-calculator/

## What it does

- **SGPA:** add your subjects, credits and grades for one semester and get your SGPA instantly.
- **CGPA:** add each semester's SGPA and credits to get your overall CGPA, weighted by credits.
- **One tap transfer:** send a semester's SGPA straight into the CGPA list.
- **Percentage conversion:** choose between common formulas (AICTE, CGPA x 10, CGPA x 9.5).
- **Remembers your data:** your entries stay saved in your browser if you refresh.
- Works on phone and desktop, with automatic dark mode.

## How it calculates

```
SGPA = sum(credits x grade points) / sum(credits)
CGPA = sum(semester credits x SGPA) / sum(semester credits)
```

Grade scale: O = 10, A+ = 9, A = 8, B+ = 7, B = 6, C = 5, P = 4, F = 0

Universities use different percentage conversion rules, so always confirm your university's official formula.

## Built with

HTML, CSS and JavaScript. No frameworks, no libraries, hosted on GitHub Pages.

## Run it locally

1. Download or clone this repository.
2. Open `index.html` in any browser.

## Author

Built by [Vikas Kapuganti](https://github.com/vikaskapuganti). Free for students, shared with [EduMoon](https://theedumoon.com).
