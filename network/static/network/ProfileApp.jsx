function ProfileApp({ profileUserId, children}) {
    const [newPost, setNewPost] = React.useState(null);

    return (
        <div>
            <div id='feed-root'>
                {children}
                <Feed endpoint={`/api/posts/user/${profileUserId}/`} newPost={newPost} />
            </div>
        </div>
    );
}

window.ProfileApp = ProfileApp;