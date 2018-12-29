importScripts('https://www.gstatic.com/firebasejs/5.5.8/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/5.5.8/firebase-messaging.js')

firebase.initializeApp({
    projectId: "blogeek-2d353",
    messagingSenderId: "456767699485"
})

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(payload =>{
    const tituloNotificacion = 'Tenemos un nuevo post!'
    const opciones = {
        body: payload.data.titulo,
        icon: 'icons/icon_new_post.png',
        click_action: "https://blogeek-2d353.firebaseapp.com/"
    }

    return self.registration.showNotification(tituloNotificacion,opciones);

})



