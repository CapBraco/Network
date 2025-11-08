function Post({ post, currentUserId, onUpdate }) {
        const [isEditing, setIsEditing] = React.useState(false);
        const [content, setContent] = React.useState(post.description);
        const [liked, setLiked] = React.useState(post.liked);
        const [likesCount, setLikesCount] = React.useState(post.likes_count);



        const handleSave = async () => {
            try {
                const response = await fetch(`/edit_post/${post.id}/`, {
                    method: 'PUT',
                    headers: {
                        "X-CSRFToken": window.CSRF_TOKEN,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ description: content })
                });

            const data =await response.json();

            if (response.ok) {
                setIsEditing(false);
                onUpdate(post.id, data.description);
            } else {
                alert(data.error || "Error updating post");
            }
            }catch (error){
                console.log(error)
            }
        }
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
                {isEditing ? (
                    <div>
                    <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    />
                    <button className='button' onClick={handleSave}>Save</button>
                    <button className='button' onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                ) :(
                    <div className='edit'>
                    <p>{post.description}</p>
                    
                    {currentUserId === post.user.id && (
                        <button className='button' onClick={() => setIsEditing(true)}>Edit</button>
                    )}
                    </div>
                )}
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