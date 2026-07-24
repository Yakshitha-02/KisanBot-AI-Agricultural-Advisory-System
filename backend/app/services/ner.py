import json

from langchain_core.messages import SystemMessage, HumanMessage

from app.services.llm.openrouter import llm

SYSTEM_PROMPT = """
You are an agricultural entity extraction assistant.

Extract the following entities from the user's question.

Return ONLY a valid JSON object.

Rules:
1. Do NOT include markdown.
2. Do NOT use ```json.
3. Do NOT explain anything.
4. If a field is missing, use null.

Example:

{
    "commodity": "Orange",
    "state": "Tamil Nadu",
    "district": null,
    "location": null
}
"""


def extract_entities(question: str):

    response = llm.invoke(
        [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=question),
        ]
    )

    content = response.content.strip()

    # Remove markdown code fences if the model returns them
    content = (
        content.replace("```json", "")
               .replace("```", "")
               .strip()
    )

    print("\n========== RAW LLM RESPONSE ==========")
    print(content)
    print("======================================\n")

    try:
        entities = json.loads(content)

        return {
            "commodity": entities.get("commodity"),
            "state": entities.get("state"),
            "district": entities.get("district"),
            "location": entities.get("location"),
        }

    except json.JSONDecodeError as e:
        print("JSON Decode Error:", e)
        print("Received Content:", repr(content))

        return {
            "commodity": None,
            "state": None,
            "district": None,
            "location": None,
        }

    except Exception as e:
        print("Unexpected Error:", e)

        return {
            "commodity": None,
            "state": None,
            "district": None,
            "location": None,
        }