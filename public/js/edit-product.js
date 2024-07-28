// Function to initialize global variables
const initGlobals = () => {
    return {
        title: '',
        color: '',
        favePlayer: '',
        cat: '',
        price: 0,
        sizes: [],
        srcImgs: [],
        numOfImgs: $('.edit-product .edit-imgs li').length || 0,
        numOfSizes: $('.edit-product .edit-sizes li').length || 0
    };
};

// Update global state functions
const updateGlobalState = (state, key, value) => {
    state[key] = value;
};

// Add or update image source
const addToSrcImgs = (state, imgSrc) => {
    if (imgSrc.includes('data:')) {
        state.srcImgs.push(imgSrc);
    } else {
        const fileName = imgSrc.split('/').pop();
        state.srcImgs.push(fileName);
    }
};

// Update image sources from DOM
const updateImgsSrc = (state) => {
    $('.edit-product .edit-imgs li img').each((_, { src }) => addToSrcImgs(state, src));
};

// Handle file input change
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
            const container = state.numOfImgs > 0 ? '.edit-product .edit-imgs li:last-child' : '.edit-product .edit-imgs ul';
            $(container).after(newImgHTML);
            state.numOfImgs++;
        };
    }
};

// Handle image change
const handleImageChange = async (input, state) => {
    try {
        const imgSrc = await readChangedURL(input);
        addToSrcImgs(state, imgSrc);
    } catch (e) {
        console.error('Image change error:', e);
    }
};

// Delete image
const deleteImg = (state, id) => {
    state.numOfImgs--;
    $(`.edit-product .edit-imgs li#${id}`).remove();
};

// Read changed URL
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

// Handle size addition
const handleSizeAddition = (state) => {
    const newSizeHTML = `
        <li id="${state.numOfSizes}" class="d-flex align-items-center mb-2">
            <input value="" name="sizes" class="form-control me-2">
            <button type="button" class="btn btn-danger btn-sm"><i class="bi bi-trash"></i></button>
        </li>`;
    const container = state.numOfSizes > 0 ? '.edit-product .edit-sizes ul' : '.edit-product .edit-sizes ul';
    $(container).append(newSizeHTML);
    state.numOfSizes++;
    updateSizes(state);
};

// Update sizes
const updateSizes = (state) => {
    state.sizes = $('.edit-product .edit-sizes li input').map((_, input) => $(input).val()).get();
};

// Handle size change
const handleSizeChange = (state, newSize, id) => {
    $(`.edit-product .edit-sizes li#${id} input`).val(newSize);
    updateSizes(state);
};

// Handle size deletion
const handleSizeDeletion = (state, id) => {
    state.numOfSizes--;
    $(`.edit-product .edit-sizes li#${id}`).remove();
    updateSizes(state);
};

// Form submission functions
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

// Add event listeners
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
};

// Initialize
const state = initGlobals();
initializeEventListeners(state);
