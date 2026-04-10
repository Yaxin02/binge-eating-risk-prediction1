import json
import os
import urllib.request

endpoint = os.environ.get("APPWRITE_ENDPOINT", "https://nyc.cloud.appwrite.io/v1").rstrip("/")
project = os.environ.get("APPWRITE_PROJECT_ID", "69d8f483003b02a74713")
key = os.environ["APPWRITE_API_KEY"]
req = urllib.request.Request(f"{endpoint}/functions/predict/deployments")
req.add_header("X-Appwrite-Project", project)
req.add_header("X-Appwrite-Key", key)
with urllib.request.urlopen(req) as r:
    data = json.load(r)
for dep in data.get("deployments", []):
    did = dep.get("$id") or dep.get("id")
    print(did, dep.get("status"), dep.get("activate"))
