function Feed({endpoint, newPost, currentUserId}) {
    const [posts, setPosts] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);

    React.useEffect(() => {
        fetch(endpoint)
        .then(response => response.json())
        .then(data => setPosts(data.posts || []));
    }, [endpoint]);

    const handleUpdate = (postId, newDescription) => {
        setPosts(posts.map(p => p.id === postId ? {...p, description: newDescription} : p));
    };

    const loadPosts = async (pageNum) => {
        try{
            const response = await fetch(`${endpoint}?page=${pageNum}`);
            if(!response.ok) throw new Error(`HTTP error ${response.status}`);
            const data = await response.json();
            setPosts(data.posts);
            setPage(data.page);
            setTotalPages(data.total_pages);
        } catch (error) {
            console.error(error);
            setPosts([]);
            setPage(1);
            setTotalPages(1);
        }
    };

    React.useEffect(() => {
        loadPosts(page);
    }, [page, endpoint]);
    
    React.useEffect(() => {
    if (newPost) {
        // Normalize newPost to match API shape
        const normalizedPost = {
            ...newPost,
            user: newPost.user
                ? newPost.user
                : { 
                    id: window.CURRENT_USER_ID,
                    username: window.CURRENT_USER_USERNAME 
                }, 
            likes_count: newPost.likes_count || 0,
            liked: newPost.liked || false,
        };

        setPosts(prev => [normalizedPost, ...prev]);
        }
    }, [newPost]);

    return (
        <div>
            {posts.length > 0 ? (posts.map(p => <Post key={p.id} post={p} currentUserId={Number(window.CURRENT_USER_ID)} onUpdate={handleUpdate} />)) : (<p>No posts yet.</p>)}
        
        <div className='pagination'>
            <button className='button' disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Previous
            </button>
            <span> Page {page} of {totalPages} </span>
            <button className='button' disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                Next
            </button>
        </div>
    </div>
    );
}
window.Feed = Feed;