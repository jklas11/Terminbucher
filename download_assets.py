
import urllib.request

headers = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def save_content(url, filename):
    print(f"Fetching {url} -> {filename}...")
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        with open(filename, 'wb') as f:
            f.write(response.read())

save_content("https://nuernberg.termine-reservieren.de/app/js/tvweb.js", "tvweb.js")
# Main page (I'll just fetch the base location page to see if it differs)
save_content("https://nuernberg.termine-reservieren.de/location?mdt=324&select_cnc=1&cnc-4142=1", "main_page.html")
