<script>
    import {fabric} from 'fabric';
    import { onMount } from 'svelte';
    import { Input, Button } from 'sveltestrap';

    let canvas;
    var canv;

    // Creating canvas 
    onMount(() => {
        canv = new fabric.Canvas(canvas, {backgroundColor : "#ccc"});
        //   canv.setBackgroundColor('#cccccc');
    });


    // Responsive canvas
    window.onresize = () => {
        console.log("resize");
        const outerCanvasContainer = document.getElementById('fabric-canvas-wrapper');

        const ratio          = canv.getWidth() / canv.getHeight();
        const containerWidth = outerCanvasContainer.clientWidth;
        const scale          = containerWidth / canv.getWidth();
        const zoom           = canv.getZoom() * scale;

        canv.setDimensions({width: containerWidth, height: containerWidth / ratio});
        canv.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
    }

    // Adding texto to the canvas
    const addText = () => {
        // Create a new Textbox instance
        var text = new fabric.Textbox('TEST',
        {
            width: 450
        });
        // Render the Textbox on Canvas
        canv.add(text);
    }

    // Downloading an Image
    const downloadImage = () => {
        // canv.deactivateAll().renderAll();
        // canv.setBackgroundColor('#cccccc');
        // canv.renderAll();
        // canv.toBlob((blob) => {
        //     saveAs(blob, 'my-image.png');
        // });

        var dataURL = canv.toDataURL({
            format: 'png',
            quality: 0.8
        });
        var link = document.createElement('a');
        link.href = dataURL;
        link.download = 'meme.png';
        link.click();
    }

    // paste and image
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

</script>

<div>
    <div id="fabric-canvas-wrapper" contenteditable='true'>
        <canvas bind:this={canvas} width="600" height="400" />
    </div>
    <div class="tools">
        <Input 
            type="file"
            on:change={changeEvent}
            width="10%"
        />
        <Button
            on:click={downloadImage}
        >Guardar
        </Button>
        <Button
            on:click={addText}
        >Añadir Texto
        </Button>

    </div>
</div>
