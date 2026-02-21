
import urllib.request
import urllib.parse
import re

headers = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def get_content(url):
    print(f"Fetching {url}...")
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        return response.read().decode('utf-8', errors='ignore')

# 1. Fetch main page to find 'addresses' variable
main_url = "https://nuernberg.termine-reservieren.de/location?mdt=324&select_cnc=1&cnc-4142=1&cnc-4148=0&cnc-4151=0&cnc-4125=0&cnc-4131=0&cnc-4134=0&cnc-4135=0&cnc-4128=0&cnc-4138=0&cnc-4141=0&cnc-4145=0&cnc-4167=0&cnc-4171=0&cnc-4173=0&cnc-4154=0&cnc-4158=0&cnc-4159=0&cnc-4161=0&cnc-4156=0&cnc-4165=0&cnc-4169=0&cnc-4406=0&cnc-4396=0&cnc-4397=0&cnc-4398=0&cnc-4399=0&cnc-4400=0&cnc-4401=0&cnc-4402=0&cnc-4403=0&cnc-4404=0&cnc-4405=0&cnc-4119=0&cnc-4122=0&cnc-4116=0&cnc-4163=0"
html = get_content(main_url)

print("\n--- Searching for 'addresses' or 'locations' variables ---")
# Look for var addresses = [...]
addresses_match = re.search(r'var\s+addresses\s*=\s*(\[.*?\]);', html, re.DOTALL)
if addresses_match:
    print("Found 'addresses' variable!")
    print(addresses_match.group(1))
else:
    print("No 'addresses' variable found.")

# 2. Fetch tvweb.js
js_url = "https://nuernberg.termine-reservieren.de/app/js/tvweb.js"
js_content = get_content(js_url)

print("\n--- Analyzing tvweb.js ---")
# Look for ajax calls
print("AJAX calls:")
ajax_calls = re.findall(r'\.ajax\(\{.*?\n(.*?)\}\)', js_content, re.DOTALL)
for call in ajax_calls:
    url_match = re.search(r'url\s*:\s*(["\'].*?["\'])', call)
    if url_match:
        print(f"  URL: {url_match.group(1)}")

# Look for 'suggest'
print("\n'suggest' occurrences:")
suggest_lines = re.findall(r'.*suggest.*', js_content)
for line in suggest_lines[:10]:
    print(f"  {line.strip()}")
