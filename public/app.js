const header = document.querySelector('header'),
      aside = document.querySelector('aside'),
      main = document.querySelector('main');

console.log(header, aside, main)

fetch("http://localhost:3000/all")
.then(resp => resp.json())
.then(data => {
    data.forEach( result => {
        console.log(result.title)
        const title = createNew('div', 'title', result.title)
        aside.appendChild(title)
    })
})

// const allURL = "http://localhost:3000/all"

// let all = async (allURL) => {
//  let resp = await fetch(allURL)
//  let result = await resp.json()
//  console.log(result)
// }

const createNew = (elemType, elemClass, elemContent ) => {
    const elem = document.createElement(elemType)
    elem.classList.add(elemClass)
    elem.innerHTML = elemContent
    return elem
}