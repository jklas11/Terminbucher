import time
import random
import datetime
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.firefox.service import Service as FirefoxService
from webdriver_manager.firefox import GeckoDriverManager
from selenium.webdriver.common.action_chains import ActionChains

# Konfiguration importieren
try:
    import config
except ImportError:
    # Fallback für den GitHub-Build-Prozess
    class MockConfig:
        URL = ""
        DRY_RUN = True
        # Füge hier alle anderen Variablen als leere Strings hinzu,
        # damit PyInstaller keine Fehler wirft
        VORNAME = NACHNAME = EMAIL = TELEFON = ""
        STRASSE = HAUSNUMMER = PLZ = ORT = ""
        GEBURTSDATUM_TAG = GEBURTSDATUM_MONAT = GEBURTSDATUM_JAHR = ""
    config = MockConfig()

def play_sound():
    # Versucht einen Ton abzuspielen (Systemabhängig)
    print('\a') # Beep trigger
    # Für Linux mit aplay (falls vorhanden)
    os.system("aplay /usr/share/sounds/alsa/Front_Center.wav 2>/dev/null") 

def get_valid_dates():
    # Gibt eine Liste der Datums-Strings für heute und die nächsten 5 Tage zurück

    #dates = ["20.02.2026","23.02.2026","24.02.2026"]
    

    dates = []

    today = datetime.datetime.now()
    for i in range(5):
        d = today + datetime.timedelta(days=i)
        dates.append(d.strftime("%d.%m.%Y"))
    
    return dates

def main():

    counter = 0
    # Füge aktuelles Verzeichnis zum PATH hinzu, damit geckodriver gefunden wird
    current_dir = os.path.dirname(os.path.abspath(__file__))
    os.environ["PATH"] += os.pathsep + current_dir

    print("Starte Termin-Bot...")
    print(f"Modus: {'TEST (DRY_RUN)' if config.DRY_RUN else 'LIVE BUCHUNG'}")
    
    # Browser initialisieren (Hier Firefox, kann auf Chrome geändert werden)
    options = webdriver.FirefoxOptions()
    # options.add_argument("--headless") # Headless für Hintergrundbetrieb

    try:
        # Der GeckoDriverManager installiert den Treiber automatisch im Hintergrund
        service = FirefoxService(GeckoDriverManager().install())
        driver = webdriver.Firefox(service=service, options=options)
        print("Browser erfolgreich mit automatischem Treiber gestartet.")
    except Exception as e:
        print(f"Fehler beim Starten des Browsers: {e}")
        return

    try:
        # 1. Seite öffnen
        driver.get(config.URL)
        
        # 2. Cookies akzeptieren (falls vorhanden)
        try:
            cookie_btn = WebDriverWait(driver, 5).until(
                EC.element_to_be_clickable((By.ID, "cookie_msg_btn_yes"))
            )
            cookie_btn.click()
            print("Cookies akzeptiert.")
        except:
            print("Kein Cookie-Banner gefunden oder bereits akzeptiert.")

        # EXTRA SCHRITT: Manuelle Navigation durch User
        print("---")
        print("BITTE JETZT MANUELL NAVIGIEREN!")
        print("Wählen Sie Ihr Anliegen aus und klicken Sie sich bis zur 'Standortauswahl' durch.")
        print("Das Skript wartet, bis die Standort-Seite erkannt wird...")
        print("---")

        # Wir warten, bis der "Standort auswählen" Button (name='select_location') sichtbar ist
        while True:
            try:
                if "select_location" in driver.page_source:
                    print("Standort-Auswahl erkannt! Übernehme Kontrolle...")
                    break
                
                time.sleep(2)
            except:
                time.sleep(1)
        
        # Kurze Pause zur Stabilisierung
        time.sleep(1)

        # 3. Hinweis bestätigen (falls vorhanden)
        try:
             hinweis_btn = WebDriverWait(driver, 3).until(
                 EC.element_to_be_clickable((By.CSS_SELECTOR, ".btn-ok"))
             )
             hinweis_btn.click()
             print("Hinweis bestätigt.")
        except:
             pass

        # ---------------------------------------------------------
        # HAUPTSCHLEIFE: Suchen & Buchen & Retry
        # ---------------------------------------------------------
        while True: # RETRY-LOOP: Falls Buchung fehlschlägt, fangen wir hier wieder an
            print(f"\n[{datetime.datetime.now().strftime('%H:%M:%S')}] --- STARTE DURCHLAUF (Standort -> Termine -> Buchung) ---")
            
            # --- START STANDORT-LOGIK ---
            print("Prüfe ob wir auf der Standort-Auswahlseite sind...")
            
            standort_loop_active = True
            while standort_loop_active:
                try:
                    # Wenn wir bereits "Freie Termine" sehen, überspringen wir die Standortwahl
                    if "Freie Termine" in driver.page_source or "Wählen Sie bitte einen Termin" in driver.page_source:
                        print("Sind bereits auf der Termin-Seite. Überspringe Standortwahl.")
                        break

                    # Prüfe ob "Keine freien Termine" im Text steht (Standortseite)
                    page_source = driver.page_source
                    
                    if "keine freien Termine" in page_source.lower():
                         print(f"Keine Termine verfügbar (Standort-Seite). Refresh...")
                    else:
                        # Wir klicken "weiter mit 1" (Vermutlich der erste Standort Button)
                        loc_btns = driver.find_elements(By.CSS_SELECTOR, "input[name='select_location']")
                        if not loc_btns:
                            loc_btns = driver.find_elements(By.CSS_SELECTOR, "button.map_loc_btn")
                        
                        if loc_btns:
                            print("Standort-Button gefunden. Versuche zu klicken...")
                            btn = loc_btns[0]
                            try:
                                # Erst sichtbar machen
                                driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", btn)
                                time.sleep(0.5)
                                # Versuch 1: Scrollen und Klicken
                                ActionChains(driver).move_to_element(btn).perform()
                                btn.click()
                            except Exception as e:
                                # Nur kurze Info, kein kompletter Stacktrace für den User
                                print(f"Standard-Klick nicht möglich (Element verdeckt?), nutze Fallback.")
                                driver.execute_script("arguments[0].click();", btn)
                                
                            print("Standort ausgewählt.")
                            break # Weiter zu Schritt 5 (Kalender)
                        else:
                            # Wir sind vielleicht schon weiter?
                            if "select_location" not in page_source and "Standort" not in driver.title:
                                print("Weder Standort-Button noch Standort-Seite erkannt. Gehe weiter zur Terminsuche...")
                                break
                    
                    # Refresh Loop
                    sleep_time = random.uniform(5, 15)
                    time.sleep(sleep_time)
                    driver.refresh()
                    
                    try:
                        WebDriverWait(driver, 2).until(EC.alert_is_present())
                        driver.switch_to.alert.accept()
                    except:
                        pass
                    
                    if "select_location" not in driver.page_source and "Standort" not in driver.title:
                        print("Scheinbar Seite verlassen? Breche Standort-Loop ab.")
                        break
                
                except Exception as e:
                    print(f"Fehler im Standort-Loop: {e}")
                    time.sleep(5)
                    try:
                        driver.refresh()
                    except:
                        pass

            # --- START TERMIN-SUCH-LOGIK ---
            print("Starte Terminsuche...")
            found_appointment = False
            
            while True:
                try:
                    counter += 1
                    # Check auf Fehlerseite (falls wir hier landen)
                    if "Es ist ein Fehler aufgetreten" in driver.find_element(By.TAG_NAME, "body").text:
                        print("Hänge auf Fehlerseite fest. Versuche Zurück...")
                        try:
                            driver.find_element(By.PARTIAL_LINK_TEXT, "Terminvorschlägen").click()
                            time.sleep(2)
                            continue
                        except:
                            driver.back()
                            time.sleep(2)
                            continue

                    # OPTIMIERUNG: Vorab-Check auf Datum im Header
                    body_text = driver.find_element(By.TAG_NAME, "body").text
                    valid_dates = get_valid_dates()
                    any_valid_date_present = False
                    for d in valid_dates:
                        if d in body_text:
                            any_valid_date_present = True
                            break
                    
                    # Wenn KEIN valides Datum da ist UND wir nicht auf "Keine Termine" warten
                    if not any_valid_date_present:
                         if "keine freien Termine" in body_text.lower():
                             print(f"[{datetime.datetime.now().strftime('%H:%M:%S')}] Versuch:{counter} / Keine Termine. Warte...")
                         else:
                             print(f"[{datetime.datetime.now().strftime('%H:%M:%S')}] Versuch:{counter} / Termine da, aber keine in den nächsten 5 Tagen. Refresh...")
                         
                         time.sleep(random.uniform(3, 8))
                         driver.refresh()
                         continue

                    # Wir suchen nach termin-buttons.
                    buttons = driver.find_elements(By.CSS_SELECTOR, "button.suggest_btn")
                    
                    for btn in buttons:
                        if not btn.is_enabled():
                            continue
                        
                        # Wir klicken den ersten verfügbaren Button
                        print("TERMINE GEFUNDEN!")
                        play_sound()
                        
                        try:
                            btn.click()
                        except:
                            driver.execute_script("arguments[0].click();", btn)
                        
                        # Jetzt kommt die Bestätigung "Sie haben folgenden Termin gewählt..."
                        try:
                            time.sleep(1)
                            
                            # VALIDIERUNG DES DATUMS
                            page_text = driver.find_element(By.TAG_NAME, "body").text
                            is_valid_date = False
                            found_date_str = "???"
                            
                            for d in valid_dates:
                                if d in page_text:
                                    is_valid_date = True
                                    found_date_str = d
                                    break
                            
                            if not is_valid_date:
                                print(f"ACHTUNG: Termin gefunden ({found_date_str}), aber nicht in den nächsten 5 Tagen! ({valid_dates})")
                                print("Breche diesen Termin ab...")
                                
                                try:
                                    cancel_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Abbrechen') or contains(text(), 'Nein') or contains(text(), 'Zurück')]")
                                    cancel_btn.click()
                                except:
                                    driver.refresh()
                                    break 
                                
                                print("Gehe davon aus, dass auch andere Termine auf dieser Seite zu spät sind. Refresh...")
                                break 
                            
                            print(f"Termin am {found_date_str} bestätigt. Fahre fort...")
                            
                            # Bestätigen ("Ja" klicken)
                            try:
                                ja_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Ja')]")
                                ja_btn.click()
                            except:
                                try:
                                    ja_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Ja')]")
                                    driver.execute_script("arguments[0].click();", ja_btn)
                                except:
                                    print("Konnte 'Ja' Button nicht finden/klicken.")
                                
                            found_appointment = True
                            break 
                                
                        except Exception as e:
                            print(f"Fehler bei Terminbestätigung: {e}")
                            driver.refresh()
                            break
                    
                    if found_appointment:
                        break # Raus aus dem Such-Loop, weiter zur Dateneingabe
                    
                    print("Keine passenden Termine auf dieser Seite gefunden. Refresh...")
                    time.sleep(random.uniform(5, 10))
                    driver.refresh()
                         
                except Exception as e:
                    print(f"Fehler im Such-Loop: {e}")
                    time.sleep(5)
                    driver.refresh()
            
            # --- START DATENEINGABE ---
            print("Fülle Formular aus...")
            
            try:
                print("Warte auf Laden des Formulars...")
                WebDriverWait(driver, 20).until(
                    lambda d: d.find_elements(By.XPATH, "//*[contains(text(), 'Vorname')]") or 
                              d.find_elements(By.XPATH, "//*[contains(text(), 'persönlichen Daten')]") or
                              d.find_elements(By.ID, "firstname")
                )
                time.sleep(1) 
                
                def try_fill(val, names=[], labels=[]):
                    # 1. Versuch: Über Name
                    for n in names:
                        try:
                            elem = driver.find_element(By.NAME, n)
                            elem.clear()
                            elem.send_keys(val)
                            # WICHTIG: Events feuern für Validierung
                            driver.execute_script("arguments[0].dispatchEvent(new Event('change'));", elem)
                            driver.execute_script("arguments[0].dispatchEvent(new Event('blur'));", elem)
                            print(f"Feld '{n}' via Name gefüllt.")
                            return True
                        except:
                            pass
                    
                    # 2. Versuch: Über Label-Text
                    for l in labels:
                        try:
                            xpath = f"//*[contains(text(), '{l}')]/following::input[1]"
                            elem = driver.find_element(By.XPATH, xpath)
                            elem.clear()
                            elem.send_keys(val)
                            driver.execute_script("arguments[0].dispatchEvent(new Event('change'));", elem)
                            driver.execute_script("arguments[0].dispatchEvent(new Event('blur'));", elem)
                            print(f"Feld '{l}' via Text-Label gefüllt.")
                            return True
                        except:
                            pass
                        try:
                            elem = driver.find_element(By.XPATH, f"//input[@placeholder='{l}']")
                            elem.clear()
                            elem.send_keys(val)
                            driver.execute_script("arguments[0].dispatchEvent(new Event('change'));", elem)
                            driver.execute_script("arguments[0].dispatchEvent(new Event('blur'));", elem)
                            print(f"Feld '{l}' via Placeholder gefüllt.")
                            return True
                        except:
                            pass
                    print(f"Konnte Feld für '{val}' nicht finden (Names: {names}, Labels: {labels})")
                    return False

                # Felder befüllen - Mit exakten IDs aus dem HTML Quelltext
                try_fill(config.VORNAME, names=["vorname"], labels=["Vorname"])
                try_fill(config.NACHNAME, names=["nachname"], labels=["Nachname"])
                try_fill(config.EMAIL, names=["email"], labels=["E-Mail *"]) 
                try_fill(config.EMAIL, names=["emailCheck"], labels=["Wiederholung"]) # Name im HTML ist emailCheck, ID emailwhlg
                try_fill(config.TELEFON, names=["phone"], labels=["Telefonnummer"])
                
                # Adresse
                try:
                    # HTML: id="str", name="anschrift"
                    elem = driver.find_element(By.ID, "str")
                    elem.clear()
                    elem.send_keys(config.STRASSE)
                    driver.execute_script("arguments[0].dispatchEvent(new Event('change'));", elem)
                    driver.execute_script("arguments[0].dispatchEvent(new Event('blur'));", elem)
                    print("Straße via ID 'str' gefüllt.")
                except:
                    print("Konnte Straße via ID 'str' nicht finden, versuche Fallback...")
                    try_fill(config.STRASSE, names=["anschrift", "street", "strasse"], labels=["Straße"])

                try:
                    # HTML: id="houseno", name="hausnummer"
                    elem = driver.find_element(By.ID, "houseno")
                    elem.clear()
                    elem.send_keys(config.HAUSNUMMER)
                    driver.execute_script("arguments[0].dispatchEvent(new Event('change'));", elem)
                    driver.execute_script("arguments[0].dispatchEvent(new Event('blur'));", elem)
                    print("Hausnummer via ID 'houseno' gefüllt.")
                except:
                     try_fill(config.HAUSNUMMER, names=["hausnummer", "housenr", "hnr"], labels=["Hausnummer"])
                
                try:
                    # HTML: id="plz", name="postleitzahl"
                    elem = driver.find_element(By.ID, "plz")
                    elem.clear()
                    elem.send_keys(config.PLZ)
                    driver.execute_script("arguments[0].dispatchEvent(new Event('change'));", elem)
                    driver.execute_script("arguments[0].dispatchEvent(new Event('blur'));", elem)
                    print("PLZ via ID 'plz' gefüllt.")
                except:
                    try_fill(config.PLZ, names=["postleitzahl", "zipcode", "zip"], labels=["Postleitzahl"])

                try:
                    # HTML: id="wohnort", name="wohnort"
                    elem = driver.find_element(By.ID, "wohnort")
                    elem.clear()
                    elem.send_keys(config.ORT)
                    driver.execute_script("arguments[0].dispatchEvent(new Event('change'));", elem)
                    driver.execute_script("arguments[0].dispatchEvent(new Event('blur'));", elem)
                    print("Ort via ID 'wohnort' gefüllt.")
                except:
                    try_fill(config.ORT, names=["wohnort", "city", "ort"], labels=["Wohnort"])
                
                # Geburtsdatum - HTML uses ids: geburtsdatumDay, geburtsdatumMonth, geburtsdatumYear
                print("Versuche Geburtsdatum zu füllen via exakter IDs...")
                try:
                    day_elem = driver.find_element(By.ID, "geburtsdatumDay")
                    day_elem.send_keys(config.GEBURTSDATUM_TAG)
                    driver.execute_script("arguments[0].dispatchEvent(new Event('change'));", day_elem)
                    
                    month_elem = driver.find_element(By.ID, "geburtsdatumMonth")
                    month_elem.send_keys(config.GEBURTSDATUM_MONAT)
                    driver.execute_script("arguments[0].dispatchEvent(new Event('change'));", month_elem)
                    
                    year_elem = driver.find_element(By.ID, "geburtsdatumYear")
                    year_elem.send_keys(config.GEBURTSDATUM_JAHR)
                    driver.execute_script("arguments[0].dispatchEvent(new Event('change'));", year_elem)
                    driver.execute_script("arguments[0].dispatchEvent(new Event('blur'));", year_elem)
                    print("Geburtsdatum erfolgreich gefüllt.")

                except Exception as e:
                    print(f"Fehler bei Geburtsdatum-IDs ({e}), versuche Fallback...")
                    try_fill(config.GEBURTSDATUM_TAG, names=["day", "birthday_d"], labels=["Tag"])
                    try_fill(config.GEBURTSDATUM_MONAT, names=["month", "birthday_m"], labels=["Monat"])
                    try_fill(config.GEBURTSDATUM_JAHR, names=["year", "birthday_y"], labels=["Jahr"])

                # Checkboxen
                # HTML: name="agreementChecked" (required)
                print("Aktiviere Pflicht-Checkboxen...")
                try:
                    agree_cb = driver.find_element(By.NAME, "agreementChecked")
                    if not agree_cb.is_selected():
                        # Scroll into view
                        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", agree_cb)
                        time.sleep(0.2)
                        driver.execute_script("arguments[0].click();", agree_cb)
                        driver.execute_script("arguments[0].dispatchEvent(new Event('change'));", agree_cb)
                        print("Datenschutz-Checkbox (agreementChecked) aktiviert.")
                except Exception as e:
                    print(f"Konnte spezifische Checkbox nicht finden ({e}). Aktiviere alle...")
                    checkboxes = driver.find_elements(By.CSS_SELECTOR, "input[type='checkbox']")
                    for cb in checkboxes:
                        try:
                           if not cb.is_selected():
                               driver.execute_script("arguments[0].click();", cb)
                               driver.execute_script("arguments[0].dispatchEvent(new Event('change'));", cb)
                        except:
                            pass
                    print("Alle Checkboxen aktiviert.")

                # Absenden
                if config.DRY_RUN:
                    print("DRY RUN: Klicke NICHT auf Reservieren.")
                    input("Drücke Enter um das Script zu beenden... (DRY RUN ENDE)")
                    break
                else:
                    print("Suche Reservieren-Button (ID: chooseTerminButton)...")
                    
                    try:
                        # Warten bis der Button klickbar ist (d.h. Klasse 'disabledButton' ist weg)
                        # Das JS 'checkWeiter()' muss erst durchlaufen.
                        WebDriverWait(driver, 10).until(
                            lambda d: "disabledButton" not in d.find_element(By.ID, "chooseTerminButton").get_attribute("class")
                        )
                        # Element neu holen
                        submit_btn = driver.find_element(By.ID, "chooseTerminButton")
                        print("Reservieren-Button ist aktiv (Validierung OK).")
                        
                        # Extra Wartezeit für Sicherheit
                        time.sleep(1.0)
                    except:
                        print("Reservieren-Button scheint noch deaktiviert (Validierung nicht fertig?).")
                        # Debug: Warum?
                        try:
                            req = driver.find_elements(By.CSS_SELECTOR, ".required")
                            err = driver.find_elements(By.CSS_SELECTOR, ".wrongvalidate")
                            if req or err:
                                print(f"Validierungsprobleme erkannt: {len(req)} Pflichtfelder fehlen, {len(err)} Fehler.")
                                # Versuch: Manuell checkWeiter auslösen?
                                driver.execute_script("if(typeof checkWeiter === 'function') checkWeiter();")
                        except:
                            pass
                        
                        # Fallback: Den Button trotzdem holen
                        try:
                            submit_btn = driver.find_element(By.ID, "chooseTerminButton")
                        except:
                            submit_btn = None

                    if submit_btn:
                        print(f"Klicke Reservieren (Text: {submit_btn.get_attribute('value')})...")
                        time.sleep(0.5) # Kurze Pause vor Klick
                        try:
                            driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", submit_btn)
                            time.sleep(0.5)
                            submit_btn.click()
                        except Exception as e:
                            print(f"Standard-Klick fehlgeschlagen ({e}), versuche JS...")
                            driver.execute_script("arguments[0].click();", submit_btn)
                    else:
                        print("!!! KONNTE RESERVIEREN-BUTTON NICHT FINDEN !!!")
                        print("!!! BITTE MANUELL KLICKEN !!!")
                        play_sound()
                    
                    print("Reservierung abgeschickt. Prüfe Ergebnis...")
                    time.sleep(5) # Warte auf Server
                    
                    # FEHLER PRÜFUNG NACH ABSENDEN
                    try:
                        page_source_after = driver.page_source
                        if "Online-Terminanfrage erfolgreich" in page_source_after or "Ihre Terminreservierung wurde gespeichert" in page_source_after:
                             print("!!! ERFOLG !!!: Termin wurde erfolgreich gebucht!")
                             play_sound()
                             input("Drücke Enter um das Script zu beenden...")
                             break # ERFOLG -> Script Ende

                        if any(x in page_source_after for x in ["Fehler aufgetreten", "anders vergeben", "Problem", "Ungültiges Formular", "Prozess fehlgeschlagen"]):
                             print("!!! FEHLER ERKANNT: Termin wurde anderweitig vergeben oder Fehler aufgetreten !!!")
                             print("Versuche Neustart des Loops...")
                             play_sound() # Alarmton
                             
                             # Versuche "Zurück"
                             try:
                                 link = driver.find_element(By.PARTIAL_LINK_TEXT, "Terminvorschlägen")
                                 link.click()
                             except:
                                 print("Kein 'Zurück'-Link. Gehe zurück via Browser.")
                                 driver.back()
                             
                             time.sleep(3)
                             continue # SPRINGE ZUM ANFANG DES WHILE TRUE LOOPS (Retry)
                    except Exception as ex:
                        print(f"Fehler bei der Erfolgskontrolle: {ex}")

                    print("KEIN FEHLER ERKANNT -> Vermutlich erfolgreich!")
                    play_sound()
                    print("Bitte E-Mails prüfen.")
                    input("Drücke Enter um das Script zu beenden...")
                    break # ERFOLG -> Script Ende
                    
            except Exception as e:
                print(f"Fehler beim Ausfüllen des Formulars: {e}")
                print("Versuche Loop neu zu starten in 10 Sekunden...")
                time.sleep(10)
                continue

    except Exception as e:
        print(f"Kritischer Fehler: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()
