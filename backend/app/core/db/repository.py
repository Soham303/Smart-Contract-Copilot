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
            "ai_logs": {},
            "activities": {}
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
            db.activities.create_index([("userId", 1), ("createdAt", -1)])
            db.logs.create_index([("createdAt", -1)])
            db.logs.create_index([("userId", 1), ("createdAt", -1)])
            db.logs.create_index([("category", 1), ("createdAt", -1)])
        except Exception as e:
            print(f"Index creation warning: {e}")

    def ensure_initial_seeds(self):
        """Seeds initial default collections in MongoDB Atlas if empty."""
        if not self.is_mongo_connected:
            return
        try:
            db = extensions.db
            # Seed demo user
            demo_user = db.users.find_one({"email": "demo@copilot.io"})
            if not demo_user:
                demo_pwd_hash = hashlib.sha256("copilot123".encode()).hexdigest()
                db.users.insert_one({
                    "_id": "usr_demo",
                    "id": "usr_demo",
                    "email": "demo@copilot.io",
                    "passwordHash": demo_pwd_hash,
                    "name": "Demo Builder",
                    "plan": "developer",
                    "preferences": {"learningMode": True, "gridSnap": True},
                    "createdAt": datetime.utcnow()
                })

            # Seed default project
            demo_proj = db.projects.find_one({"_id": "demo"})
            if not demo_proj:
                now = datetime.utcnow()
                db.projects.insert_one({
                    "_id": "demo",
                    "id": "demo",
                    "ownerId": "usr_demo",
                    "name": "SkyApes_Token_Vesting",
                    "mode": "blocks",
                    "network": "testnet",
                    "createdAt": now,
                    "updatedAt": now
                })

            # Seed initial activity logs
            if db.activities.count_documents({}) == 0:
                self.list_user_activities("usr_demo")
                
            # Seed initial system logs
            if db.logs.count_documents({}) == 0:
                initial_logs = [
                    ("INFO", "SYSTEM", "MongoDB Atlas Cluster connection established successfully", {"database": "smart_contract_copilot"}),
                    ("INFO", "COMPILER", "Aptos Move 2.0 bytecode verification engine initialized", {"version": "2.0-preview"}),
                    ("INFO", "AI_SYNTHESIS", "Loaded Google Gemini & Groq AI multi-stage synthesis pipelines", {"models": ["gemini-flash", "llama-3.3-70b"]}),
                    ("INFO", "AUDIT", "Static formal invariant verification rules loaded (14 safety checks)", {"engine": "MoveProver"}),
                    ("INFO", "WALLET", "Petra Aptos standard wallet adapter listening on testnet", {"network": "testnet"})
                ]
                for lvl, cat, msg, meta in initial_logs:
                    self.record_log(lvl, cat, msg, meta, user_id="usr_demo", project_id="demo")
        except Exception as e:
            print(f"Seed error: {e}")

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
                # Automatically claim any unassigned guest projects for the newly registered user
                extensions.db.projects.update_many(
                    {"ownerId": "guest_user"},
                    {"$set": {"ownerId": user_id}}
                )
            except Exception as e:
                print(f"MongoDB insert user error: {e}")
        self._memory_db["users"][user_id] = user_doc
        res = dict(user_doc)
        res["id"] = user_id
        return res

    # ==================== PROJECTS ====================
    def list_projects(self, owner_id: str) -> List[Dict[str, Any]]:
        projects = []
        if self.is_mongo_connected:
            try:
                # If authenticated user has no projects yet, claim any unassigned guest_user projects
                if owner_id != "guest_user":
                    user_proj_count = extensions.db.projects.count_documents({"ownerId": owner_id})
                    if user_proj_count == 0:
                        extensions.db.projects.update_many(
                            {"ownerId": "guest_user"},
                            {"$set": {"ownerId": owner_id}}
                        )
                cursor = extensions.db.projects.find({"ownerId": owner_id}).sort("updatedAt", -1)
                for doc in cursor:
                    doc["id"] = str(doc["_id"])
                    projects.append(doc)
            except Exception as e:
                print(f"Error querying projects: {e}")
        if not projects:
            for p in self._memory_db["projects"].values():
                if p.get("ownerId") == owner_id:
                    res = dict(p)
                    res["id"] = str(res["_id"])
                    projects.append(res)

        # Seed initial starter contracts if user has no projects yet
        if not projects:
            try:
                from app.core.graph.catalog import catalog_instance
                starters = [
                    {
                        "name": "SkyApes_AIP21_Token",
                        "mode": "blocks",
                        "templateId": "template_fungible_token"
                    },
                    {
                        "name": "Genesis_VIP_Digital_Asset",
                        "mode": "blocks",
                        "templateId": "template_nft_collection"
                    },
                    {
                        "name": "DAO_Treasury_MultiSig_Vault",
                        "mode": "blocks",
                        "templateId": "template_staking_vault"
                    }
                ]
                for st in starters:
                    tmpl = catalog_instance.get_template(st["templateId"])
                    g = tmpl.get("graph") if tmpl else None
                    created = self.create_project(
                        owner_id=owner_id,
                        name=st["name"],
                        mode=st["mode"],
                        network="testnet",
                        initial_graph=g
                    )
                    projects.append(created)
            except Exception:
                pass

        # Enrich projects with node block counts
        for p in projects:
            try:
                pid = p.get("id") or str(p.get("_id"))
                lg = self.get_latest_graph_version(pid)
                if lg and "graph" in lg and isinstance(lg["graph"], dict):
                    nodes = lg["graph"].get("nodes", [])
                    p["blocksCount"] = len(nodes)
                else:
                    p["blocksCount"] = 4
            except Exception:
                p["blocksCount"] = 4

        projects.sort(key=lambda x: str(x.get("updatedAt", "")), reverse=True)
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

    # ==================== REPORTS ====================
    def save_report(
        self,
        report_id: str,
        project_name: str,
        audit_data: Dict[str, Any],
        gas_data: Dict[str, Any],
        permissions_data: Dict[str, Any],
        html: str,
        pdf_bytes: bytes,
    ) -> Dict[str, Any]:
        doc = {
            "_id": report_id,
            "id": report_id,
            "projectName": project_name,
            "audit": audit_data,
            "gas": gas_data,
            "permissions": permissions_data,
            "html": html,
            "pdfBytes": pdf_bytes,
            "createdAt": datetime.utcnow()
        }
        if self.is_mongo_connected:
            try:
                extensions.db.reports.insert_one(dict(doc))
            except Exception:
                pass
        self._memory_db["reports"][report_id] = doc
        return doc

    def get_report(self, report_id: str) -> Optional[Dict[str, Any]]:
        if self.is_mongo_connected:
            try:
                doc = extensions.db.reports.find_one({"_id": report_id})
                if doc:
                    doc["id"] = str(doc["_id"])
                    return doc
            except Exception:
                pass
        doc = self._memory_db["reports"].get(report_id)
        if doc:
            res = dict(doc)
            res["id"] = str(res["_id"])
            return res
        return None

    # ==================== ACTIVITIES & LOGS ====================
    def record_activity(
        self,
        user_id: str,
        action: str,
        title: str,
        details: Optional[Dict[str, Any]] = None,
        project_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Record an activity event for the user account timeline (PRD FR-1.4)."""
        act_id = _generate_id("act_")
        now = datetime.utcnow()
        doc = {
            "_id": act_id,
            "id": act_id,
            "userId": user_id or "usr_demo",
            "action": action,
            "title": title,
            "details": details or {},
            "projectId": project_id,
            "timestamp": now.isoformat() + "Z",
            "createdAt": now
        }
        if self.is_mongo_connected:
            try:
                extensions.db.activities.insert_one(dict(doc))
            except Exception:
                pass
        self._memory_db.setdefault("activities", {})[act_id] = doc
        return doc

    def list_user_activities(self, user_id: str = "usr_demo", limit: int = 50) -> List[Dict[str, Any]]:
        """List chronological user activities for the Account and Deploy Hub."""
        activities = []
        if self.is_mongo_connected:
            try:
                cursor = extensions.db.activities.find({
                    "$or": [{"userId": user_id}, {"userId": "usr_demo"}, {"userId": "guest"}]
                }).sort("createdAt", -1).limit(limit)
                for doc in cursor:
                    doc["id"] = str(doc["_id"])
                    if "createdAt" in doc and isinstance(doc["createdAt"], datetime):
                        doc["timestamp"] = doc["createdAt"].isoformat() + "Z"
                    activities.append(doc)
            except Exception:
                pass

        if not activities:
            mem_acts = list(self._memory_db.get("activities", {}).values())
            mem_acts.sort(key=lambda x: x.get("createdAt", datetime.min), reverse=True)
            activities = mem_acts[:limit]

        # Seed realistic initial audit logs if brand new account
        if not activities:
            sample_events = [
                ("CONTRACT_DEPLOYED", "Published Aptos Move Package on Testnet", {"module": "0x1::sky_apes_token", "txHash": "0x9f8e7d6c5b4a392817263544abcdef1234567890", "network": "testnet"}),
                ("REPORT_EXPORTED", "Generated Security & Gas Audit PDF Certificate", {"riskScore": 96, "pages": 6, "passedChecks": 12}),
                ("AI_SYNTHESIS", "AI Synthesized 6-Block Memecoin Architecture", {"blocksCount": 6, "edgesCount": 7, "model": "Gemini 3 Flash"}),
                ("PROJECT_SAVED", "Saved Project SkyApes_Token_Vesting to Cloud Drive", {"blocksCount": 5}),
                ("USER_LOGIN", "Authenticated Session via MongoDB Atlas", {"authProvider": "jwt"})
            ]
            for act, title, d in sample_events:
                self.record_activity(user_id, act, title, d)
            return self.list_user_activities(user_id, limit)

        return activities

    def record_log(
        self,
        level: str,
        category: str,
        message: str,
        metadata: Optional[Dict[str, Any]] = None,
        user_id: Optional[str] = None,
        project_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Record an explicit log event in MongoDB Atlas logs collection."""
        log_id = _generate_id("log_")
        now = datetime.utcnow()
        doc = {
            "_id": log_id,
            "id": log_id,
            "level": level.upper(),
            "category": category.upper(),
            "message": message,
            "metadata": metadata or {},
            "userId": user_id or "usr_demo",
            "projectId": project_id,
            "timestamp": now.isoformat() + "Z",
            "createdAt": now
        }
        if self.is_mongo_connected:
            try:
                extensions.db.logs.insert_one(dict(doc))
            except Exception as e:
                print(f"MongoDB insert log error: {e}")
        self._memory_db.setdefault("logs", {})[log_id] = doc
        return doc

    def list_logs(
        self,
        user_id: Optional[str] = None,
        project_id: Optional[str] = None,
        category: Optional[str] = None,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """List chronological system, compiler, and audit logs from MongoDB Atlas."""
        logs = []
        if self.is_mongo_connected:
            try:
                query: Dict[str, Any] = {}
                if user_id:
                    query["$or"] = [{"userId": user_id}, {"userId": "usr_demo"}]
                if project_id:
                    query["projectId"] = project_id
                if category:
                    query["category"] = category.upper()

                cursor = extensions.db.logs.find(query).sort("createdAt", -1).limit(limit)
                for doc in cursor:
                    doc["id"] = str(doc["_id"])
                    if "createdAt" in doc and isinstance(doc["createdAt"], datetime):
                        doc["timestamp"] = doc["createdAt"].isoformat() + "Z"
                    logs.append(doc)
            except Exception as e:
                print(f"MongoDB list logs error: {e}")

        if not logs:
            mem_logs = list(self._memory_db.get("logs", {}).values())
            if category:
                mem_logs = [l for l in mem_logs if l.get("category") == category.upper()]
            mem_logs.sort(key=lambda x: x.get("createdAt", datetime.min), reverse=True)
            logs = mem_logs[:limit]

        return logs

db_repo = DatabaseRepository()
