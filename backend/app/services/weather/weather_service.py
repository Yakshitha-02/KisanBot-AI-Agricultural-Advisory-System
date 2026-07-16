import requests

from app.core.config import settings


BASE_URL = "https://api.openweathermap.org/data/2.5/weather"


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