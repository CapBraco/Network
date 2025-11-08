function FollowingFeed() {
    const [posts, setPosts] = React.useState(null);

    return (
        <div>
            <h3>Your followings</h3>
            
            <Feed endpoint="/api/posts/following/" newPost={posts} />
        </div>
    );
}

window.FollowingFeed = FollowingFeed;