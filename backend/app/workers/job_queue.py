import concurrent.futures
from typing import Callable, Any, Dict
from app import extensions

# Local thread pool executor for background async jobs when Redis is absent
_executor = concurrent.futures.ThreadPoolExecutor(max_workers=8)

class JobQueue:
    """Manages asynchronous job dispatching with Redis RQ priority and local async thread fallback."""

    def enqueue(self, func: Callable, *args, **kwargs) -> None:
        if extensions.redis_client:
            try:
                from rq import Queue
                q = Queue("copilot-jobs", connection=extensions.redis_client)
                q.enqueue(func, *args, **kwargs)
                return
            except Exception as e:
                print(f"Redis queue dispatch failed, falling back to local thread worker: {e}")

        # Local background thread dispatch
        _executor.submit(func, *args, **kwargs)

job_queue = JobQueue()
