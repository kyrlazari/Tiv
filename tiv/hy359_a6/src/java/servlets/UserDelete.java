/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import cs359db.db.PhotosDB;
import cs359db.db.UserDB;
import cs359db.model.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 *
 * @author kyriazis
 */
public class UserDelete extends HttpServlet {

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
        int flag = 0;
        
        User user = (User) session.getAttribute("user");
        String userName = request.getParameter("userName");
        if(userName != null && !userName.equals("") && user.getUserName().equals(userName)){
            try {
                
                List<Integer> photos = PhotosDB.getPhotoIDs(0, userName);
                for(int i=0;i<photos.size();i++){
                    PhotosDB.deletePhoto(photos.get(i));
                }
                UserDB.deleteUser(userName);
                flag=1;
                session.removeAttribute("user");


            } catch (ClassNotFoundException ex) {
                Logger.getLogger(UserDelete.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
            
        try (PrintWriter out = response.getWriter()) {
         
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet UserDelete</title>");            
            out.println("</head>");
            out.println("<body>");
            if(flag == 1){
                out.println("<h1>The user and the images has been deleted with success!</h1>");
            }
            else{
                out.println("<h1>The user cannot deleted neither the images! </h1> ");
            }
            out.println("</body>");
            out.println("</html>");
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
