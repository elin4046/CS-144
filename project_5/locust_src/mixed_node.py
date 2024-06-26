import sys, random
from locust import HttpLocust, TaskSet

def openPost(locust):
    postid = random.randint(1, 500)
    url_prefix = '/blog/cs144/'
    request_name = '/blog/cs144'
    locust.client.get(url_prefix + str(postid), name=request_name)

def modifyPost(locust):
    postid = random.randint(1, 500)
    url_prefix = '/api/cs144/'
    request_name = '/api/cs144'
    data_object = { 'title': 'Loading Test', 'body': '***Hello World!***' }
    locust.client.put(url_prefix + str(postid), data=data_object, name=request_name)

class MyTaskSet(TaskSet):
    tasks = {openPost: 9, modifyPost: 1}
    def on_start(locust):
        response = locust.client.post("/login", data={"username":"cs144", "password": "password"})
        if response.status_code != 200:
            print("FAIL to start with posting data to server. Make sure that your server is running.")
            sys.exit()

class MyLocust(HttpLocust):
    task_set = MyTaskSet
    min_wait = 1000
    max_wait = 2000
