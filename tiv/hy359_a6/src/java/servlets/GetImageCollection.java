/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import cs359db.db.PhotosDB;
import static cs359db.db.PhotosDB.getPhotoIDs;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
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
@WebServlet(name = "GetImageCollection", urlPatterns = {"/GetImageCollection"})
public class GetImageCollection extends HttpServlet {

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
        response.setContentType("application/json");
        try (PrintWriter out = response.getWriter()) {
            String userName=request.getParameter("user");
            String number = request.getParameter("number");
            HttpSession session = request.getSession(true);
            String numberSession = (String) session.getAttribute("number");
            
            int  value=10;  
            String json;
            if(number != null && !number.equals("")){
                value=Integer.parseInt(number);
                session.setAttribute(numberSession, number);
            }else if(numberSession!=null && !numberSession.equals("")){
                value=Integer.parseInt(numberSession);
            }
            /* TODO output your page here. You may use following sample code. */
            List <Integer> photoList;
            if (userName != null && !userName.equals("")){
                photoList = PhotosDB.getPhotoIDs(value, userName);
            }else{
                photoList = PhotosDB.getPhotoIDs(value);
            }
            json="[";
            for(int i=0;i<photoList.size();i++){

                json+="\""+photoList.get(i)+"\"";
                if(i!=photoList.size()-1){
                    json+=",";
                }
            }
            json+="]";
            out.println(json);
            System.out.println(json);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(GetImageCollection.class.getName()).log(Level.SEVERE, null, ex);
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
