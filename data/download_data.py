import urllib.request
import os

URL = "https://github.com/NeurodataWithoutBorders/pynwb/raw/main/src/pynwb/testing/data/test_data.nwb"
DEST_DIR = 'data'
DEST_FILE = os.path.join(DEST_DIR, 'sample.nwb')

if not os.path.exists(DEST_DIR):
    os.makedirs(DEST_DIR)

print(f"Downloading NWB test data to {DEST_FILE}...")
urllib.request.urlretrieve(URL, DEST_FILE)
print("Download complete.")