import os
import sys

# Add the project root and backend folder to sys.path so backend is importable
current_dir = os.path.dirname(os.path.abspath(__file__))

# Robust workspace root detection (handles both nested and flattened structures)
if os.path.exists(os.path.join(current_dir, "backend")):
    workspace_root = current_dir
else:
    workspace_root = os.path.dirname(current_dir)

backend_dir = os.path.join(workspace_root, "backend")

if workspace_root not in sys.path:
    sys.path.insert(0, workspace_root)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

try:
    from backend.main import app
    
    # Diagnostic middleware to expose the request path in response headers
    @app.middleware("http")
    async def debug_path_middleware(request, call_next):
        response = await call_next(request)
        response.headers["X-Debug-Fastapi-Path"] = request.url.path
        return response
        
except Exception as e:
    import traceback
    from fastapi import FastAPI
    app = FastAPI()
    
    @app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
    def catch_all(path: str):
        return {
            "error": "Failed to import backend",
            "exception": str(e),
            "traceback": traceback.format_exc()
        }
