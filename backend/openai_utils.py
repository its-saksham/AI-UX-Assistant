# openai_utils.py

import os
import requests
from dotenv import load_dotenv
load_dotenv()


GITHUB_API_URL = "https://models.github.ai/inference/chat/completions"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

def generate_ui_suggestion(prompt: str) -> str:
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {GITHUB_TOKEN}"
    }

    body = {
        "model": "openai/gpt-4.1",
        "temperature": 0.7,
        "top_p": 1,
        "messages": [
            {
                "role": "system",
                "content": "You are a senior UI/UX expert and React developer. Return only clean, production-ready React component code."
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    }

    response = requests.post(GITHUB_API_URL, headers=headers, json=body)
    
    if response.status_code != 200:
        print("GitHub API error:", response.text)
        raise Exception("GitHub GPT-4 API call failed.")

    return response.json()["choices"][0]["message"]["content"]
