/* global currentUser, google, EXIF */

"use strict";

var TIV2880 = function () {
    var loadedImages = [];
    var markers = {};
    var map_initialized = false;
    var old_map_index = 0;
    var map = null;
    var exifData = {};
    var self;

    function getExif() {
        EXIF.getData(this, function () {
            this.getAttribute("index");
            exifData[this.getAttribute("index")] = EXIF.getAllTags(this);
        });
    }

    function exinfo(index) {
        var wrapper = document.createElement("span");
        if (Object.keys(exifData[index]).length === 0) return null;
        Object.keys(exifData[index]).forEach(function (key) {
            var details = document.createElement("details");
            var summary = document.createElement("summary");
            summary.innerText = key.toString();
            var pre = document.createElement("p");
            pre.innerText = exifData[index][key].toString();
            details.insertBefore(summary, null);
            details.insertBefore(pre, null);
            wrapper.insertBefore(details, null);
        });
        return wrapper;
    }

    function convertDMStoDD(degrees, minutes, seconds, direction) {
        var dd = Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60);

        if (direction === "S" || direction === "W") {
            dd = dd * -1;
        }

        return dd;
    }
    
    function showUserImage () {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'GetImageCollection?user='+currentUser+'&number=5');
        xhr.onload = function(){
            if(xhr.readyState === 4 && xhr.status === 200){
                console.log(xhr.responseText);
                var ids = JSON.parse(xhr.responseText);
                document.getElementById('main').innerText = ids;
                console.log(ids);
                var i;
                for(i=0; i<ids.length; i++){
                    (function (i){
                        var id = ids[i];
                        var xhr2 = new XMLHttpRequest();
                        xhr2.open('GET', 'GetImage?id='+id+'&metadata=false');
                        xhr2.responseType = "blob";
                        xhr2.onload = function (){
                            if(xhr2.readyState === 4 && xhr2.status === 200){
                                var blob = xhr2.response;
                                var reader = new FileReader();
                                reader.readAsDataURL(blob);
                                reader.onload = function(){
                                    var base64data = reader.result;
        //                            console.log(base64data);
    //                                console.log(blob);
                                };
                            }else{
                                alert('Request failed. Returned Status of: ' + xhr2.status);
                            }
                        };

                        xhr2.send();

    //                    var xhr3 = new XMLHttpRequest();
    //                    xhr3.open('GET', 'GetImage?id='+id+'&metadata=true');
    //                    xhr3.onload = function(){
    //                        if(xhr3.readyState === 4 && xhr3.status === 200){
    ////                            console.log(xhr3.responseText);
    //                        }else{
    //                            alert('Request failed. Returned Status of: ' + xhr3.status);
    //                        }
    //                    };
    //                    xhr3.send();
                    })(i);
                }
            }else{
                alert('Request failed. Returned Status of: ' + xhr.status);
            }
        };
        xhr.send();
    }

    return {
        initializeView: function(elem) {
//            var imageViewer = document.createElement('div');
//            imageViewer.setAttribute('class', 'main');
//            imageViewer.id = 'imageViewer';

            var modal = document.createElement('div');
            modal.setAttribute('class', 'modal');
            modal.id = 'modal';

            var modal_content = document.createElement('div');
            modal_content.setAttribute('class', 'modal-content');
            modal_content.id = 'modal-content';

            var modal_image = document.createElement('div');
            modal_image.setAttribute('class', 'modal-image');
            modal_image.id = 'modal-image';

            var modal_info = document.createElement('div');
            modal_info.setAttribute('class', 'modal-info');
            modal_info.id = 'modal-info';

            var exif_info = document.createElement('div');
            exif_info.id = 'exif-info';

            var map_div = document.createElement('div');
            map_div.id = 'map';
            document.getElementById('main').innerHTML = '';

            var viewSelector = document.createElement('select');
            viewSelector.name = 'viewSelector';
            viewSelector.id = 'viewSelector';
            viewSelector.setAttribute('onchange','tiv.changeView.call(tiv,this.value);');
            var op1 = document.createElement('option');
            op1.text = 'Image & URL';
            op1.value = 1;
            var op2 = document.createElement('option');
            op2.text = 'Image, URL, EXIF';
            op2.value = 2;
            var op3 = document.createElement('option');
            op3.text = 'Image, URL, EXIF, Map';
            op3.value = 3;

            viewSelector.options.add(op1, 1);
            viewSelector.options.add(op2, 2);
            viewSelector.options.add(op3, 3);
    
            modal_info.appendChild(exif_info);
            modal_info.appendChild(map_div);

            modal_content.appendChild(modal_image);
            modal_content.appendChild(modal_info);

            modal.appendChild(modal_content);
            
            elem.appendChild(viewSelector);
//            elem.appendChild(imageViewer);
            elem.appendChild(modal);
        },
        
        clearImages: function() {
            loadedImages = [];
            markers = {};
            exifData = {};
        },
        
        //noinspection JSUnusedGlobalSymbols
        getLoadedImages: function () {
            return loadedImages;
        },

        changeView : function(viewType){
            var self = this;
            var images = document.getElementsByClassName("thumb");
            var i;
            for (i=0; i<images.length; i+=1){
                switch (parseInt(viewType)) {
                    case 1:
                        images[i].onclick = (function(img){
                            return function() {
                                self.showImage(img.getAttribute("index"), document.getElementById("modal"));
                            };
                        })(images[i]);
                        break;
                    case 2:
                        images[i].onclick = (function(img){
                            return function() {
                                self.showImageDetailedExifInfo(img.getAttribute("index"), document.getElementById("modal"));
                            };
                        })(images[i]);
                        break;
                    case 3:
                        images[i].onclick = (function(img){
                            return function() {
                                self.showImageDetailedExifWithMap(img.getAttribute("index"), document.getElementById("modal"));
                            };
                        })(images[i]);
                        break;
                }
            }
        },
        
        showUploadImages: function (){
            var uploadViewer = document.createElement('div');
            uploadViewer.setAttribute('class', 'main');
            uploadViewer.id = 'uploadViewer';
            
            var imageViewer = document.createElement('div');
            imageViewer.setAttribute('class', 'main');
            imageViewer.id = 'imageViewer';

            uploadViewer.appendChild(imageViewer);

            var modal = document.createElement('div');
            modal.setAttribute('class', 'modal');
            modal.id = 'modal';

            var modal_content = document.createElement('div');
            modal_content.setAttribute('class', 'modal-content');
            modal_content.id = 'modal-content';

            var modal_image = document.createElement('div');
            modal_image.setAttribute('class', 'modal-image');
            modal_image.id = 'modal-image';

            var modal_info = document.createElement('div');
            modal_info.setAttribute('class', 'modal-info');
            modal_info.id = 'modal-info';

            var exif_info = document.createElement('div');
            exif_info.id = 'exif-info';

            var map_div = document.createElement('div');
            map_div.id = 'map';
            document.getElementById('main').innerHTML = '';

            var selectDirectory = document.createElement('input');
            selectDirectory.id = 'imagesCollection';
            selectDirectory.type = 'file';
        //    selectDirectory.setAttribute('webkitdirectory', '');
        //    selectDirectory.setAttribute('mozdirectory', '');
        //    selectDirectory.setAttribute('directory', '');
            selectDirectory.setAttribute('name', 'myFiles');
            selectDirectory.setAttribute('multiple', '');
            selectDirectory.onchange = function(){
                var imagesCollection = document.getElementById("imagesCollection");
                if (imagesCollection !== null) {
                    var i;
                    var file;
                    var fileName;
                    for (i = 0; i < imagesCollection.files.length; i += 1) {
                        file = imagesCollection.files[i];
                        fileName = file.name.toString();
                        if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
                            loadedImages.push(file);
                        }
                    }
                }
                
                if(document.getElementById('uploadImages') === null){
                    var button = document.createElement('button');
                    button.id = 'uploadImages';
                    button.className = 'button';
                    button.innerText = 'Upload Images';
                    button.onclick = uploadImages;
                    uploadViewer.appendChild(button);
                }
            };

            var viewSelector = document.createElement('select');
            viewSelector.name = 'viewSelector';
            viewSelector.id = 'viewSelector';
            viewSelector.setAttribute('onchange','tiv.changeView.call(tiv,this.value);');
            var op1 = document.createElement('option');
            op1.text = 'Image & URL';
            op1.value = 1;
            var op2 = document.createElement('option');
            op2.text = 'Image, URL, EXIF';
            op2.value = 2;
            var op3 = document.createElement('option');
            op3.text = 'Image, URL, EXIF, Map';
            op3.value = 3;

            viewSelector.options.add(op1, 1);
            viewSelector.options.add(op2, 2);
            viewSelector.options.add(op3, 3);

            modal_info.appendChild(exif_info);
            modal_info.appendChild(map_div);

            modal_content.appendChild(modal_image);
            modal_content.appendChild(modal_info);

            modal.appendChild(modal_content);
            
            document.getElementById('main').appendChild(selectDirectory);
            document.getElementById('main').appendChild(viewSelector);
            document.getElementById('main').appendChild(uploadViewer);
            document.getElementById('main').appendChild(modal);
        },

        showLoadedImages: function (elem) {
            var self = this;
            var i;
            var reader;
            var file;
            var readerOnLoadShowFiles = function (file, index) {
                return function (e) {
                    var imageTile = document.createElement("div");
                    imageTile.setAttribute("class", "imgTile");
                    var fig = document.createElement("figure");

                    var img = document.createElement("img");
                    img.setAttribute("src", e.target.result);
                    img.setAttribute("index", index.toString());
                    img.setAttribute("class", "thumb");
                    var viewType = parseInt(document.getElementById("viewSelector").value);
                    switch (viewType) {
                        case 1:
                            img.onclick = function(){
                                self.showImage(index,document.getElementById("modal"));
                            };
                            break;
                        case 2:
                            img.onclick = function(){
                                self.showImageDetailedExifInfo(index,document.getElementById("modal"));
                            };
                            break;
                        case 3:
                            img.onclick = function(){
                                self.showImageDetailedExifWithMap(index,document.getElementById("modal"));
                            };
                            break;
                    }
                    img.onload = getExif;
                    var caption = document.createElement("figcaption");
                    caption.innerText = escape(file.name);
                    fig.insertBefore(img, null);
                    fig.insertBefore(caption, null);
                    imageTile.insertBefore(fig, null);

                    elem.insertBefore(imageTile, null);
                };
            };
            for (i = 0; i < loadedImages.length; i += 1) {
                reader = new FileReader();
                file = loadedImages[i];
                reader.onload = readerOnLoadShowFiles(file, i);
                reader.readAsDataURL(file);
            }
        },
        
        removeImage: function(index){
            var imageTile = document.getElementById('tile'+index);
            loadedImages[index] = null;
            imageTile.parentNode.removeChild(imageTile);
        },
        
        addImage: function(elem, id, file, metadata, loggedIn){
            self = this;
            var reader;
            var i = loadedImages.push(file) -1;
            var readerOnLoadShowFiles = function (file, index) {
                return function (e) {
                    var imageTile = document.createElement("div");
                    imageTile.setAttribute("class", "imgTile");
                    imageTile.id = 'tile'+index;
                    var fig = document.createElement("figure");
                    console.log('LoggedIn:' + loggedIn);
                    if(loggedIn){
                        var deleteImageButton = document.createElement('div');
                        deleteImageButton.innerHTML = '&#10006;';
                        deleteImageButton.style.display = 'block';
                        deleteImageButton.className = 'deleteImageButton';
                        deleteImageButton.imageId = id;
                        deleteImageButton.onclick = function(){
                            deleteImage(id, index);
                        };
                        fig.appendChild(deleteImageButton);
                    }
                    
                    var img = document.createElement("img");
                    img.setAttribute("src", e.target.result);
                    img.setAttribute("index", index.toString());
                    img.setAttribute("class", "thumb");
                    var viewType = parseInt(document.getElementById("viewSelector").value);
                    switch (viewType) {
                        case 1:
                            img.onclick = function(){
                                self.showImage(index,document.getElementById("modal"));
                            };
                            break;
                        case 2:
                            img.onclick = function(){
                                self.showImageDetailedExifInfo(index,document.getElementById("modal"));
                            };
                            break;
                        case 3:
                            img.onclick = function(){
                                self.showImageDetailedExifWithMap(index,document.getElementById("modal"));
                            };
                            break;
                    }
                    img.onload = getExif;
                    var caption = document.createElement("figcaption");
                    if (metadata !== undefined) caption.innerText = metadata.userName;
                    fig.insertBefore(img, null);
                    fig.insertBefore(caption, null);
                    imageTile.insertBefore(fig, null);

                    elem.insertBefore(imageTile, null);
                };
            };
            reader = new FileReader();
            reader.onload = readerOnLoadShowFiles(file, i);
            reader.readAsDataURL(file);
        },

        //noinspection JSUnusedGlobalSymbols
        showImage: function (index, elem) {
            var reader = new FileReader();
            var file = loadedImages[index];

            //noinspection JSUnusedLocalSymbols
            reader.onload = (function (file) {
                return function (e) {
                    var img = document.getElementById("openImage");
                    if (img === null) {
                        img = document.createElement("img");
                        img.setAttribute("class", "modal-image");
                        img.setAttribute("id", "openImage");
                    }
                    img.setAttribute("src", e.target.result);
                    img.setAttribute("index", index.toString());
                    var modalContent = document.getElementById("modal-content");
                    var modalInfo = document.getElementById("modal-info");
                    var modalImage = document.getElementById("modal-image");
                    modalImage.insertBefore(img, null);
                    var urltxt = document.getElementById("imageUrl");
                    if (urltxt === null) {
                        urltxt = document.createElement("input");
                        urltxt.setAttribute("type", "text");
                        urltxt.setAttribute("name", "imageUrl");
                        urltxt.setAttribute("id", "imageUrl");
                        urltxt.setAttribute("readonly", "");
                        urltxt.style.zIndex = 100;

                        modalImage.insertBefore(urltxt, null);
                    }
                    urltxt.setAttribute("value", window.URL.createObjectURL(file));

                    elem.style.display = "block";
                    modalInfo.style.display = "none";
                    modalImage.style.width = "100%";
                    modalInfo.style.height = "" + (window.innerHeight * 0.7) + "px";
                    modalContent.style.height = "" + (window.innerHeight * 0.7) + "px";
                    modalImage.style.height = "" + (window.innerHeight * 0.7) + "px";
                };
            })(file);

            reader.readAsDataURL(file);

        },

        showImageDetailedExifInfo: function (index, elem) {
            var reader = new FileReader();
            var file = loadedImages[index];
            if (exinfo(index) === null) {
                self.showImage(index,elem);
                return;
            }
            //noinspection JSUnusedLocalSymbols
            reader.onload = (function (file) {
                return function (e) {
                    var img = document.getElementById("openImage");
                    if (img === null) {
                        img = document.createElement("img");
                        img.setAttribute("class", "modal-image");
                        img.setAttribute("id", "openImage");
                    }
                    img.setAttribute("src", e.target.result);
                    img.setAttribute("index", index.toString());

                    var modalContent = document.getElementById("modal-content");
                    var modalInfo = document.getElementById("modal-info");

                    var exifInfo = document.getElementById("exif-info");
                    exifInfo.insertBefore(exinfo(index), null);
                    exifInfo.style.height = "100%";

                    var modalImage = document.getElementById("modal-image");
                    modalImage.insertBefore(img, null);
                    var urltxt = document.getElementById("imageUrl");
                    if (urltxt === null) {
                        urltxt = document.createElement("input");
                        urltxt.setAttribute("type", "text");
                        urltxt.setAttribute("name", "imageUrl");
                        urltxt.setAttribute("id", "imageUrl");
                        urltxt.setAttribute("readonly", "");
                        urltxt.style.zIndex = 10;

                        modalImage.insertBefore(urltxt, null);
                    }
                    urltxt.setAttribute("value", window.URL.createObjectURL(file));

                    elem.style.display = "block";
                    modalInfo.style.display = "block";
                    modalImage.style.width = "70%";
                    modalInfo.style.height = "" + (window.innerHeight * 0.7) + "px";
                    modalContent.style.height = "" + (window.innerHeight * 0.7) + "px";
                    modalImage.style.height = "" + (window.innerHeight * 0.7) + "px";
                };
            })(file);

            reader.readAsDataURL(file);

        },

        showImageDetailedExifWithMap: function (index, elem) {
            if (exinfo(index) === null) {
                self.showImage(index,elem);
                return;
            }
            var reader = new FileReader();
            var file = loadedImages[index];
            
            //noinspection JSUnusedLocalSymbols
            reader.onload = (function (file) {
                return function (e) {
                    var img = document.getElementById("openImage");
                    if (img === null) {
                        img = document.createElement("img");
                        img.setAttribute("class", "modal-image");
                        img.setAttribute("id", "openImage");
                    }
                    img.setAttribute("src", e.target.result);
                    img.setAttribute("index", index.toString());

                    var modalContent = document.getElementById("modal-content");
                    var modalInfo = document.getElementById("modal-info");

                    var exifInfo = document.getElementById("exif-info");
                    exifInfo.insertBefore(exinfo(index), null);
                    exifInfo.style.height = "60%";

                    var modalImage = document.getElementById("modal-image");
                    modalImage.insertBefore(img, null);
                    var urltxt = document.getElementById("imageUrl");
                    if (urltxt === null) {
                        urltxt = document.createElement("input");
                        urltxt.setAttribute("type", "text");
                        urltxt.setAttribute("name", "imageUrl");
                        urltxt.setAttribute("id", "imageUrl");
                        urltxt.setAttribute("readonly", "");
                        urltxt.style.zIndex = 100;

                        modalImage.insertBefore(urltxt, null);
                    }
                    urltxt.setAttribute("value", window.URL.createObjectURL(file));

                    elem.style.display = "block";
                    modalInfo.style.display = "block";
                    modalImage.style.width = "70%";
                    modalInfo.style.height = "" + (window.innerHeight * 0.7) + "px";
                    modalContent.style.height = "" + (window.innerHeight * 0.7) + "px";
                    modalImage.style.height = "" + (window.innerHeight * 0.7) + "px";
                };
            })(file);

            reader.readAsDataURL(file);

            if (exifData[index]["GPSLatitude"] !== undefined) {
                var mapElement = document.getElementById("map");
                mapElement.style.display = "block";
                var latitudeDMS = exifData[index]["GPSLatitude"];
                var latitudeDD = convertDMStoDD(latitudeDMS[0], latitudeDMS[1], latitudeDMS[2], exifData[index]["GPSLatitudeRef"]);
                var longitudeDMS = exifData[index]["GPSLongitude"];
                var longitudeDD = convertDMStoDD(longitudeDMS[0], longitudeDMS[1], longitudeDMS[2], exifData[index]["GPSLongitudeRef"]);
                if (!(index in markers)) {
                    markers[index] = new google.maps.Marker();
                    markers[index].setPosition({lat: latitudeDD, lng: longitudeDD});
                }

                if (map_initialized) {
                    markers[old_map_index].setMap(null);
                    markers[index].setMap(map);
                    map.setCenter({lat: latitudeDD, lng: longitudeDD});
                    map.setZoom(4);
                    old_map_index = index;
                } else {
                    old_map_index = index;
                    map = new google.maps.Map(document.getElementById("map"), {
                        zoom: 4,
                        center: {lat: latitudeDD, lng: longitudeDD},
                        streetViewControl: false
                    });
                    markers[index].setMap(map);
                    map_initialized = true;
                }
            }
        }
    };
};

//noinspection JSUnusedLocalSymbols
window.onresize = function (event) {
    var openImage = document.getElementById("openImage");
    if (openImage !== null) {
        document.getElementById("modal-info").style.height = "" + (window.innerHeight * 0.7) + "px";
        document.getElementById("modal-content").style.height = "" + (window.innerHeight * 0.7) + "px";
        // console.log(window.innerHeight);
        document.getElementById("modal-image").style.height = "" + (window.innerHeight * 0.7) + "px";

    }
};

window.onclick = function (event) {
    var modal = document.getElementById("modal");
    if (event.target === modal) {
        modal.style.display = "none";
        // modal.removeChild(modal.firstChild);
        document.getElementById("exif-info").innerHTML = "";
        if (document.getElementById('map') !== null){
            document.getElementById('map').style.display = 'none';
        }
    }
};
var tiv = new TIV2880();