import pandas as pd

df = pd.read_csv("data/Dataset_Eating_Disorder.csv")

mapping = {
    "Never": 0,
    "Seldom": 1,
    "Sometimes": 2,
    "Often": 3,
    "Very often": 4,
    "Always": 5
}

df = df.replace(mapping)
# CSV
df.to_csv("data/cleaned_dataset.csv", index=False)
df.to_excel("data/cleaned_dataset.xlsx", index=False)

print("Done ✅")