from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate as cpt

template="""
Answer the question below

This is conversation history: {context}

Question: {question}

Answer:
"""

model=OllamaLLM(model="llama3")
prompt=cpt.from_template(template)

chain=prompt | model

def handle_convo():
    context =""
    print("Welcome to Calmora ChatBot,Type 'exit' to quit.")
    while True:
        user_input=input("You: ")
        if user_input.lower()=="exit":
            break
        result=chain.invoke({"context": context,"question": user_input})
        print("Calmora: ",result)
        context+=f"\nUser: {user_input}\nAI: {result}"

if __name__=="__main__":
    handle_convo()