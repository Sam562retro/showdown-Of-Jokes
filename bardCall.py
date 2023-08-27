from bardapi import Bard
import os
import sys

os.environ['_BARD_API_KEY']="aQhBwm_-730rzNkB0tbXeBO8X_fugvGxJBVjXwD-CWU6CNnBp85kNMpbhxGdM8HktM3KwA."
msg = f"Can you rate this joke out of 10?: {sys.argv[1]}"
answer = Bard().get_answer(msg)['content']

lis = answer.split()
index = lis.index("out")

if lis[index+1] == "of":
    if lis[index-1].isnumeric():
        print(lis[index-1])
    else:
        print(0)
