/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;
import java.security.*;
import cs359db.model.User;
import cs359db.db.UserDB;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 *
 * @author kyriazis
 */
public class UserRegister extends HttpServlet {

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
        
        
        String reply = "";
        User user = new User();
        int type = 0;
        if(request.getParameter("register") != null && request.getParameter("register").equals("true")){
            type = 0;
        }else if(request.getParameter("modify") != null && request.getParameter("modify").equals("true")){
            type = 1;
            HttpSession session = request.getSession(true);
            user = (User) session.getAttribute("user");
        }
        if(request.getParameter("uname") != null && !request.getParameter("uname").equals("") &&
                request.getParameter("email") != null && !request.getParameter("email").equals("") &&
                request.getParameter("pwd") != null &&
                request.getParameter("fname") != null && !request.getParameter("fname").equals("") &&
                request.getParameter("lname") != null && !request.getParameter("lname").equals("") &&
                request.getParameter("bday") != null && !request.getParameter("bday").equals("") &&
                request.getParameter("bmonth") != null && !request.getParameter("bmonth").equals("") &&
                request.getParameter("byear") != null && !request.getParameter("byear").equals("") &&
                request.getParameter("country") != null && !request.getParameter("country").equals("") &&
                request.getParameter("city") != null && !request.getParameter("city").equals("")){
                
            try {
                String uname = request.getParameter("uname");
                String email = request.getParameter("email");
                if(type == 0 && !UserDB.checkValidUserName(uname)){
                    response.setStatus(420);
                    reply = "<h2>Username already exists<h2>";
                }else if(type == 0 && !UserDB.checkValidEmail(email)){
                    response.setStatus(421);
                    reply = "<h2>Email already exists<h2>";
                }else{
                    String birthday = "" + request.getParameter("byear") + "-" +
                            request.getParameter("bmonth") + "-" + request.getParameter("bday");
                    user.setUserName(uname);
                    user.setEmail(email);
                    if(type == 0 ||(type == 1 && request.getParameter("modifyPass").equals("true"))){
                        user.setPassword(request.getParameter("pwd"));
                    }
                    try {
                        MessageDigest md = MessageDigest.getInstance("MD5");
                        md.update(user.getPassword().getBytes());
                        byte byteData[] = md.digest();
                        StringBuffer sb = new StringBuffer();
                        for (int i = 0; i < byteData.length; i++){
                            sb.append(Integer.toString((byteData[i] & 0xff) + 0x100, 16).substring(1));
                        }    
                            System.out.println("Digest(in hex format):: " + sb.toString());
                            user.setPassword(sb.toString());
                    } catch (NoSuchAlgorithmException ex) {
                        Logger.getLogger(UserRegister.class.getName()).log(Level.SEVERE, null, ex);
                    }
                    
                    user.setFirstName(request.getParameter("fname"));
                    user.setLastName(request.getParameter("lname"));
                    user.setBirthDate(birthday);
                    user.setCountry(request.getParameter("country"));
                    user.setTown(request.getParameter("city"));
                    if(request.getParameter("gender")!= null){
                        user.setGender(request.getParameter("gender"));
                    }
                    if(request.getParameter("moreInfo")!= null){
                        user.setInfo(request.getParameter("moreInfo"));
                    }
                    if (type == 0){
                        try {
                            UserDB.addUser(user);
                        } catch (ClassNotFoundException ex) {
                            Logger.getLogger(UserRegister.class.getName()).log(Level.SEVERE, null, ex);
                        }
                    }else if(type == 1){
                        try {
                            UserDB.updateUser(user);
                        } catch (ClassNotFoundException ex) {
                            Logger.getLogger(UserRegister.class.getName()).log(Level.SEVERE, null, ex);
                        }
                    }
                }
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(UserRegister.class.getName()).log(Level.SEVERE, null, ex);
            }
        }else{
            response.setStatus(400);
        }
        
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            if(response.getStatus() == 200){
                out.println("<!DOCTYPE html>");
                out.println("<html>");
                out.println("<head>");
                out.println("<title>Servlet user_register</title>");            
                out.println("</head>");
                out.println("<body>");
                out.println("<h1>User Info</h1>");
                out.println("<table><tr><td>Username</td><td>"+ServletUtilities.filter(user.getUserName())+"</td></tr>");
                out.println("<tr><td>E-mail</td><td>"+ServletUtilities.filter(user.getEmail())+"</td></tr>");
                out.println("<tr><td>First Name</td><td>"+ServletUtilities.filter(user.getFirstName())+"</td></tr>");
                out.println("<tr><td>Last Name</td><td>"+ServletUtilities.filter(user.getLastName())+"</td></tr>");
                out.println("<tr><td>Date of Birth</td><td>"+ServletUtilities.filter(user.getBirthDate())+"</td></tr>");
                out.println("<tr><td>Gender</td><td>"+ServletUtilities.filter(user.getGender().toString())+"</td></tr>");
                out.println("<tr><td>Country</td><td>"+ServletUtilities.filter(user.getCountry())+"</td></tr>");
                out.println("<tr><td>City</td><td>"+ServletUtilities.filter(user.getTown())+"</td></tr>");
                if(!user.getInfo().equals("")){
                    out.println("<tr><td>More Info</td><td>"+ServletUtilities.filter(user.getInfo())+"</td></tr>");
                }
                out.println("</table></body>");
                out.println("</html>");
            }
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
