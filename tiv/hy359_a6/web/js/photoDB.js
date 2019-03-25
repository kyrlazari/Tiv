/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global tiv, currentUser, userImageValue, changedImageValue */

'use strict';

var changedImageCount = false;

function getImages(user){
    var imageValue = '';
//    if(userImageValue !== undefined && changedImageValue === true){
//        imageValue = '?number='+userImageValue;
//    }
    var xhr = new XMLHttpRequest();
    var loggedIn = false;
    if (user === undefined){
        if(userImageValue !== undefined && changedImageValue === true){
            xhr.open('GET', 'GetImageCollection?number='+userImageValue);
            changedImageValue = false;
        }else{
            xhr.open('GET', 'GetImageCollection');
        }
    }else{
        xhr.open('GET', 'GetImageCollection?user='+user+imageValue);
        if(userImageValue !== undefined && changedImageValue === true){
            xhr.open('GET', 'GetImageCollection?user='+user+'&number='+userImageValue);
            changedImageValue = false;
        }else{
            xhr.open('GET', 'GetImageCollection?user='+user);
        }
        if (currentUser === user){
            loggedIn = true;
        }
    }
    var ids;
    xhr.onload = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            ids = JSON.parse(xhr.responseText);
//            console.log(ids);
            var i=0;
            for (i=0; i<ids.length; i+=1){
                getAndAddImage(ids[i], loggedIn);
            }
        }
    };
    
    xhr.send();
//    return ids;
}

function getAndAddImage(id, loggedIn){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'GetImage?id='+id);
    xhr.responseType = 'blob';
    xhr.onload = function (){
        if(xhr.readyState === 4 && xhr.status === 200){
            var blob = xhr.response;
            var xhr2 = new XMLHttpRequest();
            xhr2.open('GET', 'GetImage?id='+id+'&metadata=true');
            xhr2.onload = function(){
                var metadata = JSON.parse(xhr2.response);
                tiv.addImage(document.getElementById('main'),id, blob, metadata, loggedIn);
            };
            xhr2.send();
        }else{
            alert('Request failed. Returned Status of: ' + xhr.status);
        }
    };
    xhr.send();
    
//    return base64data;
}

function uploadImages(images) {
    var i;
    var file;
    var formData;
    var xhr;
    for (i = 0; i < images.length; i += 1) {
        file = images[i];
        formData = new FormData();

        xhr = new XMLHttpRequest();
        formData.append('photo', file);
        formData.append('userName', currentUser);
        formData.append('contentType', 'image/jpg');  //TODO Change ContentType
        xhr.open('POST', 'UploadImage');
        xhr.send(formData);
    }
}