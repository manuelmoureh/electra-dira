import subprocess
import sys

def run_pipeline():
    print("=== DIRA LIVE DATA PIPELINE INITIATED ===")
    scripts = ["fetch_news.py", "fetch_social_threats.py", "fetch_counties.py"]
    
    for script in scripts:
        print(f"Running {script}...")
        res = subprocess.run([sys.executable, script], capture_output=True, text=True, encoding="utf-8")
        if res.returncode == 0:
            print(f"[OK] {script} completed successfully.")
            print(res.stdout.strip())
        else:
            print(f"[ERROR] {script} failed: {res.stderr.strip()}")
            
    print("=== PIPELINE EXECUTION COMPLETE ===")

if __name__ == "__main__":
    run_pipeline()
