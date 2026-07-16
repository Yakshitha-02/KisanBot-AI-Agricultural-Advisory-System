from app.services.rag.chat import ask_rag

question = "How do I prevent rice blast disease?"

answer = ask_rag(question)

print("\nQuestion:")
print(question)

print("\nAnswer:")
print(answer)