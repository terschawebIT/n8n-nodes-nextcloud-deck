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
  - **🆕 Benutzer zuweisen** (optional) - Direkte Benutzerzuweisung bei Erstellung
- **Karte aktualisieren**: Aktualisiert eine vorhandene Karte (mit Dropdown-Auswahl)
  - Alle Felder optional
  - **🆕 Benutzer zuweisen** (optional) - Zusätzlichen Benutzer zuweisen
- **Karte löschen**: Löscht eine Karte (mit Dropdown-Auswahl)
- **Benutzer zuweisen**: Weist einen Benutzer zu einer Karte zu
- **Benutzer entfernen**: Entfernt einen Benutzer von einer Karte

> **⚠️ Hinweis zu Labels**: Die direkte Label-Zuweisung bei Kartenerstellung/-aktualisierung ist temporär deaktiviert aufgrund von UI-Kompatibilitätsproblemen. Verwenden Sie stattdessen die separaten Label-Operationen "Label zu Karte zuweisen".

### Label-Operationen (Tags/Etiketten)

- **🆕 Alle Labels abrufen**: Listet alle Labels eines Boards auf (mit Board-Dropdown)
- **🆕 Label abrufen**: Ruft ein spezifisches Label ab (mit Board- und Label-Dropdown)
- **🆕 Label erstellen**: Erstellt ein neues Label in einem Board
  - Titel (erforderlich)
  - Farbe (erforderlich, mit Farbwähler)
- **🆕 Label aktualisieren**: Aktualisiert ein vorhandenes Label (mit Dropdown-Auswahl)
  - Titel und Farbe optional
- **🆕 Label löschen**: Löscht ein Label (mit Dropdown-Auswahl)
- **🆕 Label zu Karte zuweisen**: Weist ein Label zu einer Karte zu
- **🆕 Label von Karte entfernen**: Entfernt ein Label von einer Karte

### Comment-Operationen (Kommentare)

- **🆕 Alle Kommentare Abrufen**: Listet alle Kommentare einer Karte auf
- **🆕 Kommentar Abrufen**: Ruft einen spezifischen Kommentar ab
- **🆕 Kommentar Erstellen**: Erstellt einen neuen Kommentar an einer Karte
  - Nachricht (erforderlich, mehrzeilig)
- **🆕 Kommentar Aktualisieren**: Aktualisiert einen vorhandenen Kommentar
  - Neue Nachricht (erforderlich)
- **🆕 Kommentar Löschen**: Löscht einen Kommentar

> **Hinweis**: Kommentare werden über die Nextcloud OCS Comments API verwaltet und erfordern entsprechende Berechtigungen.

### Attachment-Operationen (Anhänge) 🆕

- **✨ Alle Anhänge Abrufen**: Listet alle Anhänge einer Karte auf
  - Vollständige Board → Stack → Card Auswahl mit ResourceLocator
  - Zeigt alle Attachment-Details inkl. Dateigröße und MIME-Type
- **✨ Anhang Abrufen**: Ruft einen spezifischen Anhang ab
  - Genaue Attachment-Details und Metadaten
- **✨ Anhang Erstellen**: Fügt einen neuen Anhang zu einer Karte hinzu
  - **Typ-Auswahl**: "Deck-Datei" oder "Nextcloud-Datei"
  - **Flexible Datenquelle**: Dateipfad oder Dateiinhalt
  - **Automatische Integration**: Direkte Synchronisation mit Nextcloud Files
- **✨ Anhang Aktualisieren**: Aktualisiert einen vorhandenen Anhang
  - **Optionale Datenänderung**: Neue Datei oder Pfad (optional)
- **✨ Anhang Löschen**: Entfernt einen Anhang komplett
  - **Sichere Löschung**: Bestätigung via Attachment-ID

### Attachment-Typ Unterstützung

- **`deck_file`**: Dateien, die direkt innerhalb der Deck-App gespeichert werden
  - Legacy-Support für ältere Deck-Versionen (< 1.3.0)
  - Interne Deck-Dateiverwaltung
- **`file`**: Dateien aus der regulären Nextcloud-Dateiverwaltung (empfohlen)
  - Standard ab Deck 1.3.0+
  - Integration mit Nextcloud Files
  - Bessere Synchronisation und Freigabe

> **💡 API-Hinweis**: Die Attachment-Funktionalität basiert auf der [offiziellen Deck Attachments API](https://deck.readthedocs.io/en/latest/API/#attachments) und verwendet REST-Endpunkte für optimale Kompatibilität.

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

### Label-Management System

- **🎨 Farb-basierte Organisation**: Erstellen Sie farbkodierte Labels für bessere visuelle Organisation
- **🔄 Vollständige CRUD-Operationen**: Erstellen, Lesen, Aktualisieren und Löschen von Labels
- **🏷️ Flexibles Tagging**: Weisen Sie Labels dynamisch zu Karten zu oder entfernen Sie sie
- **📋 Board-übergreifende Verwaltung**: Labels werden auf Board-Ebene verwaltet und können allen Karten des Boards zugewiesen werden
- **🔍 Suchbare Listen**: Alle Label-Listen sind durchsuchbar für bessere Benutzerfreundlichkeit

### Geplante Funktionen

- ~~Anhänge verwalten~~ ✅ **Implementiert!**
- ~~Kommentar-System~~ ✅ **Implementiert!**

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