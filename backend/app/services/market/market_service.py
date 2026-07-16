import requests
from datetime import datetime

from app.core.config import settings

BASE_URL = "https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24"


def get_market_price(
    commodity: str,
    state: str,
):

    params = {
        "api-key": settings.data_gov_api_key,
        "format": "json",
        "offset": 0,
        "limit": 100,

        "filters[Commodity]": commodity.strip(),
        "filters[State]": state.strip(),
    }

    session = requests.Session()
    session.trust_env = False

    response = session.get(BASE_URL, params=params, timeout=30)

    print("URL:", response.url)
    print("Status:", response.status_code)
    print("Response:", response.text)

    if response.status_code != 200:
        return None

    data = response.json()

    if not data.get("records"):
        return None

    records = data["records"]

    # Sort by latest arrival date
    records.sort(
        key=lambda x: datetime.strptime(
            x["Arrival_Date"],
            "%d/%m/%Y",
        ),
        reverse=True,
    )

    latest = records[0]

    return {
        "commodity": latest["Commodity"],
        "state": latest["State"],
        "district": latest["District"],
        "market": latest["Market"],
        "variety": latest["Variety"],
        "arrival_date": latest["Arrival_Date"],
        "min_price": latest["Min_Price"],
        "max_price": latest["Max_Price"],
        "modal_price": latest["Modal_Price"],
    }