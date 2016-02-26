import subprocess
import logging
import os

def restart(_name):
    _path = os.path.join(os.path.dirname(os.path.abspath(__file__)))
    _cmd = "touch " + _path[:-4] + "backend/" + _name
    subprocess.check_output(_cmd, shell=True)
