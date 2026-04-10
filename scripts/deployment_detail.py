import json
import os
import urllib.request

endpoint = os.environ.get("APPWRITE_ENDPOINT", "https://nyc.cloud.appwrite.io/v1").rstrip("/")
project = os.environ.get("APPWRITE_PROJECT_ID", "69d8f483003b02a74713")
key = os.environ["APPWRITE_API_KEY"]
import sys

dep_id = sys.argv[1] if len(sys.argv) > 1 else "69d95bcfcf3ce686013c"
url = f"{endpoint}/functions/predict/deployments/{dep_id}"
req = urllib.request.Request(url)
req.add_header("X-Appwrite-Project", project)
req.add_header("X-Appwrite-Key", key)
with urllib.request.urlopen(req) as r:
    data = json.load(r)
print("status:", data.get("status"))
logs = data.get("buildLogs") or ""
tail = (logs[-3000:] if logs else "(empty)").encode("ascii", errors="replace").decode("ascii")
print("logs (tail):", tail)
