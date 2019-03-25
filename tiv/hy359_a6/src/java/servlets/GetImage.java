/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import static cs359db.db.PhotosDB.getPhotoBlobWithID;
import static cs359db.db.PhotosDB.getPhotoMetadataWithID;
import cs359db.model.Photo;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author kyriazis
 */
@WebServlet(name = "GetImage", urlPatterns = {"/GetImage"})
public class GetImage extends HttpServlet {

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
        response.setContentType("image/jpg");   // Use the appropriate type from 
            /* TODO output your page here. You may use following sample code. */
            String imageId=request.getParameter("id");
            String metadata = request.getParameter("metadata");
            String thumb = request.getParameter("thumb") ;
            Boolean thumbValue= Boolean.valueOf(thumb);
            Boolean value = Boolean.valueOf(metadata);
            int id = Integer.valueOf(imageId);
            
            if((metadata == null || metadata.equals("") || !value) && !thumbValue){
                OutputStream os = response.getOutputStream(); // output with the help of outputStream
                try {
                    byte[] imgData = getPhotoBlobWithID(id);
                    os.write(imgData);
                    os.flush();
                    os.close(); 
                } catch (ClassNotFoundException ex) {
                    Logger.getLogger(GetImage.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
            else if(value && !thumbValue){
                try (PrintWriter out = response.getWriter()) {
                    response.setContentType("application/json");
                    String json="";
                    Photo photo = getPhotoMetadataWithID(id);
                    json+="{\"userName\":"+"\""+photo.getUserName()+"\""+", \"title\":"
                            +"\""+photo.getTitle()+"\""+",\"date\":"+"\""+photo.getDate()
                            +"\""+",\"contentType\":"+"\""+photo.getContentType()+"\""
                            +",\"numberOfRatings\":"+"\""+photo.getNumberOfRatings()+"\""+"}";
                    out.println(json);
                } catch (ClassNotFoundException ex) {
                    Logger.getLogger(GetImage.class.getName()).log(Level.SEVERE, null, ex);
                }
                
            }
            else if(thumbValue){
                RequestDispatcher dispatcher=getServletConfig().getServletContext().getRequestDispatcher("/getThumbnail");
                dispatcher.forward(request,response);
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
