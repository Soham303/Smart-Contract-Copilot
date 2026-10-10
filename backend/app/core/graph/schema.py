from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class BlockNode(BaseModel):
    id: str
    type: str
    props: Dict[str, Any] = Field(default_factory=dict)
    position: Optional[Dict[str, float]] = None

class Edge(BaseModel):
    id: Optional[str] = None
    from_: str = Field(alias="from")
    fromPort: str
    to: str
    toPort: str

    class Config:
        populate_by_name = True

class GraphMeta(BaseModel):
    name: str = "AptosContract"
    moduleName: str = "aptos_contract"
    version: str = "0.1.0"
    author: Optional[str] = None

class ContractGraph(BaseModel):
    schemaVersion: str = "1.0"
    target: str = "aptos-move"
    meta: GraphMeta = Field(default_factory=GraphMeta)
    blocks: List[BlockNode] = Field(default_factory=list)
    edges: List[Edge] = Field(default_factory=list)

    class Config:
        populate_by_name = True
