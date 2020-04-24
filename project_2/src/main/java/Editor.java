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

    public void init() throws ServletException
    {
        /*  write any servlet initialization code here or remove this function */
    }
    
    public void destroy()
    {
        /*  write any servlet cleanup code here or remove this function */
    }

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
        switch(action) {
            case "open": 
                statusCode = openPost(request, response);
                break; 
            case "preview":
            case "list": 
            default: 
                statusCode = HttpServletResponse.SC_BAD_REQUEST;
        }

        if (statusCode == HttpServletResponse.SC_OK) {
            response.setStatus(HttpServletResponse.SC_OK);
            request.getRequestDispatcher("/edit.jsp").forward(request, response);
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
        switch(action) {
            case "open": 
                statusCode = openPost(request, response);
                break; 
            case "preview":
            case "list": 
            case "save": 
            case "delete": 
            default: 
                statusCode = HttpServletResponse.SC_BAD_REQUEST;
        }

        if (statusCode == HttpServletResponse.SC_OK) {
            response.setStatus(HttpServletResponse.SC_OK);
            request.getRequestDispatcher("/edit.jsp").forward(request, response);
        }
        else {
            response.sendError(statusCode);
        }  
    }

    private void getParameterAndSetAttribute(HttpServletRequest request, String parameterName, String attributeName) {
        String parameterValue = request.getParameter(parameterName); 
        if (parameterValue != null) {
            request.setAttribute(attributeName, parameterName);
        }
        else {
            request.setAttribute(attributeName, ""); 
        }
    }

    // Handler for the 'open' action 
    // Prepopulates the 'title' and 'body' fields of the edit form if a post exists in the database or if the information is in the request parameter
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
            return HttpServletResponse.SC_OK;
        }

        // No postid specified, so leave the fields title and body blank
        int id = Integer.parseInt(postId);
        if (id <= 0) {
            request.setAttribute("title", "");
            request.setAttribute("body", "");
            return HttpServletResponse.SC_OK;
        }

        // Obtain the post by querying the database with username and postId parameters
        PostController controller = new PostController();
        Post post = controller.getPost(username, id);

        // Entry exists in the database, so populate the fields title and body with them 
        if (post != null) {
            request.setAttribute("title", post.getTitle()); 
            request.setAttribute("body", post.getBody());
            return HttpServletResponse.SC_OK;
        }
        return HttpServletResponse.SC_NOT_FOUND; 
    }
}

