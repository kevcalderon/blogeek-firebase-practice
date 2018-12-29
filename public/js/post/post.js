class Post {
  
  constructor () {
      // TODO inicializar firestore y settings
      this.db = firebase.firestore();
      const settings = {
          timestampsInSnapshots: true
          //todos los atributos o valores que estan almacenados, los recupere como timestamp
      }
      this.db.settings(settings);

  }

  crearPost (uid, emailUser, titulo, descripcion, imagenLink, videoLink) {
    return this.db.collection('post').add({
        uid: uid,
        autor: emailUser,
        titulo: titulo,
        descripcion: descripcion,
        imagenLink: imagenLink,
        videoLink, videoLink,
        //obtiene fecha y hora del servidor.
        fecha: firebase.firestore.FieldValue.serverTimestamp()
    }).then(refDoc =>{
        console.log(`id del post: ${refDoc.id}`);
    }).catch(err=>{
        console.log(`Error al crear el post: ${err}`);
    })
  }

  consultarTodosPost () {
      //onSnapshot, va notificando a la base de datos todo cambio.
    this.db.collection('post').orderBy('fecha', 'desc').orderBy('titulo', 'asc').onSnapshot(querySnapshot => {
      $('#posts').empty()
      if (querySnapshot.empty) {
        $('#posts').append(this.obtenerTemplatePostVacio())
      } else {
        querySnapshot.forEach(post => {
          let postHtml = this.obtenerPostTemplate(
            post.data().autor,
            post.data().titulo,
            post.data().descripcion,
            post.data().videoLink,
            post.data().imagenLink,
            Utilidad.obtenerFecha(post.data().fecha.toDate())
          )
          $('#posts').append(postHtml)
        })
      }
    })
  }

  consultarPostxUsuario (emailUser) {
    this.db.collection('post').orderBy('fecha', 'desc').where('autor', '==', emailUser).onSnapshot(querySnapshot => {
        $('#posts').empty()
        if (querySnapshot.empty) {
          $('#posts').append(this.obtenerTemplatePostVacio())
        } else {
          querySnapshot.forEach(post => {
            let postHtml = this.obtenerPostTemplate(
              post.data().autor,
              post.data().titulo,
              post.data().descripcion,
              post.data().videoLink,
              post.data().imagenLink,
              Utilidad.obtenerFecha(post.data().fecha.toDate())
            )
            $('#posts').append(postHtml)
          })
        }
      })
  }

  subirImagenPost(file, uid){
      const refStorage = firebase.storage().ref(`imgsPosts/${uid}/${file.name}`);
      const task = refStorage.put(file)

      task.on('state_changed', snapshot=>{
          const porcentaje = snapshot.bytesTransferred / snapshot.totalBytes * 100;
          $('determinate').attr('style', `width: ${porcentaje}`);
      },
      //siempre como parametro la funcion si hay error.
      err =>{
          Materialize.toast(`Error subiendo archivo: ${err.message}`);
      },
      //y como parametro cuando se sube el archivo correctamente.
      ()=>{
          task.snapshot.ref.getDownloadURL().then(downloadURL=>{
              sessionStorage.setItem('imgNewPost', downloadURL);
              console.log(`Archivo disponible en: ${downloadURL}`);
          }).catch(err =>{
              Materialize.toast(`Error obteniendo url ${err}`, 4000)
          })
      }
      )
  }

  obtenerTemplatePostVacio () {
    return `<article class="post">
      <div class="post-titulo">
          <h5>Crea el primer Post a la comunidad</h5>
      </div>
      <div class="post-calificacion">
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-llena" href="*"></a>
          <a class="post-estrellita-vacia" href="*"></a>
      </div>
      <div class="post-video">
          <iframe type="text/html" width="500" height="385" src='https://www.youtube.com/embed/bTSWzddyL7E?ecver=2'
          frameborder="0" ></iframe>
          </figure>
         
      </div>
      <div class="post-videolink">
          Video
      </div>
      <div class="post-descripcion">
          <p>Crea el primer Post a la comunidad</p>
      </div>
      <div class="post-footer container">         
      </div>
  </article>`
  }
  
  obtenerPostTemplate (
    autor,
    descripcion,
    titulo,
    videoLink,
    imagenLink,
    fecha
  ) {
    if (imagenLink) {
       
      return `<article class="post">
            <div class="post-titulo">
                <h5>${titulo}</h5>
            </div>
            <div class="post-calificacion">
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-llena" href="*"></a>
                <a class="post-estrellita-vacia" href="*"></a>
            </div>
            <div class="post-video">                
                <img id="imgVideo" src='${imagenLink}' class="post-imagen-video" 
                    alt="Imagen Video">     
            </div>
            <div class="post-videolink">
                <a href="${YouTubeUrlNormalize(videoLink)}" target="blank">Ver Video</a>                            
            </div>
            <div class="post-descripcion">
                <p>${descripcion}</p>
            </div>
            <div class="post-footer container">
                <div class="row">
                    <div class="col m6">
                        Fecha: ${fecha}
                    </div>
                    <div class="col m6">
                        Autor: ${autor}
                    </div>        
                </div>
            </div>
        </article>`
    }

    return `<article class="post">
                <div class="post-titulo">
                    <h5>${titulo}</h5>
                </div>
                <div class="post-calificacion">
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-llena" href="*"></a>
                    <a class="post-estrellita-vacia" href="*"></a>
                </div>
                <div class="post-video">
                    <iframe type="text/html" width="500" height="385" src='${YouTubeUrlNormalize(videoLink)}'
                        frameborder="0"></iframe>
                    </figure>
                </div>
                <div class="post-videolink">
                    Video
                </div>
                <div class="post-descripcion">
                    <p>${descripcion}</p>
                </div>
                <div class="post-footer container">
                    <div class="row">
                        <div class="col m6">
                            Fecha: ${fecha}
                        </div>
                        <div class="col m6">
                            Autor: ${autor}
                        </div>        
                    </div>
                </div>
            </article>`
  }
}

//so that the YouTube link works correctly!.
var getVidId = function(url)
{
    var vidId;
    if(url.indexOf("youtube.com/watch?v=") !== -1)//https://m.youtube.com/watch?v=e3S9KINoH2M
    {
        vidId = url.substr(url.indexOf("youtube.com/watch?v=") + 20);
    }
    else if(url.indexOf("youtube.com/watch/?v=") !== -1)//https://m.youtube.com/watch/?v=e3S9KINoH2M
    {
        vidId = url.substr(url.indexOf("youtube.com/watch/?v=") + 21);
    }
    else if(url.indexOf("youtu.be") !== -1)
    {
        vidId = url.substr(url.indexOf("youtu.be") + 9);
    }
    else if(url.indexOf("www.youtube.com/embed/") !== -1)
    {
        vidId = url.substr(url.indexOf("www.youtube.com/embed/") + 22);
    }
    else if(url.indexOf("?v=") !== -1)// http://m.youtube.com/?v=tbBTNCfe1Bc
    {
        vidId = url.substr(url.indexOf("?v=")+3, 11);
    }
    else
    {
        console.warn("YouTubeUrlNormalize getVidId not a youTube Video: "+url);
        vidId = null;
    }

    if(vidId.indexOf("&") !== -1)
    {
        vidId = vidId.substr(0, vidId.indexOf("&") );
    }
    return vidId;
};

var YouTubeUrlNormalize = function(url)
{
    var rtn = url;
    if(url)
    {
        var vidId = getVidId(url);
        if(vidId)
        {
            rtn = "https://www.youtube.com/embed/"+vidId;
        }
        else
        {
            rtn = url;
        }
    }

    return rtn;
};

YouTubeUrlNormalize.getThumbnail = function(url, num)
{
    var rtn, vidId = getVidId(url);
    if(vidId)
    {
        if(!isNaN(num) && num <= 4 && num >= 0)
        {
            rtn = "http://img.youtube.com/vi/"+vidId+"/"+num+".jpg";
        }
        else
        {
            rtn = "http://img.youtube.com/vi/"+getVidId(url)+"/default.jpg";
        }
    }
    else
    {
        return null;
    }
    return rtn;
};

YouTubeUrlNormalize.getFullImage = function(url)
{
    var vidId = getVidId(url);
    if(vidId)
    {
        return "http://img.youtube.com/vi/"+vidId+"/0.jpg";
    }
    else
    {
        return null;
    }
};

if ( typeof exports !== "undefined" ) {
    module.exports = YouTubeUrlNormalize;
}
else if ( typeof define === "function" ) {
    define( function () {
        return YouTubeUrlNormalize;
    } );
}
else {
    window.YouTubeUrlNormalize = YouTubeUrlNormalize;
}

