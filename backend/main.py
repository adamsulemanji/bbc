import os
import uuid
import boto3
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
import re
from mangum import Mangum

app = FastAPI()

# Add CORS middleware
origins = [
    "http://localhost:8000",
    "http://localhost:3000",
    "https://bbc.adamsulemanji.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

handler = Mangum(app)

@app.get("/")
def read_root():
    return {"success": True, "message": "Hello, World!"}

