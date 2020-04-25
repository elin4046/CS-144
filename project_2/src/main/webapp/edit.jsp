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
          form="save"
          class="btn btn-primary"
          style="margin-left: 8px; margin-right: 8px;"
        >
          Save
        </button>
        <button
          type="button"
          class="btn btn-warning"
          style="margin-left: 8px; margin-right: 8px;"
        >
          Close
        </button>
        <button
          type="button"
          class="btn btn-info"
          style="margin-left: 8px; margin-right: 8px;"
        >
          Preview
        </button>
        <button
          type="button"
          class="btn btn-danger"
          style="margin-left: 8px; margin-right: 8px;"
        >
          Delete
        </button>
      </div>
      <form action="post" method="POST" id="save">
        <input id="action" name="action" value="save" style="display: none;" />
        <div class="title-wrapper">
          <label for="title" class="title-label">Title</label>
          <input
            type="text"
            class="form-control"
            id="title"
            name="title"
            value="${title}"
          />
        </div>
        <div class="body-wrapper">
          <label for="body" class="title-label">Body</label>
          <textarea
            class="form-control"
            id="body"
            name="body"
            style="height: 250px; width: 350px;"
          >
${body}</textarea
          >
        </div>
      </form>
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
