async function logout() {
    try {
        await $.ajax({
            url: '/login/logout',
            method: 'GET',
            contentType: 'application/json',
        })
    } catch (e) {
        console.log('e:', e)
    }
}