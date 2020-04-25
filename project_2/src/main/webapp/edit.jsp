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
    <title>Edit Post</title>
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
      <h1>Edit Post</h1>
      <div class="button-row">
        <button
          type="submit"
          class="btn btn-primary"
          style="margin-left: 8px; margin-right: 8px;"
          form="save"
        >
          Save
        </button>
        <form action="post" method="POST">
          <input name="action" value="list" style="display: none;" />
          <input name="username" value="${username}" style="display: none;" />
          <button
            type="submit"
            class="btn btn-warning"
            style="margin-left: 8px; margin-right: 8px;"
          >
            Close
          </button>
        </form>
        <form action="post" method="POST">
          <input name="action" value="preview" style="display: none;" />
          <input name="username" value="${username}" style="display: none;" />
          <input name="postid" value="${postid}" style="display: none;" />
          <input name="title" id="preview-title" style="display: none;" />
          <textarea
            name="body"
            id="preview-body"
            style="display: none;"
          ></textarea>
          <button
            type="submit"
            class="btn btn-info"
            style="margin-left: 8px; margin-right: 8px;"
            onclick="handlePreview()"
          >
            Preview
          </button>
        </form>
        <form action="post" method="POST">
          <input name="action" value="delete" style="display: none;" />
          <input name="username" value="${username}" style="display: none;" />
          <input name="postid" value="${postid}" style="display: none;" />
          <button
            type="submit"
            class="btn btn-danger"
            style="margin-left: 8px; margin-right: 8px;"
          >
            Delete
          </button>
        </form>
      </div>
      <form action="post" method="POST" id="save">
        <input name="action" value="save" style="display: none;" />
        <input name="username" value="${username}" style="display: none;" />
        <input name="postid" value="${postid}" style="display: none;" />
        <div class="title-wrapper">
          <label for="title" class="title-label">Title</label>
          <input
            type="text"
            class="form-control"
            id="title"
            name="title"
            value="${title}"
            onchange="myChangeFunction1(this)"
          />
        </div>
        <div class="body-wrapper">
          <label for="body" class="title-label">Body</label>
          <textarea
            class="form-control"
            id="body"
            name="body"
            style="height: 250px; width: 350px; margin-bottom: 10px;"
            onchange="myChangeFunction2(this)"
          >
${body}</textarea
          >
        </div>
      </form>
    </div>
    <script type="text/javascript">
      function myChangeFunction1(input1) {
        var input2 = document.getElementById("preview-title");
        input2.value = input1.value;
      }
      function myChangeFunction2(input1) {
        var input2 = document.getElementById("preview-body");
        input2.value = input1.value;
      }
      function handlePreview() {
        var inputTitle = document.getElementById("title");
        var inputBody = document.getElementById("body");
        var previewTitle = document.getElementById("preview-title");
        var previewBody = document.getElementById("preview-body");

        previewTitle.value = inputTitle.value;
        previewBody.value = inputBody.value;
      }
    </script>
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
