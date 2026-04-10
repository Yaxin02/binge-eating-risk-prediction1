#!/usr/bin/env python3
"""List function $id values in your Appwrite project (for VITE_APPWRITE_FUNCTION_ID).

Requires: APPWRITE_API_KEY (server API key, never expose in the browser).

 set APPWRITE_API_KEY=your_key
  python list_functions.py
"""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request


def main() -> int:
    endpoint = os.environ.get("APPWRITE_ENDPOINT", "https://nyc.cloud.appwrite.io/v1").rstrip("/")
    project = os.environ.get("APPWRITE_PROJECT_ID", "69d8f483003b02a74713")
    key = os.environ.get("APPWRITE_API_KEY")
    if not key:
        print("Set APPWRITE_API_KEY, then run again.", file=sys.stderr)
        return 1

    url = f"{endpoint}/functions"
    req = urllib.request.Request(url, method="GET")
    req.add_header("X-Appwrite-Project", project)
    req.add_header("X-Appwrite-Key", key)

    try:
        with urllib.request.urlopen(req) as resp:
            payload = json.load(resp)
    except urllib.error.HTTPError as e:
        print(e.read().decode(), file=sys.stderr)
        return 1

    functions = payload.get("functions") or []
    if not functions:
        print("No functions found. Deploy one (Console or `appwrite push functions`).")
        return 0

    for fn in functions:
        fid = fn.get("$id") or fn.get("id", "")
        name = fn.get("name", "")
        print(f"{fid}\t{name}")

    print(
        "\nUse that id as:\n"
        "  - frontend/public/appwrite-overrides.json → \"functionId\"\n"
        "  - or Site / CI env: VITE_APPWRITE_FUNCTION_ID\n"
        "Deploy the function from this repo: python scripts/deploy_predict_function.py\n",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
