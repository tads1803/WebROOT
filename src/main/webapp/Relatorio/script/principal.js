/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


/* global google */

function onLoad(){
    $('#btFiltrar').click(function(){ Filtrar(); });
    Filtrar();
}

function Filtrar(){
    getRelTabCat();
    getRelTabMov();
}

window.onload = function(){ onLoad(); };