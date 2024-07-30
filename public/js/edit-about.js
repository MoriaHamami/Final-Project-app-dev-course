// Global variable to help us keep track of input changes
let gShops = []
// Initialize the amount of shops according to the DOM
let gNumOfShops = $('.edit-about .edit-shops li').length || 0
let nextAvailableId = gNumOfShops+1
const fieldsPerShop = 4

function onAddShop() {
    if (gNumOfShops != 0) {
        // If there are other shops, add shop input section in DOM after the last input
        const elFirstShop = $('.edit-about .edit-shops li:first-child')
        elFirstShop.before(
            `<li id=${nextAvailableId}>
                    <input value="" placeholder="Type location name" name="shops">
                    <input value="" placeholder="Type location address" name="shops">
                    <input value="" placeholder="Type location latitude" name="shops">
                    <input value="" placeholder="Type location longitude" name="shops">
                    <button type="button" onclick="onDeleteShop(${nextAvailableId})">
                      <i class="bi bi-trash"></i> Remove
                    </button>
            </li>`
        )
    } else {
        // If there are no shops, add the shop in DOM inside ul
        $('.edit-about .edit-shops ul').append(
            `               
                <li id="0">
                    <input value="" placeholder="Type location name" name="shops">
                    <input value="" placeholder="Type location address" name="shops">
                    <input value="" placeholder="Type location latitude" name="shops">
                    <input value="" placeholder="Type location longitude" name="shops">
                    <button type="button" onclick="onDeleteShop(0)"><i class="bi bi-trash"></i> Remove
                    </button>
                </li>`
        )
    }
    // Update local var
    ++gNumOfShops
    ++nextAvailableId
}
function updateShops() {
    let i = 0
    let idx = 0
    // Get all the shops in DOM
    const inputs = $('.edit-about .edit-shops li input')
    // console.log('inputs:', inputs)
    if (!inputs) return gShops = []
    // extract values and add to gShops var
    else inputs.map((_, { value }) => {
        // Check if each input was the first in its block or second and so on
        switch (i % fieldsPerShop) {
            case 0:
                value ? gShops[idx] = { name: value } : gShops[idx] = { name: "" }
                break
            case 1:
                value ? gShops[idx].address = value : gShops[idx].address = ""
                break
            case 2:
                value ? gShops[idx].lat = value : gShops[idx].lat = ""
                break
            case 3:
                // If the input was the last in its block, go on to next shop afterwards (idx++)
                value ? gShops[idx++].long = value : gShops[idx++].long = ""
                break
        }
        i++
        
    })
}
function onDeleteShop(id) {
    // Update local var
    gNumOfShops--
    // Remove from DOM the shop selected to be deleted
    $(`.edit-about .edit-shops li#${id}`).remove()
   
}

async function onUpdateShops() {

    updateShops()
    try {
        // Send a post request using ajax, and send on the body the data from the form
        await $.ajax({
            url: '/about/edit',
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                shops: gShops
            }),
        })
        console.log('done:')
        // Leave edit mode and show the about page 
        window.location.assign('/about')
    } catch (e) {
        console.log('Could not save shops from frontend:', e)
        // TODO: Later show an error modal
    }
}
