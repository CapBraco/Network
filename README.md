Network — Social Media Web App (CS50W Project)

This project is a Threads / Twitter-like social network built as part of CS50’s Web Programming with Python and JavaScript.
Users can create posts, follow others, like posts, and edit their own posts — all without reloading the page thanks to dynamic JavaScript and API calls.

Unlike the original CS50 specification, this version uses a hybrid front-end:

Django templates for base layout & routing

React components imported selectively in certain views for dynamic UI

REST-like API endpoints for asynchronous interactions (create post, edit post, like/unlike, follow/unfollow)

✨ Features
Feature	Description
User Authentication	Registration, login, logout (Django auth).
Create New Posts	Signed-in users can write and publish posts.
All Posts Feed	View all posts from all users, newest first.
Profile Pages	Show user’s posts, followers & following count.
Follow / Unfollow Users	Toggle follow state directly on profile pages.
Following Feed	Show posts only from users you follow.
Like / Unlike Posts	Posts show like count and like toggle state.
Edit Posts	Users can edit only their own posts using inline React UI.
Pagination	All post lists are paginated (10 posts per page).
🧱 Tech Stack
Layer	Technology
Backend	Django (Python)
Database	SQLite (default, can be replaced with PostgreSQL)
Templates	Django Template Engine
Front-End Components	React (ES6, no build step required)
Styling	CSS / Bootstrap
Async Comms	fetch API JSON calls (no full page reload)

This project demonstrates how React can be integrated into Django without replacing the template system entirely, allowing gradual migration or hybrid UI development.

📂 Project Structure (Important Folders)
project4/
│
├── network/                 # Django app
│   ├── static/network/      # Static JS/CSS
│   ├── templates/network/   # Django template HTML
│   ├── views.py             # Backend logic
│   ├── models.py            # Database models
│   ├── urls.py              # App URL routes
│   └── api endpoints        # JSON responses for React
│
├── project4/                # Django project config
└── manage.py

🚀 Setup & Run Locally

Clone the repository:

git clone <your-repo-url>
cd project4


Create and activate a virtual environment:

python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate


Install dependencies:

pip install -r requirements.txt


Apply migrations:

python manage.py makemigrations network
python manage.py migrate


Run the local development server:

python manage.py runserver


Visit:

http://127.0.0.1:8000/

🧠 Key Models (Conceptually)

User (extends Django AbstractUser)

Post — content + timestamp + user reference

Like — user ↔ post relationship

Followers — Many-to-many relationship between users

📝 Notes on the Hybrid Front-End Approach

Base navigation & page structure handled by Django templates.

Some interactive UI sections (e.g., post editor, post components) are built as React components embedded inside template-rendered pages.

Communication happens via JSON API endpoints, not form submissions.

No Webpack / Vite / build pipeline required — React is loaded via script CDN and components are attached to DOM nodes rendered by Django.

This design makes the project easier to maintain while still introducing modern component-based UI.

🎯 Project Requirements Completed

✔ New Post
✔ All Posts Feed
✔ Profile Pages
✔ Follow / Unfollow
✔ Following Feed
✔ Pagination (10 posts per page)
✔ Edit Post (AJAX)
✔ Like / Unlike (AJAX)

📜 License

MIT — free to use, modify, and build upon.
