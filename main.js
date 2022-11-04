const contenerForBooks = document.querySelector('.books')
const buttonForm = document.querySelector('#search-button');

const listBooks = document.querySelector('.list-books');
const books = [];
const quantity = 12;

const clearErorrForm = () => {
    const error = document.querySelector('.error');
    error.textContent = '';
    error.classList.add('d-none');
}
const clearBookContent = () => {
    contenerForBooks.innerHTML = '';
}
const clearListBooksContent = ()=>{
    listBooks.innerHTML = '';
}

const errorForm = (err)=>{
    const buttonForm = document.querySelector('#search-button')
    buttonForm.classList.add('a-bounce-error')
    const error = document.querySelector('.error');
    error.textContent = '';
    error.classList.remove('d-none')
    const p = document.createElement('p');
    p.textContent = err;
    error.append(p)
    const addEven = buttonForm.addEventListener('animationend', ()=>{
        buttonForm.classList.remove('a-bounce-error');    
    })
    buttonForm.removeEventListener('animationend', addEven)
}
const errorMain = (err) => {
    const book = document.querySelector('.books')
    book.textContent = err;
}

const checkIsbnNumber = (value) => {
    if(isNaN(value)){
        errorForm('Podałeś nieprawidłowy numer. Sprawdź czy numer został poprawnie wpisany.');
        return false;
      
    }

    if((value.trim().length !== 13 && value.trim().length !== 10)){
        if(value.trim().length === 0){
            return false;
        }
        else{
            errorForm(`Długość numeru powinna wynosić 13 cyfr lub 10 cyfr. Podano: ${value.trim().length}`)
            return false;
        }
    }
    
    clearErorrForm();
    return true;
}
const checkTitle = (value) => {
    if(value.length === 0 || typeof value !== 'string'){
        return false
    }
    clearErorrForm();
    return true;
}



const fetchBook = (title = "", number = '')=>{
    let result;
    if(title.length === 0){
        result = fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${number}`)
        .then(response => response.json())
        .then(data => data)
        .catch(err => console.log(err));
    } else{
        result = fetch(`https://www.googleapis.com/books/v1/volumes?q=title:${title}`)
        .then(response => response.json())
        .then(data => data)
        .catch(err => console.log(err));
    }
    return result;
}

const getListBooks =  async ()=>{
    const result = await (await (fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn`))).json()
    return result;
}
const generateId = (lastId)=>{
    return lastId+=1;
}

const addBookToMainContent = async (title, numberISBN) => {
    const result = await fetchBook(title, numberISBN)
    if(result.totalItems !== 0){

        const id = generateId((books.length !== 0)?  books[books.length-1] : 0)
        books.push(id);
        if(books.length === 0){
            book.innerHTML = '<h1>Aby zobaczyć ksiązkę podaj numer ISBN</h1>';
        }
        if(books.length === 1){
            clearBookContent();
        }
        const chcekImg = ()=>{
            if(!result.items[0].volumeInfo.imageLinks){
                const imgUrl = "data:image/jpeg;base64,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";
                return imgUrl;
            } else {
                return result.items[0].volumeInfo.imageLinks.thumbnail;
            }
        }
        const bookItem = document.createElement('div');
        bookItem.classList.add('modal','book-item')
        bookItem.setAttribute('data-id', id)
        console.log(result.items[0].volumeInfo.authors)
        bookItem.innerHTML += `
        <div class="book-item__content">
            <div class="book-item_img">
                <img src="${chcekImg()}" alt="">
            </div>
            <div class="book-item__desc">
                <div class="book-item__title">
                    <h4>Tytuł</h4>
                    <p>${result.items[0].volumeInfo.title}</p>
                </div>
                <div class="book_author">
                    <h4>Autorzy</h4>
                    <p>${(!result.items[0].volumeInfo.authors)? "brak": result.items[0].volumeInfo.authors}</p>
                </div>
                <div class="book-item__category">
                    <h4>Kategorie</h4>
                    <p>${(result.items[0].volumeInfo.categories !== undefined) ? result.items[0].volumeInfo.categories : "brak"}</p>
                </div>
                <div class="book-item__language">
                    <p><strong>Język</strong>: ${result.items[0].volumeInfo.language}</p>
                </div>
        </div>
        `
        contenerForBooks.prepend(bookItem);
    } else {
        return errorForm('W naszej bazie nie znaleziono tej książki');
    }
}
const deleteLastBook = () => {
    const parentBookItem = document.querySelector('.books')
    return parentBookItem.removeChild(parentBookItem.lastChild);
}


buttonForm.addEventListener('click', async (event)=>{
    event.preventDefault();
    const numberISBNFromInput = document.querySelector('#input-text__ISBN');
    const titleFromInput = document.querySelector('#input-text__title');
    if(checkTitle(titleFromInput.value) === true && checkIsbnNumber(numberISBNFromInput.value) === false){
        await addBookToMainContent(titleFromInput.value);
        if(books.length-1 >= quantity){
            deleteLastBook();
            books.shift();
        }
        return;
    }
    
    if(checkTitle(titleFromInput.value) === false && checkIsbnNumber(numberISBNFromInput.value) === true){
        await addBookToMainContent("", numberISBNFromInput.value);
        if(books.length-1 >= quantity){
            deleteLastBook();
            books.shift();
        }
        return
    }
    if(numberISBNFromInput.value.trim().length === 0 && titleFromInput.value.trim().length === 0){
        return errorForm('Podaj tytuł lub numer ISBN')
    }

})



