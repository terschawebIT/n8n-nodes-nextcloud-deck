# n8n-nodes-nextcloud-deck

Ein n8n Community Node für die Integration mit Nextcloud Deck. Diese Node ermöglicht es Ihnen, Ihre Nextcloud Deck Boards, Stacks und Karten zu verwalten.

## Installation

Um diesen Node in n8n zu installieren, folgen Sie der [Anleitung für Community Nodes](https://docs.n8n.io/integrations/community-nodes/installation/).

```bash
npm install n8n-nodes-nextcloud-deck
```

## Kompatibilität

- Nextcloud Deck Version: 1.3.0+
- n8n Version: 0.180.0+

## Konfiguration

### Credentials

Erstellen Sie neue Credentials für "Nextcloud Deck API" mit:

- **Nextcloud URL**: Die URL Ihrer Nextcloud-Instanz (z.B. `https://cloud.example.com`)
- **Benutzername**: Ihr Nextcloud Benutzername
- **Passwort**: Ihr Nextcloud Passwort oder App-Passwort (empfohlen)

> **Tipp**: Es wird dringend empfohlen, ein App-Passwort zu verwenden. Erstellen Sie eines unter Einstellungen > Sicherheit > App-Passwörter.

## Funktionen

### Board-Operationen

- **Alle Boards abrufen**: Listet alle verfügbaren Boards auf
- **Board abrufen**: Ruft ein spezifisches Board ab
- **Board erstellen**: Erstellt ein neues Board
- **Board aktualisieren**: Aktualisiert ein vorhandenes Board
- **Board löschen**: Löscht ein Board

### Geplante Funktionen

- Stack-Operationen (Spalten verwalten)
- Card-Operationen (Karten verwalten)
- Label-Management
- Benutzer-Zuweisungen
- Kommentare

## API-Dokumentation

Diese Node basiert auf der [Nextcloud Deck REST API](https://deck.readthedocs.io/en/latest/API/).

## Beispiel-Workflow

1. **Alle Boards abrufen**
   - Ressource: Board
   - Operation: Alle Boards abrufen

2. **Neues Board erstellen**
   - Ressource: Board
   - Operation: Board erstellen
   - Titel: "Mein neues Projekt"
   - Farbe: "0082C9" (Blau)

## Entwicklung

```bash
# Dependencies installieren
npm install

# Build
npm run build

# Linting
npm run lint

# Entwicklungsmodus
npm run dev
```

## Lizenz

MIT

## Support

Bei Problemen oder Feature-Anfragen erstellen Sie bitte ein Issue im [GitHub Repository](https://github.com/terschawebIT/n8n-nodes-nextcloud-deck).

## Autor

Niko Terschawetz - [nt@terschaweb.de](mailto:nt@terschaweb.de) 