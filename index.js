(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []

  const dataPanel = document.getElementById('data-panel')
  const movieContent = document.querySelector('.modal-body')
  const movieName = document.querySelector('.modal-title')
  const searchForm = document.getElementById('searchForm')
  const searchInput = document.getElementById('search-input')

  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  const viewMode = document.querySelector('.viewMode')
  let paginationData = []
  let currentPage = 1
  let mode = 'iconsMode'

  axios
    .get(INDEX_URL)
    .then((response) => {
      data.push(...response.data.results)
      getPageData(currentPage, data)
      getTotalPages(data)
    })
    .catch((error) => {
      console.log(error)
    })

  // Render Page
  function displayDataList(pageData) {
    let htmlContent = ''
    pageData.forEach(function (item, index) {
      if (mode === 'iconsMode') {
        htmlContent += `
          <div class="col-sm-3">
            <div class="card mb-2">
              <img class="card-img-top" src="${POSTER_URL}${item.image}">
              <div class="card-body movie-item-body">
                <h6 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer">
                <button type="button" class="btn btn-primary btn-show-movie" data-toggle="modal" data-id='${item.id}' data-target="#exampleModal">
                  Info
                </button>
                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
              </div>
            </div>
          </div> `
      } else if (mode === 'listsMode') {
        htmlContent += `
        <div class="card container">
          <div class="row align-items-center justify-content-between">
            <div class="card-body">
              ${item.title}
            </div>
            <div class="btn">
              <button type="button" class="btn btn-primary btn-show-movie" data-toggle="modal" data-id='${item.id}' data-target="#exampleModal">Info</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
				</div> `
      }
    })
    dataPanel.innerHTML = htmlContent
  }
  // Add To Favorite
  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }
  // Movies Info
  function showMovie(id) {
    const movie = data.find(item => item.id === Number(id))
    movieName.innerHTML = `<div>${movie.title}</div>`
    movieContent.innerHTML = `
      <div>${movie.description}</div>
      <br></br>
      <div>Release Date: ${movie.release_date}</div> `
  }
  // Pagination
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li> `
    }
    pagination.innerHTML = pageItemContent
  }
  // Pagination Data To Render Page
  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let target = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(target, target + ITEM_PER_PAGE)
    displayDataList(pageData)
  }
  // listen to pagniation
  pagination.addEventListener('click', event => {
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page, data)
      currentPage = event.target.dataset.page
    }
  })
  // listen to view mode
  viewMode.addEventListener('click', event => {
    if (event.target.matches('.fa-bars')) {
      mode = 'listsMode'
    } else if (event.target.matches('.fa-th')) {
      mode = 'iconsMode'
    }
    getPageData(currentPage)
  })
  // listen to searchForm
  searchForm.addEventListener('submit', event => {
    event.preventDefault()
    let results = []
    const regex = new RegExp(searchInput.value, 'i')
    results = data.filter(movie => movie.title.match(regex))

    getTotalPages(results)
    getPageData(currentPage, results)
  })
  // listen to data panel
  dataPanel.addEventListener('click', event => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
    }
  })
})()