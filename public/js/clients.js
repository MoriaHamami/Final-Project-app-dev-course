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
    try {
        const products = await $.ajax({
            url: `/clients/${id}`,
            method: 'GET',
            contentType: 'application/json',
        })
        // Create a long string that represents the HTML of products we want to be shown after we got the products from the DB 
        let str = ''
        if (products?.length > 0) {
            str += `   <h2>Items | ${products.length} </h2>
                        <h2>Date | ${products.dateCreated} </h2>
                        <h2>Status | ${products.Status} </h2>
                        <span class="product-container">`
            for (let i = 0; i < products.length; i++) {
                order = products[i]
                str += `<div class="product"> 
                                <img src="${order.srcImg[0]}" alt="Product Image" class="product-image">
                                <div class="product-info">
                                    <span class="product-name"><b>${order.title}</b></span>
                                    <span class="product-Size">Size: ${order.size} </span>
                                    <span class="product-name&num"><b>Name and number</b></span>
                                    <span class="product-playerName">Player Name : ${order.favePlayer} </span>
                                    <hr>
                                    <span class="product-Price">${order.price}$</span>
                                </div>
                            </div>
                        `
            }
            str += "</span>"
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
