/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


function getRelTabMov(){
    
    let dados = {
        params : {
            cliente : $('#valCliente').val(),
            container : $('#valContainer').val(),
            dataIniciadoDe : $('#dataIniciadoDe').val(),
            dataIniciadoAte : $('#dataIniciadoAte').val()
        }
    };
    
    console.log(dados);
    
    StartLoading();
    ServiceMovimentacao.GetRelByMov(JSON.stringify(dados), function(){
        StopLoading();
        if (this.status === 200){
            try{
                InitRelMov(JSON.parse(this.responseText));
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

var CamposRelMov = [[]];

function InitRelMov(dados){
    console.log(dados);
    CamposRelMov = [[]];
    CamposRelMov[0].push('Cliente');
    let lista = dados.lista;
    for (let i = 0; i < lista.length; i++){
        let cli = lista[i];
        let row = [];
        row.push(cli.nome);
        for (let ii = 0; ii < cli.tipo.length; ii++){
            let tipo = cli.tipo[ii];
            if(CamposRelMov[0].length < (cli.tipo.length + 1)) CamposRelMov[0].push(tipo.nome);
            row.push(tipo.quantidade);
        }
        CamposRelMov.push(row);
    }
    InitTabRelMov();
    InitGraRelMov();
}

function InitTabRelMov(){
    google.charts.load('current', {packages: ['table']});
    google.charts.setOnLoadCallback(function(){
        var data = google.visualization.arrayToDataTable(CamposRelMov);
        var options = {
            showRowNumber : true,
            width: '90%',
            height: 'auto'
        };

        var table = new google.visualization.Table(document.getElementById('relTabMovimentacao'));
        table.draw(data, options);
    });
}

function InitGraRelMov(){
    google.charts.load('current', {packages: ['corechart', 'bar']});
    google.charts.setOnLoadCallback(function(){
        var data = google.visualization.arrayToDataTable(CamposRelMov);
        var options = {
            title: 'Quantidade por Tipo de Movimentações',
            chartArea: {width: '60%'},
            hAxis: {
                title: 'Quantidade',
                minValue: 0
            },
            vAxis: {
                title: 'Cliente'
            }
        };

        var chart = new google.visualization.BarChart(document.getElementById('relGraMovimentacao'));
        chart.draw(data, options);
    });
    
    $('#relGraMovimentacao').css('height',(CamposRelCat.length * 5)+'em');
}