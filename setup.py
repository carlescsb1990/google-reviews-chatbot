#!/usr/bin/env python3

import subprocess
import sys
import os

def check_pip():
    """Check if pip is available"""
    try:
        subprocess.run([sys.executable, '-m', 'pip', '--version'], 
                      check=True, capture_output=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def install_dependencies():
    """Try to install dependencies from requirements.txt"""
    if not os.path.exists('requirements.txt'):
        print("❌ requirements.txt not found")
        return False
    
    if not check_pip():
        print("❌ pip is not available in this environment")
        print("   This is a common issue in restricted Docker environments")
        return False
    
    try:
        print("📦 Installing dependencies from requirements.txt...")
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], 
                      check=True)
        print("✅ Dependencies installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def check_dependencies():
    """Check if required dependencies are available"""
    required_packages = ['flask', 'google-auth', 'openai', 'celery']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
            print(f"✅ {package} is available")
        except ImportError:
            print(f"❌ {package} is missing")
            missing_packages.append(package)
    
    return len(missing_packages) == 0

def main():
    print("🔧 Google Reviews Chatbot Setup")
    print("=" * 40)
    
    print("\n1. Checking Python environment...")
    print(f"   Python version: {sys.version}")
    print(f"   Python executable: {sys.executable}")
    
    print("\n2. Checking pip availability...")
    pip_available = check_pip()
    if pip_available:
        print("   ✅ pip is available")
    else:
        print("   ❌ pip is not available")
    
    print("\n3. Checking current dependencies...")
    deps_available = check_dependencies()
    
    if not deps_available and pip_available:
        print("\n4. Attempting to install missing dependencies...")
        install_success = install_dependencies()
        if install_success:
            print("\n5. Re-checking dependencies...")
            check_dependencies()
    
    print("\n" + "=" * 40)
    if deps_available or (pip_available and install_dependencies()):
        print("🎉 Setup complete! You can now run the full Flask application:")
        print("   python3 chatbot/routes.py")
    else:
        print("⚠️  Setup incomplete. Running in limited mode:")
        print("   python3 minimal_chatbot.py")
        print("\n   To enable full functionality, ensure these packages are installed:")
        print("   - flask")
        print("   - google-auth")
        print("   - google-api-python-client") 
        print("   - openai")
        print("   - celery")
        print("   - python-dotenv")

if __name__ == '__main__':
    main()
