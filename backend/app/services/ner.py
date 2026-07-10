from transformers import pipeline

ner = pipeline(
    "ner",
    model="dslim/bert-base-NER",
    aggregation_strategy="simple",
)


def extract_entities(text: str):

    entities = ner(text)

    result = []

    for entity in entities:
        result.append(
            {
                "entity": entity["entity_group"],
                "word": entity["word"],
            }
        )

    return result