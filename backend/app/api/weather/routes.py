from fastapi import APIRouter, HTTPException

from app.services.weather.weather_service import get_current_weather

router = APIRouter()


@router.get("/current")
def current_weather(city: str):

    weather = get_current_weather(city)

    if weather is None:
        raise HTTPException(
            status_code=404,
            detail="City not found."
        )

    return weather