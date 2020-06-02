import sys, random
from locust import HttpLocust, TaskSet

def modifyPost(locust):
    postid = random.randint(1, 500)
    url_prefix = '/editor/post?action=save&username=cs144&postid=' + str(postid) + '&title=Loading%20Test&body=***Hello%20World!***'
    request_name = '/editor/post?action=save'
    locust.client.post(url_prefix, name=request_name)

class MyTaskSet(TaskSet):
    tasks = [modifyPost]

class MyLocust(HttpLocust):
    task_set = MyTaskSet
    min_wait = 1000
    max_wait = 2000
