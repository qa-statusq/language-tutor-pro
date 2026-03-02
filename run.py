"""Start Language Tutor on localhost:3000"""
import subprocess, sys, os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Install deps if needed
try:
    import flask
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "flask", "requests", "python-dotenv", "huggingface_hub"])

subprocess.call([sys.executable, "app.py"])
