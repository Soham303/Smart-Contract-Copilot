from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class UserModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    email: str
    passwordHash: str
    oauthId: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    plan: str = "free"
    preferences: Dict[str, Any] = Field(default_factory=lambda: {"learningMode": True})

class ProjectModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    ownerId: str
    name: str
    mode: str = "blocks"  # blocks or code
    currentGraphId: Optional[str] = None
    currentCodeId: Optional[str] = None
    network: str = "testnet"
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class JobModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    projectId: str
    type: str  # compile, audit, gas, report, ai
    status: str = "queued"  # queued, processing, completed, failed
    inputHash: Optional[str] = None
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    startedAt: Optional[datetime] = None
    finishedAt: Optional[datetime] = None

class DeploymentModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    projectId: str
    network: str = "testnet"
    address: str
    txHash: str
    codeHash: str
    deployedAt: datetime = Field(default_factory=datetime.utcnow)
