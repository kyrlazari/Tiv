/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import cs359db.model.User;
import cs359db.db.UserDB;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Calendar;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 *
 * @author kyriazis
 */
public class UserModify extends HttpServlet {
    private static final String[] countries = {"Greece", "Afghanistan", "Albania", "Algeria", "American Samoa",
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
    "Western Sahara", "Yemen", "Yugoslavia", "Zambia", "Zimbabwe"};
    
    private String fill_date(String bday){
        String bday_html = "<select id = \"day\">\n<option value>DD</option>\n";
        String[] parts = bday.split("-");
        int day = Integer.parseInt(parts[2]);
        int month = Integer.parseInt(parts[1]);
        int year = Integer.parseInt(parts[0]);
        
        for(int i=1; i<10; i++){
            bday_html = bday_html + "<option value=\""+i+"\" ";
            if (i == day) bday_html = bday_html + "selected";
            bday_html = bday_html + ">0"+i+"</option>\n";
        }
        
        for(int i=10; i<32; i++){
            bday_html = bday_html + "<option value=\""+i+"\" ";
            if (i == day) bday_html = bday_html + "selected";
            bday_html = bday_html + ">"+i+"</option>\n";
        }
        
        bday_html = bday_html + "</select>\n<select id=\"month\">\n<option value>MM</option>\n";
        
        for(int i=1; i<10; i++){
            bday_html = bday_html + "<option value=\""+i+"\" ";
            if (i == month) bday_html = bday_html + "selected";
            bday_html = bday_html + ">0"+i+"</option>\n";
        }
        for(int i=10; i<13; i++){
            bday_html = bday_html + "<option value=\""+i+"\" ";
            if (i == month) bday_html = bday_html + "selected";
            bday_html = bday_html + ">"+i+"</option>\n";
        }
        
        bday_html = bday_html + "</select>\n<select id=\"year\">\n<option value>YYYY</option>\n";
        
        for(int i=1900; i<=Calendar.getInstance().get(Calendar.YEAR); i++){
            bday_html = bday_html + "<option value=\""+i+"\" ";
            if (i == year) bday_html = bday_html + "selected";
            bday_html = bday_html + ">"+i+"</option>\n";
        }
        
        bday_html = bday_html + "</select>\n";
        return bday_html;
        
    }
    
    private String fill_country(String old_country){
        String countries_html = "";
        
        for (String country : countries) {
            countries_html = countries_html + "<option value=\""+country+"\" ";
            if(country.equals(old_country)){
                countries_html = countries_html + "selected";
            }
            countries_html = countries_html + ">"+country+"</option>\n";
        }
        
        return countries_html;
    }
    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        
        HttpSession session = request.getSession(true);
        if(session.getAttribute("user") == null){
            response.setStatus(401);
            return;
        }
        User user = (User) session.getAttribute("user");
        
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            out.println("<div id=\"regform\" class=\"registration-form\">\n");
            out.println("<h3>Modification Form</h3><br/>\n");
            out.println("<div id=\"uname-row\" class=\"row\">\n");
            out.println("<label for=\"uname\"><abbr title=\"The username has to be at least 8 characters long.\">Username</abbr></label>\n");
            out.println("<input id=\"uname\" name=\"userName\" disabled value=\""+user.getUserName()+"\"/><br/>\n");
            out.println("</div>\n");
            out.println("<div id=\"email-row\" class=\"row\">\n");
            out.println("<label for=\"email\">Email</label>\n");
            out.println("<input id=\"email\" type=\"text\" name=\"Email\" disabled value=\""+user.getEmail()+"\"/><br/>\n");
            out.println("</div>\n");
            out.println("<div id=\"pwd-row\" class=\"row\">\n");
            out.println("<label for=\"pwd\"><abbr title=\"The password has to be 6 to 10 characters long and \n");
            out.println("must contain one letter, one number and a symbol.\">Password</abbr></label>\n");
            out.println("<input id=\"pwd\" maxlength=\"10\" type=\"password\" name=\"password\"/><br/>\n");
            out.println("</div>\n");
            out.println("<div class=\"row\">\n");
            out.println("<label for=\"pwdConfirm\">Retype Password</label>\n");
            out.println("<div class=\"cell\">\n");
            out.println("<input id=\"pwdConfirm\" maxlength=\"10\" type=\"password\" name=\"passwordConfirm\"/><br/>\n");
            out.println("</div>\n");
            out.println("</div>\n");
            out.println("<div id=\"fname-row\" class=\"row\">\n");
            out.println("<label for=\"fname\">First Name</label>\n");
            out.println("<input id=\"fname\" maxlength=\"20\" type=\"text\" name=\"firstName\" value=\""+user.getFirstName()+"\"/><br/>\n");
            out.println("</div>\n");
            out.println("<div id=\"lname-row\" class=\"row\">\n");
            out.println("<label for=\"lname\">Last Name</label>\n");
            out.println("<input id=\"lname\" maxlength=\"20\" type=\"text\" name=\"lastName\" value=\""+user.getLastName()+"\"/><br/>\n");
            out.println("</div>\n");
            out.println("<div id=\"bdate-row\" class=\"row\">\n");
            out.println("<label><abbr title=\"You have to be at least 15 years old to register\">Date of Birth</abbr></label>\n");
            out.println("<div id=\"bdate-cell2\" class=\"cell date\">\n");
            out.println(fill_date(user.getBirthDate()));
            out.println("</div>\n");
            out.println("</div>\n");
            out.println("<div id=\"gender-row\" class=\"row\">\n");
            out.println("<label>Gender</label>\n");
            out.println("<div class=\"radio\">\n");
            out.println("<label for=\"male\">Male</label>\n");
            out.print("<input id=\"male\" type=\"radio\" name=\"Gender\" value=\"Male\" ");
            if(user.getGender() == User.Gender.MALE) out.print("checked");
            out.print("/>\n<label for=\"female\">Female</label>\n");
            out.print("<input id=\"female\" type=\"radio\" name=\"Gender\" value=\"Female\" ");
            if(user.getGender() == User.Gender.FEMALE) out.print("checked");
            out.println("/>\n<label for=\"notAppl\">Not Applicable</label>\n");
            out.print("<input id=\"notAppl\" type=\"radio\" name=\"Gender\" value=\"Not Applicable\" ");
            if(user.getGender() == User.Gender.UNKNOWN) out.print("checked");
            out.println("/>\n</div>\n");
            out.println("</div>\n");
            out.println("<div id=\"country-row\" class=\"row\">\n");
            out.println("<label for=\"country\">Country</label>\n");
            out.println("<select id=\"country\">");
            out.println(fill_country(user.getCountry()));
            out.println("</select><br/>\n");
            out.println("<script type=\"text/javascript\">print_country(\"country\");</script>\n");
            out.println("</div>\n");
            out.println("<div id=\"city-row\" class=\"row\">\n");
            out.println("<label for=\"city\">City</label>\n");
            out.println("<input id=\"city\" maxlength=\"50\" value=\""+user.getTown()+"\" type=\"text\" name=\"City\"/><br/>\n");
            out.println("</div>\n");
            out.println("<div class=\"row\">\n");
            out.println("<label for=\"moreInfo\">More Info</label>\n");
            out.println("<textarea id=\"moreInfo\" rows=\"10\" cols=\"40\" value=\""+user.getInfo()+"\" maxlength=\"500\"></textarea><br/>\n");
            out.println("</div>\n");
     /*      out.println("<div class=\"row\">\n");
            out.println("<div class=\"cell\"></div>\n");
            out.println("<input class=\"button\" type=\"button\" onclick=\"validateFormAndSend(\'modify\');\" value=\"Submit\"/>\n");
            out.println("</div>\n");*/
            out.println("</div>");
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
