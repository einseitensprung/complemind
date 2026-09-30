# complemind – Website

Statische Website von complemind (Konzept & Design aus Wien), neu aufgebaut ohne Adobe Muse.
Reines HTML/CSS/Vanilla-JS, kein Build-Schritt, keine Abhängigkeiten.

## Git-Workflow (verbindlich)

**Jede Änderung wird sofort committed und gepusht.**

- Nach jeder abgeschlossenen Änderung an Dateien in diesem Repo: `git add -A`, `git commit`, `git push` – ohne Rückfrage.
- Eine Änderung = ein Commit mit aussagekräftiger Nachricht auf Deutsch (z. B. „Semperit: Bildunterschrift korrigiert“).
- Direkt auf `main` arbeiten, keine Feature-Branches, außer der User wünscht es.
- Schlägt der Push fehl (z. B. Remote ist weiter): `git pull --rebase`, Konflikte lösen, erneut pushen. Niemals `--force`.
- Keine Secrets, Zugangsdaten oder temporären Dateien committen.

## Struktur

```
index.html                 Startseite mit Scroll-Animationen (Vorhänge, Köpfe, Hände, Kontakt)
*.html                     Skill- und Projektseiten, Impressum
assets/css/style.css       Globale Styles, Unterseiten-Komponenten, Mobile-Layouts
assets/css/home.css        Desktop-Positionen der Startseiten-Elemente
assets/js/main.js          Scroll-Effekte, Slideshows, iMac-Skalierung
assets/js/fonts.js         Adobe Fonts Kit (ff-utility-web-pro, domaingebunden)
images/                    Alle Bilder
```

## Konventionen

- Farben/Fonts als CSS-Variablen in `:root` (`--blue #00a0e6`, `--ink #323232`, …).
- Breakpoint: Desktop ab 961 px, darunter Mobile-Layout ohne Scroll-Animation.
- Scroll-Effekte der Startseite stehen als `data-fx` direkt am Element:
  - `pos: [k, [sx,sy] vor k, [sx,sy] nach k]` – Versatz = Speed × (Scroll − k); `sy 0` = fixiert, `sy -1` = scrollt mit
  - `op:  [k, [fade, ziel] vor, [fade, ziel] nach]` – bei k voll sichtbar, Ziel-Opacity (0–100) nach `fade` px
  - `bg:  [k, …]` – horizontaler Hintergrund-Versatz
- Slideshows: `.slideshow` mit `data-transition="fade|slide"`, `data-autoplay` (ms), optional `.thumbs`.
- Kein Muse-Code, kein jQuery, keine Frameworks einführen.
- Neue Bilder sprechend benennen, ohne Leerzeichen.

## Lokal ansehen

```
python -m http.server 8765
```
→ http://localhost:8765/ (die Webschrift lädt nur auf der complemind-Domain, lokal greift die Ersatzschrift).
