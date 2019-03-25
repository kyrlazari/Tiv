/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import cs359db.model.User;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 *
 * @author kyriazis
 */
public class UserMenu extends HttpServlet {

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
            out.println("<!--Username:"+ServletUtilities.filter(user.getUserName())+"-->");
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
