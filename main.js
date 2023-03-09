// Настройки
const apiKey = '990b750d-4b03-45cb-a2ee-3a0180b48a83';
const apiKeyYoutube = 'AIzaSyAyg97OJ47yIBhTqSSw6_L5DauP_krbAqQ';

const url = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";
const urlSearch = "https://kinopoiskapiunofficial.tech/api/v2.1/films/";
const urlTop  = "https://kinopoiskapiunofficial.tech/api/v2.2/films"; 
const urlSearchActors  = "https://kinopoiskapiunofficial.tech/api/v1/";
const urlYouTube = "https://youtube.googleapis.com/youtube/v3/";
const options = {
    method: 'GET',
    headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
    },
};

// DOM элементы
const filmsWrapper = document.querySelector('.films')
const loader = document.querySelector('.loader-wrapper')
const btnShowMore = document.querySelector('.show-more')
const formFilms = document.querySelector('.form-films')
const formActors = document.querySelector('.form-actors')
const filmSearch = document.querySelector('.search-films')
const actorSearch = document.querySelector('.search-actors')
const btnTopFilms = document.querySelector('.top100-films')
const btnTopSeries = document.querySelector('.top100-series')
const titleRefresh = document.querySelector('.title-1')

// Глобальная переменная, которая нужна для счётчика страниц в функциях
let page = 1;

// Кнопки вызова "Топ-100" и "Стартовой страницы"
btnTopFilms.onclick = beforeOutputFilms;
btnTopSeries.onclick = beforeOutputSeries;
titleRefresh.onclick = beforeOutputStartPage;

// Очистка главной страницы перед выводом "Топ-100 фильмов"
function beforeOutputFilms () {
    btnShowMore.classList.add('none');
    document.querySelector('.films').innerHTML = '';
    top100Films ();
}

// Очистка главной страницы перед выводом "Топ-100 сериалов"
function beforeOutputSeries () {
    btnShowMore.classList.add('none');
    document.querySelector('.films').innerHTML = '';
    top100Series ();
}

// Очистка главной страницы перед выводом "Стартовой страницы"
function beforeOutputStartPage () {
    page = 1;
    btnShowMore.classList.add('none');
    document.querySelector('.films').innerHTML = '';
    startPage ();
}

//  Стартовая страница
async function startPage () {
    // Показать preloader
    loader.classList.remove('none')

    // Получение данных о фильмах
    const data = await fetchData(url + `top?page=${page}`, options);

    // Счётчик страниц
    if (data.pagesCount > 1) page++

    // Проверка на отображение кнопки "Следующие 20 фильмов"
    if (data.pagesCount > 1) btnShowMore.classList.remove('none')

    // Отслеживание клика по кнопке "Следующие 20 фильмов"
    btnShowMore.onclick = startPage;

    // Скрыть preloader
    loader.classList.add('none')

    // Вывод фильмов
    renderFilms(data.films); 

    // Проверка на скрытие кнопки "Следующие 20 фильмов"
    if (page > data.pagesCount) btnShowMore.classList.add('none')
}

// Топ-100 фильмов
async function top100Films () {
    // Показать preloader
    loader.classList.remove('none')

    // Получение данных о фильмах
    const data = await fetchData(urlTop +`?order=NUM_VOTE&type=FILM&ratingFrom=8&page=${page}`, options);

    // Счётчик страниц
    if (data.totalPages > 1) page++

    // Проверка на отображение кнопки "Следующие 20 фильмов"
    if (data.totalPages > 1) btnShowMore.classList.remove('none')

    // Отслеживание клика по кнопке "Следующие 20 фильмов"
    btnShowMore.onclick = top100Films;

    // Скрыть preloader
    loader.classList.add('none')

    // Вывод фильмов
    renderFilmsTop(data.items); 

    // Бесконечный скрол фильмов по кнопке "Следующие 20 фильмов"
    if (page > data.totalPages) page = 1
}

// Топ-100 сериалов
async function top100Series () {
    // Показать preloader
    loader.classList.remove('none')

    // Получение данных о фильмах
    const data = await fetchData(urlTop +`?order=NUM_VOTE&type=TV_SERIES&ratingFrom=8&page=${page}`, options);

    // Счётчик страниц
    if (data.totalPages > 1) page++

    // Проверка на отображение кнопки "Следующие 20 фильмов"
    if (data.totalPages > 1) btnShowMore.classList.remove('none')

    // Отслеживание клика по кнопке "Следующие 20 фильмов"
    btnShowMore.onclick = top100Series;

    // Скрыть preloader
    loader.classList.add('none')

    // Вывод сериалов
    renderFilmsTop(data.items); 

    // Бесконечный скрол сериалов
    if (page > data.totalPages) page = 1
}

// Поиск по фильмам
async function searchMovies () {
    // Показать preloader
    loader.classList.remove('none')

    // Получение данных о фильмах
    const data = await fetchData(urlSearch + `search-by-keyword?keyword=${filmSearch.value}`, options);

    // Скрыть preloader
    loader.classList.add('none')

    // Вывод фильмов
    renderFilms(data.films); 
}

// Поиск по актёрам
async function searchActors () {
    // Показать preloader
    loader.classList.remove('none')

    // Получение данных об актерах
    const data = await fetchData(urlSearchActors + `persons?name=${actorSearch.value}`, options);

    // Скрыть preloader
    loader.classList.add('none')

    // Вывод актёров
    renderActors(data.items); 
}

// Получение основных данных с API Kinopoisk
async function fetchData (url, options) {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}

// Создание и отображение карточек с фильмами для стартовой страницы
function renderFilms(films) {
    for (film of films) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.id = film.filmId;

        // Открытие деталей фильма по клику на карточку
        card.onclick = openFilmDetails;

        const html = `
                    <img src=${film.posterUrlPreview} alt="Cover" class="card__img">
                    <h3 class="card__title">${film.nameRu}</h3>
                    <p class="card__year">${film.year}</p>
                    <p class="card__rate">Рейтинг: ${film.rating}</p>
                `;

        card.insertAdjacentHTML('afterbegin', html)

        filmsWrapper.insertAdjacentElement('beforeend', card)
    }
}

// Создание и отображение карточек с актёрами
function renderActors(actors) {
    for (actor of actors) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.id = actor.kinopoiskId;

        // Открытие деталей по актёру после клика на карточку
        card.onclick = openActorDetails;

        const html = `
                    <img src=${actor.posterUrl} alt="Cover" class="card__img">
                    <h3 class="card__title">${actor.nameRu}</h3>
                `;

        card.insertAdjacentHTML('afterbegin', html)

        filmsWrapper.insertAdjacentElement('beforeend', card)
    }
}

// Создание и отображение карточек с фильмами для "Топ-100 фильмов"
function renderFilmsTop(films) {
    for (film of films) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.id = film.kinopoiskId;

        // Открытие деталей фильма по клику на карточку
        card.onclick = openFilmDetails;

        const html = `
                    <img src=${film.posterUrlPreview} alt="Cover" class="card__img">
                    <h3 class="card__title">${film.nameRu}</h3>
                    <p class="card__year">${film.year}</p>
                    <p class="card__rate">Рейтинг: ${film.ratingKinopoisk}</p>
                `;

        card.insertAdjacentHTML('afterbegin', html)

        filmsWrapper.insertAdjacentElement('beforeend', card)
    }
}

// Обработка клика по карточке с фильмом
async function openFilmDetails(e) {
    // Достаём id фильма через event
    const id = e.currentTarget.id

    // Получаем данные фильма по которому произошел клик
    const data = await fetchData(url + id, options)

    // Рендер и отображение информации с деталями фильма
    renderFilmData(data);
}

// Обработка клика по карточке с актёром
async function openActorDetails(e) {
    // Достаём id фильма через event
    const id = e.currentTarget.id

    // Получаем данные актёра по которому произошел клик
    const data = await fetchData(urlSearchActors + `staff/${id}`, options)

    // Рендер и отображение информации с деталями об актёре
    renderActorData(data);
}

// Создание и отображение деталей фильма
function renderFilmData (film) {
    // Проверка отображения деталей по фильму
    if (document.querySelector('.container-right')) document.querySelector('.container-right').remove()

    // Создание и отображение формы для вывода деталей
    const containerRight = document.createElement('div');
    containerRight.classList.add('container-right');
    document.body.insertAdjacentElement('beforeend', containerRight);

    // Создание и отображение "кнопки закрытия"
    const btnClose = document.createElement('button');
    btnClose.classList.add('btn-close');
    btnClose.innerHTML = '<img src="./img/cross.svg" alt="Close" width="24">';
    containerRight.insertAdjacentElement('afterbegin', btnClose);

    // Удаление контейнера с деталями со страницы по клику на "кнопку закрытия"
    btnClose.onclick = () => {containerRight.remove()}

    // Создание и отображение деталей фильма
    const html = `<div class="film">
        <div class="film__title">${film.nameRu}</div>

        <div class="film__img">
            <img src=${film.posterUrl} alt="Cover"  class="film__poster">
        </div>

        <div class="film__desc">
            <p class="film__details">Год: ${film.year}</p>
            <p class="film__details">Рейтинг: ${film.ratingKinopoisk}</p>
            <p class="film__details">Продолжительность: ${formatFilmLength(film.filmLength)}</p>
            <p class="film__details">Страна: ${formatCountry(film.countries)}</p>
            <p class="film__text">${film.description}</p>   
        </div>
    </div>`

    containerRight.insertAdjacentHTML('beforeend', html);

    // Запрос к API YouTube и получение данных по поиску трейлера к фильму
    fetch(`${urlYouTube}search?part=snippet&maxResults=1&order=relevance&q=${film.nameRu} ${film.year} трейлер&key=${apiKeyYoutube}`)
        .then((result)=>{
            return result.json()
        }).then((data)=>{
            const videos = data.items

            // Отображение трейлера фильма
            for(video of videos){
                const videoId = video.id.videoId
                const youtubePlayer = `<iframe id="player" type="text/html" width="600" height="320"
                src="http://www.youtube.com/embed/${videoId}?enablejsapi=1&"
                frameborder="0"></iframe>`

            containerRight.insertAdjacentHTML('beforeend', youtubePlayer);
            }
        })
}

// Создание и отображение деталей об актёрах
function renderActorData (actor) {
    // Проверка отображения деталей по актёру
    if (document.querySelector('.container-right')) document.querySelector('.container-right').remove()

    // Создание и отображение формы для вывода деталей
    const containerRight = document.createElement('div');
    containerRight.classList.add('container-right');
    document.body.insertAdjacentElement('beforeend', containerRight);

    // Создание и отображение "кнопки закрытия"
    const btnClose = document.createElement('button');
    btnClose.classList.add('btn-close');
    btnClose.innerHTML = '<img src="./img/cross.svg" alt="Close" width="24">';
    containerRight.insertAdjacentElement('afterbegin', btnClose);

    // Удаление контейнера с деталями со страницы по клику на "кнопку закрытия"
    btnClose.onclick = () => {containerRight.remove()}

    // Создание и отображение деталей об актёре
    const html = `<div class="actor">
        <div class="actor__title">${actor.nameRu}</div>

        <div class="actor__img">
            <img src=${actor.posterUrl} alt="Cover" class="actor__poster">
        </div>

        <div class="actor__desc">
            <p class="actor__details">Дата рождения: ${new Date (actor.birthday).toLocaleDateString()}</p>
            <p class="actor__details">Место рождения: ${actor.birthplace}</p>
            <p class="actor__details">Карьера: ${actor.profession}</p>
            <p class="actor__text actor__beforeText">Интересные факты из жизни:</p>   
            <p class="actor__text">${formatFacts(actor.facts)}</p>   
        </div>
    </div>`

    containerRight.insertAdjacentHTML('beforeend', html);
}

// Форматирование продолжительности фильма
function formatFilmLength(value) {
    let length = '';

    const hours = Math.floor(value / 60);
    const minutes = value % 60;

    if (hours > 0) length += hours + ' ч. '
    if (minutes > 0) length += minutes + ' мин.'

    return length;
}

// Форматирование массива из стран в которых снимался фильм
function formatCountry (countriesArray) {
    let countriesString = '';

    for(country of countriesArray) {
        countriesString += country.country;
        if(countriesArray.indexOf(country) + 1 < countriesArray.length) countriesString += ', '
    }

    return countriesString;
}

// Форматирование массива из фактов о человеке
function formatFacts (factsArray) {
    let factString = '';
    let factResult = '';

    for(fact of factsArray) {
        factString += fact;
        if(factsArray.indexOf(fact) + 1 < factsArray.length) factString += '<br><br> '
        if(factsArray.indexOf(fact) + 1 < 4) factResult = factString;
    }

    return factResult;
}

// Обработчик входных данных поиска по фильмам
formFilms.addEventListener('submit', (e) => {
    e.preventDefault();

    if(filmSearch.value) { 
        clearAfterSearch();
        searchMovies()
    }

    filmSearch.value = ''
})

// Обработчик входных данных поиска по актерам
formActors.addEventListener('submit', (e) => {
    e.preventDefault();

    if(actorSearch.value) { 
        clearAfterSearch();
        searchActors()
    }

    actorSearch.value = ''
})

// Очистка страницы перед выдачей поискового запроса
function clearAfterSearch () {
    btnShowMore.classList.add('none');
    document.querySelector('.films').innerHTML = '';
}

// Вызов стартовой страницы
startPage().catch((err) => console.log(err));