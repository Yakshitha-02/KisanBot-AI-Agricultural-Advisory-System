import json
from pathlib import Path
from typing import List, Dict, Optional

# Path to schemes.json
BASE_DIR = Path(__file__).resolve().parents[2]
SCHEME_FILE = BASE_DIR / "data" / "schemes.json"


class SchemeService:
    def __init__(self):
        self.schemes = self._load_schemes()

    def _load_schemes(self) -> List[Dict]:
        try:
            with open(SCHEME_FILE, "r", encoding="utf-8") as file:
                return json.load(file)
        except Exception as e:
            print(f"Error loading schemes: {e}")
            return []

    def get_all_schemes(self) -> List[Dict]:
        return self.schemes

    def get_scheme_by_id(self, scheme_id: str) -> Optional[Dict]:
        for scheme in self.schemes:
            if scheme["id"] == scheme_id:
                return scheme
        return None

    def search_scheme(self, query: str) -> List[Dict]:
        query = query.lower()

        results = []

        for scheme in self.schemes:
            if (
                query in scheme["name"].lower()
                or query in scheme["description"].lower()
            ):
                results.append(scheme)

        return results

    def check_eligibility(
        self,
        land_owner: bool,
        farmer_type: str
    ) -> List[Dict]:

        eligible = []

        for scheme in self.schemes:

            rules = scheme.get("eligibility", {})

            # Check land ownership
            if "land_owner" in rules:
                if rules["land_owner"] != land_owner:
                    continue

            # Check farmer type
            if "farmer_types" in rules:
                if farmer_type.lower() not in rules["farmer_types"]:
                    continue

            eligible.append(scheme)

        return eligible


scheme_service = SchemeService()