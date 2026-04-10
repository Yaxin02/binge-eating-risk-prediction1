"""Create binge_eating_model.joblib if missing (synthetic data — replace with your real trained model)."""

from __future__ import annotations

import os
import sys

import joblib
import numpy as np
from sklearn.linear_model import LogisticRegression

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "appwrite_functions", "prediction", "binge_eating_model.joblib")


def main() -> int:
    if os.path.isfile(OUT):
        print(f"Model already exists: {OUT}")
        return 0
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    rng = np.random.default_rng(42)
    X = rng.standard_normal((300, 11))
    y = (X.sum(axis=1) + rng.standard_normal(300) * 0.5 > 0).astype(int)
    clf = LogisticRegression(max_iter=2000, random_state=42)
    clf.fit(X, y)
    joblib.dump(clf, OUT)
    print(f"Wrote placeholder model (train on real data for production): {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
