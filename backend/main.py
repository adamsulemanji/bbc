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

# DynamoDB setup uses env variables so dev/prod can share code paths.
APP_ENV = os.getenv("APP_ENV", "dev").lower()
TABLE_NAME_PROD = os.getenv("BBC_TABLE_PROD", "bbc_prod")
TABLE_NAME_DEV = os.getenv("BBC_TABLE_DEV", "bbc_dev")

dynamodb = boto3.resource("dynamodb")
table_prod = dynamodb.Table(TABLE_NAME_PROD)
table_dev = dynamodb.Table(TABLE_NAME_DEV)
active_table = table_prod if APP_ENV == "prod" else table_dev

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
