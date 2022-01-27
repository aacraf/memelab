<script>
    import {fabric} from 'fabric';
    import { onMount } from 'svelte';
    import { Input, Button, Container, Row, Col, ListGroup, ListGroupItem, Image, Alert } from 'sveltestrap';

    import { user } from './userStore.js';

    let myUser;
    let canvas;
    var canv;
    let search = "";

    let memealert=false;
    user.subscribe(function(user) {
        myUser = user;
    });

    // Creating canvas 
    onMount(() => {
        canv = new fabric.Canvas(canvas, {backgroundColor : "#ccc"});
        //   canv.setBackgroundColor('#cccccc');
    });


    // Responsive canvas
    window.onresize = () => {
        
        const outerCanvasContainer = document.getElementById('outer-canv');

        const ratio          = canv.getWidth() / canv.getHeight();
        const containerWidth = outerCanvasContainer.clientWidth;
        const scale          = containerWidth / canv.getWidth();
        const zoom           = canv.getZoom() * scale;

        // if (containerWidth <= 400 && containerWidth/ratio <= 600)
        // {
        canv.setDimensions({width: containerWidth, height: containerWidth / ratio});
        canv.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
        // }
    }

    // Adding texto to the canvas
    const addText = () => {
        // Create a new Textbox instance
        var text = new fabric.Textbox('Text',
        {
            width: 450
        });
        // Render the Textbox on Canvas
        canv.add(text);
    }

    // Saving Image
    const saveImage = () => {
        // canv.deactivateAll().renderAll();
        var dataURL = canv.toDataURL({
            format: 'png',
            quality: 0.8
        });
    
        let data = {}
        data.image = dataURL;
        data.author = myUser;
        data.likes = 0;
        data.width = canv.getWidth();
        data.height = canv.getHeight();
        data.name = "prueba"
        data.creation_date = new Date();

        console.log(data);

        // document.getElementById("prueba").src = dataURL;        

        fetch('http://localhost:8000/api/memes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(response=>{
            memealert=true;
        })
    }

    // Downloading an Image
    const downloadImage = () => {

        var dataURL = canv.toDataURL({
            format: 'png',
            quality: 0.8
        });
        var link = document.createElement('a');
        link.href = dataURL;
        link.download = 'meme.png';
        link.click();
    }


    // paste an image
    function pasteImage(e) {

        var items=e.originalEvent.clipboardData.items;

        e.preventDefault();
        e.stopPropagation();

        //Loop through files
        for(var i=0;i<items.length;i++){
          if (items[i].type.indexOf('image')== -1) continue;
          var file = items[i],
              type = items[i].type;
          var imageData = file.getAsFile();
          var URLobj = window.URL || window.webkitURL;
          var img = new Image();
          img.src = URLobj.createObjectURL(imageData);
          fabric.Image.fromURL(img.src, function(img){
            canv.add(img);
          });
        }
    }

    // document.getElementById('fabric-canvas-wrapper').addEventListener('paste', pasteImage);
    // memes from imglip
    const fetchMemes = (async () => {
        const response = await fetch("https://api.imgflip.com/get_memes");
        return await response.json();
    })();


    // Event to upload an image to canvas
    const changeEvent = (e) => {
        var reader = new FileReader();
        reader.onload = function (event) {
            var imgObj = new Image();
            imgObj.src = event.target.result;
            imgObj.onload = function () {
                // start fabricJS stuff
                var image = new fabric.Image(imgObj);
                image.set({
                    left: 250,
                    top: 250,
                    angle: 20,
                    padding: 10,
                    cornersize: 10
                });
                //image.scale(getRandomNum(0.1, 0.25)).setCoords();
                canv.add(image);
                // end fabricJS stuff
            };
    }
    reader.readAsDataURL(e.target.files[0]);
  };


  // Add Image to canvas
  function addImage(meme){  
    canv.clear()     
    fabric.Image.fromURL(meme.url, (img) => {
        img.set({
            left: 300,
            top: 0
        });
        img.scaleToHeight(300);
        img.scaleToWidth(300);
        canv.add(img);
    }, { crossOrigin: 'Anonymous' })
  }
</script>
<Alert isOpen={memealert} color="success" dismissible >Meme created</Alert>
<Container class="mt-30">
    <Row>
        <Col id="outer-canv">
            <div id="fabric-canvas-wrapper" contenteditable='true'>
                <canvas bind:this={canvas} width="600" height="400" />
            </div>
        </Col>
        <Col md>

            <h6>Upload a file</h6>
            <Input 
                type="file"
                on:change={changeEvent}
                width="10%"
            />

            <h6>Or search for a meme</h6>

            
            {#await fetchMemes}
            ...getting top memes
            {:then memes}
                <Input 
                    type="text"
                    placeholder="Search for a meme"
                    width="10%"
                    bind:value={search}
                />
                <ListGroup>
                    {#each memes.data.memes.filter(elem => elem.name.includes(search)).slice(0,5) as meme}
                        <ListGroupItem on:click={()=>addImage(meme)} style="cursor:pointer;">
                            <p>{meme.name}</p>
                            <!-- <Image thumbnail alt={meme.name} src={meme.url}/> -->
                        </ListGroupItem>
                    {/each}
                </ListGroup>
            {:catch}
              Error: Couldn't get top memes...
            {/await}
        </Col>
    </Row>
    <Row>
        <div>
            <div class="tools">
                <Button outline dark
                    on:click={saveImage}
                >
                Create Meme
                </Button>
                <Button outline dark
                    on:click={downloadImage}
                >Download 
                </Button>
                <Button outline dark
                    on:click={addText}
                >Add Text
                </Button>
        
            </div>
        </div>
    </Row>
</Container>

