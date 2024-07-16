document.addEventListener('DOMContentLoaded', function () {
    const deleteButtons = document.querySelectorAll('.delete-acc-btn')

    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const row = this.closest('tr')
            if (row) {
                const confirmation = confirm("האם אתה בטוח שאתה רוצה למחוק?")
                if (confirmation) {
                    row.remove()
                }
            }
        })
    })
})
$(document).ready(function () {
    // מאזין ללחיצה על כפתורי מחיקה
    $(".delete-acc-btn").on("click", function () {
        // הצגת הודעת אישור
        if (confirm("האם אתה בטוח שאתה רוצה למחוק?")) {
            // מחיקת השורה
            const row = $(this).closest("tr")
            row.remove()
        }
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
