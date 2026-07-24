import requests
from datetime import datetime

from app.core.config import settings

BASE_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"

LIMIT = 1000

COMMODITY_MAP = {
    "paddy": "Rice",
    "rice": "Rice",

    "corn": "Maize",
    "maize": "Maize",

    "mirchi": "Chilli",
    "chili": "Chilli",
    "chilli": "Chilli",

    "ground nut": "Groundnut",
    "groundnut": "Groundnut",

    "turmeric": "Turmeric",
    "cotton": "Cotton",
    "tomato": "Tomato",
    "potato": "Potato",
    "onion": "Onion",
    "banana": "Banana",
    "mango": "Mango",
    "orange": "Orange",
    "apple": "Apple",
    "grapes": "Grapes",
    "guava": "Guava",
}


def normalize_commodity(commodity: str) -> str:
    return COMMODITY_MAP.get(
        commodity.lower().strip(),
        commodity.title().strip()
    )


def build_response(record, exact_state):

    return {
        "commodity": record.get("commodity"),
        "state": record.get("state"),
        "district": record.get("district"),
        "market": record.get("market"),
        "variety": record.get("variety"),
        "arrival_date": record.get("arrival_date"),
        "min_price": record.get("min_price"),
        "max_price": record.get("max_price"),
        "modal_price": record.get("modal_price"),
        "exact_state": exact_state,
    }


def get_market_price(commodity: str, state: str):

    commodity = normalize_commodity(commodity)

    headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
    }

    all_records = []

    offset = 0

    try:

        while True:

            params = {
                "api-key": settings.data_gov_api_key,
                "format": "json",
                "limit": LIMIT,
                "offset": offset,
                "filters[commodity]": commodity,
            }

            response = requests.get(
                BASE_URL,
                params=params,
                headers=headers,
                timeout=30,
            )

            response.raise_for_status()

            data = response.json()

            records = data.get("records", [])

            if not records:
                break

            all_records.extend(records)

            print(f"Fetched {len(records)} records (Offset {offset})")

            if len(records) < LIMIT:
                break

            offset += LIMIT

        if not all_records:
            return None

        valid_records = []

        for record in all_records:

            try:
                record["_date"] = datetime.strptime(
                    record["arrival_date"],
                    "%d/%m/%Y"
                )

                valid_records.append(record)

            except Exception:
                continue

        if not valid_records:
            return None

        valid_records.sort(
            key=lambda r: r["_date"],
            reverse=True
        )

        # Try exact state match first
        for record in valid_records:

            if record["state"].lower() == state.lower():

                return build_response(
                    record,
                    exact_state=True
                )

        # Otherwise return latest commodity record
        return build_response(
            valid_records[0],
            exact_state=False
        )

    except Exception as e:

        print("Market API Error:", e)

        return None