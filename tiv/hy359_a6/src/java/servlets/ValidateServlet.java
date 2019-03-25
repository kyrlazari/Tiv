/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import cs359db.db.UserDB;
import cs359db.model.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 *
 * @author kyriazis
 */
@SuppressWarnings("unchecked")
@WebServlet(name="ValidateServlet", urlPatterns={"/ValidateServlet"})
public class ValidateServlet extends HttpServlet {

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
        String pwd="";
        if(request.getParameter("logout") != null && request.getParameter("logout").equals("true")){
            HttpSession session = request.getSession(true);
            session.removeAttribute("user");
            session.removeAttribute("number");
        }else if(request.getParameter("uname") != null && request.getParameter("pwd") != null){
            try {
                User user = UserDB.getUser(request.getParameter("uname"));
                String password = request.getParameter("pwd");
                try {
                        MessageDigest md = MessageDigest.getInstance("MD5");
                        md.update(password.getBytes());
                        byte byteData[] = md.digest();
                        StringBuffer sb = new StringBuffer();
                        for (int i = 0; i < byteData.length; i++){
                            sb.append(Integer.toString((byteData[i] & 0xff) + 0x100, 16).substring(1));
                        }    
                            System.out.println("Password is : " + sb.toString());
                            user.setPassword(sb.toString());
                            pwd = sb.toString();
                    } catch (NoSuchAlgorithmException ex) {
                        Logger.getLogger(UserRegister.class.getName()).log(Level.SEVERE, null, ex);
                    }
                    if(user != null && user.getPassword().equals(pwd)){
                    HttpSession session = request.getSession(true);
                    session.setAttribute("user", user);
                    try(PrintWriter out = response.getWriter()){
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
                        out.println("</table>");
                    }
                }else{
                    response.setStatus(420);
                }
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(ValidateServlet.class.getName()).log(Level.SEVERE, null, ex);
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
