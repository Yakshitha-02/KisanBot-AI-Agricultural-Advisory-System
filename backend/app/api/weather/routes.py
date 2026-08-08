from fastapi import APIRouter, HTTPException

from app.services.weather.weather_service import (
    get_current_weather,
    get_current_weather_by_coords,
    geocode_city,
    get_5_day_forecast,
)

router = APIRouter()


# -------------------------------------------------
# Used by the RAG chatbot
# Example:
# /api/weather/current?city=Hyderabad
# -------------------------------------------------
@router.get("/current")
def current_weather(city: str):

    weather = get_current_weather(city)

    if weather is None:
        raise HTTPException(
            status_code=404,
            detail="City not found."
        )

    return weather


# -------------------------------------------------
# Used by Dashboard (GPS location)
# Example:
# /api/weather/current-location?lat=17.38&lon=78.48
# -------------------------------------------------
@router.get("/current-location")
def current_location_weather(lat: float, lon: float):

    weather = get_current_weather_by_coords(lat, lon)

    if weather is None:
        raise HTTPException(
            status_code=404,
            detail="Unable to fetch weather."
        )

    return weather

@router.get("/forecast")
def forecast(lat: float, lon: float):

    data = get_5_day_forecast(lat, lon)

    if data is None:
        raise HTTPException(
            status_code=404,
            detail="Unable to fetch forecast."
        )

    return data


@router.get("/geocode")
def geocode(city: str):

    data = geocode_city(city)

    if data is None:
        raise HTTPException(
            status_code=404,
            detail="Unable to geocode city.",
        )

    return data