document.addEventListener('DOMContentLoaded', function () {
    const deleteButtons = document.querySelectorAll('.delete-acc-btn')

    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const row = this.closest('tr')
            if (row) {
                const confirmation = confirm("Are you sure you want to remove the client from the list?")
                if (confirmation) {
                    row.remove()
                    showNotice('Client removed successfully');
                }
            }
        })
    })
})

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
        showNotice('Error fetching orders');
    }
}

function getImgURL(srcImg, folder){
    console.log('srcImg:', srcImg)
    if(!srcImg) return ""
        return srcImg?.includes('data:') ? srcImg : ('/styles/imgs/' + folder + '/' + srcImg)
}

async function onDeleteClient(id) { 
    try {
        const res = await $.ajax({
            url: '/clients/edit/' + id,
            method: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify({ id }),
        })
        if (res.status !== 404) {
            showNotice('Client deleted successfully');
            window.location.assign('/clients')
        } else {
            showNotice('Client not found');
        }
    } catch (e) {
        console.log('e:', e)
        showNotice('Error deleting client');
    }
} 

async function onBlockClient(id, isBanned) { 
    console.log("in js")

    try {
        const res = await $.ajax({
            url: '/clients/block/' + id,
            method: 'PATCH',
            contentType: 'application/json',
            data: JSON.stringify({ isBanned }),
        });

        if (res.status !== 200) {
            showNotice('Failed to update block status');
        } else {
            showNotice('Block status updated successfully');
        }
    } catch (e) {
        console.log('Error:', e);
        showNotice('Failed to update block status');
    }
}
function showNotice(message, redirectToCart = false) {
    document.getElementById('noticeModalBody').innerText = message;
    var noticeModal = new bootstrap.Modal(document.getElementById('noticeModal'), {});
    noticeModal.show();

    // Adding a delay before redirect
    setTimeout(function() {
        if (redirectToCart) {
            window.location.href = '/cart'; // Redirect to the cart page after 1 second
        } else {
            noticeModal.hide();
        }
    }, 2000);
}
