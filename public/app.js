const header = document.querySelector('header'),
      searchInput = document.querySelector('#search'),
      clearBtn = document.querySelector('#clearBtn'),
      sideListing = document.querySelector('.side-listing'),
      main = document.querySelector('main')

const api = "http://localhost:3000/api"
const getData = async url => {
    const resp = await fetch(url)
    const result = await resp.json()
    return result
}

getData(api).then( result => {
    displayList(result) 
    search(result)
    selectTags(result)
    clear(result)
})

const displayList = result => {
    result.forEach( (obj, index) => {
        let titleClass = index == 0 ? 'title active' : 'title'
        const titleEl = createNew('div', titleClass, obj.title)
        const currObj = result[index]
        display(sideListing, titleEl)
        listEvent(titleEl, currObj)

        if (index == 0) displayDishInfo(obj)
    })
} 

// tags
const selectTags = result => {
    let tags = ""
    result.forEach( obj => {        
        for(const tag of obj.tags){
            if(tags.indexOf(tag) < 1){
                tags += `<input type="checkbox" class="tag" name="${tag}"><label for="${tag}">${tag}</label>`
            }
        }
    })
    const tempDiv = createNew('div', 'tags', tags)
    display(header, tempDiv)
    tagEvent(result)
}

const tagEvent = result => {
    const tagEl = document.querySelectorAll('.tag')
    let tagsChecked = []
    for(const el of tagEl){
        el.addEventListener('change', () => {
            tagsChecked = []
             tagEl.forEach( el => {
                 if(el.checked){
                    if (!tagsChecked.includes(el.name)) tagsChecked.push(el.name)
                 }
             })
             handleChecked(result, tagsChecked)
        })
    }
}

const handleChecked = (result, tagsChecked) => {
    sideListing.innerHTML = ""
    let dishHasTag = []

    result.forEach( (obj, index) => {
        obj.tags.forEach( tag => {
            if(tagsChecked.includes(tag)) {
                if(!dishHasTag.includes(obj.title)) dishHasTag.push(obj.title)
            } 
        })
    })

   dishHasTag.length > 0 ?  displayTagDishes(result, dishHasTag) : displayList(result)
}

const displayTagDishes = (result, dishHasTag) => {
    let counter = 0

    result.forEach( (obj, index) => {
        if(dishHasTag.includes(obj.title)){
            const titleClass = counter == 0 ? 'title active' : 'title'
            const titleEl = createNew('div', titleClass, obj.title)
            const currObj = result[index]
            display(sideListing, titleEl)
            listEvent(titleEl, currObj)
            if (counter == 0) displayDishInfo(currObj)
            counter ++
        }
    })
}

const listEvent = (el, currObj) => {
    el.addEventListener('click', e => {
        removeActive()
        e.target.classList.add('active')
        displayDishInfo(currObj)
    })
}

const displayDishInfo = currObj => {
    let template = ""
    for(const key in currObj){
        switch(key) {
            case 'title':
                template += title(currObj, key);
                break;
            case 'ingredients':
                template += ingredients(currObj, key);
                break;
            case 'directions':
                template += directions(currObj, key);
                break;
            case 'servings':
                template += servings(currObj, key);
                break;
            case 'tags':
                    template += tags(currObj, key);
                break;
            case 'author':
                template += author(currObj, key);
                break;
            case 'source_url':
                template += source(currObj, key);
                break;
            default:
                template += `<h3>${key.replaceAll('_', ' ')}</h3><p>${currObj[key]}</p>`
        }
    }
    const info = createNew('div', 'main', template)
    main.innerHTML = ""
    display(main, info)
    servingQty()
}

// Dish information
const title = (currObj, key) =>{
   return `<h1>${currObj[key]}</h1>`
}

const ingredients = (currObj, key) => {
    let ingredients = `<h3>${key}</h3>`
    let list = ""
    for (const ingr of currObj[key]) list += `<li>${ingr}</li>`
    ingredients += `<ul class="ingredients">${list}</ul>`
    return ingredients
}

const directions = (currObj, key) =>{
    let directions = `<h3>${key}</h3>`
    for(const value of currObj[key]) directions += `<p>${value}</p>`
    return directions
}

const servings = (currObj, key) => {
    let options = ""
    for(i = 1; i < currObj[key] + 1; i++){
        if(i == currObj[key]) options += `<option value="${i}" selected>${i}</option>`
        else options += `<option value=${i}>${i}</option>`
    }
    const selectEl = `<h3>${key}</h3><select id="servingQty">${options}</select>`
    return selectEl
}

const tags = (currObj, key) => {
    let tags = `<h3>${key}</h3>`
    for(const tag of currObj[key]) tags += `</p>${tag}</p>`
    return tags
}

const author = (currObj, key) =>{
    let author = `<h3>${key}</h3><p>${currObj[key]['name']}</p><p><a href="${currObj[key]['url']}">${currObj[key]['url']}</a></p>`
    return author
}

const source = (currObj, key) =>{
    let source = `<h3>${key.replace('_',' ')}</h3><p><a href="${currObj[key]}">${currObj[key]}</a></p>`
    return source
}

const servingQty = () => {
    const qty = document.querySelector('#servingQty')
    const ingredients = document.querySelectorAll('.ingredients > li')
    qty.addEventListener('change', e => {
        for(const item of ingredients){
            // const numInString = item.innerHTML.match(/[+-]?\d+(?:\.\d+)?/g)
            // const strSplit = item.innerHTML.split(numInString.length)

            const itemContent = item.innerHTML
            const firstSpace = itemContent.indexOf(' ')
            const itemNum = itemContent.split(' ',[1])
            const itemTxt = itemContent.slice(firstSpace)
            const servings = +e.target.value
            let convertedNum = 0

            switch(itemNum){
                case '1/4':
                    convertedNum = 0.25
                    break
                case '1/2':
                    convertedNum = 0.50
                    break
                case '3/4':
                    convertedNum = 0.75
                    break
                default:
                    convertedNum = itemNum
            }

           const newAmount = (convertedNum / servings).toFixed(2)
           const newContent = `${newAmount} ${itemTxt}`
           item.innerHTML = newContent
        }
    })
}

// search
const search = result =>{
    searchInput.addEventListener('input', e => {
        sideListing.innerHTML = ""
        let counter = 0
        resetChecked()
        result.forEach( (obj, index) => {
            if(JSON.stringify(obj.ingredients).includes(e.target.value)){
                const titleClass = counter == 0 ? 'title active' : 'title'
                const titleEl = createNew('div', titleClass, obj.title)
                const currObj = result[index]
                display(sideListing, titleEl)
                listEvent(titleEl, currObj)
                if(counter == 0) displayDishInfo(currObj)
                counter ++
            }
        })
    })
}

// misc
const display = (section, el) => {
    section.append(el)
}

const clear = result => {
    clearBtn.addEventListener('click', () => {
        searchInput.value = ""
        sideListing.innerHTML = "" 
        displayList(result)
    })
}

const createNew = (elemType, elemClass, elemContent ) => {
    const elem = document.createElement(elemType)
    elem.className = elemClass
    elem.innerHTML = elemContent
    return elem
}

const removeActive = () => {
    const els = document.querySelectorAll('.title')
    for(const el of els) {
        if (el.classList.contains('active')){
            el.classList.remove('active') 
            return
        }
    }
}

const resetChecked = () => {
    const tags = document.querySelectorAll('.tag')
    for(const tag of tags) tag.checked = false
}