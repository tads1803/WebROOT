/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

function getRelTabCat(){
    
    let dados = {
        params : {
            cliente : $('#valCliente').val(),
            container : $('#valContainer').val()
        }
    };
    
    StartLoading();
    ServiceContainer.GetRelByCat(JSON.stringify(dados),function(){
        StopLoading();
        if (this.status === 200){
            try{
                InitRelCat(JSON.parse(this.responseText));
            }catch(ex){
                console.log(ex);
                alert('Erro ao tentar carregar os dados na inteface!');
            }
        }else
        if (this.status === 404){
            alert('Recurso indisponível!');
        }else{
            alert(tools.JSONException(this.responseText).getMessage());
        }
    });
}

var CamposRelCat = [[]];

function InitRelCat(dados){
    console.log(dados);
    CamposRelCat = [[]];
    CamposRelCat[0].push('Cliente');
    let lista = dados.lista;
    for (let i = 0; i < lista.length; i++){
        let cli = lista[i];
        let row = [];
        row.push(cli.nome);
        for (let ii = 0; ii < cli.tipo.length; ii++){
            let cat = cli.tipo[ii];
            if(CamposRelCat[0].length < (cli.tipo.length + 1)) CamposRelCat[0].push(cat.nome);
            row.push(cat.quantidade);
        }
        CamposRelCat.push(row);
    }
    InitTabRelCat();
    InitGraRelCat();
}

function InitTabRelCat(){
    google.charts.load('current', {packages: ['table']});
    google.charts.setOnLoadCallback(function(){
        var data = google.visualization.arrayToDataTable(CamposRelCat);
        var options = {
            showRowNumber : true,
            width: '90%',
            height: 'auto'
        };

        var table = new google.visualization.Table(document.getElementById('relTabCategoria'));
        table.draw(data, options);
    });
}

function InitGraRelCat(){
    google.charts.load('current', {packages: ['corechart', 'bar']});
    google.charts.setOnLoadCallback(function(){
        var data = google.visualization.arrayToDataTable(CamposRelCat);
        var options = {
            title: 'Quantidade de Importação e Exportação por Cliente',
            chartArea: {width: '60%'},
            hAxis: {
                title: 'Quantidade',
                minValue: 0
            },
            vAxis: {
                title: 'Cliente'
            }
        };

        var chart = new google.visualization.BarChart(document.getElementById('relGraCategoria'));
        chart.draw(data, options);
    });
    
    $('#relGraCategoria').css('height',(CamposRelCat.length * 5)+'em');
}