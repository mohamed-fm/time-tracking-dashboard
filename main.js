

// Get the main elements
const categories = document.querySelectorAll('.category')
const cards_contenar = document.querySelector('.cards')
// Call the setActiveCategory  & bulidCards once a category button is clicked
categories.forEach((el)=>{
    // set the active class on the clicked element
    el.addEventListener('click' , setActiveCategory)
    // bulid the new car informations once a category button is clicked
    el.addEventListener('click' , bulidCards)
})

function setActiveCategory(e){
    // Remover all active classes
    categories.forEach(function(el){    
        el.classList.remove('active')
    })
    // Set the active calss on the clicked element
    e.target.classList.add('active')
}

// Get the data-type attr value from the active element to use in bulding the cards
function getActiveCategory(){
    let category = ''
    categories.forEach(function(el){    
        if(el.classList.contains('active')){
            category = el.attributes.getNamedItem('data-type').value
        }else{
            return false
        }
    })
    return category
}
getActiveCategory()

async function fetchData(){
    try{
        let response = await fetch('./data.json')
        if(response.ok){
            // Promise resolved and HTTP status is successful
            return response.json()
        }else{
            // If response is 404
            if (response.status === 404) throw new Error('404, Not found');
            // If response 500
            if (response.status === 500) throw new Error('500, internal server error');
            // For any other server error
            throw new Error(response.status);
        }
    }catch(error){
        console.error("Fetch" , error)
    }
    return false
}
const data = fetchData()

function load(){
    let cu_h = document.querySelectorAll('.hours h2')
    let pr_h = document.querySelectorAll('.hours span')
    for(let i =0 ;i < cu_h.length ; i++){
        cu_h[i].textContent = ''
        pr_h[i].textContent = ''
        cu_h[i].classList.add('load-h2','load')
        pr_h[i].classList.add('load-p','load')
    }
}
function bulidCards(){
    load()
    setTimeout(()=>{
        cards_contenar.textContent = ''
        let category = getActiveCategory()
        data.then((res)=>{
            for(let i =0 ; i < res.length ; i++){
                let card = document.createElement('div')
                card.classList.add('card',res[i]["title"])
                let shadow = document.createElement('div')
                shadow.classList.add('shadow' ,`${res[i]["title"]}-shadow`)
                let img = document.createElement('div')
                img.classList.add('se-image',`${res[i]["title"]}-image`)
                shadow.append(img)
                card.append(shadow)
                let main_card = document.createElement('div')
                main_card.classList.add('main-card')
                let card_type = document.createElement('div')
                card_type.classList.add('card-type')
                let p = document.createElement('p')
                p.textContent = res[i]['title']
                let dots = document.createElement('img')
                dots.src = "images/icon-ellipsis.svg"
                card_type.append(p)
                card_type.append(dots)
                main_card.append(card_type)
                let hours = document.createElement('div')
                hours.classList.add('hours')
                let h2 = document.createElement('h2')
                h2.textContent = res[i]["timeframes"][category]["current"] + 'hrs'
                let span = document.createElement('span')
                if(category == 'daily'){
                    span.textContent = `Last Day -  ${res[i]["timeframes"][category]["previous"]}hrs` 
                }else if(category == 'weekly'){
                    span.textContent = `Last Week -  ${res[i]["timeframes"][category]["previous"]}hrs` 
                }else{
                    span.textContent = `Last Month -  ${res[i]["timeframes"][category]["previous"]}hrs` 
                }
                hours.append(h2)
                hours.append(span)
                main_card.append(hours)
                card.append(main_card)
                cards_contenar.append(card)
            }
        })
    } , 2000)
}

bulidCards()