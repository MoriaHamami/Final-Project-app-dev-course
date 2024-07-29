document.addEventListener('DOMContentLoaded', function () {
    let clientIdToDelete = null;

    const deleteButtons = document.querySelectorAll('.delete-acc-btn');
    const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'), {});
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const successModal = new bootstrap.Modal(document.getElementById('successModal'), {});
    const noticeModal = new bootstrap.Modal(document.getElementById('noticeModal'), {});

    // Handle delete button click
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            clientIdToDelete = this.getAttribute('data-client-id');
            confirmDeleteModal.show();
        });
    });

    // Handle confirm delete button click
    confirmDeleteButton.addEventListener('click', async function () {
        if (clientIdToDelete) {
            try {
                const res = await $.ajax({
                    url: '/clients/edit/' + clientIdToDelete,
                    method: 'DELETE',
                    contentType: 'application/json',
                    data: JSON.stringify({ id: clientIdToDelete }),
                });

                if (res.status !== 404) {
                    // Remove the row from the table
                    const row = document.querySelector(`button[data-client-id="${clientIdToDelete}"]`).closest('tr');
                    if (row) row.remove();
                    showNotice('Client removed successfully');
                } else {
                    showNotice('Client not found');
                }
                confirmDeleteModal.hide();
            } catch (e) {
                console.log('Error:', e);
                showNotice('Error deleting client');
            }
        }
    });

    // Reset the clientIdToDelete when the modal is hidden
    document.getElementById('confirmDeleteModal').addEventListener('hidden.bs.modal', function () {
        clientIdToDelete = null;
    });

    // Automatically close the success modal after a short delay
    $('#successModal').on('shown.bs.modal', function () {
        setTimeout(function () {
            $('#successModal').modal('hide');
        }, 3000); // Change this value to adjust the delay
    });

    // Handle search input
    $('#searchInput').on('input', function () {
        const searchValue = $(this).val().toLowerCase();
        $('#clientTableBody tr').filter(function () {
            $(this).toggle($(this).find('.client-username').text().toLowerCase().indexOf(searchValue) > -1);
        });
    });
});

$('.orders-btn').click(function () {
    const id = $(this).attr('id');
    getOrdersById(id);
});

async function getOrdersById(id) {
    $('.shopping-cart').html('<div class="container" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;"><img src="/styles/imgs/general/loader.webp" alt="loader" style="width:30%;"></div>');
    try {
        const orders = await $.ajax({
            url: `/clients/${id}`,
            method: 'GET',
            contentType: 'application/json',
        });
        // Create a long string that represents the HTML of products we want to be shown after we got the products from the DB 
        let str = '';
        if (orders?.length > 0) {
            for (let j = 0; j < orders.length; j++) {
                let order = orders[j];
                str += `   <h2>Items | ${order.length} </h2>
                            <span class="product-container">`;
                for (let i = 0; i < order.length; i++) {
                    const product = order[i].productInfo;
                    str += `<div class="product"> 
                        <img src="${getImgURL(order[i].imgs?.length ? order[i].imgs[0] : null, order[i].type)}" alt="Product Image" class="product-image">
                        <div class="product-info">
                        <span class="product-name"><b>${product.title}</b></span>
                        <span class="product-Size">Size: ${order[i].size} </span>
                        <span class="product-name&num"><b>Name and number</b></span>
                        <span class="product-playerName">Player Name : ${product.favePlayer} </span>
                        <hr>
                        <span class="product-Price">${product.price}$</span>
                        </div>
                        </div>`;
                }
                str += "</span>";
            }
        } else {
            str += `<div class="shopping-cart">
                        No purchases yet
                    </div>`;
        }
        $('.shopping-cart').html(str);
    } catch (e) {
        console.log('Error:', e);
        showNotice('Error fetching orders');
    }
}

function getImgURL(srcImg, folder) {
    if (!srcImg) return "";
    return srcImg?.includes('data:') ? srcImg : ('/styles/imgs/' + folder + '/' + srcImg);
}

async function onBlockClient(id, isBanned) {
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
    const noticeModal = new bootstrap.Modal(document.getElementById('noticeModal'), {});
    noticeModal.show();

    // Adding a delay before redirect
    setTimeout(function () {
        if (redirectToCart) {
            window.location.href = '/cart'; // Redirect to the cart page after 2 seconds
        } else {
            noticeModal.hide();
        }
    }, 2000);
}
