/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

function StartLoading(zindex){
    var load = $(document.createElement('div'));
    load.attr('id','htmlLoading');
    load.appendTo($('html'));
    
    var loading = $(document.createElement('div'));
    $(loading).attr('class', 'loading');
    $(loading).appendTo(load);
    
    $('html').addClass('stop-scrolling');
    $(load).attr('class', 'boxLoading');
    
    if(zindex !== undefined){ load.css('z-index',zindex); }
    
    load.css('position','fixed');
    load.show();
}

function StopLoading(){
    $('html').removeClass('stop-scrolling');
    $('html').find('#htmlLoading').remove();
}