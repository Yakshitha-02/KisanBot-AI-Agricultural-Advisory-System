from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.api.schemes.service import scheme_service

router = APIRouter(
    prefix="/schemes",
    tags=["Government Schemes"]
)


class EligibilityRequest(BaseModel):
    land_owner: bool
    farmer_type: str


@router.get("/")
def get_all_schemes():
    return scheme_service.get_all_schemes()


@router.get("/{scheme_id}")
def get_scheme(scheme_id: str):
    scheme = scheme_service.get_scheme_by_id(scheme_id)

    if not scheme:
        raise HTTPException(
            status_code=404,
            detail="Scheme not found"
        )

    return scheme


@router.get("/search/")
def search_scheme(query: str):
    return scheme_service.search_scheme(query)


@router.post("/check")
def check_eligibility(request: EligibilityRequest):

    eligible = scheme_service.check_eligibility(
        land_owner=request.land_owner,
        farmer_type=request.farmer_type
    )

    return {
        "eligible_schemes": eligible,
        "count": len(eligible)
    }