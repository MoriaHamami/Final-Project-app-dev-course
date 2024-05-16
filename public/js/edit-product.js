// const title = ''
// const color = ''
// const cat = ''
// const srcImg = []
// const favePlayer = ''
// const price = 0
// const gender = ''

const addProduct = (title, color, cat, srcImg, favePlayer, price, gender) => {
    fetch('/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // _id: Number,
            title,
            color,
            cat,
            srcImg,
            favePlayer,
            price,
            gender
        })
    })
}

// const onChange = (newTitle, newColor, newCat, newSrcImg, newFavePlayer, newPrice, newGender) => {
//     title = newTitle
//     color = newColor
//     cat = newCat
//     srcImg = newSrcImg
//     favePlayer = newFavePlayer
//     price = newPrice
//     gender = newGender

// }

const updateProduct = (title, color, cat, srcImg, favePlayer, price, gender) => {
    fetch('/products', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // _id: Number,
            title,
            color,
            cat,
            srcImg,
            favePlayer,
            price,
            gender
        })
    })
}