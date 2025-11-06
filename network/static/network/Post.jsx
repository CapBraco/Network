function Post({ post }) {
        const [liked, setLiked] = React.useState(post.liked);
        const [likesCount, setLikesCount] = React.useState(post.likes_count);

        const toggleLike = async () => {
            const response = await fetch(`/like/${post.id}/`, {
                method: 'POST',
                headers: { 'X-CSRFToken': window.CSRF_TOKEN },
            });
            const data = await response.json();
            setLiked(data.liked);
            setLikesCount(data.likes_count);
        };

        return (
            <div className='post'>
                <a href={`/post/all_posts/${post.user.id}/`}><h3>{post.user.username}</h3></a>
                <p>{post.description}</p>
                <button onClick={toggleLike} className='button'>
                    {liked ? '❤️' : '🤍'} {likesCount}
                </button>
                <div className='timestamp'>
                    {post.timestamp}
                </div>
            </div>
        );
    }
window.Post = Post;