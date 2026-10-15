from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class UserModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    email: str
    passwordHash: str
    oauthId: Optional[str] = None
    name: str = ""
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    plan: str = "free"
    preferences: Dict[str, Any] = Field(default_factory=lambda: {"learningMode": True, "gridSnap": True})

class ProjectModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    ownerId: str
    name: str
    mode: str = "blocks"  # "blocks" or "code"
    currentGraphId: Optional[str] = None
    currentCodeId: Optional[str] = None
    network: str = "testnet"
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class GraphVersionModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    projectId: str
    graph: Dict[str, Any]
    schemaVersion: str = "1.0"
    hash: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class CodeVersionModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    projectId: str
    files: Dict[str, str]
    generatedFromGraphId: Optional[str] = None
    sourceMap: Optional[Dict[str, Any]] = None
    hash: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class JobModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    projectId: str
    type: str  # compile, audit, gas, report, ai, ai_code
    status: str = "queued"  # queued, processing, completed, failed
    inputHash: Optional[str] = None
    progress: int = 0
    message: Optional[str] = None
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    startedAt: Optional[datetime] = None
    finishedAt: Optional[datetime] = None

class FindingModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    jobId: str
    ruleId: str
    severity: str  # Critical, High, Medium, Low, Info
    blockId: Optional[str] = None
    file: Optional[str] = None
    line: Optional[int] = None
    message: str
    fix: Optional[str] = None
    acknowledged: bool = False
    note: Optional[str] = None

class GasReportModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    jobId: str
    entries: List[Dict[str, Any]] = Field(default_factory=list)
    optimizations: List[Dict[str, Any]] = Field(default_factory=list)
    gasPrice: int = 100
    network: str = "testnet"
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class PermissionMatrixModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    projectId: str
    codeHash: str
    matrix: List[Dict[str, Any]] = Field(default_factory=list)
    keyAnswers: Dict[str, Any] = Field(default_factory=dict)
    mutableParameters: List[str] = Field(default_factory=list)
    fundsFlow: Dict[str, Any] = Field(default_factory=dict)
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class DeploymentModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    projectId: str
    network: str = "testnet"
    address: str
    txHash: str
    codeHash: str
    deployedAt: datetime = Field(default_factory=datetime.utcnow)

class ReportModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    projectId: str
    pdfRef: str
    toolVersion: str = "1.0.0"
    rulesetVersion: str = "1.0.0"
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class AiLogModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    userId: Optional[str] = None
    promptHash: str
    graphResult: Dict[str, Any] = Field(default_factory=dict)
    valid: bool = True
    repairAttempts: int = 0
    latencyMs: float = 0.0
    createdAt: datetime = Field(default_factory=datetime.utcnow)
