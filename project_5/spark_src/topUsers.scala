val twitterEdges = sc.textFile("twitter.edges") 
val rddSplit = twitterEdges.map(line => line.split(":")) 
val usersToFollowers = rddSplit.flatMap(arr => {
    val follower = arr(0) 
    val users = arr(1).replaceAll("\\s", "").split(",") 
    users.map(user => (user, follower))
})
val usersToNumFollowers = usersToFollowers.groupBy({ case (user, follower) => user}).map({ case (user, iter) => (user, iter.size)})
val popularUsers = usersToNumFollowers.filter({ case (user, numFollowers) => (numFollowers > 1000)})
popularUsers.saveAsTextFile("output")
System.exit(0)
                               