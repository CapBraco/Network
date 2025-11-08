function Followers ( {user, currentUserId} ) {
    const [followed, setFollowed] = React.useState(false);
    const [followers, setFollowers] = React.useState(0);
    const [following, setFollowing] = React.useState(0);

    React.useEffect(() => {
        if (!user) return;

        fetch(`/api/user_followers/${user}/`)
        .then(async (response) => {
            if(!response.ok){
                const text = await response.text();
                console.error("Error fetching followers:", text);
                throw new Error('Failed to fetch followers');
            }
            return response.json();
        })
        .then((data) => {
            setFollowers(data.followers.length);
            setFollowing(data.following.length);

            setFollowed(data.followers.some(u => u.id === currentUserId));
        });
    }, [user, currentUserId]);

    const toggleFollow = async () => {
    try {
        const response = await fetch(`/post/follow_user/${user}/`, {
            method: 'POST',
            headers: { 
                'X-CSRFToken': window.CSRF_TOKEN,
                'Content-Type': 'application/json'
             }
        });
        const data = await response.json();

        if (response.ok) {
            setFollowed(data.followed)
            setFollowers(data.followers_count)
            setFollowing(data.following_count)
        } else {
            alert(data.error || "An error has occurred");
        }
    } catch (error) {
        alert("Network or server error");
        console.error(error);
        }
    }

    return (
        <div>
            {currentUserId !== Number(user) && (
                <button onClick={toggleFollow} className='button'>
                    {followed ? "Unfollow" : "Follow"}
                </button>
            )}

            <p>Followers: {followers}</p>
            <p>Following: {following}</p>
        </div>
    )


}

window.Followers = Followers;