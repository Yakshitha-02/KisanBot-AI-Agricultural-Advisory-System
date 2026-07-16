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