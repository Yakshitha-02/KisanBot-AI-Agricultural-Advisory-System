from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from app.services.llm.openrouter import llm


rewrite_prompt = ChatPromptTemplate.from_template("""
You are an AI assistant that rewrites follow-up questions into complete, standalone questions.

Your job is ONLY to rewrite the user's latest question.

Rules:
1. Use the conversation history to resolve pronouns such as:
   - it
   - this
   - that
   - they
   - them
   - those
2. Preserve the user's original intent.
3. Preserve crop names, diseases, fertilizers, pesticides, weather locations, commodities, markets, and states.
4. If the current question is already complete, return it unchanged.
5. Do NOT answer the question.
6. Return ONLY the rewritten question.

Examples

Conversation:
User: What fertilizer is suitable for rice?
User: How much should I apply?

Standalone Question:
How much fertilizer should I apply for rice?

Conversation:
User: What fertilizer is suitable for rice?
User: When should I use it?

Standalone Question:
When should I apply fertilizer for rice?

Conversation:
User: What are the symptoms of blast disease in rice?
User: How can I prevent it?

Standalone Question:
How can I prevent blast disease in rice?

Conversation:
User: What are the symptoms of blast disease in rice?
User: Which fungicide should I use?

Standalone Question:
Which fungicide should I use for blast disease in rice?

Conversation:
User: Which fungicide should I use for blast disease in rice?
User: When should I spray it?

Standalone Question:
When should I spray fungicide for blast disease in rice?

Conversation:
User: What is the market price of tomato in Karnataka?
User: What about onion?

Standalone Question:
What is the market price of onion in Karnataka?

Conversation:
User: What is the weather in Bengaluru?
User: What about Mysuru?

Standalone Question:
What is the weather in Mysuru?

Now rewrite the user's latest question.

Conversation History:
{history}

Current Question:
{question}

Standalone Question:
""")


rewrite_chain = (
    rewrite_prompt
    | llm
    | StrOutputParser()
)


def rewrite_query(question: str, history: str = "") -> str:
    """
    Rewrite follow-up questions into standalone questions.
    """

    if not history or not history.strip():
        return question

    rewritten_question = rewrite_chain.invoke(
        {
            "history": history,
            "question": question,
        }
    ).strip()

    print("\n===== REWRITTEN QUERY =====")
    print(rewritten_question)
    print("===========================\n")

    return rewritten_question