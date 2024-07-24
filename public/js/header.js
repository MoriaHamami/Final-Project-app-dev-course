function getCartPage() {
    window.location.assign('/cart')
}
async function getLoggedInUser() {
    try {
        // const user = {
        //     name: "lihideshe",
        //     isManager: true
        // }
        // TODO : Later add Tal client page func to get user and render in client page
        const user = await $.ajax({
            url: '/login/isLogged',
            method: 'GET',
            contentType: 'application/json',
        })
        if (!user) window.location.assign('/login')
        else if (user.isManager) window.location.assign('/manager')
        else window.location.assign('/client')

    } catch (error) {
        console.error('Error:', error)
    }
}