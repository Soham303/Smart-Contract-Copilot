from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class FunctionParamIR(BaseModel):
    name: str
    type_name: str

class FunctionIR(BaseModel):
    name: str
    visibility: str = "public"
    is_entry: bool = True
    params: List[FunctionParamIR] = Field(default_factory=list)
    return_type: Optional[str] = None
    acquires: List[str] = Field(default_factory=list)
    body_statements: List[str] = Field(default_factory=list)
    block_id: Optional[str] = None

class StructFieldIR(BaseModel):
    name: str
    type_name: str

class StructIR(BaseModel):
    name: str
    abilities: List[str] = Field(default_factory=lambda: ["key", "store"])
    fields: List[StructFieldIR] = Field(default_factory=list)
    block_id: Optional[str] = None

class ModuleIR(BaseModel):
    address: str = "copilot_addr"
    name: str = "contract"
    imports: List[str] = Field(default_factory=list)
    constants: Dict[str, Any] = Field(default_factory=dict)
    structs: List[StructIR] = Field(default_factory=list)
    functions: List[FunctionIR] = Field(default_factory=list)
    test_functions: List[FunctionIR] = Field(default_factory=list)
