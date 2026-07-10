from app.services.rag.chat import ask_rag

question = input("Ask a question: ")

answer = ask_rag(question)

print("\n")
print("=" * 50)
print(answer)
print("=" * 50)