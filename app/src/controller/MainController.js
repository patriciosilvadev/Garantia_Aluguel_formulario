 angular
       .module('app')
       .controller('MainController', ['$scope', '$http', 'serviceUtil', 'formularioService', 'validaService', 'FileUploader', 'dataUtil','$timeout',
        function($scope, $http, service, formularioService, validador, FileUploader, dataUtil, $timeout){
    	   
    	  var _url = service.getUrl();
    	  
    	  $scope.filtroImob = {};//filtro para selecionar imobiliaria caso não seja passado um cnpj na url
    	  //$('#modalSelectImob').modal('show') abre o modal de selecionar imobiliaria

        //obtem os parametros na url se existir
        $scope.paramUrl = service.extraiParamUrl(location.search.slice(1));
        
        var codRegistro = service.apenasNumeros($("input[name='codigo']").val());
        var codCartaOferta = $("input[name='codigo_carta_oferta']").val();
        $scope.codSeguradora = service.apenasNumeros($("input[name='codigo_seguradora']").val());
        
       
          //controla o hide/show do botão ir para topo quando chegar no fim da pagina
        $(window).scroll(function () {
          //usar esse if para exibir o btn ir para o top quando o usuario rolar a pagina
          //if ($(this).scrollTop() > 100); 

          var maxTop = document.body.scrollHeight - (document.body.clientHeight + 300);
           if (parseInt($(this).scrollTop()) >= maxTop) {
            $('.btn-go-top').addClass('display').fadeIn();
           } else {
            $('.btn-go-top').removeClass('display').fadeOut();
           }
        });
          
          /*Função voltar para o topo da pagina*/
          $scope.gotoTop = function(){
            $("html, body").animate({ scrollTop: 0 }, 300);
          }

          /*rola a pagina até o id passado*/
          $scope.goTo = function(id){
           service.moveTo(id);
          }

          /*************************FUNÇÕES DO FORMULÁRIO**********************/
          $scope.errors = [];
          var erroCep = '';
          var passosValidados = [];
          $scope.passo = '1';

          $scope.filtro = {};
          $scope.cadastro = {};
          $scope.cadastro.imobiliaria = {};
          $scope.cadastro.pretendente = {nacionalidade: 'Brasileiro(a)', tipoInquilino: 'F'};
          $scope.cadastro.residencia = {};
          $scope.cadastro.profissional = {};
          $scope.cadastro.imovel = {};
		  
		  $scope.porto      = {};
		  $scope.liberty    = {};
		  $scope.tooseguros = {};
		  $scope.corretoras = {};
		  
          $scope.cadastro.pessoal = {tipoPessoa : 'FISICA'};
          
          var carregarDadosPeloCpfCnpj = function(cnpjParamMetodo){
                  var cpfCnpjParam = cnpjParamMetodo ? cnpjParamMetodo : service.formatarCpfCnpj(service.decriptografar($scope.paramUrl.var1));
                  $http.post(_url + 'php/consulta.php/consultarCpfCnpj', {cpfCnpj : cpfCnpjParam}).then(function(data){
                  var dadosImobiliaria = service.extraiParamUrl(data.data);
                  $scope.cadastro.imobiliaria.codigo = dadosImobiliaria.codigo;
                  $scope.cadastro.imobiliaria.fantasia = dadosImobiliaria.fantasia;
                  $scope.cadastro.imobiliaria.razao = dadosImobiliaria.razao;
                  $scope.cadastro.imobiliaria.corretor = dadosImobiliaria.corretor;
                  $scope.cadastro.imobiliaria.cnpj = cpfCnpjParam;
                   
                  if($scope.paramUrl){
                	  $scope.cadastro.imovel.aluguel = service.formatarValor(service.decriptografar($scope.paramUrl.var2));
                	  $scope.cadastro.imovel.condominio = service.formatarValor(service.decriptografar($scope.paramUrl.var3));
                	  $scope.cadastro.imovel.iptu = service.formatarValor(service.decriptografar($scope.paramUrl.var4));
                	  $scope.cadastro.imovel.agua = service.formatarValor(service.decriptografar($scope.paramUrl.var5));
                	  $scope.cadastro.imovel.luz = service.formatarValor(service.decriptografar($scope.paramUrl.var6));
                	  $scope.cadastro.imovel.gas = service.formatarValor(service.decriptografar($scope.paramUrl.var7));
                	  $scope.cadastro.imovel.solicitante = service.decriptografar($scope.paramUrl.var8);
                	  $scope.cadastro.pretendente.nome = $scope.paramUrl.var9 ? $scope.paramUrl.var9.replace(/%20/g, ' ') : ''; //%20 são os espaços
                	  $scope.cadastro.pretendente.cpf = service.decriptografar($scope.paramUrl.var10);
                	  $scope.cadastro.pretendente.tipoInquilino = ($scope.paramUrl.var11 && ['F', 'J'].includes($scope.paramUrl.var11.toUpperCase())) ? $scope.paramUrl.var11 : 'F';
                	  $scope.cadastro.imovel.nivelAcesso = $scope.paramUrl.var12 ? $scope.paramUrl.var12 : '';
                  }
      			 
      			 
      			 //se existir codigo do solicitante obtem o usuario solicitante
      			 if($scope.cadastro.imovel.solicitante && $scope.cadastro.imovel.nivelAcesso){
      				 obterUsuarioSolicitante($scope.cadastro.imovel.solicitante, $scope.cadastro.imovel.nivelAcesso);
      			 }
      			 
                  }, function(erro){
                    service.alertarErro(erro.statusText);
                  });
          }
          
          
          /**
           * Obtem o Usuario solicitante
           */
          var obterUsuarioSolicitante = function(codigo, nivelAcesso){
        	  $http.post(_url + 'php/consulta.php/consultarPorCodigoUsuario', {codigoUser: codigo, nivel : nivelAcesso}).then(function(data){
        		  if(data.data && data.data.nome){
        			  $scope.usuarioSolicitante = ' - Usuário ' + data.data.nome;
        		  }
             }, function(erro){
               service.alertarErro(erro.statusText);
             });
          }
          
          /**
           * Obtem a lista de imobiliarias
           */
          $scope.listarImobiliariasPorCidade = function(){
        	  $http.post(_url + 'php/consulta.php/consultarImobsPorCidade', {cidade: $scope.filtroImob.cidade}).then(function(data){
        		 $scope.listaImobiliarias = data.data;
             }, function(erro){
               service.alertarErro(erro.statusText);
             });
          }
          
          /**
           * Seleciona a imobiliaria
           */
          $scope.selecionarImobiliaria = function(){
        	  if($scope.filtroImob.imobNaoParceira){
        		  if($scope.filtroImob.estado){
        			 var cpfCnpj = service.formatarCpfCnpj(service.decriptografar(formularioService.obterCpfCnpjPeloEstado($scope.filtroImob.estado)));
        			 carregarDadosPeloCpfCnpj(cpfCnpj);
        			 $('#modalSelectImob').modal('hide');
        		  }else{
        			  service.alertarErro('Selecione uma estado.');
        		  }
        		  
        	  }else{
        		  if($scope.filtroImob.imobiliaria){
        			  carregarDadosPeloCpfCnpj($scope.filtroImob.imobiliaria.cpf);
        			  $('#modalSelectImob').modal('hide');
        			  
        		  }else{
        			  service.alertarErro('Selecione uma imobiliaria para vincular ao cadastro.');
        		  }
        	  }
          }
          
          /*gera o link para a pasta upload*/
           $scope.gerarLinkPastaUpload = function(cadastro){
            return service.gerarLinkPastaUpload(cadastro.codigo, cadastro.pretendente.nome);
          }

          /*inicia as configurações de upload*/
          var iniciarUpload = function(id_codigo){
            $scope.uploader = new FileUploader({
              url : _url + 'php/upload.php',
              formData:[{codigo: id_codigo}]
            });

             /*Envia o upload dos arquivos*/
          $scope.enviarArquivos = function(){
            var listaTipoNaoInformado = $scope.uploader.queue
                                          .filter(item=> !item.isUploaded)
                                          .filter(item=> !item.file.tipoDoc || 
                                          angular.equals(item.file.tipoDoc, 'outros') && !item.file.descOutros);

            if(listaTipoNaoInformado.length > 0){
              service.alertar('Informe o tipo do documento.');

            }else{
                $scope.uploader.queue.forEach(function(item, index){
                var arrayName = item.file.name.split('.');
                var extensao = '.' + arrayName[arrayName.length - 1];

                if(angular.equals(item.file.tipoDoc, 'outros')){
                  item.file.name = (index + 1) + '-' + item.file.descOutros + extensao;
                }else{
                  item.file.name = (index + 1) + '-' + item.file.tipoDoc + extensao;
                }
              });

              $scope.uploader.uploadAll();
            }
            
          }


           /*função chamada em caso de erro no upload*/
          $scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
            service.alertarErro(response);
          };

          $scope.uploader.onCompleteAll = function() {
            service.alertar('Arquivos enviados com sucesso!');
          };
        } 

        //########### PESQUISA CADASTRO POR CPF INQUILINO ##########################
        $scope.pesquisarCpfInquilino = function(){
          $http.post(_url + 'php/consulta.php/consultarPorCpfInquilino', {cpf: service.formatarCpfCnpj($scope.filtro.cpf)}).then(function(data){
        	 if(data.data.length == 0){
        		 service.alertar('Cadastro não encontrado.');
        		 $scope.filtro.cpf = '';
        		 
        	 }else{
        		 var cadastroPreenchido = formularioService.preencherFormulario(data.data[0]);
        		 if(!angular.equals(cadastroPreenchido.imobiliaria.cnpj, $scope.cadastro.imobiliaria.cnpj)){
        			 service.alertar('Esse cadastro está vinculado a outra imobiliária. Contate a corretora de seguros.');
        			 
        		 }else{
        			 $scope.cadastro = formularioService.preencherFormulario(data.data[0]);
        			 $scope.isAlteracao = true;
        			 iniciarUpload($scope.cadastro.codigo);
        			 verificarSeFezUploadArquivos();
        			 $scope.passo = '1';
        		 }
        	 }
        	 
            }, function(erro){
              service.alertarErro(erro.statusText);
            });
        }
        
        var pesquisarPorCodigoRegistro = function(codigoReg){
            $http.post(_url + 'php/consulta.php/consultarPorCodigoRegistro', {codigo: codigoReg}).then(function(data){
          	 if(data.data.length == 0){
          		 service.alertar('Não foi possivel carreger o registro pelo código');
          		 
          	 }else{
          		 $scope.cadastro = formularioService.preencherFormulario(data.data[0]);
          		 $scope.isAlteracao = true;
          		 iniciarUpload($scope.cadastro.codigo);
                 verificarSeFezUploadArquivos();
                 $scope.passo = '1';
          	 }
          	 
              }, function(erro){
                service.alertarErro(erro.statusText);
              });
          }

        //verifica se fez Upload de arquivos
        var verificarSeFezUploadArquivos = function(){
           $http.post(_url + 'php/consulta.php/fezUploadArquivos', {pasta: $scope.gerarLinkPastaUpload($scope.cadastro)}).then(function(data){ 
            $scope.cadastro.fezUpload = data.data.qtd > 0;
            }, function(erro){
             service.alertarErro(erro.statusText);
            });
        }
        //######################################################################

          /** Submete o formulario ao PHP*/
          $scope.salvar = function(){
			  
			/*
            $scope.cadastro.pretendente.cpf = service.formatarCpfCnpj($scope.cadastro.pretendente.cpf);

            $http.post('../app/php/api.php/salvarFormulario', $scope.cadastro).then(function(data){
             
              if($scope.isAlteracao){
                $scope.codigoCadastro = $scope.cadastro.codigo
                service.alertar('Cadastro alterado com sucesso.');
                
              }else{
                $scope.codigoCadastro = data.data;
                service.exibirAlertaCadastro();
                iniciarUpload($scope.codigoCadastro);
              }
                            
              $scope.proximoPasso();
            }, function(erro){
              service.alertarErro(erro.statusText);
            });
            */			
			   
			 
			if($scope.paramUrl){
				if($scope.paramUrl.var8 != undefined){
					$scope.cadastro.imovel.solicitante = service.decriptografar($scope.paramUrl.var8);
				}else{
					$scope.cadastro.imovel.solicitante = '';
				}	
			}else{
				$scope.cadastro.imovel.solicitante = '';
			}
			 
			console.log($scope.cadastro);
			  
            //garante a formatação do cpf
            $scope.cadastro.pretendente.cpf = service.formatarCpfCnpj($scope.cadastro.pretendente.cpf);
            $scope.cadastro.status = '1';
            
            $http.post(_url + 'php/api.php/salvarFormulario', $scope.cadastro).then(function(data){
            	$scope.proximoPasso();
            	
				    $scope.geraAnaliseLib = 0;
					$scope.geraAnalisePor = 0;
					$scope.geraAnaliseToo = 0;
             
					if($scope.isAlteracao){
						
						        if($scope.codSeguradora != undefined && $scope.codSeguradora != ''){
									
									if($scope.codSeguradora == "lib"){
										$scope.geraAnaliseLib = 1;
									}
									
									if($scope.codSeguradora == "por"){
										$scope.geraAnalisePor = 1;
									}
									
									if($scope.codSeguradora == "too"){
										$scope.geraAnaliseToo = 1;
									}
									
								}
						  
								$scope.codigoCadastro = $scope.cadastro.codigo;
								$scope.corretoras.codMsg = 1;
								$scope.codigoStatus = 4;

								$http.get("https://www.segurosja.com.br/gerenciador/aplicacao_liberty_fianca/api_resposta.php?codigo_fianca="+$scope.codigoCadastro+"&gera_analise="+$scope.geraAnaliseLib).then(function(data){
													   
										$scope.liberty.msgValidacao  = data.data.msgValidacao;
										$scope.liberty.codigoStatus  = data.data.codigoStatus;
										
										console.log('LIBERTY');
										console.log(data.data);
									
										if($scope.cadastro.imovel.finalidade == 'R'){
									
												console.log('RESIDENCIAL');
											
												$http.get("https://www.segurosja.com.br/gerenciador/aplicacao_porto/api_resposta.php?codigo_fianca="+$scope.codigoCadastro+"&gera_analise="+$scope.geraAnalisePor).then(function(data){
										   
															$scope.porto.msgValidacao  = data.data.msgValidacao;
															$scope.porto.codigoStatus  = data.data.codigoStatus;
										
															if(($scope.liberty.codigoStatus == 1) && ($scope.porto.codigoStatus == 1)){
																$scope.codMsg = 2;
															}
															
															if(($scope.liberty.codigoStatus == 1) && ($scope.porto.codigoStatus == 2) || ($scope.liberty.codigoStatus == 2) && ($scope.porto.codigoStatus == 1)){
																$scope.corretoras.codMsg = 1;
															}
															
															if(($scope.liberty.codigoStatus == 3) && ($scope.porto.codigoStatus == 3)){
																$scope.corretoras.codMsg = 4;
															}                                                            $scope.enviaEmails($scope.codigoCadastro);
									 
									                        console.log('PORTO');
															console.log(data.data);
															
															service.alertar('Cadastro alterado com sucesso.');
															//$scope.proximoPasso();
																	
												  
												}, function(erro){
												  service.alertarErro(erro.statusText);
												});
											
										}else{
											
											    if(($scope.liberty.codigoStatus == 1) && ($scope.porto.codigoStatus == 1)){
													$scope.codMsg = 2;
												}
												
												if(($scope.liberty.codigoStatus == 1) && ($scope.porto.codigoStatus == 2) || ($scope.liberty.codigoStatus == 2) && ($scope.porto.codigoStatus == 1)){
													$scope.corretoras.codMsg = 1;
												}
												
												if(($scope.liberty.codigoStatus == 3) && ($scope.porto.codigoStatus == 3)){
													$scope.corretoras.codMsg = 4;
												}                                                $scope.enviaEmails($scope.codigoCadastro);
											
												service.alertar('Cadastro alterado com sucesso.');
												//$scope.proximoPasso();
												$scope.porto.codigoStatus  = 2;
												console.log('COMERCIAL');
												
										}
										   
								  
								}, function(erro){
								  service.alertarErro(erro.statusText);
								}); 
						
					}else{
						  
								$scope.codigoCadastro = data.data;
								$scope.corretoras.codMsg = 1;
								$scope.tooseguros.codigoStatus = 4;
								iniciarUpload($scope.codigoCadastro);
								
								$http.get("https://www.segurosja.com.br/gerenciador/aplicacao_liberty_fianca/api_resposta.php?codigo_fianca="+$scope.codigoCadastro +"&carta_especifica=" + codCartaOferta +"&gera_analise=1").then(function(data){
						   
										$scope.liberty.msgValidacao  = data.data.msgValidacao;
										$scope.liberty.codigoStatus  = data.data.codigoStatus;
										
										if($scope.cadastro.imovel.finalidade == 'R'){
										
												console.log('RESIDENCIAL');
											
												$http.get("https://www.segurosja.com.br/gerenciador/aplicacao_porto/api_resposta.php?codigo_fianca="+$scope.codigoCadastro+"&gera_analise=1").then(function(data){
								   
															$scope.porto.msgValidacao  = data.data.msgValidacao;
															$scope.porto.codigoStatus  = data.data.codigoStatus;
												  
															if(($scope.liberty.codigoStatus == 1) && ($scope.porto.codigoStatus == 1)){
																$scope.corretoras.codMsg = 2;
															}
															
															if(($scope.liberty.codigoStatus == 1) && ($scope.porto.codigoStatus == 2) || ($scope.liberty.codigoStatus == 2) && ($scope.porto.codigoStatus == 1)){
																$scope.corretoras.codMsg = 1;
															}
															
															if(($scope.liberty.codigoStatus == 3) && ($scope.porto.codigoStatus == 3)){
																$scope.corretoras.codMsg = 4;
															}                                                            $scope.enviaEmails($scope.codigoCadastro);
									
															service.exibirAlertaCadastro();
															//iniciarUpload($scope.codigoCadastro);		
															//$scope.proximoPasso();

										  
												}, function(erro){
												  service.alertarErro(erro.statusText);
												});
										
										
										}else{
											
											    if(($scope.liberty.codigoStatus == 1) && ($scope.porto.codigoStatus == 1)){
													$scope.corretoras.codMsg = 2;
												}
												
												if(($scope.liberty.codigoStatus == 1) && ($scope.porto.codigoStatus == 2) || ($scope.liberty.codigoStatus == 2) && ($scope.porto.codigoStatus == 1)){
													$scope.corretoras.codMsg = 1;
												}
												
												if(($scope.liberty.codigoStatus == 3) && ($scope.porto.codigoStatus == 3)){
													$scope.corretoras.codMsg = 4;
												}                                                $scope.enviaEmails($scope.codigoCadastro);
											
												console.log('COMERCIAL');
												
												service.exibirAlertaCadastro();
												$scope.porto.codigoStatus  = 2;								
												//iniciarUpload($scope.codigoCadastro);
												//$scope.proximoPasso();
											
										}
										   
								}, function(erro){
								  service.alertarErro(erro.statusText);
								}); 
										
					}
								  
			}, function(erro){
			  service.alertarErro(erro.statusText);
			});
			
			
			$scope.tooseguros.codigoStatus  = 2;

			
          }
        
          var setarPasso = function(passo){
            $scope.passo = passo;
          }

          var isPassoValidado = function(passo){
            return passosValidados.indexOf(passo) > -1;
          }

          $scope.proximoPasso = function(){
            if($scope.errors.length == 0){
               if(!isPassoValidado($scope.passo))
                passosValidados.push($scope.passo);

               setarPasso(service.obterProximoPasso($scope.passo));
               
              }else{
                if(isPassoValidado($scope.passo))
                  passosValidados.splice(passosValidados.indexOf($scope.passo), 1);
                
                setTimeout(function(){
                  $scope.goTo('listErrors');
                });
                
              }
          }

          //navega entre as abas
          $scope.navegarAbas = function(passo){
        	  if($scope.isAlteracao){
        		  iniciarVariavelErro();
        		  switch ($scope.passo) {
        		  case "1": $scope.validarDadosPretendente('formDadosPretendente', true);
        		  break;
        		  case "2": $scope.validarDadosResidenciais('formDadosResidenciais', true);
        		  break;
        		  
        		  case "3": $scope.validarDadosProfissionais('formDadosProfissionais', true);
        		  break;
        		  
        		  case "4": $scope.validarDadosDoImovel('formDadosImovel', true);
        		  break;
        		  }
        		  
        		  if($scope.errors.length > 0){
             		 service.alertarErro('Favor corrigir os erros de validação antes de navegar para outra aba.');
             	 }else{
             		 setarPasso(passo);
             	 }
        		  
        	  }else{
              var passoAtual = parseInt($scope.passo)
              var passoPretendido = parseInt(passo)
              if(passoAtual > passoPretendido || 
                  (isPassoValidado(passoAtual.toString()) && (passoAtual + 1) == passoPretendido)){
                setarPasso(passo);

              }else{
                var validado = true;
                for (var i = 1; i < parseInt(passo); i++) {
                    if(!isPassoValidado(i.toString())){
                      service.alertarErro('Preencha os dados obrigatorios das abas anteriores.');
                      validado = false;
                      break;
                    }
                  }

                if(validado)
                  setarPasso(passo);
              }
            }   
            
          }

          $scope.passoAnterior = function(){
           $scope.passo = service.obterPassoAnterior($scope.passo);
          }

          $scope.getLabelEtapa = function(etapa){
            return service.labelEtapa(etapa);
          }
          
          var iniciarVariavelErro = function(){
        	  $scope.errors = [];
        	  if(erroCep){
        		  $scope.errors.push(erroCep);
        	  }
          }

          /*Valida os dados do Pretendente*/
          $scope.validarDadosPretendente = function(form, apenasValidar){
        	  iniciarVariavelErro();
             validador.validarCamposObrigatorios(form, $scope.errors);
              if(!validador.validarCpf($scope.cadastro.pretendente.cpf)){
                $scope.errors.push("CPF inválido");
              }

              if(!validador.validarCpf($scope.cadastro.pretendente.cpfConjuge)){
                $scope.errors.push("CPF Conjuge inválido");
              }

              if(!validador.validarEmail($scope.cadastro.pretendente.email)){
                $scope.errors.push("EMAIL inválido");
              }

              /*if(!$scope.cadastro.pretendente.telefone && !$scope.cadastro.pretendente.celular
                && !$scope.cadastro.pretendente.telefoneComercial){
                $scope.errors.push("Preencha ao menos um campo de telefone.");
              }*/
              
              if($scope.cadastro.pretendente.telefone){
            	  if(!validador.isDDDValido($scope.cadastro.pretendente.dddTelefone)){
            		  $scope.errors.push("Preencha o DDD do telefone.");
            	  }
            	  if(service.apenasNumeros($scope.cadastro.pretendente.telefone).length > 9){
            		  $scope.errors.push("Telefone inválido. Favor informar apenas o número sem o DDD");
            	  }
              }
              
              if($scope.cadastro.pretendente.celular && !validador.isDDDValido($scope.cadastro.pretendente.dddCelular)){
            	  $scope.errors.push("Preencha o DDD do celular.");
              }
              
              if($scope.cadastro.pretendente.telefoneComercial && !validador.isDDDValido($scope.cadastro.pretendente.dddTelefoneComercial)){
            	  $scope.errors.push("Preencha o DDD do telefone comercial.");
              }

              if(!validador.validarCaracteresEspeciais($scope.cadastro.pretendente.nome)){
                $scope.errors.push("Nome do pretendente não pode conter acentos ou caracteres especiais.");
              }
              
              if($scope.cadastro.pretendente.dataNascimento){
            	 var difAnos = dataUtil.difEntreDatasEmAnos($scope.cadastro.pretendente.dataNascimento, dataUtil.getDataAtual());
            	 if(difAnos < 16){
            		 $scope.errors.push("Pretendente não pode ser menor que 16 anos.");
            	 }
              }

              //se tiver sido informado telefone comercial seta no tel da empresa
              if($scope.cadastro.pretendente.telefoneComercial)
                  $scope.cadastro.profissional.telefone = $scope.cadastro.pretendente.telefoneComercial;

              //$scope.errors = []; //##################################################

              if(!apenasValidar)
            	  $scope.proximoPasso();
          }
          
          /*Valida os dados Pessoais*/
          $scope.validarDadosPessoaisESalvar = function(form){
        	  iniciarVariavelErro();
             validador.validarCamposObrigatorios(form, $scope.errors);
            
           if($scope.cadastro.pessoal.possuiRendaArcarLocacao == 'S'){
            if($scope.cadastro.pessoal.solidario1){
            	if($scope.cadastro.pessoal.solidario1.cpfConjuge && !validador.validarCpf($scope.cadastro.pessoal.solidario1.cpfConjuge)){
            		$scope.errors.push("CPF conjuge locatário solidário 1 inválido.");
            	}
            	
            	if($scope.cadastro.pessoal.solidario1.cpf && !validador.validarCpf($scope.cadastro.pessoal.solidario1.cpf)){
            		$scope.errors.push("CPF locatário solidário 1 inválido.");
            	}
            	
            	if($scope.cadastro.pessoal.solidario1.numDoc && (!$scope.cadastro.pessoal.solidario1.dataEmissao && !$scope.cadastro.pessoal.solidario1.dataValidade)){
            		$scope.errors.push("(Locatário solidário 1) Preencha ao menos uma das datas (Emissão ou Validade) a que melhor se adequar ao tipo de documento informado.");
            	}
            	
            	if($scope.cadastro.pessoal.solidario1.cep && !service.isCepValido($scope.cadastro.pessoal.solidario1.cep)){
            		$scope.errors.push("Cep do locatário solidário 1 inválido.");
            	}
            	
            }
         
           if($scope.cadastro.pessoal.numSolidarios > 1 && $scope.cadastro.pessoal.solidario2){
        	   if($scope.cadastro.pessoal.solidario2.cpfConjuge && !validador.validarCpf($scope.cadastro.pessoal.solidario2.cpfConjuge)){
        		   $scope.errors.push("CPF conjuge locatário solidário 2 inválido.");
        	   }
        	   
        	   if($scope.cadastro.pessoal.solidario2.cpf && !validador.validarCpf($scope.cadastro.pessoal.solidario2.cpf)){
           		$scope.errors.push("CPF locatário solidário 2 inválido.");
           	}
        	   
        	   if($scope.cadastro.pessoal.solidario2.numDoc && (!$scope.cadastro.pessoal.solidario2.dataEmissao && !$scope.cadastro.pessoal.solidario2.dataValidade)){
           		$scope.errors.push("(Locatário solidário 2) Preencha ao menos uma das datas (Emissão ou Validade) a que melhor se adequar ao tipo de documento informado.");
           	}
        	   
        	   if($scope.cadastro.pessoal.solidario2.cep && !service.isCepValido($scope.cadastro.pessoal.solidario2.cep)){
           		$scope.errors.push("Cep do locatário solidário 2 inválido.");
           	}
        	   
           } 
            
           if($scope.cadastro.pessoal.numSolidarios > 2 && $scope.cadastro.pessoal.solidario3){
        	   if($scope.cadastro.pessoal.solidario3.cpfConjuge && !validador.validarCpf($scope.cadastro.pessoal.solidario3.cpfConjuge)){
        		   $scope.errors.push("CPF conjuge locatário solidário 3 inválido.");
        	   }
        	   
        	   if($scope.cadastro.pessoal.solidario3.cpf && !validador.validarCpf($scope.cadastro.pessoal.solidario3.cpf)){
           		$scope.errors.push("CPF locatário solidário 3 inválido.");
           	}
        	   
        	   if($scope.cadastro.pessoal.solidario3.numDoc && (!$scope.cadastro.pessoal.solidario3.dataEmissao && !$scope.cadastro.pessoal.solidario3.dataValidade)){
           		$scope.errors.push("(Locatário solidário 3) Preencha ao menos uma das datas (Emissão ou Validade) a que melhor se adequar ao tipo de documento informado.");
           	}
        	   
        	   if($scope.cadastro.pessoal.solidario3.cep && !service.isCepValido($scope.cadastro.pessoal.solidario3.cep)){
           		$scope.errors.push("Cep do locatário solidário 3 inválido.");
           	}
        	  
           }
           
         }else{
        	 $scope.cadastro.pessoal.numSolidarios = 0;
         }
          

          if($scope.errors.length == 0){
        	//se num solidarios não form maior que zero garante os objetos vazios
              if($scope.cadastro.pessoal.numSolidarios == 0){
           	   $scope.cadastro.pessoal.solidario1 = {};
           	   $scope.cadastro.pessoal.solidario2 = {};
           	   $scope.cadastro.pessoal.solidario3 = {};
           	   
              }else if($scope.cadastro.pessoal.numSolidarios == 1){
           	   $scope.cadastro.pessoal.solidario2 = {};
           	   $scope.cadastro.pessoal.solidario3 = {};
           	   
              }else if($scope.cadastro.pessoal.numSolidarios == 2){
           	   $scope.cadastro.pessoal.solidario3 = {};
              }
              
        	  $scope.salvar();
          }
      }

          /*valida os dados profissionaiss*/
          $scope.validarDadosProfissionais = function(form, apenasValidar){
        	  iniciarVariavelErro();
             validador.validarCamposObrigatorios(form, $scope.errors);

            if($scope.cadastro.profissional.naturezaRenda == 'FUNCIONARIO PÚBLICO' || $scope.cadastro.profissional.naturezaRenda == 'FUNCIONÁRIO COM REGISTRO CLT'){
			    if($scope.cadastro.profissional.profissao == '' || $scope.cadastro.profissional.profissao == undefined){
				    $scope.errors.push("Profissão é obrigatório.");
			    }
		    }
            
            if($scope.cadastro.profissional.telefone && !validador.isDDDValido($scope.cadastro.profissional.dddTelefone)){
             	  $scope.errors.push("Preencha o DDD do Telefone");
               }
            
            if($scope.cadastro.profissional.telefoneGerente && !validador.isDDDValido($scope.cadastro.profissional.dddTelefoneGerente)){
             	  $scope.errors.push("Preencha o DDD do Telefone Gerente.");
               }
            
            if($scope.cadastro.profissional.telefone){
            	$scope.cadastro.pretendente.telefoneComercial = $scope.cadastro.profissional.telefone;
            }
            //$scope.errors = []; //##################################################

            if(!apenasValidar)
            	$scope.proximoPasso();
          }
          
          /*valida os dados residenciais*/
          $scope.validarDadosResidenciais = function(form, apenasValidar){
        	  iniciarVariavelErro();
             validador.validarCamposObrigatorios(form, $scope.errors);
             
             if($scope.cadastro.residencia.telefoneImobiliaria && !validador.isDDDValido($scope.cadastro.residencia.dddTelefoneImobiliaria)){
           	  $scope.errors.push("Preencha o DDD do Telefone Imobiliária/Proprietário.");
             }

             if(!apenasValidar)
            	 $scope.proximoPasso();
          }

          /*Valida os dados do imóvel*/
          $scope.validarDadosDoImovel = function(form, apenasValidar){
        	  iniciarVariavelErro();
            validador.validarCamposObrigatorios(form, $scope.errors);

            if($scope.cadastro.imovel.cnpjEmpresaConstituida && !validador.validarCNPJ($scope.cadastro.imovel.cnpjEmpresaConstituida)){
                $scope.errors.push("CNPJ empresa constituída inválido");
              }
            
            if($scope.cadastro.imovel.cep && !service.isCepValido($scope.cadastro.imovel.cep)){
        		$scope.errors.push("Cep inválido.");
        	}
            

            //$scope.errors = []; //##################################################

              if(!apenasValidar)
            	  $scope.proximoPasso();

          }

          /*Valida os dados obrigatorios*/
          $scope.validarDadosObrigatorios = function(form){
        	  iniciarVariavelErro();
             validador.validarCamposObrigatorios(form, $scope.errors);
			 
			 //$scope.errors = []; //##################################################
			 
             $scope.proximoPasso();
          }


          $scope.getTotalGastosMensais = function(){
            if(service.isNull($scope.cadastro.imovel)) return 0;
            return service.valorOuZeroSeNull($scope.cadastro.imovel.aluguel) +
                   service.valorOuZeroSeNull($scope.cadastro.imovel.iptu) +
                   service.valorOuZeroSeNull($scope.cadastro.imovel.condominio) +
                   service.valorOuZeroSeNull($scope.cadastro.imovel.agua) +
                   service.valorOuZeroSeNull($scope.cadastro.imovel.luz) +
                   service.valorOuZeroSeNull($scope.cadastro.imovel.gas);
          }

          $scope.getRendaNecessaria = function(){
            if(angular.equals($scope.cadastro.imovel.finalidade, 'R'))
                return $scope.getTotalGastosMensais() / 0.35;

              return $scope.getTotalGastosMensais() / 0.15;
          }

          $scope.getRendaInformada = function(){
            return service.valorOuZeroSeNull($scope.cadastro.profissional.salario) +
            		   service.valorOuZeroSeNull($scope.cadastro.pretendente.rendaConjuge) +
                       service.valorOuZeroSeNull($scope.cadastro.profissional.totalRendimentos);
          }

          $scope.isRendaSuficiente = function(){
            return $scope.getRendaInformada() >= $scope.getRendaNecessaria();
          }

          $scope.pesquisarCep = function(obj){
            //se o cep for valido efetua a consulta no webservice
        	 erroCep = '';
            var cep = obj.cep.replace(/\.|\-/g, '');
            if(/^[0-9]{8}$/.test(cep)){
              service.consultarCep(cep, function(dados){
                if(dados !== null){
                  obj.estado = dados.uf;
                  obj.cidade = dados.localidade.toUpperCase();
                  obj.endereco = dados.logradouro.toUpperCase();
                  obj.bairro = dados.bairro.toUpperCase();
                  obj.complemento = dados.complemento.toUpperCase();
                  $scope.$digest();
                }else{
                	erroCep = 'Cep inexistente ou inválido.';
                }
              })
            }
          }
          
          /**
           * Valida o cep dos solidarios
           */
          $scope.validarCepLocatarioSolidario = function(cep){
              //se o cep for valido efetua a consulta no webservice
          	 erroCep = '';
              cep = cep.replace(/\.|\-/g, '');
              if(/^[0-9]{8}$/.test(cep)){
                service.consultarCep(cep, function(dados){
                  if(dados == null){
                	  erroCep = 'Cep: ' + cep + ' inexistente ou inválido.';
                  }
                })
              }
            }

          $scope.alertaLocatarioSolidario = function(){
            if(angular.equals($scope.cadastro.pessoal.possuiRendaArcarLocacao, 'C')){
              service.alertar('Informe a quantidade de pessoas que comporão renda com o Pretendente.');
            }
            
          }
		  
		  $scope.carregaCbMotivoLocacao = function(){
			  
				$http.get("https://www.segurosja.com.br/gerenciador/aplicacao_porto/cb_motivo_locacao.php").then(function(data){
							
                    $scope.cadastro.imovel.motivoLocacaoSelect = data.data.motivoLocacao;
					
					console.log($scope.cadastro.imovel.motivoLocacaoSelect);

				}, function(erro){
				  service.alertarErro(erro.statusText);
				});  
			
          }
		  

		$scope.getProfissao = function(pesquisa = '') {
			 
			 return $http.get("http://www.segurosja.com.br/gerenciador/fianca/app/php/cb_autocomplete_profissoes.php?ocupacao="+pesquisa).then(function(results){return results.data;});
			 
		};
		
		$scope.seletItemCD = function(codigo = '') {

			$scope.cadastro.profissional.profissao = codigo;
			 
			 console.log('codigo a: '+$scope.cadastro.profissional.profissao);

		};
		$scope.enviaEmails = function(codigo = '') {
			 
			 //return $http.get("https://www.segurosja.com.br/gerenciador/fianca/app/php/email_status_propostas.php?codigo="+codigo).then(function(results){return results.data;});

             	$.ajax({
					type: "POST", 
					url: "https://www.segurosja.com.br/gerenciador/fianca/app/php/email_status_propostas.php",
					dataType: "json",           
                    data:{
                        codigo:codigo 
                    },
					success: function(response) {
                           console.log('sucess: '+response);        
					}
				});                console.log('passou aqui');
			 
		};
		
		$scope.select2EditaCombo = function(){
			
			if(($scope.cadastro.profissional.profissao_descricao != undefined) || ($scope.cadastro.profissional.profissao_descricao != '')){
				$('#select2-profissao-container').html($scope.cadastro.profissional.profissao_descricao);
			}else{
				$('#select2-profissao-container').html('Digite uma profissao para a pesquisa');
			}
			
		    
			
		}
		
		$scope.select2Load = function(){

			$('#profissao').change(function(){
				codigo = $(this).val();
				$scope.cadastro.profissional.profissao = codigo;
				descricao = $("#profissao option:selected").text();
				$scope.cadastro.profissional.profissao_descricao = descricao;
			}); 
  			
		    $("#profissao").select2({
			 
				ajax: {
					url: "https://www.segurosja.com.br/gerenciador/fianca/app/php/cb_autocomplete_profissoes.php",
					type: "post",
					dataType: 'json',
					data: function (params) {
						return {
							searchTerm: params.term
						};
					},
					processResults: function (response) {
						return {
							results: response
						};
					},
					cache: true
				} 
				
			});
		}
		
		if(codRegistro){//se foi passado codigo carrega o registro pelo codigo
	    	pesquisarPorCodigoRegistro(codRegistro);
	    	
	    }else if(!$scope.codSeguradora && (!$scope.paramUrl || !$scope.paramUrl.var1)){
        	//service.alertarErro('Favor entrar em contato com a Imobiliária ou a corretora de seguros para liberação do formulário de análise.');
	    	$timeout(function(){
	    		$('#modalSelectImob').modal('show')
	    	}, 500);
	    	
        }else{
        	carregarDadosPeloCpfCnpj();
        }
    }]);