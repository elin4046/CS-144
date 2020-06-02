import sys, random
from locust import HttpLocust, TaskSet

def openPost(locust):
    postid = random.randint(1, 500)
    url_prefix = '/editor/post?action=open&username=cs144&postid='
    request_name = '/editor/post?action=open'
    locust.client.get(url_prefix + str(postid), name=request_name)

def modifyPost(locust):
    postid = random.randint(1, 500)
    url_prefix = '/editor/post?action=save&username=cs144&postid=' + str(postid) + '&title=Loading%20Test&body=***Hello%20World!***'
    request_name = '/editor/post?action=save'
    locust.client.post(url_prefix, name=request_name)

class MyTaskSet(TaskSet):
    tasks = {openPost: 9, modifyPost: 1}

class MyLocust(HttpLocust):
    task_set = MyTaskSet
    min_wait = 1000
    max_wait = 2000