#*--------------------------------------------------*#
#  file: ./run.py
#  This write by alittleshark-dev.
#  You can run this file to run server.
#*--------------------------------------------------*#
from app import app

if __name__ == "__main__":
    app.run("0.0.0.0", 5501, debug=True)