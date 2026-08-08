import requests

from app.core.config import settings

BASE_URL = "https://api.openweathermap.org/data/2.5/weather"
GEOCODE_URL = "https://api.openweathermap.org/geo/1.0/direct"


# -----------------------------------------------------------------
# Used by the RAG chatbot (searches weather by city name)
# -----------------------------------------------------------------
def get_current_weather(city: str):

    params = {
        "q": city,
        "appid": settings.openweather_api_key,
        "units": "metric",
    }

    response = requests.get(BASE_URL, params=params)

    print(response.status_code)
    print(response.text)

    if response.status_code != 200:
        return None

    data = response.json()

    return {
        "city": data["name"],
        "temperature": data["main"]["temp"],
        "humidity": data["main"]["humidity"],
        "condition": data["weather"][0]["main"],
        "description": data["weather"][0]["description"],
        "wind_speed": data["wind"]["speed"],
    }


# -----------------------------------------------------------------
# Used by Dashboard (searches weather using GPS coordinates)
# -----------------------------------------------------------------
def get_current_weather_by_coords(lat: float, lon: float):

    params = {
        "lat": lat,
        "lon": lon,
        "appid": settings.openweather_api_key,
        "units": "metric",
    }

    response = requests.get(BASE_URL, params=params)

    print(response.status_code)
    print(response.text)

    if response.status_code != 200:
        return None

    data = response.json()

    return {
        "city": data["name"],
        "temperature": data["main"]["temp"],
        "humidity": data["main"]["humidity"],
        "condition": data["weather"][0]["main"],
        "description": data["weather"][0]["description"],
        "wind_speed": data["wind"]["speed"],
        "icon": data["weather"][0]["icon"],
    }


def geocode_city(city: str):

    if not settings.openweather_api_key:
        return None

    params = {
        "q": city,
        "limit": 1,
        "appid": settings.openweather_api_key,
    }

    response = requests.get(GEOCODE_URL, params=params)

    if response.status_code != 200:
        return None

    data = response.json()

    if not data:
        return None

    first = data[0]

    return {
        "lat": first["lat"],
        "lon": first["lon"],
        "name": first.get("name", city),
        "country": first.get("country"),
        "state": first.get("state"),
    }

def get_5_day_forecast(lat: float, lon: float):

    url = "https://api.openweathermap.org/data/2.5/forecast"

    params = {
        "lat": lat,
        "lon": lon,
        "appid": settings.openweather_api_key,
        "units": "metric",
    }

    response = requests.get(url, params=params)

    if response.status_code != 200:
        return None

    data = response.json()

    forecast = []

    for item in data["list"]:

        forecast.append({
            "datetime": item["dt_txt"],
            "temperature": item["main"]["temp"],
            "condition": item["weather"][0]["main"],
            "description": item["weather"][0]["description"],
            "icon": item["weather"][0]["icon"],
        })

    return forecast