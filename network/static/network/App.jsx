function App(){
    const [newPost, setNewPost] = React.useState(null);

    return (
        <div>
            <div id='create-post-root'>
                <CreatePost onPostCreated={setNewPost} />
            </div>
            <hr />
            <div id='feed-root'>
                <Feed endpoint="/api/posts/" newPost={newPost} />
            </div>
        </div>
    );
}
window.App = App;