const populateURL=`http://localhost:3000/quotes?_embed=likes`;
const quotesContainer=document.getElementById('quote-list');
const quoteForm= document.getElementById ('new-quote-form');
const likesUrl=`http://localhost:3000/likes`;
const quotesUrl=`http://localhost:3000/quotes/`;

function getQuotes(){
    fetch(populateURL)
    .then (res=> res.json())
    .then (quoteArray => {
        quoteArray.forEach(showQuote)
    })
}


function showQuote (quote){
    const li=document.createElement('li')
    li.className="quote-card"
    li.id=quote.id

    const blockQuote=document.createElement('blockquote')
    blockQuote.className="blockquote"

    const p = document.createElement('p')
    p.className='mb-0';
    p.innerText=quote.quote;

    const footer=document.createElement('footer');
    footer.className="blockquote-foter";
    footer.innerText=quote.author;

    const br=document.createElement('br');

    const likeButton=document.createElement('button');
    likeButton.className="btn-success";
    likeButton.id = `like${quote.id}`;
    likeButton.dataset.id=quote.id;
    
    if(quote.likes){
        likeButton.dataset.likes=parseInt(quote.likes.length);
        likeButton.innerHTML=`Likes: ❤ <span>${likeButton.dataset.likes}</span>`;
    } 
    else {
        likeButton.dataset.likes=0;
        likeButton.innerHTML=`Likes: ❤ <span>${likeButton.dataset.likes}</span>`;
    }
    likeButton.addEventListener('click',likeQuote);

    const deleteButton=document.createElement('button');
    deleteButton.className="btn-danger";
    deleteButton.id=quote.id;
    deleteButton.innerText="Delete";
    deleteButton.addEventListener('click',deleteQuote);

    blockQuote.append(p,footer,br,likeButton,deleteButton);
    li.append(blockQuote);
    quotesContainer.append(li);
}
function likeQuote (e){
    const id = parseInt(e.target.dataset.id)
    const confObj={
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(
        { quoteId : parseInt(id)
        })
    }
    fetch (likesUrl,confObj)
    .then (res=>res.json())
    .then (newLike=>{
        let likeButton=document.getElementById(`like${id}`);
        const aLike=parseInt(likeButton.dataset.likes)+1;
        likeButton.dataset.likes=aLike;
        likeButton.innerText=`Likes: ❤ ${likeButton.dataset.likes}`
    })
}
function deleteQuote(e) {
    const id= e.target.id;
    const confObj = {
        method: 'DELETE',
    }
    fetch(quotesUrl+id,confObj)
    .then(res=>res.text())
    .then(()=>{
        e.target.parentElement.parentElement.remove()
    })
}
function submitForm(){
    quoteForm.addEventListener('submit',createQuote)
}
function main(){
   submitForm(); 
   getQuotes();
}

function createQuote (e){
    e.preventDefault()
    const newQuote = {
        quote: e.target['quote'].value,
        author:e.target['author'].value,
    }
    const confObj={
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newQuote)
    }
    fetch(quotesUrl,confObj)
    .then((res)=>res.json())
    .then(quote=>{
        quoteForm.reset()
        showQuote(quote)
    })
}
main();