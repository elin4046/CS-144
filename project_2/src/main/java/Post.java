import java.sql.Timestamp;
import java.text.SimpleDateFormat; 

public class Post {

    public Post(String username, int postId, String title, String body) {
        this.username = username; 
        this.postId = postId; 
        this.title = title; 
        this.body = body; 
    }

    public Post(String username, int postId, String title, String body, Timestamp modified, Timestamp created) {
        this.username = username; 
        this.postId = postId; 
        this.title = title; 
        this.body = body; 
        this.modified = modified; 
        this.created = created; 
    }

    public String getUsername() {
        return username; 
    }

    public int getPostId() {
        return postId; 
    }

    public String getBody() {
        return body; 
    }

    public String getTitle() {
        return title; 
    }

    public Timestamp getModified() {
        return modified; 
    }

    public Timestamp getCreated() {
        return created; 
    }

    
    public void setTitle(String title) {
        this.title = title; 
    }
    
    public void setBody(String body) {
        this.body = body; 
    }

    public void setCreated(Timestamp t) {
        this.created = t; 
    }
    
    public void setModified(Timestamp t) {
        this.modified = t; 
    }

    public String prettyModifiedDate() {
        return new SimpleDateFormat("MM/dd/yyyy HH:mm:ss").format(modified);
    }

    public String prettyCreatedDate() {
        return new SimpleDateFormat("MM/dd/yyyy HH:mm:ss").format(created);
    }

    @Override
    public String toString() {
        return "username: " + username + "\n" +
               "postId: " + postId + "\n" + 
               "title: " + title + "\n" + 
               "body: " + body + "\n" + 
               "modified: " + modified + "\n" + 
               "created: " + created; 
    }

    private String username; 
    private int postId; 
    private String title; 
    private String body; 
    private Timestamp modified; 
    private Timestamp created; 
}; 