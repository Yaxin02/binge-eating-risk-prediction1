"""
Create the 'predict' function on Appwrite Cloud and upload code (tar.gz).

Requires: APPWRITE_API_KEY (server key with functions write access)
Optional: APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID

Usage (PowerShell):
  $env:APPWRITE_API_KEY="your_key"
  python scripts/deploy_predict_function.py
"""

from __future__ import annotations

import io
import json
import os
import tarfile
import urllib.error
import urllib.request
import uuid
from typing import Any

ENDPOINT = os.environ.get("APPWRITE_ENDPOINT", "https://nyc.cloud.appwrite.io/v1").rstrip("/")
PROJECT = os.environ.get("APPWRITE_PROJECT_ID", "69d8f483003b02a74713")
FUNCTION_ID = "predict"

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FUNC_DIR = os.path.join(ROOT, "appwrite_functions", "prediction")


def _request(
    method: str,
    path: str,
    *,
    body: bytes | None = None,
    headers: dict[str, str] | None = None,
    content_type: str | None = "application/json",
) -> tuple[int, Any]:
    key = os.environ.get("APPWRITE_API_KEY")
    if not key:
        raise SystemExit("Set APPWRITE_API_KEY")
    url = f"{ENDPOINT}{path}"
    h = {
        "X-Appwrite-Project": PROJECT,
        "X-Appwrite-Key": key,
    }
    if content_type and body is not None:
        h["Content-Type"] = content_type
    if headers:
        h.update(headers)
    req = urllib.request.Request(url, data=body, method=method, headers=h)
    try:
        with urllib.request.urlopen(req) as resp:
            raw = resp.read().decode()
            return resp.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        raw = e.read().decode()
        try:
            err_body = json.loads(raw)
        except json.JSONDecodeError:
            err_body = raw
        return e.code, err_body


def _function_exists() -> bool:
    code, data = _request("GET", f"/functions/{FUNCTION_ID}")
    return code == 200


def _create_function() -> None:
    payload = {
        "functionId": FUNCTION_ID,
        "name": "Prediction ML",
        "runtime": "python-ml-3.11",
        "execute": ["any"],
        "events": [],
        "schedule": "",
        "timeout": 60,
        "enabled": True,
        "logging": False,
        "entrypoint": "main.py",
        "commands": "pip install -r requirements.txt",
        "scopes": [],
    }
    code, data = _request(
        "POST",
        "/functions",
        body=json.dumps(payload).encode(),
    )
    if code not in (200, 201):
        raise SystemExit(f"Create function failed {code}: {data}")
    print("Created function", FUNCTION_ID)


def _tar_function_dir() -> bytes:
    buf = io.BytesIO()
    with tarfile.open(fileobj=buf, mode="w:gz") as tar:
        for name in sorted(os.listdir(FUNC_DIR)):
            p = os.path.join(FUNC_DIR, name)
            if os.path.isfile(p):
                tar.add(p, arcname=name)
    return buf.getvalue()


def _multipart_deploy(tar_gz: bytes) -> None:
    boundary = f"----WebKitFormBoundary{uuid.uuid4().hex}"
    crlf = b"\r\n"
    parts: list[bytes] = []

    def add_field(name: str, value: str) -> None:
        parts.append(f"--{boundary}".encode())
        parts.append(f'Content-Disposition: form-data; name="{name}"'.encode())
        parts.append(b"")
        parts.append(value.encode())

    add_field("entrypoint", "main.py")
    add_field("commands", "pip install -r requirements.txt")
    add_field("activate", "true")
    parts.append(f"--{boundary}".encode())
    parts.append(
        b'Content-Disposition: form-data; name="code"; filename="code.tar.gz"'
    )
    parts.append(b"Content-Type: application/gzip")
    parts.append(b"")
    parts.append(tar_gz)
    parts.append(f"--{boundary}--".encode())
    body = crlf.join(parts) + crlf

    key = os.environ["APPWRITE_API_KEY"]
    url = f"{ENDPOINT}/functions/{FUNCTION_ID}/deployments"
    req = urllib.request.Request(url, data=body, method="POST")
    req.add_header("X-Appwrite-Project", PROJECT)
    req.add_header("X-Appwrite-Key", key)
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
    try:
        with urllib.request.urlopen(req) as resp:
            raw = resp.read().decode()
            print("Deployment response:", raw[:500])
    except urllib.error.HTTPError as e:
        print(e.read().decode())
        raise SystemExit(f"Deploy failed HTTP {e.code}") from e


def main() -> int:
    if not os.path.isdir(FUNC_DIR):
        raise SystemExit(f"Missing {FUNC_DIR}")
    need = ["main.py", "requirements.txt", "binge_eating_model.joblib"]
    for n in need:
        if not os.path.isfile(os.path.join(FUNC_DIR, n)):
            raise SystemExit(f"Missing {os.path.join(FUNC_DIR, n)} — run scripts/ensure_prediction_model.py")

    if not _function_exists():
        _create_function()
    else:
        print(f"Function {FUNCTION_ID} already exists, uploading new deployment…")

    tar = _tar_function_dir()
    _multipart_deploy(tar)
    print("Done. Active build may take 1–3 minutes. Function ID:", FUNCTION_ID)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
