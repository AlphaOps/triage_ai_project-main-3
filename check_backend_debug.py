
import sys
import traceback

try:
    print("Attempting to import api...")
    import api
    print("Successfully imported api.")
    print("Backend check logic complete.")
except Exception:
    traceback.print_exc()
    sys.exit(1)
