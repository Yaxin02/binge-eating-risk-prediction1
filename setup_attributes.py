import os
from appwrite.client import Client
from appwrite.services.databases import Databases

client = Client()
client.set_endpoint(os.environ.get("APPWRITE_ENDPOINT", "https://nyc.cloud.appwrite.io/v1"))
client.set_project(os.environ.get("APPWRITE_PROJECT_ID", "69d8f483003b02a74713"))
_api_key = os.environ.get("APPWRITE_API_KEY")
if not _api_key:
    raise SystemExit("Set APPWRITE_API_KEY (server-only; never put this in the frontend).")
client.set_key(_api_key)

databases = Databases(client)

db_id = 'binge_db'
col_id = 'patients'

try:
    print("Creating attributes...")
    # Strings
    databases.create_string_attribute(db_id, col_id, "created_at", 100, True)
    
    # Integers
    int_attrs = ["gender", "education", "alcohol", "t2d", "sleep_apnea_syndrome", "gastroesophageal_reflux_disease", "prediction"]
    for attr in int_attrs:
        databases.create_integer_attribute(db_id, col_id, attr, True)

    # Floats
    float_attrs = ["age", "bmi", "weight_kg", "waist_cm", "ede_q_per_operation", "probability"]
    for attr in float_attrs:
        databases.create_float_attribute(db_id, col_id, attr, True)
        
    print("Setup Complete")
except Exception as e:
    print(e)
