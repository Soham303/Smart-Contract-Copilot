import hashlib
import time
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
from app import extensions

def _generate_id(prefix: str = "") -> str:
    return f"{prefix}{uuid.uuid4().hex[:16]}"

class DatabaseRepository:
    """Unified Data Access Layer supporting both MongoDB and in-memory resilient fallback.

    Conforms to PRD Section 14 (Data Model).
    """

    def __init__(self):
        # In-memory document collections as fallback
        self._memory_db: Dict[str, Dict[str, Dict[str, Any]]] = {
            "users": {},
            "projects": {},
            "graph_versions": {},
            "code_versions": {},
            "jobs": {},
            "findings": {},
            "gas_reports": {},
            "permission_matrices": {},
            "deployments": {},
            "reports": {},
            "ai_logs": {}
        }
        self._init_demo_data()

    def _init_demo_data(self):
        demo_pwd_hash = hashlib.sha256("copilot123".encode()).hexdigest()
        self._memory_db["users"]["usr_demo"] = {
            "_id": "usr_demo",
            "email": "demo@copilot.io",
            "passwordHash": demo_pwd_hash,
            "name": "Demo Builder",
            "plan": "developer",
            "preferences": {"learningMode": True, "gridSnap": True},
            "createdAt": datetime.utcnow()
        }

    @property
    def is_mongo_connected(self) -> bool:
        return extensions.db is not None

    def ensure_indexes(self):
        """Creates required MongoDB indexes (PRD Section 14)."""
        if not self.is_mongo_connected:
            return
        try:
            db = extensions.db
            db.users.create_index("email", unique=True)
            db.projects.create_index([("ownerId", 1), ("updatedAt", -1)])
            db.graph_versions.create_index([("projectId", 1), ("createdAt", -1)])
            db.code_versions.create_index([("projectId", 1), ("createdAt", -1)])
            db.jobs.create_index([("projectId", 1), ("type", 1), ("createdAt", -1)])
            db.findings.create_index("jobId")
            db.deployments.create_index([("projectId", 1), ("deployedAt", -1)])
        except Exception as e:
            print(f"Index creation warning: {e}")

    # ==================== USERS ====================
    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        norm_email = email.strip().lower()
        if self.is_mongo_connected:
            try:
                doc = extensions.db.users.find_one({"email": norm_email})
                if doc:
                    doc["id"] = str(doc["_id"])
                    return doc
            except Exception:
                pass
        for u in self._memory_db["users"].values():
            if u.get("email") == norm_email:
                res = dict(u)
                res["id"] = str(res["_id"])
                return res
        return None

    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        if self.is_mongo_connected:
            try:
                doc = extensions.db.users.find_one({"_id": user_id})
                if doc:
                    doc["id"] = str(doc["_id"])
                    return doc
            except Exception:
                pass
        doc = self._memory_db["users"].get(user_id)
        if doc:
            res = dict(doc)
            res["id"] = str(res["_id"])
            return res
        return None

    def create_user(self, email: str, password_hash: str, name: str = "", plan: str = "free") -> Dict[str, Any]:
        norm_email = email.strip().lower()
        user_id = _generate_id("usr_")
        user_doc = {
            "_id": user_id,
            "email": norm_email,
            "passwordHash": password_hash,
            "name": name or norm_email.split("@")[0],
            "plan": plan,
            "preferences": {"learningMode": True, "gridSnap": True},
            "createdAt": datetime.utcnow()
        }
        if self.is_mongo_connected:
            try:
                extensions.db.users.insert_one(dict(user_doc))
            except Exception:
                pass
        self._memory_db["users"][user_id] = user_doc
        res = dict(user_doc)
        res["id"] = user_id
        return res

    # ==================== PROJECTS ====================
    def list_projects(self, owner_id: str) -> List[Dict[str, Any]]:
        projects = []
        if self.is_mongo_connected:
            try:
                cursor = extensions.db.projects.find({"ownerId": owner_id}).sort("updatedAt", -1)
                for doc in cursor:
                    doc["id"] = str(doc["_id"])
                    projects.append(doc)
                return projects
            except Exception:
                pass
        for p in self._memory_db["projects"].values():
            if p.get("ownerId") == owner_id:
                res = dict(p)
                res["id"] = str(res["_id"])
                projects.append(res)
        projects.sort(key=lambda x: x.get("updatedAt", datetime.min), reverse=True)
        return projects

    def get_project(self, project_id: str) -> Optional[Dict[str, Any]]:
        if self.is_mongo_connected:
            try:
                doc = extensions.db.projects.find_one({"_id": project_id})
                if doc:
                    doc["id"] = str(doc["_id"])
                    return doc
            except Exception:
                pass
        doc = self._memory_db["projects"].get(project_id)
        if doc:
            res = dict(doc)
            res["id"] = str(res["_id"])
            return res
        return None

    def create_project(self, owner_id: str, name: str, mode: str = "blocks", network: str = "testnet", initial_graph: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        proj_id = _generate_id("proj_")
        now = datetime.utcnow()
        proj_doc = {
            "_id": proj_id,
            "ownerId": owner_id,
            "name": name,
            "mode": mode,
            "network": network,
            "currentGraphId": None,
            "currentCodeId": None,
            "createdAt": now,
            "updatedAt": now
        }

        # If initial graph is provided, save it as version 1
        if initial_graph:
            g_ver = self.save_graph_version(proj_id, initial_graph)
            proj_doc["currentGraphId"] = g_ver["id"]

        if self.is_mongo_connected:
            try:
                extensions.db.projects.insert_one(dict(proj_doc))
            except Exception:
                pass
        self._memory_db["projects"][proj_id] = proj_doc
        res = dict(proj_doc)
        res["id"] = proj_id
        return res

    def update_project(self, project_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        now = datetime.utcnow()
        updates["updatedAt"] = now

        if self.is_mongo_connected:
            try:
                extensions.db.projects.update_one({"_id": project_id}, {"$set": updates})
                doc = extensions.db.projects.find_one({"_id": project_id})
                if doc:
                    doc["id"] = str(doc["_id"])
                    return doc
            except Exception:
                pass

        if project_id in self._memory_db["projects"]:
            self._memory_db["projects"][project_id].update(updates)
            res = dict(self._memory_db["projects"][project_id])
            res["id"] = project_id
            return res
        return None

    def delete_project(self, project_id: str) -> bool:
        if self.is_mongo_connected:
            try:
                extensions.db.projects.delete_one({"_id": project_id})
                extensions.db.graph_versions.delete_many({"projectId": project_id})
                extensions.db.code_versions.delete_many({"projectId": project_id})
            except Exception:
                pass
        removed = self._memory_db["projects"].pop(project_id, None)
        return removed is not None

    # ==================== GRAPH VERSIONS ====================
    def save_graph_version(self, project_id: str, graph_dict: Dict[str, Any]) -> Dict[str, Any]:
        ver_id = _generate_id("gv_")
        import json
        canon_json = json.dumps(graph_dict, sort_keys=True)
        g_hash = hashlib.sha256(canon_json.encode()).hexdigest()
        now = datetime.utcnow()

        ver_doc = {
            "_id": ver_id,
            "projectId": project_id,
            "graph": graph_dict,
            "schemaVersion": graph_dict.get("schemaVersion", "1.0"),
            "hash": g_hash,
            "createdAt": now
        }

        if self.is_mongo_connected:
            try:
                extensions.db.graph_versions.insert_one(dict(ver_doc))
                extensions.db.projects.update_one(
                    {"_id": project_id},
                    {"$set": {"currentGraphId": ver_id, "updatedAt": now}}
                )
            except Exception:
                pass

        self._memory_db["graph_versions"][ver_id] = ver_doc
        if project_id in self._memory_db["projects"]:
            self._memory_db["projects"][project_id]["currentGraphId"] = ver_id
            self._memory_db["projects"][project_id]["updatedAt"] = now

        res = dict(ver_doc)
        res["id"] = ver_id
        return res

    def get_latest_graph_version(self, project_id: str) -> Optional[Dict[str, Any]]:
        proj = self.get_project(project_id)
        if proj and proj.get("currentGraphId"):
            return self.get_graph_version(proj["currentGraphId"])
        # Fallback to latest by date
        if self.is_mongo_connected:
            try:
                doc = extensions.db.graph_versions.find_one(
                    {"projectId": project_id},
                    sort=[("createdAt", -1)]
                )
                if doc:
                    doc["id"] = str(doc["_id"])
                    return doc
            except Exception:
                pass
        matches = [g for g in self._memory_db["graph_versions"].values() if g.get("projectId") == project_id]
        if matches:
            matches.sort(key=lambda x: x.get("createdAt", datetime.min), reverse=True)
            res = dict(matches[0])
            res["id"] = str(res["_id"])
            return res
        return None

    def get_graph_version(self, version_id: str) -> Optional[Dict[str, Any]]:
        if self.is_mongo_connected:
            try:
                doc = extensions.db.graph_versions.find_one({"_id": version_id})
                if doc:
                    doc["id"] = str(doc["_id"])
                    return doc
            except Exception:
                pass
        doc = self._memory_db["graph_versions"].get(version_id)
        if doc:
            res = dict(doc)
            res["id"] = str(res["_id"])
            return res
        return None

    # ==================== JOBS ====================
    def create_job(self, project_id: str, job_type: str, input_hash: Optional[str] = None) -> Dict[str, Any]:
        job_id = _generate_id("job_")
        now = datetime.utcnow()
        job_doc = {
            "_id": job_id,
            "projectId": project_id,
            "type": job_type,
            "status": "queued",
            "inputHash": input_hash,
            "progress": 0,
            "message": "Job enqueued in pipeline",
            "result": None,
            "error": None,
            "startedAt": now,
            "finishedAt": None
        }
        if self.is_mongo_connected:
            try:
                extensions.db.jobs.insert_one(dict(job_doc))
            except Exception:
                pass
        self._memory_db["jobs"][job_id] = job_doc
        res = dict(job_doc)
        res["id"] = job_id
        return res

    def update_job(self, job_id: str, status: str, progress: int = 100, result: Optional[Dict[str, Any]] = None, error: Optional[str] = None, message: Optional[str] = None) -> Optional[Dict[str, Any]]:
        now = datetime.utcnow()
        updates = {
            "status": status,
            "progress": progress,
            "message": message or f"Status: {status}",
            "result": result,
            "error": error
        }
        if status in ["completed", "failed"]:
            updates["finishedAt"] = now

        if self.is_mongo_connected:
            try:
                extensions.db.jobs.update_one({"_id": job_id}, {"$set": updates})
                doc = extensions.db.jobs.find_one({"_id": job_id})
                if doc:
                    doc["id"] = str(doc["_id"])
                    return doc
            except Exception:
                pass

        if job_id in self._memory_db["jobs"]:
            self._memory_db["jobs"][job_id].update(updates)
            res = dict(self._memory_db["jobs"][job_id])
            res["id"] = job_id
            return res
        return None

    def get_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        if self.is_mongo_connected:
            try:
                doc = extensions.db.jobs.find_one({"_id": job_id})
                if doc:
                    doc["id"] = str(doc["_id"])
                    return doc
            except Exception:
                pass
        doc = self._memory_db["jobs"].get(job_id)
        if doc:
            res = dict(doc)
            res["id"] = str(res["_id"])
            return res
        return None

    # ==================== DEPLOYMENTS ====================
    def record_deployment(self, project_id: str, network: str, address: str, tx_hash: str, code_hash: str = "") -> Dict[str, Any]:
        dep_id = _generate_id("dep_")
        now = datetime.utcnow()
        dep_doc = {
            "_id": dep_id,
            "projectId": project_id,
            "network": network,
            "address": address,
            "txHash": tx_hash,
            "codeHash": code_hash or hashlib.sha256(tx_hash.encode()).hexdigest(),
            "deployedAt": now
        }
        if self.is_mongo_connected:
            try:
                extensions.db.deployments.insert_one(dict(dep_doc))
            except Exception:
                pass
        self._memory_db["deployments"][dep_id] = dep_doc
        res = dict(dep_doc)
        res["id"] = dep_id
        return res

    def list_deployments(self, project_id: Optional[str] = None) -> List[Dict[str, Any]]:
        deps = []
        if self.is_mongo_connected:
            try:
                query = {"projectId": project_id} if project_id else {}
                cursor = extensions.db.deployments.find(query).sort("deployedAt", -1)
                for doc in cursor:
                    doc["id"] = str(doc["_id"])
                    deps.append(doc)
                return deps
            except Exception:
                pass
        for d in self._memory_db["deployments"].values():
            if project_id is None or d.get("projectId") == project_id:
                res = dict(d)
                res["id"] = str(res["_id"])
                deps.append(res)
        deps.sort(key=lambda x: x.get("deployedAt", datetime.min), reverse=True)
        return deps

    # ==================== AI LOGS ====================
    def log_ai(self, user_id: Optional[str], prompt: str, graph_result: Dict[str, Any], valid: bool = True, repair_attempts: int = 0, latency_ms: float = 0.0) -> Dict[str, Any]:
        log_id = _generate_id("ailog_")
        p_hash = hashlib.sha256(prompt.encode()).hexdigest()
        log_doc = {
            "_id": log_id,
            "userId": user_id,
            "promptHash": p_hash,
            "graphResult": graph_result,
            "valid": valid,
            "repairAttempts": repair_attempts,
            "latencyMs": latency_ms,
            "createdAt": datetime.utcnow()
        }
        if self.is_mongo_connected:
            try:
                extensions.db.ai_logs.insert_one(dict(log_doc))
            except Exception:
                pass
        self._memory_db["ai_logs"][log_id] = log_doc
        return log_doc

db_repo = DatabaseRepository()
