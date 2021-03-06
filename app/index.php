<!DOCTYPE html>
<html lang="pt_br" >
  <head>
    <!--<base href="/app/">-->
    <title>Seguros Já! - Fiança Locatícia</title>

  <?php
        ini_set('default_charset','UTF-8');
    ?>
    
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />

    <link rel='stylesheet' href='assets/fontes/fonte.css'>
    <link rel="stylesheet" href="../node_modules/angular-material/angular-material.min.css"/>
    <link rel="stylesheet" href="assets/app.css"/>
    <link rel="stylesheet" href="../node_modules/bootstrap/dist/css/bootstrap.min.css"/>
    <link rel="stylesheet" href="../node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css"/>
  
    <!--SELECT 2-->
  <link rel="stylesheet" href="../node_modules/select2/dist/css/select2.min.css"/>

    <style type="text/css">
        /**
         * Hide when Angular is not yet loaded and initialized
         */
        [ng\:cloak], [ng-cloak], [data-ng-cloak], [x-ng-cloak], .ng-cloak, .x-ng-cloak {
          display: none !important;
        }
        .alert{
          padding: 10px !important;
          margin-bottom: 0px !important;
        }
    </style>

  </head>

<body ng-app="app" ng-cloak>

  <!-- Captura o codigo do registro -->
  <input name="codigo" type="hidden" value="<?echo $_POST['codigo'];?>" />

  <!-- Captura o codigo da seguradora -->
  <input name="codigo_seguradora" type="hidden" value="<?echo $_POST['codigo_seguradora'];?>" />

  <!-- Captura o codigo da carta oferta -->
  <input name="codigo_carta_oferta" type="hidden" value="<?echo $_POST['codigo_carta_oferta'];?>" />

  <div id="container-principal" class="container">
    <!-- Inclusão da pagina do formulario -->
      <div data-ng-include="'./src/view/formulario/principal.html'" ng-controller="MainController"></div> 
  </div>

    <!-- Bibliotecas Angular-Material -->
    <script src="../node_modules/angular/angular.min.js"></script>
    <script src="../node_modules/angular-locale-pt-br/angular-locale_pt-br.js"></script>
    <script src="../node_modules/angular-animate/angular-animate.min.js"></script>
    <script src="../node_modules/angular-aria/angular-aria.min.js"></script>
    <script src="../node_modules/angular-file-upload/dist/angular-file-upload.min.js"></script>
    <script type="text/javascript" src="../node_modules/angular-material/angular-material.min.js"></script>
    <script type="text/javascript" src="../node_modules/angular-route/angular-route.min.js"></script>
    <script type="text/javascript" src="../node_modules/angular-utils-pagination/dirPagination.js"></script>

    <!-- Bibliotecas Jquery + Boostrap -->
    <script type="text/javascript" src="../node_modules/jquery/dist/jquery.min.js"></script>
    <script type="text/javascript" src="../node_modules/jquery.maskedinput/src/jquery.maskedinput.js"></script>
    <script type="text/javascript" src="../node_modules/jquery-maskmoney/dist/jquery.maskMoney.min.js"></script>
    <script type="text/javascript" src="../node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="../node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js"></script>
    <script type="text/javascript" src="../node_modules/bootstrap-datepicker/dist/locales/bootstrap-datepicker.pt-BR.min.js"></script>
  <script type="text/javascript" src="../node_modules/select2/dist/js/select2.min.js"></script>

    <script src="./src/app.js"></script>
    <script src="./src/diretiva/diretiva.js"></script>
    <script src="./src/diretiva/filters.js"></script>
    <script src="./src/service/ServiceUtil.js"></script>
    <script src="./src/service/MessageUtil.js"></script>
    <script src="./src/message/message.min.js"></script>
    <script src="./src/service/DataUtil.js"></script>
    <script src="./src/service/FormularioService.js"></script>
    <script src="./src/service/ValidaService.js"></script>
    <script src="./src/controller/MainController.js"></script>
    <script src="./src/controller/ListaController.js"></script>
    <script type="text/javascript">

          angular
              .module('starterApp', ['ngMaterial', 'users'])
              .config(function($mdThemingProvider){                                    
                      $mdThemingProvider.theme('default')
                          .primaryPalette('brown')
                          .accentPalette('red');

              });  

    </script> 

  </body>
</html>
