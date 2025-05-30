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
- **Board abrufen**: Ruft ein spezifisches Board ab (mit Dropdown-Auswahl)
- **Board erstellen**: Erstellt ein neues Board
- **Board aktualisieren**: Aktualisiert ein vorhandenes Board (mit Dropdown-Auswahl)
- **Board löschen**: Löscht ein Board (mit Dropdown-Auswahl)

### Stack-Operationen (Spalten)

- **Alle Stacks abrufen**: Listet alle Stacks eines Boards auf (mit Board-Dropdown)
- **Stack abrufen**: Ruft einen spezifischen Stack ab (mit Board- und Stack-Dropdown)
- **Stack erstellen**: Erstellt einen neuen Stack in einem Board (mit Board-Dropdown)
- **Stack aktualisieren**: Aktualisiert einen vorhandenen Stack (mit Dropdown-Auswahl)
- **Stack löschen**: Löscht einen Stack (mit Dropdown-Auswahl)

### Card-Operationen (Karten)

- **Stack mit Karten abrufen**: Ruft einen Stack mit allen enthaltenen Karten ab (mit Board- und Stack-Dropdown)
- **Karte abrufen**: Ruft eine spezifische Karte ab (mit Board-, Stack- und Card-Dropdown)
- **Karte erstellen**: Erstellt eine neue Karte in einem Stack
  - Titel (erforderlich)
  - Beschreibung (optional, mehrzeilig)
  - Typ: Standard oder Markdown (optional)
  - Reihenfolge im Stack (optional)
  - Fälligkeitsdatum (optional)
- **Karte aktualisieren**: Aktualisiert eine vorhandene Karte (mit Dropdown-Auswahl)
- **Karte löschen**: Löscht eine Karte (mit Dropdown-Auswahl)
- **Benutzer zuweisen**: Weist einen Benutzer zu einer Karte zu
- **Benutzer entfernen**: Entfernt einen Benutzer von einer Karte

> **Hinweis**: Die Nextcloud Deck API stellt keinen direkten Endpunkt zum Abrufen aller Karten eines Stacks bereit. Die Operation "Stack mit Karten abrufen" ruft stattdessen den Stack ab und extrahiert die darin enthaltenen Karten.

### UI-Verbesserungen

- **Resource Locator**: Flexible Auswahl zwischen Dropdown-Listen und direkter ID-Eingabe
  - **Listen-Modus**: Benutzerfreundliche Dropdown-Listen mit Suchfunktion
  - **ID-Modus**: Direkte Eingabe von Board- und Stack-IDs für Automatisierung
- **Dynamische Listen**: Stack-Listen werden automatisch basierend auf der Board-Auswahl aktualisiert
- **Intelligente Validierung**: Optionale Felder werden nur gesendet wenn sie Werte enthalten
- **Suchfunktion**: Alle Listen sind durchsuchbar für bessere Benutzerfreundlichkeit

### Flexibilität

- **Hybrid-Auswahl**: Jedes Board/Stack-Feld kann sowohl über Liste als auch über ID ausgewählt werden
- **API-Integration**: Perfekt für Workflows, die IDs aus anderen Systemen verwenden
- **Benutzerfreundlichkeit**: Dropdown-Listen für manuelle Auswahl, ID-Eingabe für Automatisierung

### Geplante Funktionen

- Label-Management für Karten
- Kommentar-System
- Anhänge verwalten

## API-Dokumentation

Diese Node basiert auf der [Nextcloud Deck REST API](https://deck.readthedocs.io/en/latest/API/).

## Beispiel-Workflow

1. **Board und Stacks erstellen**
   - Ressource: Board → Operation: Board erstellen
   - Titel: "Mein Projekt", Farbe: "0082C9"
   - Ressource: Stack → Operation: Stack erstellen
   - Board-ID: {Board-ID}, Titel: "To Do"

2. **Workflow organisieren**
   - Erstellen Sie Stacks wie "To Do", "In Progress", "Done"
   - Verwenden Sie die Reihenfolge-Parameter für die richtige Anordnung

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