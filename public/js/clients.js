document.addEventListener('DOMContentLoaded', function () {
    const deleteButtons = document.querySelectorAll('.delete-acc-btn')

    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const row = this.closest('tr')
            if (row) {
                const confirmation = confirm("Are you sure you want to remove the client from the list?")
                if (confirmation) {
                    row.remove()
                }
            }
        })
    })
}) 
// TO DO MAKE THIS WORK
$('.orders-btn').click(function () {
    var id = $(this).attr('id')
    getOrdersById(id)
})

async function getOrdersById(id) {
    $('.shopping-cart').html('<div class="container" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;"><img src="/styles/imgs/general/loader.webp" alt="loader" style="width:30%;"></div>')
    try {
        const orders = await $.ajax({
            url: `/clients/${id}`,
            method: 'GET',
            contentType: 'application/json',
        })
        // Create a long string that represents the HTML of products we want to be shown after we got the products from the DB 
        let str = ''
        if (orders?.length > 0) {
            for (let j = 0; j < orders.length; j++) {
                let order = orders[j]
                str += `   <h2>Items | ${order.length} </h2>
                            <span class="product-container">`
                for (let i = 0; i < order.length; i++) {
                    product = order[i].productInfo
                    str += `<div class="product"> 
                                                <img src="${getImgURL( order[i].imgs?.length ? order[i].imgs[0] : null, order[i].type) }" alt="Product Image" class="product-image">
                                                <div class="product-info">
                                                    <span class="product-name"><b>${product.title}</b></span>
                                                    <span class="product-Size">Size: ${order[i].size} </span>
                                                    <span class="product-name&num"><b>Name and number</b></span>
                                                    <span class="product-playerName">Player Name : ${product.favePlayer} </span>
                                                    <hr>
                                                    <span class="product-Price">${product.price}$</span>
                                                </div>
                                            </div>
                                        `
                }
                str += "</span>"
            }
        } else {
            str += `<div class="shopping-cart">
                            No purchases yet
                        </div>`
        }
        // Inside the products area in the HTML, show all the products
        $('.shopping-cart').html(str)
    } catch (e) {
        console.log('e:', e)
        // TODO: Later show an error modal
    }
}

function getImgURL(srcImg, folder){
    console.log('srcImg:', srcImg)
    if(!srcImg) return ""
        return srcImg?.includes('data:') ? srcImg : ('/styles/imgs/' + folder + '/' + srcImg)
}

 
async function onDeleteClient(id) { 
    console.log("in js") 

    try {
        // Send a delete request using ajax, and send on the body the id of the product to delete
        const res = await $.ajax({
            url: '/clients/edit/' + id,
            method: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify({ id }),
        })
        if (res.status !== 404) window.location.assign('/clients')
    } catch (e) {
        console.log('e:', e)
    }
} 
 
function confirmBlock(event) {
    if (confirm("האם לחסום?")) {
        // המשך פעולת החסימה כאן
        console.log("הלקוח נחסם בהצלחה!");
        event.target.style.backgroundColor = 'gray'; // שינוי צבע הרקע לאפור
        // שינוי צבע הרקע של הכפתור השני ללבן
        let otherButton = event.target.nextElementSibling;
        if (otherButton) {
            otherButton.style.backgroundColor = '';
        }
    } else {
        // ביטול חסימת הלקוח
        console.log("ביטול חסימת הלקוח.");
    }
}

 

function confirmUnblock(event) {
    if (confirm("האם לשחרר את החסימה?")) {
        // כאן תוכל להוסיף את קוד שחרור החסימה
        console.log("החסימה שוחררה בהצלחה!"); 
        event.target.style.backgroundColor = 'gray'; // שינוי צבע הרקע לאפור
    // שינוי צבע הרקע של הכפתור השני ללבן
    let otherButton = event.target.previousElementSibling;
    if (otherButton) {
        otherButton.style.backgroundColor = '';
    }
} else {
    // ביטול שחרור החסימה
    console.log("ביטול שחרור החסימה.");
}

}












