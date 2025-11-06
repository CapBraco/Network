function Feed({endpoint, newPost}) {
    const [posts, setPosts] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);


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
            setPosts(prev => [newPost, ...prev]);
        }
    },[newPost]);

    return (
        <div>
            {posts.length > 0 ? (posts.map(p => <Post key={p.id} post={p} />)) : (<p>No posts yet.</p>)}
        
        <div className='pagination'>
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Previous
            </button>
            <span> Page {page} of {totalPages} </span>
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                Next
            </button>
        </div>
    </div>
    );
}
window.Feed = Feed;