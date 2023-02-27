/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


var tools = {
    // Utilize para obter os parâmetros enviados na URL
    GetHttpParameter : function(parameter) {  
        var loc = location.search.substring(1, location.search.length);   
        var param_value = false;   
        var params = loc.split("&");   
        for (i=0; i<params.length;i++) {   
            param_name = params[i].substring(0,params[i].indexOf('='));   
            if (param_name === parameter) {                                          
                param_value = params[i].substring(params[i].indexOf('=')+1);
            }   
        }   
        if (param_value) {
            return param_value;   
        }   
        else {   
            return undefined;   
        }   
    },
    
    // Retorna um objeto JSON com a exceção
    JSONException : function(txt){
        let Exception = {

            txt : undefined,

            toJSONError(){
                let json = { code : 00, message : "Erro desconhecido!" };
                try{ 
                    let jResponse = JSON.parse(this.txt);
                    if (jResponse !== undefined) {
                        if (jResponse.code !== undefined) { json.code = jResponse.code; }
                        if (jResponse.message !== undefined) { json.message = jResponse.message; }
                    }
                }catch(ex){ 
                    if (this.txt !== undefined) { json.message = this.txt; }
                }finally{
                    return json;
                }
            },

            getMessage(){
                return this.toJSONError().message;
            },

            getCode(){
                return this.toJSONError().code;
            }
        };

        Exception.txt = txt;
        return Exception;
    },
    
    //Verifica se é CPF ou CNPJ
    verificaCpfCnpj : function(valor) {

        // Garante que o valor é uma string
        valor = valor.toString();

        // Remove caracteres inválidos do valor
        valor = valor.replace(/[^0-9]/g, '');

        // Verifica CPF
        if ( valor.length === 11 ) {
            return 'CPF';
        } 

        // Verifica CNPJ
        else if ( valor.length === 14 ) {
            return 'CNPJ';
        } 

        // Não retorna nada
        else {
            return false;
        }

    }, // verificaCpfCnpj
    
    // Retorna um string CPF ou CNPJ formatado
    formataCpfCnpj : function(valor) {

        // O valor formatado
        var formatado = false;

        // Verifica se é CPF ou CNPJ
        var valida = this.verificaCpfCnpj( valor );

        // Garante que o valor é uma string
        valor = valor.toString();

        // Remove caracteres inválidos do valor
        valor = valor.replace(/[^0-9]/g, '');

        // Valida CPF
        if ( valida === 'CPF' ) {

            // Verifica se o CPF é válido
            if ( this.validaCpf(valor) ) {

                // Formata o CPF ###.###.###-##
                formatado  = valor.substr( 0, 3 ) + '.';
                formatado += valor.substr( 3, 3 ) + '.';
                formatado += valor.substr( 6, 3 ) + '-';
                formatado += valor.substr( 9, 2 ) + '';

            }

        }

        // Valida CNPJ
        else if ( valida === 'CNPJ' ) {

            // Verifica se o CNPJ é válido
            if ( this.validaCnpj(valor) ) {

                // Formata o CNPJ ##.###.###/####-##
                formatado  = valor.substr( 0,  2 ) + '.';
                formatado += valor.substr( 2,  3 ) + '.';
                formatado += valor.substr( 5,  3 ) + '/';
                formatado += valor.substr( 8,  4 ) + '-';
                formatado += valor.substr( 12, 14 ) + '';

            }

        } 

        // Retorna o valor 
        return formatado;

    }, // formataCpfCnpj
    
    /*
        Multiplica dígitos vezes posições
 
        @param string digitos Os digitos desejados
        @param string posicoes A posição que vai iniciar a regressão
        @param string soma_digitos A soma das multiplicações entre posições e dígitos
        @return string Os dígitos enviados concatenados com o último dígito
    */
    calcDigitosPosicoes : function( digitos, posicoes = 10, soma_digitos = 0 ) {

        // Garante que o valor é uma string
        digitos = digitos.toString();

        // Faz a soma dos dígitos com a posição
        // Ex. para 10 posições:
        //   0    2    5    4    6    2    8    8   4
        // x10   x9   x8   x7   x6   x5   x4   x3  x2
        //   0 + 18 + 40 + 28 + 36 + 10 + 32 + 24 + 8 = 196
        for ( var i = 0; i < digitos.length; i++  ) {
            // Preenche a soma com o dígito vezes a posição
            soma_digitos = soma_digitos + ( digitos[i] * posicoes );

            // Subtrai 1 da posição
            posicoes--;

            // Parte específica para CNPJ
            // Ex.: 5-4-3-2-9-8-7-6-5-4-3-2
            if ( posicoes < 2 ) {
                // Retorno a posição para 9
                posicoes = 9;
            }
        }

        // Captura o resto da divisão entre soma_digitos dividido por 11
        // Ex.: 196 % 11 = 9
        soma_digitos = soma_digitos % 11;

        // Verifica se soma_digitos é menor que 2
        if ( soma_digitos < 2 ) {
            // soma_digitos agora será zero
            soma_digitos = 0;
        } else {
            // Se for maior que 2, o resultado é 11 menos soma_digitos
            // Ex.: 11 - 9 = 2
            // Nosso dígito procurado é 2
            soma_digitos = 11 - soma_digitos;
        }

        // Concatena mais um dígito aos primeiro nove dígitos
        // Ex.: 025462884 + 2 = 0254628842
        var cpf = digitos + soma_digitos;

        // Retorna
        return cpf;

    }, // calcDigitosPosicoes

    //Retorna bool True para CPF correto - False para CPF incorreto
    validaCpf : function( valor ) {

        // Garante que o valor é uma string
        valor = valor.toString();

        // Remove caracteres inválidos do valor
        valor = valor.replace(/[^0-9]/g, '');

        // Captura os 9 primeiros dígitos do CPF
        // Ex.: 02546288423 = 025462884
        var digitos = valor.substr(0, 9);

        // Faz o cálculo dos 9 primeiros dígitos do CPF para obter o primeiro dígito
        var novo_cpf = this.calcDigitosPosicoes( digitos );

        // Faz o cálculo dos 10 dígitos do CPF para obter o último dígito
        var novo_cpf = this.calcDigitosPosicoes( novo_cpf, 11 );

        // Verifica se o novo CPF gerado é idêntico ao CPF enviado
        if ( novo_cpf === valor ) {
            // CPF válido
            return true;
        } else {
            // CPF inválido
            return false;
        }

    }, // validaCpf
    
    // Retorna bool true para válido, false para inválido
    validaCnpj : function(valor) {

        // Garante que o valor é uma string
        valor = valor.toString();

        // Remove caracteres inválidos do valor
        valor = valor.replace(/[^0-9]/g, '');

        // O valor original
        var cnpj_original = valor;

        // Captura os primeiros 12 números do CNPJ
        var primeiros_numeros_cnpj = valor.substr( 0, 12 );

        // Faz o primeiro cálculo
        var primeiro_calculo = this.calcDigitosPosicoes( primeiros_numeros_cnpj, 5 );

        // O segundo cálculo é a mesma coisa do primeiro, porém, começa na posição 6
        var segundo_calculo = this.calcDigitosPosicoes( primeiro_calculo, 6 );

        // Concatena o segundo dígito ao CNPJ
        var cnpj = segundo_calculo;

        // Verifica se o CNPJ gerado é idêntico ao enviado
        if ( cnpj === cnpj_original ) {
            return true;
        }

        // Retorna falso por padrão
        return false;

    }, // validaCnpj

    // Retorna bool true para válido, false para inválido
    validaCpfCnpj : function (valor) {

        // Verifica se é CPF ou CNPJ
        var valida = this.verificaCpfCnpj( valor );

        // Garante que o valor é uma string
        valor = valor.toString();

        // Remove caracteres inválidos do valor
        valor = valor.replace(/[^0-9]/g, '');


        // Valida CPF
        if ( valida === 'CPF' ) {
            // Retorna true para cpf válido
            return this.validaCpf( valor );
        } 

        // Valida CNPJ
        else if ( valida === 'CNPJ' ) {
            // Retorna true para CNPJ válido
            return this.validaCnpj( valor );
        } 

        // Não retorna nada
        else {
            return false;
        }

    } // validaCpfCnpj
};