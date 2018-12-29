$(() => {
  $('.tooltipped').tooltip({ delay: 50 })
  $('.modal').modal()

  // TODO: Adicionar el service worker
  navigator.serviceWorker.register('notificaciones-sw.js').then(registro=>{
    firebase.messaging().useServiceWorker(registro);
    console.log(`service worker registrado!`);
  }).catch(err=>{
    console.log(`Error en ServiceW: ${err}`);
  });

  // Init Firebase nuevamente
  firebase.initializeApp(config);

  // TODO: Registrar LLave publica de messaging
  const messaging = firebase.messaging();

  messaging.usePublicVapidKey('BNhQr0JmWkkoMd9CRhL0D6qUAPC_DqwZHOClVgeSa2w6WUjC3enGC7vH5-7xM7238Y1How3_RjjUabn83ZkFoBE');
  messaging.requestPermission().then(()=>{
    console.log(`Permiso aceptado para token`);
    return messaging.getToken();
  }).then(token=>{
    const db = firebase.firestore()
    db.settings({timestampsInSnapshots: true});
    db.collection('tokens').doc(token).set({
      token: token
    }).catch(err=>{
      console.log(`Error al insertar el token: ${err}`);
    })

  })

  messaging.onTokenRefresh(()=>{
    messaging.getToken().then(token=>{
      const db = firebase.firestore()
      console.log(`El token se ha actualizado.`)
      db.settings({timestampsInSnapshots: true});
      db.collection('tokens').doc(token).set({
      token: token
    }).catch(err=>{
      console.log(`Error al actualizar el token: ${err}`);
    })
    })
  })

  // TODO: Recibir las notificaciones cuando el usuario esta foreground
  messaging.onMessage(payload=>{
    Materialize.toast(`Tenemos un nuevo post, se llama ${payload.data.titulo}`, 6000)
  })

  // TODO: Recibir las notificaciones cuando el usuario esta background


  // TODO: Listening real time
  const post = new Post();
  post.consultarTodosPost();

  // TODO: Firebase observador del cambio de estado
  firebase.auth().onAuthStateChanged(user=>{
    if(user){
      $('#btnInicioSesion').text('Salir')
      if(user.photoURL){
        $('#avatar').attr('src', user.photoURL)
      } else {
        $('#avatar').attr('src', 'imagenes/usuario_auth.png')
      }
    } else {
      $('#btnInicioSesion').text('Iniciar Sesión');
      $('#avatar').attr('src', 'imagenes/usuario.png')
    }
  })

  // TODO: Evento boton inicio sesion
  $('#btnInicioSesion').click(() => {
    const user = firebase.auth().currentUser
    if(user){
      $('#btnInicioSesion').text('Iniciar Sesion');
      return firebase.auth().signOut().then(()=>{
        $('#avatar').attr('src', 'imagenes/usuario.png');
        Materialize.toast(`SignOut correctamente.`, 4000)
      }).catch(err =>{
        Materialize.toast(`Error al realizar SignOut => ${err}`, 4000)
      })
    }
    //
    // 
    

    $('#emailSesion').val('')
    $('#passwordSesion').val('')
    $('#modalSesion').modal('open')
  })

  $('#avatar').click(() => {
    firebase.auth().signOut().then(()=>{
      $('#avatar').attr('src', 'imagenes/usuario.png')
      Materialize.toast(`SignOut correcto`, 5000)
    }).catch(err=>{
      Materialize.toast(`Error al cerrar sesion, ${err}`, 4000)
    })
    
  })

  $('#btnTodoPost').click(() => {
    $('#tituloPost').text('Posts de la Comunidad') 
    const post = new Post();
    post.consultarTodosPost();  
  })

  $('#btnMisPost').click(() => {
    const user = firebase.auth().currentUser
    if(user){
      const post = new Post();
      post.consultarPostxUsuario(user.email)
      $('#tituloPost').text('Mis Posts')
    } else{
      Materialize.toast(`Debes estar autenticado para ver tus posts`, 4000)    
    }
  })
})
