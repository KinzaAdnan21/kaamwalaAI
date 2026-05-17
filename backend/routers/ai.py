import os
import json
from fastapi import APIRouter, HTTPException
import schemas
from google import genai
from google.genai import types

router = APIRouter()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

@router.post("/diagnose", response_model=schemas.DiagnosisResponse)
def diagnose_issue(request: schemas.DiagnosisRequest):
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key":
        return {
            "causes": [
                { "title": 'Refrigerant gas leak', "sub": 'Most common issue', "pct": 65, "color": '#DC2626', "range": 'Rs. 4,000 – 6,500' },
                { "title": 'Compressor / PCB fault', "sub": 'Electrical issue', "pct": 22, "color": '#F59E0B', "range": 'Rs. 5,500 – 8,000' },
                { "title": 'Filters / coils blocked', "sub": 'Needs servicing', "pct": 13, "color": '#10B981', "range": 'Rs. 3,500 – 4,500' }
            ]
        }
    
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        prompt = f"""
        Analyze the following home appliance/service issue and provide the top 3 likely causes.
        Issue: "{request.issue_description}"
        
        Respond ONLY with a JSON object in this exact format:
        {{
            "causes": [
                {{
                    "title": "Short title of cause",
                    "sub": "Short description/sub-text (in Roman Urdu or English)",
                    "pct": probability_percentage_as_integer,
                    "color": "hex_color_code_representing_severity_like_#DC2626",
                    "range": "Estimated price range in PKR, e.g., 'Rs. 4,000 - 6,500'"
                }}
            ]
        }}
        """
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            )
        )
        
        result = json.loads(response.text)
        return result
    except Exception as e:
        print(f"Gemini API error: {e}")
        raise HTTPException(status_code=500, detail="Failed to analyze issue")
