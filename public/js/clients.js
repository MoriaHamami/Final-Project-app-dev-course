// This script will run once the DOM is fully loaded
$(document).ready(function () {
    let clientIdToDelete = null;

    // Initialize modals
    const deleteButtons = $('.delete-acc-btn');
    const confirmDeleteModal = new bootstrap.Modal($('#confirmDeleteModal')[0], {});
    const confirmDeleteButton = $('#confirmDeleteButton');
    const successModal = new bootstrap.Modal($('#successModal')[0], {});
    const noticeModal = new bootstrap.Modal($('#noticeModal')[0], {});

    // Handle delete button click
    deleteButtons.on('click', function () {
        clientIdToDelete = $(this).data('client-id');
        confirmDeleteModal.show();
    });

    // Handle confirm delete button click
    confirmDeleteButton.on('click', async function () {
        if (clientIdToDelete) {
            try {
                const res = await $.ajax({
                    url: '/clients/edit/' + clientIdToDelete,
                    method: 'DELETE',
                    contentType: 'application/json',
                    data: JSON.stringify({ id: clientIdToDelete }),
                });

                if (res.status !== 404) {
                    // Remove the row from the table if client was deleted
                    const row = $(`button[data-client-id="${clientIdToDelete}"]`).closest('tr');
                    if (row) row.remove();
                    showNotice('Client removed successfully');
                } else {
                    showNotice('Client not found');
                }
                confirmDeleteModal.hide();
            } catch (e) {
                showNotice('Error deleting client');
            }
        }
    });

    // Reset the clientIdToDelete when the modal is hidden
    $('#confirmDeleteModal').on('hidden.bs.modal', function () {
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

// Handle orders button click
$('.orders-btn').click(function () {
    const id = $(this).attr('id');
    getOrdersById(id);
});

// display orders by client ID
async function getOrdersById(id) {
    // Show loading indicator
    $('.shopping-cart').html('<div class="container" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;"><img src="/styles/imgs/general/loader.webp" alt="loader" style="width:30%;"></div>');
    try {
        const orders = await $.ajax({
            url: `/clients/${id}`,
            method: 'GET',
            contentType: 'application/json',
        });

        let str = '';
        if (orders?.length > 0) {
            for (let j = 0; j < orders.length; j++) {
                let order = orders[j];
                str += `<h2>Items | ${order.length} </h2>
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
        showNotice('Error fetching orders');
    }
}

// Get the image URL 
function getImgURL(srcImg, folder) {
    if (!srcImg) return "";
    return srcImg?.includes('data:') ? srcImg : ('/styles/imgs/' + folder + '/' + srcImg);
}

// Block or unblock a client by ID
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
        showNotice('Failed to update block status');
    }
}

// notice a message and optionally redirect to the cart
function showNotice(message, redirectToCart = false) {
    $('#noticeModalBody').text(message);
    const noticeModal = new bootstrap.Modal($('#noticeModal')[0], {});
    noticeModal.show();

    setTimeout(function () {
        if (redirectToCart) {
            window.location.href = '/cart'; // Redirect to the cart page after 2 seconds
        } else {
            noticeModal.hide();
        }
    }, 2000);
}
