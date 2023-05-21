import csv
import requests
from colorama import Fore, Style, init

init(convert=True)  # Initialize colorama

def send_post_request(payload):
    url = "https://energy-household-api.onrender.com/locations"
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 201:
        print(Fore.GREEN + "Request successful" + Style.RESET_ALL)
    else:
        print(Fore.RED + "Request failed" + Style.RESET_ALL)

csv_file = "locations.csv"

with open(csv_file, "r") as file:
    reader = csv.DictReader(file)
    for row in reader:
        payload = {
            "state_id":int(row["state_id"]),
            "region_id": int(row["state_id"]),
            "city":row["city"],
            "zip_code":row["zip_code"]
        }

        print(payload)

        # Send the POST request
        send_post_request(payload)
