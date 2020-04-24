import java.sql.*;
import java.util.List;
import java.util.ArrayList;
import java.util.Date;    


public class PostController {
    public PostController(String username, String password) {
        try {
            Class.forName("com.mysql.jdbc.Driver");
        } catch (ClassNotFoundException ex) {
            System.out.println(ex);
        }
        this.dbUsername = username; 
        this.dbPassword = password;
    }

    // Retrieve a post from the database using the primary keys: usernamd and postId 
    public Post getPost(String username, int postId) {
        Connection connection = null;
        PreparedStatement preparedStatement = null; 
        ResultSet rs = null; 
        Post post = null; 
        try {
            // Create a new database connection 
            connection = createConnection(); 

            // Generate prepared statement and substitute values 
            preparedStatement = connection.prepareStatement(
                "SELECT * FROM Posts WHERE username = ? AND postid = ?" 
            ); 
            preparedStatement.setString(1, username); 
            preparedStatement.setInt(2, postId); 

            // Execute the query  
            rs = preparedStatement.executeQuery(); 

            // Post exists in the db with (username, postid) 
            if (rs.next()) {
                post = new Post(rs.getString("username"), 
                                rs.getInt("postid"),
                                rs.getString("title"), 
                                rs.getString("body"), 
                                rs.getTimestamp("modified"),
                                rs.getTimestamp("created")
                ); 
            }
        }
        catch(SQLException ex) {
            handleSQLException(ex);
        }
        finally {
            closeConnections(connection, preparedStatement, rs);
            return post;
        }
    }

    // Get a list of all posts made by a user
    public List<Post> getPostsMadeByUser(String username) {
        Connection connection = null;
        PreparedStatement preparedStatement = null; 
        ResultSet rs = null; 
        List<Post> postsByUsername = null; 
        try {
            // Create a new database connection 
            connection = createConnection(); 

            // Generate prepared statement and substitute values 
            preparedStatement = connection.prepareStatement(
                "SELECT * FROM Posts WHERE username = ?" 
            ); 
            preparedStatement.setString(1, username); 

            // Execute the query  
            rs = preparedStatement.executeQuery(); 

            // Retrieve all posts by a certain username 
            postsByUsername = new ArrayList<Post>(); 
            while (rs.next()) {
                Post post = new Post(rs.getString("username"), 
                                rs.getInt("postid"),
                                rs.getString("title"), 
                                rs.getString("body"), 
                                rs.getTimestamp("modified"),
                                rs.getTimestamp("created")
                ); 
                postsByUsername.add(post);
            }
        }
        catch(SQLException ex) {
            handleSQLException(ex);
        }
        finally {
            closeConnections(connection, preparedStatement, rs);
            return postsByUsername;
        }
    }

    // Add a new post into the database and return the newly added post with updated timestamps
    public Post insertPost(Post newPost) {
        Connection connection = null;
        PreparedStatement preparedStatement = null; 
        try {
            // Create a new database connection 
            connection = createConnection(); 

            // Generate prepared statement and substitute values 
            preparedStatement = connection.prepareStatement(
                "INSERT INTO Posts (username, postid, title, body, modified, created) VALUES (?, ?, ?, ?, ?, ?)"
            ); 
            preparedStatement.setString(1, newPost.getUsername()); 
            preparedStatement.setInt(2, newPost.getPostId()); 
            preparedStatement.setString(3, newPost.getTitle()); 
            preparedStatement.setString(4, newPost.getBody()); 

            Date creationDate = new Date(); 
            Timestamp creationTimestamp = new Timestamp(creationDate.getTime());
            preparedStatement.setTimestamp(5, creationTimestamp);
            preparedStatement.setTimestamp(6, creationTimestamp);

            // Update POJO
            newPost.setCreated(creationTimestamp); 
            newPost.setModified(creationTimestamp); 

            // Execute the delete statement 
            preparedStatement.executeUpdate(); 
        }
        catch(SQLException ex) {
            handleSQLException(ex);
        }
        finally {
            closeConnections(connection, preparedStatement, null);
            return newPost;
        }
    }

    // Update an existing post and return the POJO with an updated modified timestamp
    public Post updatePost(Post post) {
        Connection connection = null;
        PreparedStatement preparedStatement = null; 
        try {
            // Create a new database connection 
            connection = createConnection(); 

            // Generate prepared statement and substitute values 
            preparedStatement = connection.prepareStatement(
                "UPDATE Posts SET title = ?, body = ?, modified = ? WHERE username = ? AND postid = ?"
            ); 
            preparedStatement.setString(1, post.getTitle()); 
            preparedStatement.setString(2, post.getBody()); 
            Date modifiedDate = new Date(); 
            Timestamp modifiedTimestamp = new Timestamp(modifiedDate.getTime());
            preparedStatement.setTimestamp(3, modifiedTimestamp); 
            preparedStatement.setString(4, post.getUsername()); 
            preparedStatement.setInt(5, post.getPostId()); 

            // Update POJO timestamp
            post.setModified(modifiedTimestamp); 

            // Execute the delete statement 
            preparedStatement.executeUpdate(); 
        }
        catch(SQLException ex) {
            handleSQLException(ex);
        }
        finally {
            closeConnections(connection, preparedStatement, null);
            return post;
        }
    }

    // Delete a post from the database given the primary keys: username and postId 
    public void deletePost(String username, int postId) {
        Connection connection = null;
        PreparedStatement preparedStatement = null; 
        try {
            // Create a new database connection 
            connection = createConnection(); 

            // Generate prepared statement and substitute values 
            preparedStatement = connection.prepareStatement(
                "DELETE FROM Posts WHERE username = ? AND postid = ?" 
            ); 
            preparedStatement.setString(1, username); 
            preparedStatement.setInt(2, postId); 

            // Execute the delete statement 
            preparedStatement.executeUpdate(); 
        }
        catch(SQLException ex) {
            handleSQLException(ex);
        }
        finally {
            closeConnections(connection, preparedStatement, null);
        }
    }

    // Create a new database connection to CS144 SQL database
    private Connection createConnection() throws SQLException {
        return DriverManager.getConnection(
            "jdbc:mysql://localhost:3306/CS144", dbUsername, dbPassword
        );
    }

    // Exception handler for SQLException 
    private void handleSQLException(SQLException ex) {
        System.out.println("SQLException caught");
        System.out.println("---");
        while ( ex != null ) {
            System.out.println("Message   : " + ex.getMessage());
            System.out.println("SQLState  : " + ex.getSQLState());
            System.out.println("ErrorCode : " + ex.getErrorCode());
            System.out.println("---");
            ex = ex.getNextException();
        }
    }

    // Close all the connections associated with a database query 
    private void closeConnections(Connection c, PreparedStatement ps, ResultSet rs) {
        if (rs != null) {
            try { rs.close(); } catch (Exception e) { /* ignored */ }
        }
        if (ps != null) {
            try { ps.close(); } catch (Exception e) { /* ignored */ }
        }
        if (c != null) {
            try { c.close(); } catch (Exception e) { /* ignored */ }
        }
    }

    private String dbUsername; 
    private String dbPassword; 
}; 