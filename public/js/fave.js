// $(document).ready(function() {
//     $('.fave-btn').click(function(e) {
//         e.preventDefault();
//         $('.shopping-fave').fadeIn();
//     });

//     $('.shopping-fave .close-btn').click(function() {
//         $('.shopping-fave').fadeOut();
//     });

//     $('.dark-screen').click(function() {
//         $('.shopping-fave').fadeOut();
//     });
// });

// async function removeItemFave(productId) {
//     try {
//         const response = await $.ajax({
//             url: '/fave/remove',
//             method: 'POST',
//             contentType: 'application/json',
//             data: JSON.stringify({
//                 productId: productId
//             })
//         });

//         showNotice('Product removed from favorites successfully.', '/current-url');
//     } catch (e) {
//         console.log('Error removing product from favorites:', e);
//         showNotice('Error removing product from favorites.');
//     }
// }
// function showNotice(message, redirectTo = false) {
//     document.getElementById('noticeModalBody').innerText = message;
//     var noticeModal = new bootstrap.Modal(document.getElementById('noticeModal'), {});
//     noticeModal.show();

//     // Adding a delay before redirect
//     setTimeout(function() {
//         if (redirectTo) {
//             window.location.href = redirectTo; // Redirect to the specified URL
//         } else {
//             noticeModal.hide();
//         }
//     }, 2000);
// }
