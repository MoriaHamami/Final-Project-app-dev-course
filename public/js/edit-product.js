const initGlobals = () => {
    return {
        title: $('#title').val() || '',
        color: $('#color').val() || '',
        favePlayer: $('#favePlayer').val() || '',
        cat: $('.edit-cat select').val() || '',
        price: parseFloat($('#price').val()) || 0,
        sizes: [],
        srcImgs: [],
        numOfImgs: $('.edit-product .edit-imgs li').length || 0,
        numOfSizes: $('.edit-product .edit-sizes li').length || 0
    };
};

const updateGlobalState = (state, key, value) => {
    state[key] = value;
};

const addToSrcImgs = (state, imgSrc) => {
    if (imgSrc.includes('data:')) {
        state.srcImgs.push(imgSrc);
    } else {
        const fileName = imgSrc.split('/').pop();
        state.srcImgs.push(fileName);
    }
};

const updateImgsSrc = (state) => {
    state.srcImgs = []; // Clear the srcImgs array before updating
    $('.edit-product .edit-imgs li img').each((_, { src }) => addToSrcImgs(state, src));
};

const handleFileInput = (state, input) => {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        reader.onload = e => {
            const imgSrc = e.target.result;
            const id = state.numOfImgs;
            const newImgHTML = `
                <li id="${id}">
                    <img src="${imgSrc}" class="srcImg-${id} img-thumbnail">
                    <input type="file" accept="image/*" name="srcImg" id="${id}" class="form-control mt-2">
                    <button type="button" id="${id}" class="btn btn-danger btn-sm mt-2 deleteImg">DELETE</button>
                </li>`;
            $('.edit-product .edit-imgs ul').append(newImgHTML);
            state.numOfImgs++;
        };
    }
};

const handleImageChange = async (input, state) => {
    try {
        const imgSrc = await readChangedURL(input);
        addToSrcImgs(state, imgSrc);
    } catch (e) {
        console.error('Image change error:', e);
    }
};

const deleteImg = (state, id) => {
    state.numOfImgs--;
    $(`.edit-product .edit-imgs li#${id}`).remove();
    updateImgsSrc(state); // Update srcImgs after deletion
};

const readChangedURL = (input) => {
    if (input.files && input.files[0]) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(input.files[0]);
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
        });
    }
};

const handleSizeAddition = (state) => {
    const newSizeHTML = `
        <li id="${state.numOfSizes}" class="d-flex align-items-center mb-2">
            <input value="" name="sizes" class="form-control me-2">
            <button type="button" class="btn btn-danger btn-sm"><i class="bi bi-trash"></i></button>
        </li>`;
    $('.edit-product .edit-sizes ul').append(newSizeHTML);
    state.numOfSizes++;
    updateSizes(state);
};

const updateSizes = (state) => {
    state.sizes = $('.edit-product .edit-sizes li input').map((_, input) => $(input).val()).get();
};

const handleSizeChange = (state, newSize, id) => {
    $(`.edit-product .edit-sizes li#${id} input`).val(newSize);
    updateSizes(state);
};

const handleSizeDeletion = (state, id) => {
    state.numOfSizes--;
    $(`.edit-product .edit-sizes li#${id}`).remove();
    updateSizes(state);
};

const handleProductFormSubmit = async (event, state, url, method) => {
    event.preventDefault();
    updateImgsSrc(state);
    updateSizes(state);
    try {
        const response = await $.ajax({
            url,
            method,
            contentType: 'application/json',
            data: JSON.stringify(state)
        });
        window.location.assign(`/products/product/${response._id}`);
    } catch (e) {
        console.error('Form submission error:', e);
    }
};

const showNotification = (message, type = 'success') => {
    const notification = $('#notification');
    notification.removeClass('d-none').addClass(`alert-${type}`).text(message);
    setTimeout(() => {
        notification.addClass('d-none').removeClass(`alert-${type}`).text('');
    }, 3000);
};

const onUpdateProduct = async (event) => {
    event.preventDefault();
    const state = initGlobals();
    updateImgsSrc(state);
    updateSizes(state);
    const productId = $('#updateButton').val();

    try {
        await $.ajax({
            url: `/products/edit/${productId}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(state)
        });
        showNotification('Product updated successfully!');
        setTimeout(() => {
            window.location.assign(`/products/product/${productId}`);
        }, 1500);
    } catch (e) {
        console.error('Update product error:', e);
        showNotification('Failed to update product.', 'danger');
    }
};

const onDeleteProduct = async (id) => {
    try {
        await $.ajax({
            url: `/products/edit/${id}`,
            method: 'DELETE',
            contentType: 'application/json'
        });
        showNotification('Product deleted successfully!');
        setTimeout(() => {
            window.location.assign('/products');
        }, 1500);
    } catch (e) {
        console.error('Delete product error:', e);
        showNotification('Failed to delete product.', 'danger');
    }
};

const initializeEventListeners = (state) => {
    $(document).on('change', 'input[type="file"]', function () {
        handleFileInput(state, this);
    });

    $(document).on('change', '.edit-product .edit-sizes input', function () {
        handleSizeChange(state, $(this).val(), $(this).closest('li').attr('id'));
    });

    $(document).on('click', '.deleteImg', function () {
        deleteImg(state, $(this).attr('id'));
    });

    $(document).on('click', '.btn-danger.btn-sm', function () {
        handleSizeDeletion(state, $(this).closest('li').attr('id'));
    });

    $(document).on('click', '#updateButton', function (event) {
        onUpdateProduct(event);
    });

    $(document).on('click', '#deleteButton', function () {
        const productId = $(this).val();
        onDeleteProduct(productId);
    });
};

const state = initGlobals();
initializeEventListeners(state);
