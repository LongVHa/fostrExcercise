const header = document.querySelector('header'),
      searchInput = document.querySelector('#search'),
      findBtn = document.querySelector('#findBtn'),
      sideListing = document.querySelector('.side-listing'),
      main = document.querySelector('main')

const api = "http://localhost:3000/api"
const getData = async url => {
    const resp = await fetch(url)
    const result = await resp.json()
    return result
}

getData(api).then( result =>{
    listTitles(result) 
    search(result)
    tags(result)
})

const listTitles = result => {
    result.forEach( (obj, index) => {
        const titleEl = createNew('div', 'title', obj.title)
        const currObj = result[index]        
        display(sideListing, titleEl)
        listEvent(titleEl, currObj)
    })
} 

//get tags
const tags = (result) => {
    let tags = ""
    
    result.forEach( (obj, index) => {        
        for(const tag of obj.tags){
            if(tags.indexOf(tag) < 1){
                tags += `<label for="${tag}">${tag}</label><input type="checkbox" class="tag" name="${tag}">`
            }
        }
    })
    const tempDiv = createNew('div', 'tags', tags)
    display(header, tempDiv)
    tagEvent(result)
}

const tagEvent = result => {
    const tagEl = document.querySelectorAll('.tag')
    for(const el of tagEl){
        el.addEventListener('change', (e) => {
             if (this.checked) console.log('checked')
        })
    }
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
        main.innerHTML = ''
        display(main, div)
    })
}


// info displays
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
    let options =''
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
    findBtn.addEventListener('click', () => {
        // console.log(result.find(searchInput.value))
    })
}

// misc
const display = (section, el) =>{
    section.append(el)
}

const createNew = (elemType, elemClass, elemContent ) => {
    const elem = document.createElement(elemType)
    elem.classList.add(elemClass)
    elem.innerHTML = elemContent
    return elem
}

