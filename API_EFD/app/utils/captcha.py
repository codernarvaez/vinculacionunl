import httpx
import os
from fastapi import HTTPException, status
from dotenv import load_dotenv

load_dotenv()

# Cloudflare Turnstile verification URL
TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

# Test secret key for development: always passes
TEST_SECRET_KEY = "1x0000000000000000000000000000000AA"

async def verify_turnstile_token(token: str):
    """
    Verifies the Cloudflare Turnstile token.
    Uses the test secret key if in development or if TURNSTILE_SECRET_KEY is not set.
    """
    secret_key = os.getenv("TURNSTILE_SECRET_KEY", TEST_SECRET_KEY)
    
    # In development mode, we use the test secret key automatically if not provided
    # or if we are on localhost (common during dev)
    # The user request explicitly said to use the test key for development.
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                TURNSTILE_VERIFY_URL,
                data={
                    "secret": secret_key,
                    "response": token,
                },
                timeout=10.0
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Error connecting to Cloudflare verification service"
                )
            
            result = response.json()
            if not result.get("success"):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid Captcha"
                )
                
            return True
            
        except httpx.RequestError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error verifying captcha: {str(e)}"
            )
