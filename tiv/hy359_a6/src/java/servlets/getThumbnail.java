/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import static cs359db.db.PhotosDB.getPhotoBlobWithID;
import java.awt.Color;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author kyriazis
 */
public class getThumbnail extends HttpServlet {

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
            throws ServletException {

        try {
            
            response.setContentType("text/html;charset=UTF-8");
            String width = request.getParameter("width");
            String height = request.getParameter("heigth");
            String imageId=request.getParameter("id");
            int widthValue = Integer.valueOf(width);
            int heightValue = Integer.valueOf(height);
            int imageIdValue = Integer.valueOf(imageId);
            byte[] imgData = getPhotoBlobWithID(imageIdValue);
            ByteArrayInputStream in = new ByteArrayInputStream(imgData);
            try {
                BufferedImage img = ImageIO.read(in);
                
                Image scaledImage = img.getScaledInstance(widthValue, heightValue, Image.SCALE_SMOOTH);
                BufferedImage imageBuff = new BufferedImage(widthValue, heightValue, BufferedImage.TYPE_INT_RGB);
                imageBuff.getGraphics().drawImage(scaledImage, 0, 0, new Color(0, 0, 0), null);
                
                ByteArrayOutputStream buffer = new ByteArrayOutputStream();
                
                ImageIO.write(imageBuff, "jpg", buffer);
                OutputStream os = response.getOutputStream();
                os.write(buffer.toByteArray());
                    os.flush();
                    os.close();
               
            } catch (IOException e) {
                Logger.getLogger(getThumbnail.class.getName()).log(Level.SEVERE, null, e);
            }
            
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(getThumbnail.class.getName()).log(Level.SEVERE, null, ex);
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
