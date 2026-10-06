import uvicorn

if __name__ == "__main__":
    print("Starting Persona-Based Explanation Chatbot Backend...")
    print("Documentation available at: http://localhost:8000/docs")
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
