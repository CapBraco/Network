function CreatePost({ onPostCreated }) {
  const [description, setDescription] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (description.trim() === "") return;

    const response = await fetch("/api/create_post/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": window.CSRF_TOKEN,
      },
      body: JSON.stringify({ description }),
    });
    if (response.status === 401){
    window.location.href = "/login";
    return;
    }

    const data = await response.json();

    if (response.ok) {
      setDescription("");           // Clear textarea
      if (onPostCreated) onPostCreated(data.post);
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="create-post">
      <form onSubmit={handleSubmit}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write your post..."
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}

window.CreatePost = CreatePost;