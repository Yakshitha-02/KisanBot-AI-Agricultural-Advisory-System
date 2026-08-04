from fastapi import APIRouter, HTTPException

from app.services.market.market_service import get_market_price

router = APIRouter()


@router.get("/price")
def market_price(
    commodity: str,
    state: str,
):

    result = get_market_price(
        commodity=commodity,
        state=state,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="No market data found."
        )

    return result

@router.get("/dashboard")
def dashboard_prices():

    commodities = [
        "Tomato",
        "Rice",
        "Onion",
        "Potato",
        "Maize",
    ]

    state = "Andhra Pradesh"

    prices = []

    for commodity in commodities:

        result = get_market_price(
            commodity=commodity,
            state=state,
        )

        if result:
            prices.append(result)

    return prices