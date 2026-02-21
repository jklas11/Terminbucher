# TerminBot Nürnberg

Dieses Skript automatisiert die Suche und Buchung eines zeitnahen Termins (innerhalb der nächsten 5 Tage) bei der Nürnberger Stadtverwaltung.

Da oft täglich Termine storniert werden und diese meist zu bestimmten Zeiten (z. B. morgens zwischen 6:00 und 7:00 Uhr) wieder im System freigegeben werden, übernimmt dieser Bot die Aufgabe, die Seite in dieser Zeit automatisch und kontinuierlich zu aktualisieren, bis ein passender Termin gefunden und gebucht ist.

## Voraussetzungen

* **Firefox Browser:** Muss auf dem System installiert sein (der Bot nutzt Selenium, um Firefox fernzusteuern).
* **Konfigurationsdatei:** Eine gültige Datei namens `config.py` muss im selben Ordner wie das Skript (oder die `.exe`) liegen.

## Einrichtung & Nutzung

1. **Konfiguration erstellen:**
   - Kopiere die beiliegende Datei `config.example.py` und nenne die Kopie `config.py`.
   - Öffne die neue `config.py` und trage dort deine Daten (Name, E-Mail, Anschrift etc.) ein.

2. **Ausführung:**
   - **Als `.exe`:** Lade die fertig kompilierte `TerminBot.exe` und lege die `config.py` in denselben Ordner.
   - **Als Python-Skript:**
     1. Erstelle eine virtuelle Umgebung und aktiviere sie (`python -m venv venv` und `source venv/bin/activate` / `venv\Scripts\activate`).
     2. Installiere die Abhängigkeiten: `pip install -r requirements.txt`.
     3. Starte den Bot: `python check_and_book.py`.

3. **Verhalten des Bots:**
   - Das Skript öffnet den Browser.
   - Navigiere beim Start auf der geöffneten Website manuell durch die Auswahl deines Anliegens, bis du bei der "Standortauswahl" (z. B. Kfz-Zulassung Großreuther Str.) ankommst. Sobald die Seite geladen ist, erkennt das Skript die Seite, übernimmt ab dort automatisch die Steuerung und beginnt seinen Such-Loop.
   - Sobald ein Termin gefunden wird, wählt das Skript diesen aus, füllt schnell das Formular mit den Daten aus deiner `config.py` aus und schließt die Buchung ab. Erfolge oder aufgetretene Fehler werden dir am Ende in der Konsole angezeigt.

