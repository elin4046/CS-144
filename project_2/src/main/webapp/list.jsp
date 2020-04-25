<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%><%@ taglib uri="http://java.sun.com/jsp/jstl/core"
prefix="c" %><!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <title>Post List</title>
    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
      integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
      crossorigin="anonymous"
    />
    <link rel="stylesheet" type="text/css" href="edit.css" />
  </head>
  <body>
    <div class="edit-wrapper">
      <h1>Post List</h1>
      <div class="button-row">
        <form action="post" method="GET" id="new-post">
          <input
            name="username"
            value='${param["username"]}'
            style="display: none;"
          />
          <input name="postid" value="0" style="display: none;" />
          <input name="action" value="open" style="display: none;" />
          <button type="submit" class="btn btn-primary" form="new-post">
            New Post
          </button>
        </form>
      </div>
      <div class="post-list">
        <div class="table-headers">
          <div>Title</div>
          <div>Created</div>
          <div>Modified</div>
        </div>
        <c:forEach items="${posts}" var="post">
          <div class="each-post">
            <div>${post.title}</div>
            <div>${post.prettyCreatedDate()}</div>
            <div>${post.prettyModifiedDate()}</div>
            <div class="open-delete-buttons">
              <form action="post" method="POST">
                <input
                  name="username"
                  value='${param["username"]}'
                  style="display: none;"
                />
                <input
                  name="postid"
                  value="${post.postId}"
                  style="display: none;"
                />
                <input name="action" value="open" style="display: none;" />
                <button
                  type="submit"
                  class="btn btn-success"
                  style="margin-bottom: 5px; border-radius: 5px; width: 80px;"
                >
                  Open
                </button>
              </form>
              <form action="post" method="POST">
                <input name="action" value="delete" style="display: none;" />
                <input
                  name="username"
                  value="${username}"
                  style="display: none;"
                />
                <input
                  name="postid"
                  value="${post.postId}"
                  style="display: none;"
                />
                <button
                  type="submit"
                  class="btn btn-danger"
                  style="border-radius: 5px; width: 80px;"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        </c:forEach>
      </div>
    </div>
    <script
      src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
      integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
      crossorigin="anonymous"
    ></script>
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
      integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
      crossorigin="anonymous"
    ></script>
    <script
      src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
      integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
      crossorigin="anonymous"
    ></script>
  </body>
</html>
