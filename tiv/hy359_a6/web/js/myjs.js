/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global tiv, uploadImages */

'use strict';

var currentUser = '';
var userImageValue;
var changedImageValue = false;

var country_arr = new Array("Greece", "Afghanistan", "Albania", "Algeria", "American Samoa",
    "Angola", "Anguilla", "Antartica", "Antigua and Barbuda", "Argentina", 
    "Armenia", "Aruba", "Ashmore and Cartier Island", "Australia", "Austria", 
    "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", 
    "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", 
    "Bosnia and Herzegovina", "Botswana", "Brazil", "British Virgin Islands", 
    "Brunei", "Bulgaria", "Burkina Faso", "Burma", "Burundi", "Cambodia", 
    "Cameroon", "Canada", "Cape Verde", "Cayman Islands", 
    "Central African Republic", "Chad", "Chile", "China", "Christmas Island", 
    "Clipperton Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", 
    "Congo, Democratic Republic of the", "Congo, Republic of the", "Cook Islands", 
    "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czeck Republic", 
    "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", 
    "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", 
    "Europa Island", "Falkland Islands (Islas Malvinas)", "Faroe Islands", "Fiji", 
    "Finland", "France", "French Guiana", "French Polynesia", 
    "French Southern and Antarctic Lands", "Gabon", "Gambia, The", "Gaza Strip", 
    "Georgia", "Germany", "Ghana", "Gibraltar", "Glorioso Islands",  
    "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", 
    "Guinea", "Guinea-Bissau", "Guyana", "Haiti", 
    "Heard Island and McDonald Islands", "Holy See (Vatican City)", "Honduras", 
    "Hong Kong", "Howland Island", "Hungary", "Iceland", "India", "Indonesia", 
    "Iran", "Iraq", "Ireland", "Ireland, Northern", "Israel", "Italy", "Jamaica", 
    "Jan Mayen", "Japan", "Jarvis Island", "Jersey", "Johnston Atoll", "Jordan", 
    "Juan de Nova Island", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", 
    "Korea, South", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", 
    "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", 
    "Macau", "Macedonia, Former Yugoslav Republic of", "Madagascar", "Malawi", 
    "Malaysia", "Maldives", "Mali", "Malta", "Man, Isle of", "Marshall Islands", 
    "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", 
    "Micronesia, Federated States of", "Midway Islands", "Moldova", "Monaco", 
    "Mongolia", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nauru", 
    "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", 
    "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", 
    "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", 
    "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcaim Islands", 
    "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romainia", 
    "Russia", "Rwanda", "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", 
    "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", 
    "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Scotland", 
    "Senegal", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", 
    "Slovenia", "Solomon Islands", "Somalia", "South Africa", 
    "South Georgia and South Sandwich Islands", "Spain", "Spratly Islands", 
    "Sri Lanka", "Sudan", "Suriname", "Svalbard", "Swaziland", "Sweden", 
    "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", 
    "Tobago", "Toga", "Tokelau", "Tonga", "Trinidad", "Tunisia", "Turkey", 
    "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", 
    "United Kingdom", "Uruguay", "USA", "Uzbekistan", "Vanuatu", "Venezuela", 
    "Vietnam", "Virgin Islands", "Wales", "Wallis and Futuna", "West Bank", 
    "Western Sahara", "Yemen", "Yugoslavia", "Zambia", "Zimbabwe");

function showRegisterForm(){
    document.getElementById('regform').style.display = 'block';
}

function print_country(){
    var options = '';
    var i;
    for(i=0; i<country_arr.length; i++){
        options = options.concat('<option value="'+ country_arr[i] + '">'+ country_arr[i]+'</option>\n');
    }
    return options;
}

function fill_date(){
    var current_year = new Date().getFullYear();

    var bday_html = '<select id = "day">\n<option value>DD</option>\n';
    
    var i=0;
    for (i=1; i<10; i++){
        bday_html = bday_html.concat('<option value="'+i+'">0'+i+'</option>\n');
    }
    for (i=10; i<32; i++){
        bday_html = bday_html.concat('<option value="'+i+'">'+i+'</option>\n');
    }
    bday_html = bday_html.concat('</select>\n<select id="month">\n<option value>MM</option>\n');
    
    for (i=1; i<10; i++){
        bday_html = bday_html.concat('<option value="'+i+'">0'+i+'</option>\n');
    }
    for (i=10; i<13; i++){
        bday_html = bday_html.concat('<option value="'+i+'">'+i+'</option>\n');
    }
    
    bday_html = bday_html.concat('</select>\n<select id="year">\n<option value>YYYY</option>\n');
    
    for (i=1900; i<=current_year; i++){
        bday_html = bday_html.concat('<option value="'+i+'">'+i+'</option>\n');
    }
    
    bday_html = bday_html.concat('</select>\n');
    
    return bday_html;
}

function validateEmpty(type){
    var uname = document.getElementById('uname').value;
    var email = document.getElementById('email').value;
    var pwd = document.getElementById('pwd').value;
    var fname = document.getElementById('fname').value;
    var lname = document.getElementById('lname').value;
    var bday = document.getElementById('day').value;
    var bmonth = document.getElementById('month').value;
    var byear = document.getElementById('year').value;
    var city = document.getElementById('city').value;
    
    var flag = 0;
    
    var empty_field = document.createElement('p');
    empty_field.setAttribute('class', 'invalid');
    empty_field.innerText = 'This field cannot be empty';
    
    if(uname === '' || uname === null){
        document.getElementById('uname-row').appendChild(empty_field);
        flag = 1;
    }
    if(email === '' || email === null){
        document.getElementById('email-row').appendChild(empty_field.cloneNode(true));
        flag = 1;
    }
    if(type === 'register' && (pwd === '' || pwd === null)){
        document.getElementById('pwd-row').appendChild(empty_field.cloneNode(true));
        flag = 1;
    }
    if(fname === '' || fname === null){
        document.getElementById('fname-row').appendChild(empty_field.cloneNode(true));
        flag = 1;
    }
    if(lname === '' || lname === null){
        document.getElementById('lname-row').appendChild(empty_field.cloneNode(true));
        flag = 1;
    }
    if(bday=== '' || bmonth === '' || byear === ''){
        document.getElementById('bdate-cell2').appendChild(empty_field.cloneNode(true));
        flag = 1;
    }
    if(city === '' || city === null){
        document.getElementById('city-row').appendChild(empty_field.cloneNode(true));
        flag = 1;
    }
    if (flag === 1){
        return false;
    }
    return true;
}

function validateLoginEmpty(){
    var uname = document.getElementById('login-uname').value;
    var pwd = document.getElementById('loginPwd').value;
    
    var empty_field = document.createElement('p');
    empty_field.setAttribute('class', 'invalid');
    empty_field.innerText = 'This field cannot be empty';
    
    if(uname === '' || uname === null){
        document.getElementById('uname-row').appendChild(empty_field);
        flag = 1;
    }
    
    if(pwd === '' || pwd === null){
        document.getElementById('pwd-row').appendChild(empty_field.cloneNode(true));
        flag = 1;
    }
}

function validatePatterns(type){
    var uname = document.getElementById('uname').value;
    var email = document.getElementById('email').value;
    var pwd = document.getElementById('pwd').value;
    var fname = document.getElementById('fname').value;
    var lname = document.getElementById('lname').value;
    var city = document.getElementById('city').value;
    
    var flag = 0;
    
    if (uname !== '' && !(/[a-zA-Z0-9_]{8,}/.test(uname))){
        var uname_invalid = document.createElement('p');
        uname_invalid.setAttribute('class', 'invalid');
        uname_invalid.innerText = 'Username has to be at least 8 characters long';
        document.getElementById('uname-row').appendChild(uname_invalid);
        console.log('Uname invalid');
        flag = 1;
    }
    if(email !== '' && !(/[a-zA-z0-9-!#$%&'*+/=?^_`{|}~\.]+@[a-zA-z0-9-]+(\.[a-zA-z0-9-]+)+/.test(email))){
        var email_invalid = document.createElement('p');
        email_invalid.setAttribute('class', 'invalid');
        email_invalid.innerText = 'Please use a valid email';
        document.getElementById('email-row').appendChild(email_invalid);
        console.log('Email invalid:'+email);
        flag = 1;
    }
    if(!(type === 'modify' && pwd === '')){
        if(pwd !== '' && !(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,10}$/.test(pwd))){
            var pwd_invalid = document.createElement('p');
            pwd_invalid.setAttribute('class', 'invalid');
            pwd_invalid.innerText = 'The password has to be 6 to 10 characters long and must contain one letter, one number and a symbol';
            document.getElementById('pwd-row').appendChild(pwd_invalid);
            console.log('Password invalid:'+pwd);
            flag = 1;
        }
    }
    if(fname !== '' && !(/[a-zA-Z\s]{3,20}/.test(fname))){
        var fname_invalid = document.createElement('p');
        fname_invalid.setAttribute('class', 'invalid');
        fname_invalid.innerText = 'The first name has to be at least 3 characters long';
        document.getElementById('fname-row').appendChild(fname_invalid);
        console.log('Fname invalid');
        flag = 1;
    }
    if(lname !== '' && !(/[a-zA-Z]{4,20}/.test(lname))){
        var lname_invalid = document.createElement('p');
        lname_invalid.setAttribute('class', 'invalid');
        lname_invalid.innerText = 'The last name has to be at least 4 characters long';
        document.getElementById('lname-row').appendChild(lname_invalid);
        console.log('Lname invalid');
        flag = 1;
    }
    if(city !== '' && !(/[a-zA-Z]{2,50}/.test(city))){
        var city_invalid = document.createElement('p');
        city_invalid.setAttribute('class', 'invalid');
        city_invalid.innerText = 'The city has to be at least 2 characters long';
        document.getElementById('city-row').appendChild(city_invalid);
        console.log('City invalid');
        flag = 1;
    }
    
    if (flag === 1){
        return false;
    }
    return true;
}

function validateDate(){
    var bday = document.getElementById('day').value;
    var bmonth = document.getElementById('month').value;
    var byear = document.getElementById('year').value;
    var invalid = 0;
    var big_months = ['1','3','5','7','8','10','12'];
    var wrong_date = document.createElement('p');
    wrong_date.setAttribute('class', 'invalid');
    wrong_date.innerText = "Please give a valid Date";
  	var year_elem;
    if (big_months.indexOf(bmonth) === -1 ){ //month has 30 days or less
        var m = parseInt(bmonth);
        var d = parseInt(bday);
        if(m !== 2){
            if (d === 31){
                year_elem = document.getElementById('year');
                year_elem.parentNode.appendChild(wrong_date);
                invalid = 1;
            }
        }else{
            var y = parseInt(byear);
            if((y%4 === 0 && y%100 !== 0) || (y%400 === 0)){
                if( d > 29){
                    year_elem = document.getElementById('year');
                    year_elem.parentNode.appendChild(wrong_date);
                    invalid = 1;
                }
            }else{
                if (d > 28){
                    year_elem = document.getElementById('year');
                    year_elem.parentNode.appendChild(wrong_date);
                    invalid = 1;
                }
            }
        }
    }
    var user_date = new Date();
    user_date.setDate(bday);
    user_date.setMonth(bmonth-1);
    user_date.setFullYear(byear);
    
    var min_date = new Date();
    min_date.setFullYear(min_date.getFullYear() -15);
 
    var too_young = document.createElement('p');
    too_young.setAttribute('class', 'invalid');
    too_young.innerText = 'You have to be at least 15 years old to register';
    if (user_date.getTime() > min_date.getTime()){
        invalid = 1;
        document.getElementById('year').parentNode.appendChild(too_young);
    }
    
    if (invalid === 1){
        return false;
    }
    return true;
}

function validatePassword(){
    var wrong_pass = document.createElement('p');
    wrong_pass.setAttribute('class', 'invalid');
    wrong_pass.innerText = 'Passwords do not match';
    if(document.getElementById('pwdConfirm').value !== document.getElementById('pwd').value){
        document.getElementById('pwdConfirm').parentNode.appendChild(wrong_pass);
        return false;
    }
    
    return true;
}

function clearInvalid(){
    var invalid_elements = document.getElementsByClassName('invalid');
    while(invalid_elements.length >0){
        invalid_elements[0].parentNode.removeChild(invalid_elements[0]);
    }
}

function validateFormAndSend(type){
    
    clearInvalid();
    var flag = 0;
    if(!validateEmpty(type)) flag = 1;
    
    if(!validatePatterns(type)) flag = 1;
    
    if(!validateDate()) flag = 1;
    
    if(!validatePassword()) flag = 1;
    
    if (flag === 1) return false;
    
    sendAjaxPost(type);
    return false;
}

function sendAjaxPost(type){
    var uname = document.getElementById('uname').value;
    var email = document.getElementById('email').value;
    var pwd = document.getElementById('pwd').value;
    var fname = document.getElementById('fname').value;
    var lname = document.getElementById('lname').value;
    var bday = document.getElementById('day').value;
    var bmonth = document.getElementById('month').value;
    var byear = document.getElementById('year').value;
    var gender = 0;
    var radios = document.getElementsByName('Gender');
    for(var i=0, length = radios.length; i<length; i++){
        if(radios[i].checked){
            gender = radios[i].value;
        }
    }
    
    var country = document.getElementById('country').value;
    var city = document.getElementById('city').value;
    var moreInfo = document.getElementById('moreInfo').value;
    
    var xhr = new XMLHttpRequest();
    
    xhr.open('POST', 'UserRegister');
    xhr.onload = function (){
        if(xhr.readyState === 4 && xhr.status === 200){
//            document.getElementById('regform').style.display = 'none';
            document.getElementById('main').innerHTML = xhr.responseText;
        } else if (xhr.readyState === 4 && xhr.status === 420) {
            var uname_invalid = document.createElement('p');
            uname_invalid.setAttribute('class', 'invalid');
            uname_invalid.innerText = 'Username already exists!';
            document.getElementById('uname-row').appendChild(uname_invalid);
        }else if (xhr.readyState === 4 && xhr.status === 421) {
            var email_invalid = document.createElement('p');
            email_invalid.setAttribute('class', 'invalid');
            email_invalid.innerText = 'Email already exists!';
            document.getElementById('email-row').appendChild(email_invalid);
        }
    };
    var modifyPass = true;
    if(type === 'modify'){
        if (pwd === null || pwd === ''){
            modifyPass = false;
        }
    }
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(''+type+'=true&modifyPass='+modifyPass+'&uname=' + uname + '&email=' + email + '&pwd=' + pwd + '&fname=' +
            fname + '&lname=' + lname + '&bday=' + bday + '&bmonth=' + bmonth +
            '&byear=' + byear + '&gender=' + gender + '&country=' + country + 
            '&city=' + city + '&moreInfo=' + moreInfo);
}

function loggedInUserImages(){
    tiv.clearImages();
    document.getElementById('main').innerHTML = '';

    tiv.initializeView(document.getElementById('main'));
    
    getImages(currentUser);
}

function anotherUserImages(user){
    tiv.clearImages();
    document.getElementById('main').innerHTML = '';
    tiv.initializeView(document.getElementById('main'));
    getImages(user);
}

function guestUserImages(){
    tiv.clearImages();
    document.getElementById('main').innerHTML = '';
    tiv.initializeView(document.getElementById('main'));
    
    getImages();
}

function showUploadImages(){
    var uploadViewer = document.createElement('div');
    uploadViewer.id = 'uploadViewer';
//    uploadViewer.className = 'main';
    
    var selectDirectory = document.createElement('input');
    selectDirectory.id = 'imagesCollection';
    selectDirectory.type = 'file';
    selectDirectory.textContent = 'Hello!';
//    selectDirectory.setAttribute('webkitdirectory', '');
//    selectDirectory.setAttribute('mozdirectory', '');
//    selectDirectory.setAttribute('directory', '');
    selectDirectory.setAttribute('name', 'myFiles');
    selectDirectory.setAttribute('multiple', '');
    selectDirectory.setAttribute('accept', 'image/*');
    selectDirectory.onchange = function(){
        var imagesCollection = document.getElementById("imagesCollection");
        if (imagesCollection !== null) {
            var i;
            var file;
            var fileName;
            for (i = 0; i < imagesCollection.files.length; i += 1) {
                file = imagesCollection.files[i];
                fileName = file.name.toString();
//                if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
                    tiv.addImage(uploadViewer, file);
//                }
            }
        }

        if(document.getElementById('uploadImages') === null){
            var button = document.createElement('button');
            button.id = 'uploadImages';
            button.className = 'button';
            button.innerText = 'Upload Images';
            button.onclick = function(){
                uploadImages(tiv.getLoadedImages());
            };
            button.style.display = 'block';
            button.style.clear = 'left';
            document.getElementById('main').appendChild(button);
        }
    };
    var main = document.getElementById('main');
    tiv.initializeView(uploadViewer);
    
    main.appendChild(selectDirectory);
    main.appendChild(uploadViewer);
    main.appendChild(document.createElement('br'));
}

function createUserMenu(){
    var userMenu = document.createElement('div');
    userMenu.id = 'userMenu';
    userMenu.className = 'dropdown';
    var userButton = document.createElement('button');
    userButton.className = 'dropbtn';
    userButton.innerText = 'User Menu';
    userMenu.appendChild(userButton);

    var a1 = document.createElement('button');
    a1.onclick = showUsers;
    a1.innerText= 'Show Users';
    var a2 = document.createElement('button');
    a2.onclick = showUserMenu;
    a2.innerText = 'Show My Info';
    var a3 = document.createElement('button');
    a3.onclick = showModify;
    a3.innerText = 'Modify My Info';
    var a4 = document.createElement('button');
    a4.onclick = showUploadImages;
    a4.innerText = 'Upload Images';
    var a5 = document.createElement('button');
    a5.onclick = loggedInUserImages;
    a5.innerText = 'View My Images';
    

    var dropdownContent = document.createElement('div');
    dropdownContent.className = 'dropdown-content';

    dropdownContent.appendChild(a1);
    dropdownContent.appendChild(a2);
    dropdownContent.appendChild(a3);
    dropdownContent.appendChild(a4);
    dropdownContent.appendChild(a5);
    userMenu.appendChild(dropdownContent);
    
    return userMenu;
}

function checkSession(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'SessionServlet');
    xhr.onload = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            guestUserImages();
        }else if(xhr.readyState === 4 && xhr.status === 210){
            var button = document.getElementById('button2');
            button.innerText = 'Logout';
            button.onclick = logout;
            var usernameRegex = /<!--Username:.*-->/;
            var usernameComment = xhr.responseText.match(usernameRegex)[0];

            var username = usernameComment.substring(13,usernameComment.length - 3);
            currentUser = username;

            document.getElementById('nav-left').insertBefore(createUserMenu(), document.getElementById('numberOfImages'));
            document.getElementById('button3').style.display = 'none';
            document.getElementById('main').innerHTML = xhr.responseText;
        }else{
            alert('Request failed. Returned Status of: ' + xhr.status);
        }
    };
    
    xhr.send();
}

function change_to_register(){
    document.getElementById('main').innerHTML = '<div id="regform" class="registration-form">\n'+
                '<h3>Registration Form</h3><br/>\n'+
                '<div id="uname-row" class="row">\n'+
                    '<label for="uname"><abbr title="The username has to be at least 8 characters long.">Username</abbr></label>\n'+
                    '<input id="uname" name="userName" value="dermitzos"/><br/>\n'+
                '</div>\n'+
                '<div id="email-row" class="row">\n'+
                    '<label for="email">Email</label>\n'+
                    '<input id="email" type="text" name="Email" value="dermitz@csd.uoc.gr"/><br/>\n'+
                '</div>\n'+
'                <div id="pwd-row" class="row">\n'+
                    '<label for="pwd"><abbr title="The password has to be 6 to 10 characters long and \n'+
'must contain one letter, one number and a symbol.">Password</abbr></label>\n'+
                    '<input id="pwd" maxlength="10" type="password" name="password" value="manos123!"/><br/>\n'+
                '</div>\n'+
                '<div class="row">\n'+
                    '<label for="pwdConfirm">Retype Password</label>\n'+
                    '<div class="cell">\n'+
                        '<input id="pwdConfirm" maxlength="10" type="password" value="manos123!" name="passwordConfirm"/><br/>\n'+
                    '</div>\n'+
                '</div>\n'+
                '<div id="fname-row" class="row">\n'+
                    '<label for="fname">First Name</label>\n'+
                    '<input id="fname" maxlength="20" type="text" name="firstName" value="Manos"/><br/>\n'+
                '</div>\n'+
                '<div id="lname-row" class="row">\n'+
                    '<label for="lname">Last Name</label>\n'+
                    '<input id="lname" maxlength="20" type="text" name="lastName" value="Dermi"/><br/>\n'+
                '</div>\n'+
                '<div id="bdate-row" class="row">\n'+
                    '<label><abbr title="You have to be at least 15 years old to register">Date of Birth</abbr></label>\n'+
                    '<div id="bdate-cell2" class="cell date">\n'+
                        fill_date()+
                    '</div>\n'+
                    '<script type="text/javascript">fill_date();</script>\n'+
                '</div>\n'+
                '<div id="gender-row" class="row">\n'+
                    '<label>Gender</label>\n'+
                    '<div class="radio">\n'+
                        '<label for="male">Male</label>\n'+
                        '<input id="male" type="radio" name="Gender" value="Male" checked=""/>\n'+
                        '<label for="female">Female</label>\n'+
                        '<input id="female" type="radio" name="Gender" value="Female"/>\n'+
                        '<label for="notAppl">Not Applicable</label>\n'+
                        '<input id="notAppl" type="radio" name="Gender" value="Not Applicable"/>\n'+
                    '</div>\n'+
                '</div>\n'+
                '<div id="country-row" class="row">\n'+
                    '<label for="country">Country</label>\n'+
                    '<select id="country">'+ print_country()+'</select><br/>\n'+
                    '<script type="text/javascript">print_country("country");</script>\n'+
                '</div>\n'+
                '<div id="city-row" class="row">\n'+
                    '<label for="city">City</label>\n'+
                    '<input id="city" maxlength="50" value="Heraklion" type="text" name="City"/><br/>\n'+
                '</div>\n'+
                '<div class="row">\n'+
                    '<label for="moreInfo">More Info</label>\n'+
                    '<textarea id="moreInfo" rows="10" cols="40" maxlength="500"></textarea><br/>\n'+
                '</div>\n'+
                '<div class="row">\n'+
                    '<div class="cell"></div>\n'+
                    '<input class="button" type="button" onclick="validateFormAndSend(\'register\');" value="Submit"/>\n'+
                '</div>\n'+
            '</div>';
}

function register(){
    var loginform = document.getElementById('loginform');
    if(loginform !== null)
        loginform.parentNode.removeChild(loginform);
    
    change_to_register();
    print_country();

}

function logout(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'ValidateServlet?logout=true');
    xhr.onload = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            currentUser = '';
            window.location.reload();
        }else{
            alert('Request failed. Returned Status of: ' + xhr.status);
        }
    };
    
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
}

function login(){
    document.getElementById('main').innerHTML ='<div id="loginform" class="login-form">'+
            '<h3>Login</h3><br/>'+
            '<div id="uname-row" class="row">'+
            '<label for="login-uname">Username</label>'+            
            '<input id="login-uname" name="loginUserName"/>'+
            '</div>'+
            '<div id="pwd-row" class="row">'+
            '<label for="loginPwd">Password</label>'+
            '<input type="password" id="loginPwd" maxlength="10" name="loginPassword"/>'+
            '</div>'+
            '<div class="row">'+
            '<div class="cell"><input class="button" type="button" onclick="register();" value="Register"/></div>'+
            '<div class="cell"><input class="button" type="button" onclick="userLogin();" value="Login"/></div>'+
            '</div>';
}
function deleteImage(id, index){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'ImageDelete');
    xhr.onload = function(){
        var main = document.getElementById('main');
        var response = document.getElementById('ajaxResponse');
        if(response === null){
            response = document.createElement('div');
            response.id = 'ajaxResponse';
            response.style.display = 'block';
            response.style.clear = 'left';
            main.appendChild(response);
        }
        if (xhr.readyState === 4 && xhr.status === 200){
            response.innerHTML = xhr.responseText;
            tiv.removeImage(index);
        }else{
            response.innerHTML = xhr.responseText;
            alert('Request failed. Returned Status of: ' + xhr.status);
        }
    };
    console.log(id);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send('id='+id);
}
function userLogin(){
    clearInvalid();
    validateLoginEmpty();
    var uname = document.getElementById('login-uname').value;
    var pwd = document.getElementById('loginPwd').value;
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'ValidateServlet?uname='+uname+'&pwd='+pwd);
    xhr.onload = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            currentUser = uname;
            var button = document.getElementById('button2');
            button.innerText = 'Logout';
            button.onclick = logout;
            document.getElementById('nav-left').insertBefore(createUserMenu(), document.getElementById('numberOfImages'));
            document.getElementById('button3').style.display = 'none';
            document.getElementById('main').innerHTML = xhr.responseText;
        }else if(xhr.readyState === 4 && xhr.status === 420){
            var e = document.createElement('p');
            e.setAttribute('class', 'invalid');
            e.innerText = 'Username or Password is wrong';
            document.getElementById('main').appendChild(e);
        }else{
            alert('Request failed. Returned Status of: ' + xhr.status);
        }
    };
    
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
}

function deleteUser(){
    alert('Going to delete User!');
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'UserDelete');
    
    xhr.onload = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            document.getElementById('main').innerHTML = xhr.responseText;
            setTimeout(logout, 3000);
//            currentUser = '';
        }else{
            document.getElementById('main').innerHTML = xhr.responseText;
        }
    };
    console.log(currentUser);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send('userName='+currentUser);
}

function showUsers(){
    tiv.clearImages();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'ShowUsers');
    xhr.onload=function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            var users = JSON.parse(xhr.responseText);
            var main = document.getElementById('main');
            main.innerHTML = '';
            var table = document.createElement('table');
            var th = document.createElement('th');
            th.innerText = 'Users of our network';
            table.appendChild(th);
            
            for(var i =0; i<users.length; i++){
                var tr = document.createElement('tr');
                var td = document.createElement('td');
                var user = users[i];
                td.innerText = user;
                td.className = 'UserLink';
                console.log(user);
                td.onclick = (function(user){
                    return function(){
                        anotherUserImages(user);
                        console.log('Showing images of '+user);
                    };
                })(user);
                tr.appendChild(td);
                table.appendChild(tr);
            }
            main.appendChild(table);
            var h3 = document.createElement('h3');
            h3.innerText = 'Click on UserName to see their Photos!';
            main.appendChild(h3);
        }else{
            alert('Request failed. Returned Status of: ' + xhr.status);
        }
    };
    xhr.send();
}

function showUserMenu(){
    tiv.clearImages();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'UserMenu');
    xhr.onload=function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            document.getElementById('main').innerHTML =  xhr.responseText;
        }else{
            alert('Request failed. Returned Status of: ' + xhr.status);
        }
    };
    xhr.send();
}

function showModify(){
    tiv.clearImages();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'UserModify');
    xhr.onload=function(){
        if (xhr.readyState === 4 && xhr.status === 200){
            document.getElementById('main').innerHTML = xhr.responseText;
            
            var deleteButton = document.createElement('button');
            deleteButton.id = 'deleteButton';
            deleteButton.className = 'button modify';
            deleteButton.innerText = 'Delete User';
            deleteButton.onclick = deleteUser;
            
            var submitButton = document.createElement('input');
            submitButton.className = 'button modify';
            submitButton.type = 'button';
            submitButton.onclick= function(){
                validateFormAndSend('modify');
            };
            submitButton.value = 'Submit';
            
            var modButtons = document.createElement('div');
            modButtons.id = 'modButtons';
            modButtons.appendChild(submitButton);
            modButtons.appendChild(deleteButton);
            
//            document.getElementById('main').appendChild(submitButton);
            document.getElementById('main').appendChild(modButtons);
        }else{
            alert('Request failed. Returned Status of: ' + xhr.status);
        }
        
    };
    xhr.send();
}