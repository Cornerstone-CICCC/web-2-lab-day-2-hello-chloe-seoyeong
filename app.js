$(function() {
  // your code here
  const container = $('.container');
  const info = $('.info');
  const inforContent = info.find('.info__content');
  const posts = $('.posts');
  const postsHeader = posts.find('h3');
  const postsList = posts.find('ul');
  const todos = $('.todos');
  const todosHeader = todos.find('h3');
  const todosList = todos.find('ul');
  const prevButton = $('header').children().first();
  const nextButton = $('header').children().last();

  let userId = 1;

  function paintInfo(userid) {
    getUsers(userid);
    getPosts(userid);
    getTodos(userid);
  }

  function getUsers(userid) {
    // users
    $.ajax({
      url: `https://dummyjson.com/users/${userid}`,
      data: "GET",
      success: function(response) {
        info.find('img').attr('src', response.image);
        inforContent.empty();
        inforContent.append(`
          <h2>${response.firstName} ${response.lastName}</h2>
          <ul>
            <li><strong>Age</strong><span>${response.age}</span></li>
            <li><strong>Email</strong><span>${response.email}</span></li>
            <li><strong>Phone</strong><span>${response.phone}</span></li>
          </ul>
        `);

        posts.children('h3').text(`${response.firstName}'s Posts`);
        todos.children('h3').text(`${response.firstName}'s To Dos`);
      },
      error: function(err) {
        console.error(err);
      }
    })
  }

  function getPosts(userid) {
    // posts
    $.ajax({
      url: `https://dummyjson.com/users/${userid}/posts`,
      data: 'GET',
      success: function(response) {
        postsList.empty();

        const posts = response.posts;
        if(posts.length) {
          posts.forEach(item => {
            postsList.append(`
                <li>
                  <h4 id="${item.id}">${item.title}</h4>
                  <p>${item.body}</p>
                </li>
              `)
          })
        } else {
          postsList.append(`<li>User has no posts</li>`);
        }

        postsList.find('h4').on("click", function() {
          const postid = $(this).attr('id');
          openModal(postid);
        })
      },
      error: function(err) {
        console.error(err);
      }
    })
  }

  function getTodos(userid) {
    // todos
    $.ajax({
      url: `https://dummyjson.com/users/${userid}/todos`,
      data: 'GET',
      success: function(response) {
        todosList.empty();
        const todos = response.todos;
        if(todos.length) {
          todos.forEach(item => {
            todosList.append(`
              <li>${item.todo}</li>
              `);
          });
        } else {
          todosList.append(`<li>User has no todos</li>`);
        }
      },
      error: function(err) {
        console.error(err);
      }
    })
  }

  function openModal(postid) {
    // modal
    $.ajax({
      url: `https://dummyjson.com/posts/${postid}`,
      data: 'GET',
      success: function(response) {
        const overlay = `<div class="overlay">
          <div class="modal">
            <h2>${response.title}</h2>
            <p>${response.body}</p>
            <span><i>Views: </i>${response.views}</span>
            <button>Close Modal</button>
          </div>
        </div>`;
        container.append(overlay);

        $('.modal').find('button').on('click', function() {
          $('.overlay').remove();
        })
      },
      error: function(err) {
        console.error(err);
      }
    })
  }

  paintInfo(userId); // open 1st user's

  prevButton.on('click', function() {
    if(userId === 1) {
      userId = 30;
    }
    userId -= 1;
    paintInfo(userId);
  });
  nextButton.on('click', function() {
    if(userId === 30) {
      userId = 1;
    }
    userId += 1;
    paintInfo(userId);
  });

  postsHeader.on('click', function() {
    $(this).next().slideToggle();
  });
  todosHeader.on('click', function() {
    $(this).next().slideToggle();
  });
})