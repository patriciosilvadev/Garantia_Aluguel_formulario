var diretiva = angular.module('diretiva', []);

/*Converte para maiusculo*/
diretiva.directive('upper', function($parse) {

	function link(scope, element, attrs, ngModelCtrl) {
			$(element).on('blur', function(){
				ngModelCtrl.$modelValue = $(element).val().toUpperCase();
				$parse(attrs.ngModel).assign(scope,ngModelCtrl.$modelValue);
				ngModelCtrl.$commitViewValue();
				ngModelCtrl.$render();
			})
		}
	

	return {
		restrict : 'A',
		require : 'ngModel',
		link : link
	};
});

/*Exibi um asterisco vermelho na label do input*/
diretiva.directive('requerido', function($parse) {

	function link(scope, element, attrs, ngModelCtrl) {
		var label = $("label[for='"+element.attr('id')+"']");
		$(label).prepend('<span style="color:red">*</span>');

		/*ao ganhar o foco remove a classe errorAtribute*/
		$(element).on('focus', function(){
			$(element).removeClass('errorAttribute');
		})

		/*ao perder o foco se o valor for vazio adiciona a classe errorAtribute*/
		$(element).on('blur', function(){
			if(!$(element).val())
				$(element).addClass('errorAttribute');
		});
		
	}
	

	return {
		restrict : 'A',
		require : 'ngModel',
		link : link
	};
});

/*Diretiva mascara
Se o acesso for via mobile a diretiva não é ativada
*/
diretiva.directive('mascara', function(serviceUtil) {

	function link(scope, el, attrs, ctrl) {
		if(!serviceUtil.isMobile()){
			$(el).mask(attrs.mascara, {placeholder: ""});
			$(el).attr('type', 'text');
      		el.on('keyup', function () {
				scope.$apply(function(){
				ctrl.$setViewValue(el.val());
			});
      	});

	}else{
		$(el).attr('type', attrs.mobile)
	}
			
}
	

	return {
		restrict : 'A',
		require : 'ngModel',
		link : link
	};
});

/*Diretiva mascara para telefone
Se o acesso for via mobile a diretiva não é ativada
*/
diretiva.directive('mascaraTelefone', function(serviceUtil) {

	function link(scope, el, attrs, ctrl) {
		if(!serviceUtil.isMobile()){
			$(el).mask("(99) 9999-9999?9").change(function (event) {  
	            var target, phone, element;  
	            target = (event.currentTarget) ? event.currentTarget : event.srcElement;  
	            phone = target.value.replace(/\D/g, '');
	            element = $(target);  
	            element.unmask();  
	            if(phone.length > 10) {  
	                element.mask("(99) 99999-999?9");  
	            } else {  
	                element.mask("(99) 9999-9999?9");  
	            }  
	        });

	        el.on('focusout', function () {
				scope.$apply(function(){
				ctrl.$setViewValue(el.val().replace(/[^0-9]/g, '').length >= 10 ? el.val() : undefined);
			});
      	});
	        
	}else{
		$(el).attr('type', attrs.mobile)
	}
			
}
	

	return {
		restrict : 'A',
		require : 'ngModel',
		link : link
	};
});

/*Mascara Monetária*/
diretiva.directive('mascaraMonetaria', function(serviceUtil) {

	function link(scope, el, attrs, ctrl) {
		if(!serviceUtil.isMobile()){
			$(el).maskMoney({
				 prefix: "",
         		 decimal: ",",
         		 thousands: "."
			});
			$(el).attr('type', 'text');
      		el.on('keyup', function () {
				scope.$apply(function(){
				ctrl.$setViewValue(el.val());
			});
      	});

	}else{
		$(el).attr('type', attrs.mobile)
	}
			
}
	

	return {
		restrict : 'A',
		require : 'ngModel',
		link : link
	};
});

/**
 * Implementação de 'directive', para Abrir o Calendário.
 * 
 * O input que estiver com "datepicker", abre o calendário ao ser clicado.
 */
diretiva.directive('datepicker', function() {
	return {
		restrict : 'A',
		require : 'ngModel',
		link : function(scope, element, attrs, ctrl) {

			$(function() {

				$(element).datepicker({
					format : 'dd/mm/yyyy',
					language: 'pt-BR',
					autoclose : true,
					startDate : '01/01/1900',
					endDate : '31/12/2999',
					todayHighlight : true,
					clearBtn : true
				});
			});

			$(element).on('change', function () {
				scope.$apply(function(){
				ctrl.$setViewValue(element.val());
			});
      	});

		}
	}
});

/**
 * Implementação de 'directive', para controlar o Foco.
 * 
 * O componente que estiver com "data-focus", recebe o Foco.
 */
diretiva.directive('focus', function($timeout) {
	return {

		restrinct : 'A',

		link : function(scope, element) {
			$timeout(function() {
				element[0].focus();
			});
		}
	};
});

/**
 * Seta o tabindex passado por parametro no elemento e adiciona o manipulador de
 * evento keydow para controlar a tabulação com enter entre os elementos do
 * formulario.
 */
diretiva.directive(
		'ngTabindex',
		function() {
			return {
				restrinct : 'A',
				link : function(scope, element, attrs) {
					$(element).attr('tabindex', attrs.ngTabindex);
					$(element).keydown(
							function(event) {
								var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
								if (keyCode == 13) {
								var field = document.getElementById($(this).attr('id'));
								event.preventDefault();
								var isFocado = false;
								$($("form[name = '" + field.form.name +"']").prop('elements')).each(function(){
									
									if($(this).is(':enabled')){//verifica se o elemento esta habilitado
										var indexField = parseInt($(this).attr('tabindex'));
										var condicao = indexField > field.tabIndex;
										if(condicao){
											if(!isFocado){
												$(this).focus();
												$(this).select();
												isFocado = true;
											}
											
										}
									}
									
									
								});
									
						}

				});
				}
			}
		});

/**
 * The ng-thumb directive
 * @author: nerv
 * @version: 0.1.2, 2014-01-09
 */
diretiva.directive('ngThumb', ['$window', function($window) {
     var helper = {
         support: !!($window.FileReader && $window.CanvasRenderingContext2D),
         isFile: function(item) {
             return angular.isObject(item) && item instanceof $window.File;
         },
         isImage: function(file) {
             var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
             return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
         }
     };

     return {
         restrict: 'A',
         template: '<canvas/>',
         link: function(scope, element, attributes) {
             if (!helper.support) return;

             var params = scope.$eval(attributes.ngThumb);

             if (!helper.isFile(params.file)) return;
             if (!helper.isImage(params.file)) return;

             var canvas = element.find('canvas');
             var reader = new FileReader();

             reader.onload = onLoadFile;
             reader.readAsDataURL(params.file);

             function onLoadFile(event) {
                 var img = new Image();
                 img.onload = onLoadImage;
                 img.src = event.target.result;
             }

             function onLoadImage() {
                 var width = params.width || this.width / this.height * params.height;
                 var height = params.height || this.height / this.width * params.width;
                 canvas.attr({ width: width, height: height });
                 canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
             }
         }
     };
 }]);