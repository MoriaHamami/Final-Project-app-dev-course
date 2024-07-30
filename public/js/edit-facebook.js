let gTxt = '';
let gImgSrc = '';

$('.file-btn').click(function () {
    $(".file-input").trigger('click');
})

function onChangeTxt(newTxt) {
    gTxt = newTxt;
}

// שינוי תמונה
async function onChangeImg(event) {
    try {
        // console.log('event.target:', event.target)
        const imgSrc = await readChangedURL(event.target)
        updategSrcImg(imgSrc)
    } catch (e) {
        console.log('Error:', e);
    }
}

// הוספת כתובת מקור של תמונה ל-gImgSrc
function updategSrcImg(imgSrc) {
    if (!imgSrc) {
        const imgElement = document.querySelector(`.edit-facebook li img`)
        imgElement.src = '/styles/imgs/facebook/placeholder.png';
        const fileInputElement = document.querySelector(`.edit-facebook input[type="file"]`)
        fileInputElement.value = '';
        return
    }
    gImgSrc = imgSrc
    // console.log('gImgSrc.entries():', gImgSrc.entries())
    // console.log('gImgSrc:', gImgSrc)
    // gImgSrc = imgSrc.includes('data:') ? imgSrc : imgSrc.substring(imgSrc.lastIndexOf('/') + 1)
    // const imgElement = document.querySelector(`.edit-facebook li img`)
    // TODO: SHOW IN INPUT
    // imgElement.src = gImgSrc

    // urltoFile(gImgSrc,"test" , '.png').then((file)=>{
    //     gImgSrc= file
    //     console.log('gImgsrc:', file)
    // })

}

//return a promise that resolves with a File instance
// function urltoFile(url, filename, mimeType){
//     mimeType = mimeType || (url.match(/^data:([^;]+);/)||'')[1];
//     return (fetch(url)
//         .then(function(res){return res.arrayBuffer();})
//         .then(function(buf){return new File([buf], filename, {type:mimeType});})
//     );
// }

// מחיקת תמונה
function onDeleteImg() {
    const imgElement = document.querySelector(`#image-preview`);
    const fileInputElement = document.querySelector(`input[type="file"][name="imgSrc"]`);
    if (imgElement) {
        imgElement.src = '/styles/imgs/facebook/placeholder.png';
    }

    if (fileInputElement) {
        fileInputElement.value = '';
    }
    gImgSrc = "";
}

async function readChangedURL(input) {
    console.log('input.files:', input.files)
    if (input.files && input.files[0]) {
        return new Promise((res, rej) => {
            let reader = new FileReader();
            reader.readAsDataURL(input.files[0]);
            reader.onload = function (e) {
                const imgUrl = e.target.result;
                document.querySelector(`.edit-facebook .srcImg-1`).src = imgUrl;
                // input.src = imgUrl;
                // res(imgUrl);
                const formData = new FormData();
                // Add data to the FormData object
                // formData.append('name', 'John Doe');
                // formData.append('email', 'johndoe@example.com');
                // here we add the file that we went to send it.
                // return to part one to understad better 
                formData.append('source', input.files[0]);
                console.log('formData:', formData)
                // formData.append('source', input.files[0]);
                res(formData)
            }
        });
    }
}


async function facebookPost(ev) {

    ev.preventDefault()
    // if (gImgSrc == "/styles/imgs/facebook/placeholder.png") gImgSrc = ""

    // console.log('gImgSrc:', gImgSrc)
    try {
        const newArticle = await $.ajax({
            url: '/manager/edit-facebook',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                // genre: gGenre,
                txt: gTxt,
                imgSrc: gImgSrc
                // date: gDate
            }),
        })
        if (newArticle?.id) {
            window.open("https://www.facebook.com/profile.php?id=61559829412060&locale=he_IL", '_blank')
            // Leave edit mode and show the manager page 
        window.location.assign('/manager')
        } else{
            console.log("Failed in DB", newArticle)
        }
    } catch (e) {
        console.log('Error:', e);
    }
}

