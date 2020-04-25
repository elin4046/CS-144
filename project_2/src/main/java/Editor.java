import java.io.IOException;
import java.sql.* ;
import java.util.List;
import java.util.ArrayList;
import java.util.Date;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.commonmark.node.*;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;

/**
 * Servlet implementation class for Servlet: ConfigurationTest
 *
 */
public class Editor extends HttpServlet {
    /**
     * The Servlet constructor
     * 
     * @see javax.servlet.http.HttpServlet#HttpServlet()
     */
    public Editor() {}

    /**
     * Handles HTTP GET requests
     * 
     * @see javax.servlet.http.HttpServlet#doGet(HttpServletRequest request,
     *      HttpServletResponse response)
     */
    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException 
    {   
        // Action parameter is a required parameter
        String action = request.getParameter("action"); 
        if (action == null) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST); 
            return; 
        }

        int statusCode = 0;
        String requestDispatcher = null;
        switch(action) {
            case "open": 
                statusCode = openPost(request, response);
                requestDispatcher = "/edit.jsp"; 
                break; 
            case "preview":
                statusCode = previewPost(request, response);
                requestDispatcher = "/preview.jsp"; 
                break;
            case "list": 
                statusCode = listPosts(request, response); 
                requestDispatcher = "/list.jsp"; 
                break;
            default: 
                statusCode = HttpServletResponse.SC_BAD_REQUEST;
        }

        if (statusCode == HttpServletResponse.SC_OK) {
            response.setStatus(HttpServletResponse.SC_OK);
            request.getRequestDispatcher(requestDispatcher).forward(request, response);
        }
        else {
            response.sendError(statusCode);
        }            
    }
    
    /**
     * Handles HTTP POST requests
     * 
     * @see javax.servlet.http.HttpServlet#doPost(HttpServletRequest request,
     *      HttpServletResponse response)
     */
    public void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException 
    {
        // Action parameter is a required parameter
        String action = request.getParameter("action"); 
        if (action == null) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST); 
            return; 
        }

        int statusCode = 0;
        String requestDispatcher = null;
        switch(action) {
            case "open": 
                statusCode = openPost(request, response);
                requestDispatcher = "/edit.jsp"; 
                break; 
            case "preview":
                statusCode = previewPost(request, response);
                requestDispatcher = "/preview.jsp"; 
                break;
            case "list": 
                statusCode = listPosts(request, response); 
                requestDispatcher = "/list.jsp";
                break;
            case "save": 
                statusCode = savePost(request, response);
                requestDispatcher = "/list.jsp";
                break;
            case "delete": 
                statusCode = deletePost(request, response);
                requestDispatcher ="/list.jsp";
                break;
            default: 
                statusCode = HttpServletResponse.SC_BAD_REQUEST;
        }

        if (statusCode == HttpServletResponse.SC_OK) {
            response.setStatus(HttpServletResponse.SC_OK);
            request.getRequestDispatcher(requestDispatcher).forward(request, response);
        }
        else {
            response.sendError(statusCode);
        }  
    }


    // Handler for the 'open' action 
    // Provides the 'title' and 'body' fields of the edit form if a post exists in the database or if the information is in the request parameter
    // If a postID is zero or negative, the fields are assumed to be blank 
    // Returns the HTTP status code to return 
    private int openPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException 
    {
        // Required parameters: username and postid 
        String username = request.getParameter("username");
        String postId = request.getParameter("postid");
        if (postId == null || username == null) {
            return HttpServletResponse.SC_BAD_REQUEST; 
        }

        // Title and body parameters are available in the parameter, so prepopulate the fields with them
        String title = request.getParameter("title"); 
        String body = request.getParameter("body"); 
        if (title != null && body != null) {
            request.setAttribute("title", title); 
            request.setAttribute("body", body); 
            request.setAttribute("username", username);
            return HttpServletResponse.SC_OK;
        }

        // Check if postId parameter is actually a number
        int id = 0;
        try {
            id = Integer.parseInt(postId);
        }
        catch(NumberFormatException ex) {
            return HttpServletResponse.SC_BAD_REQUEST;
        }

        // Invalid postid specified, so leave the fields title and body blank
        if (id <= 0) {
            request.setAttribute("title", "");
            request.setAttribute("body", "");
            request.setAttribute("username", username);
            return HttpServletResponse.SC_OK;
        }

        // Obtain the post by querying the database with username and postId parameters
        PostController controller = new PostController();
        Post post = controller.getPost(username, id);

        // Entry exists in the database, so populate the fields title and body with them 
        if (post != null) {
            request.setAttribute("title", post.getTitle()); 
            request.setAttribute("body", post.getBody());
            request.setAttribute("username", username);
            return HttpServletResponse.SC_OK;
        }
        return HttpServletResponse.SC_NOT_FOUND; 
    }

    
    // Handler for 'list' action
    // Provides a list of posts made by the inputted username to the request dispatcher 
    private int listPosts(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
        // Required parameters: username 
        String username = request.getParameter("username");
        if (username == null) {
            return HttpServletResponse.SC_BAD_REQUEST; 
        }

        PostController controller = new PostController(); 
        List<Post> posts = controller.getPostsMadeByUsername(username);
        request.setAttribute("posts", posts);
        request.setAttribute("username", username);
        return HttpServletResponse.SC_OK;
    }

    // Handler for 'save' action
    private int savePost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
        // Required parameters: username, postid, title, and body
        String username = request.getParameter("username");
        String postId = request.getParameter("postid");
        String title = request.getParameter("title");
        String body = request.getParameter("body");
        if (username == null || postId == null || title == null || body == null) {
            return HttpServletResponse.SC_BAD_REQUEST; 
        }

        PostController controller = new PostController();
        
        // Check if postId is a string 
        int id = 0;
        try {
            id = Integer.parseInt(postId);
        }
        catch(NumberFormatException ex) {
            return HttpServletResponse.SC_BAD_REQUEST;
        }

        if (id <= 0) {
            // Get the next id to use 
            int nextAvailablePostId = controller.getMaxPostIdFromUser(username) + 1;
            Post newPost = new Post(username, nextAvailablePostId, title, body);
            controller.insertPost(newPost);
        }
        else {
            // Update existing post if one exists, otherwise do nothing 
            Post post = controller.getPost(username, id);
            if (post != null) {
                controller.updatePost(post);
            }
        }
        request.setAttribute("username", username);
        return HttpServletResponse.SC_OK;
    }

    // Handler for 'delete' action
    private int deletePost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
        // Required parameters: username, postid, title, and body
        String username = request.getParameter("username");
        String postId = request.getParameter("postid");
        if (username == null || postId == null) {
            return HttpServletResponse.SC_BAD_REQUEST; 
        }

        PostController controller = new PostController();

        // Check if postId is a string 
        int id = 0;
        try {
            id = Integer.parseInt(postId);
        }
        catch(NumberFormatException ex) {
            return HttpServletResponse.SC_BAD_REQUEST;
        }
        
        controller.deletePost(username, id);
        request.setAttribute("username", username);
        return HttpServletResponse.SC_OK;
    }

    // Handler for 'preview' action
    private int previewPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
        // Required parameters: postid, title, and body
        String username = request.getParameter("username");
        String postId = request.getParameter("postid");
        String title = request.getParameter("title");
        String body = request.getParameter("body");
        if (username == null || postId == null || title == null || body == null) {
            return HttpServletResponse.SC_BAD_REQUEST; 
        }
        Parser parser = Parser.builder().build(); 
        HtmlRenderer renderer = HtmlRenderer.builder().build(); 
        String markdownTitle = renderer.render(parser.parse(title));
        String markdownBody = renderer.render(parser.parse(body));

        request.setAttribute("username", username);
        request.setAttribute("postid", postId);
        request.setAttribute("body", body);
        request.setAttribute("title", title);
        request.setAttribute("markdownBody", markdownBody);
        request.setAttribute("markdownTitle", markdownTitle);
        return HttpServletResponse.SC_OK;
    }
}

