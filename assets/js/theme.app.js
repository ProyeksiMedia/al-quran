(function(theme,$) {
	
	$.fn.themePluginPerkalian = function(opts) {
		var fone = opts.kolom[0],
			ftwo = opts.kolom[1],
			ftri = opts.kolom[2];
		$('#'+fone+', #'+ftwo).on('keyup', function (e) {
			//console.log(e)
			
		})
	}
	
	$.fn.themePluginSqlDate = function(opts) {
		var $this = $ ( this );
	}
	
	$.fn.themePluginNumberFormat = function(opts) {
		var $this = $ ( this );
		$this.on('keyup', function (e) {
			var input = $this[0];
			var num = input.value.replace(/\ /g,'');
			if(!isNaN(num)){
				
				if(num.indexOf('.') > -1 ){
					
					num = num.split('.');
					num[0] = num[0].toString()
						.split('')
						.reverse()
						.join('')
						.replace(/(?=\d*\,?)(\d{3})/g,'$1 ')
						//.replace(/\B(?=(\d{3})+(?!\d))/g, opts.thousandsSeparator)
						.split('')
						.reverse()
						.join('')
						.replace(/^[\ ]/,'');
					
					if(num[1].length > opts.decimalPlaces){
						num[1] = num[1].substring(0,num[1].length-1);
					} 
					if(opts.decimalPlaces > 0 ) {
						input.value = num[0]+'.'+num[1]; 
					} else {
						input.value = num[0]
					}
					
				} 
				else
				{ 
					input.value = num
						.toString()
						.split('')
						.reverse()
						.join('')
						.replace(/(?=\d*\,?)(\d{3})/g,'$1 ')
						//.replace(/\B(?=(\d{3})+(?!\d))/g, opts.thousandsSeparator)
						.split('')
						.reverse()
						.join('')
						.replace(/^[\ ]/,'')
				}
				
			}
			else
			{ 
				input.value = num.substring(0,num.length-1);
			}
			
		})
	}
	
}).apply(this, [ window.theme, jQuery ]);

(function($) {

	$.fn.serialize = function(obj, prefix) {
		var str = [], p;
		for(p in obj) {
			if (obj.hasOwnProperty(p)) {
				var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
				str.push((v !== null && typeof v === "object") ?
				serialize(v, k) :
				encodeURIComponent(k) + "=" + encodeURIComponent(v));
			}
		}
		return str.join("&");
	}
	
	$.fn.not_empty=function(a, b, c) {
		if ($.fmatter.isEmpty(a)){
			return [false, b+" tidak boleh di kosongkan"];
		} else {
			return [true,""];
		}
		console.log(this)
	}
	
	isBoolean= function(o) {
		return typeof o === 'boolean';
	}
		
	isObject= function(o) {
		return (o && (typeof o === 'object' || $.isFunction(o))) || false;
	}
		
	isString= function(o) {
		return typeof o === 'string';
	}
		
	isNumber= function(o) {
		return typeof o === 'number' && isFinite(o);
	}

	isNull= function(o) {
		return o === null;
	}
		
	isUndefined= function(o) {
		return typeof o === 'undefined';
	}

	isValue= function (o) {
		return (this.isObject(o) || this.isString(o) || this.isNumber(o) || this.isBoolean(o));
	}
	
	isEmpty= function(o) {
		if(!this.isString(o) && this.isValue(o)) {
				return false;
		}else if (!this.isValue(o)){
				return true;
		}
		o = $.trim(o).replace(/\&nbsp\;/ig,'').replace(/\&#160\;/ig,'');
		return o==="";	
	}
	
	$('li.nav-parent')
		.on('click','a.select-region',function(e){
			e.preventDefault();
			var reg = this.text
			$.post('select_region',{name:reg},
			function(d,s,e) {
				window.open(window.location.href,'_self',1,true);
			},'json')
		})
		.on('click','a.select-database',function(e){
			e.preventDefault();
			var db = this.text
			$.get('select_database',{db:db},
				function(d,s,e) {
					if (d.status==1) {
						window.open(window.location.href,'_self',1,true);
					} else {
						var $body = $('body'),
						$div = document.createElement('div'),
						$msg = [
						'<section class="panel">',
							'<header class="panel-heading">',
								'<h2 class="panel-title">Perhatian</h2>',
							'</header>',
							'<div class="panel-body">',
								'<div class="modal-wrapper">',
									'<div class="modal-text">',
										'<p>Database <code>tahun '+ db +' tidak dapat di akses</code>, Silahkan kontak Administrator</p>',
									'</div>',
								'</div>',
							'</div>',
							'<footer class="panel-footer">',
								'<div class="row">',
									'<div class="col-md-12 text-right">',
										'<button type="button" id="dialogButton" class="btn btn-warning" >Tutup</button>',
									'</div>',
								'</div>',
							'</footer>',
						'</section>'].join( ' ' );
						$div.setAttribute('id','dialog-db');
						$div.setAttribute('class','modal-block mfp-hide');
						$($div).html($msg);
						$body.append($div);
						var $btn = $('#dialogButton');
						$.magnificPopup.open({
							items: {
								src: '#dialog-db',
								type: 'inline'
							},
							preloader: false,
							modal: true,
							callbacks: {
								change: function() {
									$btn.on( 'click', function( e ) {
										e.preventDefault();
										$.magnificPopup.close();
									});
								},
								close: function() {
									$btn.off( 'click' );
									$div.remove()
								}
							}
						})
					}
			},'json')
		})
		

}).apply(this, [ jQuery ]);
	
	