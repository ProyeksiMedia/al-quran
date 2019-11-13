(function ($){
	'use strict';
	
	var Quran = {
		
		options: {
			menu: 'ul.nav-main',
			panel_body: 'div.panel-body',
			breadcrumb: 'a.breadcrumb-navi',
		},
		
		setVars: function() {
			this.$menu	= $( this.options.menu );
			this.$panel_body	= $( this.options.panel_body );
			
			return this;
		},
		
		events: function() {
			var _self = this;
			
			this.$menu
				.on('click', 'a.select-surat', function( e ) {
					e.preventDefault();
					var $items = $( '.nav-main li.nav-parent' );
					$items.find( '.nav-active' ).removeClass( 'nav-active' );
					var li = this.parentNode
					$(this.parentNode).addClass('nav-active')
					_self.get_surah( this.id );
				})
				
			return this;
		},
		
		load_data: function() {
			var _self = this;
			
			this.dt = $.get('assets/quran.json',{},'json')
			.done(function(d,s,e) {
				var surah = d[1];
				$.each(surah, function(key, value) {
					_self.$menu.append($('<li class="nav-parent"><a><i class="text-info">' + value.index +'</i><span class="alternative-font label">' + value.surat_indonesia +'</span><span class="pull-right label-right">' + value.surat_arab +'</span></a><ul class="nav nav-children"><li><a href="#" class="select-surat" id="' + value.index + '">Arti : ' + value.arti+ '</a></li><li><a href="#" class="select-surat" id="' + value.index + '">Jumlah Ayat : ' + value.jumlah_ayat+ '</a></li><li><a href="#" class="select-surat" id="' + value.index + '">Turun di : ' + value.tempat_turun+ '</a></li><li><a href="#" class="select-surat" id="' + value.index + '">Wahyu ke : ' + value.urutan_pewahyuan+ '</a></li></ul></li>'))	
					var $items = $( '.nav-main li.nav-parent' );
					$items.find('> a').on('click', function() {
						var prev = $( this ).closest('ul.nav').find('> li.nav-expanded' ),
							next = $( this ).closest('li');

						if ( prev.get( 0 ) !== next.get( 0 ) ) {
							_self.collapse( prev );
							_self.expand( next );
						} else {
							_self.collapse( prev );
						}
					});
				})
			})
			this.alquran = this.dt;
			return this;
		},
		
		get_surah: function( id ) {
			var _self = this,
				panel = $(this.$panel_body),
				data = this.alquran.responseJSON, 
				ind,
				arb,
				srh = {};
				
			//var html = html = document.documentElement;
			//html.className += ' sidebar-left-collapsed';
			//console.log($('html'))
			
			$('html').removeClass('sidebar-left-opened')
			
			srh.arti = data[1].filter(x => x.index === id).map(x => x.arti);
			srh.surat_arab = data[1].filter(x => x.index === id).map(x => x.surat_arab);
			srh.jumlah_ayat = data[1].filter(x => x.index === id).map(x => x.jumlah_ayat);
			panel.html('<div class="col-md-6"><h4>' + srh.arti + '</h4></div><div class="col-md-6 text-right"><h4 class="arabic">' + srh.surat_arab + '</h4></div>')
			
			arb = data[0].filter(x => x.SuraID === id).map(x => x.AyahText);
			ind = data[2].filter(x => x.SuraID === id).map(x => x.AyahText);
			
			var m = [];
			for(var i = 0; i < ind.length; i++) {
				var no = parseInt(i)+1;
				panel.append($('<div class="col-md-12 text-right arabic"><p>' + arb[i] + ' ' +no.toLocaleString('ar-EG') + '</p></div><div class="col-md-12 text-left latin">' + no + '. ' + ind[i] + '</div>'))
			}
			
		},	
		
		initialize: function() {
			this
				.setVars()
				.events()
				.load_data();
		},
		
		collapse: function( li ) {
			var _self = this;
			li.children('ul.nav-children' ).slideUp( 'fast', function() {
					$(this).css( 'display', '' );
				li.removeClass( 'nav-expanded' );
			})
		},
		
		expand:function( li ) {
			var _self = this;
			li.children( 'ul.nav-children' ).slideDown( 'fast', function() {
				li.addClass( 'nav-expanded' );
				$(this).css( 'display', '' );
				_self.ensureVisible( li );
			})
		},
		
		ensureVisible:function( li ) {
			var _self = this;
			var scroller = li.offsetParent();
			if ( !scroller.get(0) ) {
				return false;
			}

			var top = li.position().top;
			if ( top < 0 ) {
				scroller.animate({
					scrollTop: scroller.scrollTop() + top
				}, 'fast');
			}
		}

	};

	$(function() {
		Quran.initialize();
	});
	
}).apply( this, [ jQuery ]);