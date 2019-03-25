/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

/**
 *
 * @author kyriazis
 */
public class ServletUtilities {
    public static String filter(String input){
        if (!hasSpecialChars(input)) {
            return(input);
        }
        
        StringBuffer filtered = new StringBuffer(input.length());
        char c;
        
        for(int i=0; i<input.length(); i++){
            c = input.charAt(i);
            switch(c){
                case '<': filtered.append("&lt;"); break;
                case '>': filtered.append("&gt;"); break;
                case '"': filtered.append("&quot;"); break;
                case '&': filtered.append("&amp;"); break;
                default: filtered.append(c);
            }
        }
        return(filtered.toString());
    }

    private static boolean hasSpecialChars(String input) {
        return input.contains("<") ||
                input.contains(">") ||
                input.contains("\"") ||
                input.contains("&");
    }
}
