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

getData(api).then( result =>{
    displayList(result) 
    search(result)
    tags(result)
    clear(result)
})

const displayList = result => {
    result.forEach( (obj, index) => {
        const titleEl = createNew('div', 'title', obj.title)
        const currObj = result[index]
        display(sideListing, titleEl)
        listEvent(titleEl, currObj)
    })
} 

// tags
const tags = (result) => {
    let tags = ""
    result.forEach( (obj, index) => {        
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
    for(const obj of result){
        obj.tags.forEach( (tag, index) => {
            if(tagsChecked.includes(tag)) {
                if(!dishHasTag.includes(obj.title)) dishHasTag.push(obj.title)
            } 
        })
    }
    dishHasTag.length > 0 ?  displayTagDishes(result, dishHasTag) : displayList(result)
}

const displayTagDishes = (result, dishHasTag) => {
    result.forEach( (obj, index) => {
        if(dishHasTag.includes(obj.title)){
            const titleEl = createNew('div', 'title', obj.title)
            const currObj = result[index]
            display(sideListing, titleEl)
            listEvent(titleEl, currObj)
        }
    })
}

const listEvent = (el, currObj) => {
    el.addEventListener('click', () => {
        let template = ""
        for(const key in currObj){
            if (key === 'title') template += handleTitle(currObj, key)
            else if(key === 'ingredients') template += handleIngredients(currObj, key)
            else if(key === 'servings') template += handleServings(currObj, key)
            else if(key === 'author') template += handleAuthor(currObj, key)
            else template += `<h3>${key.replaceAll('_', ' ')}</h3><p>${currObj[key]}</p>`
        }
        const div = createNew('div', 'main', template)
        main.innerHTML = ""
        display(main, div)
    })
}


// Dish information
const handleTitle = (currObj, key) =>{
   return `<h1>${currObj[key]}</h1>`
}

const handleIngredients = (currObj, key) => {
    let temp = `<h3>${key}</h3>`
    let tempIngr = ""
    for (const ingr of currObj[key]) tempIngr += `<li>${ingr}</li>`
    temp += `<ul class="ingredients">${tempIngr}</ul>`
    return temp
}

const handleServings = (currObj, key) => {
    let options = ""
    for(i = 1; i < currObj[key] + 1; i++){
        if(i == currObj[key]) options += `<option value="${i}" selected>${i}</option>`
        else options += `<option value=${i}>${i}</option>`
    }
    const selectEl = `<h3>${key}</h3><select>${options}</select>`
    return selectEl
}

const handleAuthor = (currObj, key) =>{
    for( const k in currObj[key]) return `<h3>${key}</h3>${currObj[key][k]}`
}


// search
const search = (result) =>{
    searchInput.addEventListener('input', e => {
        sideListing.innerHTML = ""
        result.forEach( (obj, index) => {
            if(JSON.stringify(obj.ingredients).includes(e.target.value)){
                const titleEl = createNew('div', 'title', obj.title)
                const currObj = result[index]
                display(sideListing, titleEl)
                listEvent(titleEl, currObj)
            }
        })
    })
}

// misc
const display = (section, el) =>{
    section.append(el)
}

const clear = (result) => {
    clearBtn.addEventListener('click', () => {
        searchInput.value = ""
        sideListing.innerHTML = "" 
        displayList(result)
    })
}

const createNew = (elemType, elemClass, elemContent ) => {
    const elem = document.createElement(elemType)
    elem.classList.add(elemClass)
    elem.innerHTML = elemContent
    return elem
}

