// imports
const fs = require('fs')
const path = require('path')

// get all posts
const posts = fs.readFileSync(path.join(__dirname, 'posts'))

const postsContainer = document.querySelector('div.posts')

// add capitalize function in a string variable
String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.substr(1);
}

// creating post button for each posts in public/posts folder
posts.forEach(post => {
  // creating post container
  const newPost = document.createElement('div')

  // formatting title of post
  let formattedTitle = post.replaceAll('_', ' ').replaceAll('__', ' / ').capitalize()

  // populating newPost
  newPost.innerHTML = `
    <div class="post-container">
      <a href="posts/${post}">${formattedTitle}</a>
    </div>
  `

  // add new post in post container
  postsContainer.append(newPost)
})