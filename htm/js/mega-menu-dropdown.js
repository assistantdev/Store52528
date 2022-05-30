;(function($){
	"use strict";
	$.fn.droopmenu = function(options){
		var settings = {
			dmArrow 		: false,
			dmIndicator 		: true,
			dmArrowDirection 	: 'dmarrowup',
			dmHideClick 		: true,
			dmClickIcon 		: true,
			dmTabAccess 		: true,
			dmAnimation 		: true,
			dmFixed 		: false,
			dmSticky 		: false,
			dmStickyClass 		: 'dmsticky',
			dmOffCanvas 		: true,		
			dmAnimationEffect 	: 'dmfade',
			dmFixedClass 		: 'dmfixed',
			dmOffCanvasPos 		: 'dmoffright',
			dmPosition 		: 'dmtop',
			dmOrientation 		: 'dmhorizontal',
			dmCentered 		: false,
			dmCenteredClass 	: 'dmcentered',
			dmOpenClass 		: 'dmopener',
			dmAnimDelay 		: 500,
			dmShowDelay 		: 200,
			dmHideDelay 		: 200,			
			dmToggleSpeed 		: 200,
			dmBreakpoint 		: 1024
		};
		
		options = $.extend(settings, options);
		
		var droopmenu_inst = $(this),
			droopmenu_body = $('body'),
			droopmenu_wrapper = $(droopmenu_inst),
			droopmenu_container = $('.droopmenu-nav'),
			droopmenu_main_toggler = $(".droopmenu-toggle"),
			droopmenu_arrow = $('<div class="dm-arrow"></div>'),
			droopmenu_overlay = $('<div class="droopmenu-overlay"></div>'),
			droopmenu_overlay_btn = $('<div class="droopmenu-mclose"><span></span></div>'),
			droopmenu_target_extra = $(".droopmenu-extra .droopmenu > li:has(> ul), .droopmenu-extra .droopmenu li .droopmenu-indicator"),
			droopmenu_target_droopmenu = droopmenu_wrapper,
			droopmenu_target_overlay = droopmenu_overlay,
			droopmenu_ww = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		
		var droopmenu_config = function() {
			$(droopmenu_inst).find(".droopmenu li a").each(function() {
				if($(this).siblings("ul").length > 0){
					$(this).attr("aria-expanded", "false");
					$(this).parent("li").addClass("droopmenu-parent").attr("aria-haspopup", "true");
					if(settings.dmIndicator == true){
						$(this).append("<span class='droopmenu-indicator'><em></em></span>");
					}
				}
				if($(this).siblings("ul").find(".droopmenu-grid").length > 0){
					$(".droopmenu-grid").closest("ul").addClass("droopmenu");
				}				
			});
			
			$(droopmenu_inst).find('li:has(ul.droopmenu-megamenu)').addClass('droopmenu-mega');
			$(droopmenu_inst).find(".droopmenu > li > a").append("<em class='droopmenu-topanim'></em>");
			$(droopmenu_inst).find(".droopmenu-nav .droopmenu").wrapAll("<div class='droopmenu-nav-wrap'><div class='droopmenu-navi'></div></div>");
			$(droopmenu_inst).find(droopmenu_main_toggler).append("<i class='dm-burg'></i><i class='dm-burg'></i><i class='dm-burg'></i>");			
			if(settings.dmFixed == true){
				$(droopmenu_inst).addClass(settings.dmFixedClass);
			}
			if(settings.dmSticky == true){
				$(droopmenu_inst).addClass(settings.dmStickyClass);
			}			
			if(settings.dmArrow == true){
				$(droopmenu_inst).find(".droopmenu > li:has(ul) > a").after(droopmenu_arrow);
				switch (settings.dmArrowDirection) {
					case 'dmarrowup':
						$(droopmenu_inst).addClass('dmarrow-up');
						break;
					case 'dmarrowdown':
						$(droopmenu_inst).addClass('dmarrow-down');
						break;
				}				
			
			}		
			
			switch (settings.dmOrientation) {
				case 'dmvertical':
					$(droopmenu_inst).addClass('droopmenu-vertical');
					break;
				case 'dmhorizontal':
					$(droopmenu_inst).addClass('droopmenu-horizontal');
					break;
			}			
			
			switch (settings.dmPosition) {
				case 'dmtop':
					$(droopmenu_inst).addClass('dmpos-top');
					break;
				case 'dmbottom':
					$(droopmenu_inst).addClass('dmpos-bottom');
					break;
				case 'dmleft':
					$(droopmenu_inst).addClass('dmpos-left');
					break;
				case 'dmright':
					$(droopmenu_inst).addClass('dmpos-right');
					break;
			}			
		}
		
		var droopmenu_open = function() {
			if(settings.dmOffCanvas == true){
				droopmenu_wrapper.addClass('droopmenu-offcanvas-open');
				droopmenu_body.addClass('droopmenu-dmopen');
				droopmenu_overlay_btn.addClass('dmo-active');
			} else {
				droopmenu_container.stop(true,true).slideDown(settings.dmToggleSpeed);
				droopmenu_body.removeClass('droopmenu-dmopen');
				droopmenu_overlay_btn.remove();
			}
		}
		
		var droopmenu_close = function() {
			if(settings.dmOffCanvas == true){
				droopmenu_wrapper.removeClass('droopmenu-offcanvas-open');
				droopmenu_overlay_btn.removeClass('dmo-active');
			   setTimeout(function() {
				   droopmenu_body.removeClass('droopmenu-dmopen');
			   }, settings.dmAnimDelay);
			} else {
				droopmenu_container.stop(true,true).slideUp(settings.dmToggleSpeed);
				droopmenu_body.removeClass('droopmenu-dmopen');
				droopmenu_overlay_btn.remove();
			}
		}
		
		var droopmenu_close_offcanvas = function() {
			droopmenu_main_toggler.removeClass("dmt-active");
			droopmenu_overlay_btn.removeClass('dmo-active');
			droopmenu_close();			
		}
		
		var droopmenu_toggleMenu = function(e) {
			e.preventDefault();
			var droopmenu_mobile_toggle = $(this),
				droopmenu_closest_ul = droopmenu_mobile_toggle.closest("ul:not(.droopmenu-grid ul)"),
				droopmenu_active_links = droopmenu_closest_ul.find(".dmtoggle-open"),
				droopmenu_closest_li = droopmenu_mobile_toggle.closest("li"),
				droopmenu_open_link = droopmenu_closest_li.hasClass("dmtoggle-open"),
				droopmenu_count = 0;
			droopmenu_closest_li.removeClass(settings.dmOpenClass).children("ul").find('li').removeClass(settings.dmOpenClass);
			droopmenu_closest_ul.find("ul:not(.droopmenu-grid ul)").stop(true, true).slideUp(settings.dmToggleSpeed, function() {
				if (++droopmenu_count == droopmenu_closest_ul.find("ul:not(.droopmenu-grid ul)").length){
					droopmenu_active_links.removeClass("dmtoggle-open");
					droopmenu_active_links.find('> a').attr('aria-expanded', 'false');
					droopmenu_active_links.find('ul').removeAttr("style");
				}
			});
			if (!droopmenu_open_link) {
				droopmenu_closest_li.children("ul:not(.droopmenu-grid ul)").stop(true, true).slideDown(settings.dmToggleSpeed);
				droopmenu_closest_li.addClass("dmtoggle-open");
				droopmenu_closest_li.find('> a').attr('aria-expanded', 'true');
			}	
		}		
				
		var droopmenu_adjust = function() {
			if(droopmenu_ww >= settings.dmBreakpoint){
				$(document).off("click.droopMenu touchstart.droopMenu");
				$(droopmenu_inst).find(".droopmenu li a .droopmenu-indicator").off('click');
				$(droopmenu_inst).find(".droopmenu li a:not(.droopmenu-grid a)").off('click');
				$(droopmenu_inst).removeClass(settings.dmOffCanvasPos);
				$(droopmenu_inst).removeClass("droopmenu-offcanvas droopmenu-offcanvas-open");
				$(droopmenu_inst).closest(droopmenu_body).removeClass('droopmenu-dmopen');
				$(droopmenu_inst).find(droopmenu_overlay, droopmenu_overlay_btn).remove();
				if(settings.dmAnimation == true){
					$(droopmenu_inst).addClass(settings.dmAnimationEffect);	
				}
				if(settings.dmOffCanvas == true){
					$(droopmenu_inst).find(droopmenu_main_toggler).removeClass("dmt-active");	
				}
				if(settings.dmTabAccess == true){
					$(droopmenu_inst).find("a, object, :input, iframe, [tabindex]").focus(function() {
						$(this).parents('li:has("ul")').addClass(settings.dmOpenClass).find('> a').attr('aria-expanded', 'true');
					}).blur(function() {
						$(this).parents('li:has("ul")').removeClass(settings.dmOpenClass).find('> a').attr('aria-expanded', 'false');
					});			
				}
				if(settings.dmCentered == true){
					$(droopmenu_inst).addClass(settings.dmCenteredClass);	
				}
				var dmHoverTimer,
				dmHoverList = $(droopmenu_inst).find(".droopmenu li:has(ul)");
				dmHoverList.removeClass(settings.dmOpenClass);
				dmHoverList.on({
					mouseenter: function(){
						var dmHoverLnk = $(this);
						clearTimeout(dmHoverTimer);
						dmHoverTimer = setTimeout(function(){
							dmHoverLnk.stop(true,true).addClass(settings.dmOpenClass);
							dmHoverLnk.find('> a').attr('aria-expanded', 'true');
						}, settings.dmShowDelay);
					},
					mouseleave: function(){
						var dmHoverLnk = $(this);
						setTimeout(function(){
						 dmHoverLnk.stop(true,true).removeClass(settings.dmOpenClass);
						 dmHoverLnk.find('> a').attr('aria-expanded', 'false');
						}, settings.dmHideDelay);
					}
				});
				
			} else {
				
					$(droopmenu_inst).removeClass(settings.dmAnimationEffect);
					$(droopmenu_inst).removeClass(settings.dmCenteredClass);
					$(droopmenu_inst).find(".droopmenu li:has(ul)").off('mouseenter mouseleave');
					
					if(settings.dmClickIcon == true){
						$(droopmenu_inst).find(".droopmenu li a .droopmenu-indicator").off('click').on('click', droopmenu_toggleMenu);	
					} else {
						$(droopmenu_inst).find(".droopmenu li:has(ul) > a").off('click').on('click', droopmenu_toggleMenu);	
					}
					
					if(settings.dmOffCanvas == true){
						droopmenu_container.after(droopmenu_overlay);
						droopmenu_container.prepend(droopmenu_overlay_btn);
						droopmenu_wrapper.addClass("droopmenu-offcanvas");
						droopmenu_wrapper.addClass(settings.dmOffCanvasPos);
						$(droopmenu_inst).on('click', function(e){													  
							var droopmenu_target_close_btn = $(droopmenu_inst).find(".droopmenu-mclose span");
							if($(e.target).is(droopmenu_target_close_btn)) {
								droopmenu_close_offcanvas();
							}									 
						});
					}
					
					if(settings.dmHideClick == true){
						$(document).on("click.droopMenu touchstart.droopMenu", function(e){
							if(settings.dmOffCanvas == true){										
								if( $(e.target).is(droopmenu_target_overlay)) {
									droopmenu_close_offcanvas();
								}
							} else {
								if (!droopmenu_inst.is(e.target)&& droopmenu_inst.has(e.target).length === 0){
									droopmenu_container.slideUp(settings.dmToggleSpeed, function() {
										droopmenu_main_toggler.removeClass("dmt-active");
									});
								}
							}
							if (!droopmenu_target_extra.is(e.target)&& droopmenu_target_extra.has(e.target).length === 0){
								var dmExtraParent = $(droopmenu_inst).find('.droopmenu-extra .droopmenu li:has(ul)');
								dmExtraParent.removeClass('dmtoggle-open').find('> a').attr('aria-expanded', 'false');
								dmExtraParent.find('> a').removeClass('dmparent-open').siblings('ul').slideUp(settings.dmToggleSpeed, function(){ });								
							}
						});
					}
				
			}
		}
		
		var droopmenu_tabs = function() {
			$(droopmenu_inst).find('.droopmenu-tabs').each(function(i){
				var droopmenu_tab = $(this);
				droopmenu_tab.wrapInner('<div class="droopmenu-tabpanel droopmenutabcol"></div>')
				droopmenu_tab.prepend('<div class="droopmenu-tabnav droopmenutabcol"></div>');
				droopmenu_tab.find('.droopmenu-tabsection').each(function(j){
					$(this).attr('id', 'droopmenutab' + i + j);	
					$(this).children('.droopmenu-tabheader').attr('href', '#droopmenutab' + i + j);	
					droopmenu_tab.children('.droopmenu-tabnav').append('<a href="#droopmenutab' + i + j +'">' + $(this).children('.droopmenu-tabheader').html() + '</a>');
				});
				droopmenu_tab.find('.droopmenu-tabsection:first').addClass('droopmenu-tab-active');
				droopmenu_tab.find('.droopmenu-tabnav a:first').addClass('droopmenu-tab-active');
				droopmenu_tab.find('.droopmenu-tabheader').each(function(j){
					$(this).on('click', function(e){
						e.preventDefault();
						droopmenu_tab.find('.droopmenu-tabsection').closest().removeClass('droopmenu-tab-active');
						var index = $(this).parent().index();
						if(!$(this).hasClass('droopmenu-tab-active')){
							droopmenu_tab.find('.droopmenu-tabsection > .droopmenu-tab-active').removeClass('droopmenu-tab-active');
							droopmenu_tab.find('.droopmenu-tabsection:eq(' + index + ')').children().toggleClass('droopmenu-tab-active');
						}else{
							droopmenu_tab.find('.droopmenu-tabsection > .droopmenu-tab-active').removeClass('droopmenu-tab-active');
						};
					});
				});
				droopmenu_tab.find('.droopmenu-tabnav a').each(function(j){
					if($(this).closest(droopmenu_tab).hasClass("droopmenu-tab-hover")){	
						$(this).hover(function() {
							var index = $(this).index();
							droopmenu_tab.find('.droopmenu-tabsection, .droopmenu-tabnav a').removeClass('droopmenu-tab-active');
							droopmenu_tab.find('.droopmenu-tabsection:eq(' + index + '), .droopmenu-tabnav a:eq(' + index + ')').toggleClass('droopmenu-tab-active');
						});
					}else{
						$(this).on('click', function(e){
							e.preventDefault();
							var index = $(this).index();
							droopmenu_tab.find('.droopmenu-tabsection, .droopmenu-tabnav a').removeClass('droopmenu-tab-active');
							droopmenu_tab.find('.droopmenu-tabsection:eq(' + index + '), .droopmenu-tabnav a:eq(' + index + ')').toggleClass('droopmenu-tab-active');
						});				
					}
				});
			});			
		}
		
		var droopmenu_dmtoggler = function() {
			$(droopmenu_inst).find(droopmenu_main_toggler).on("click", function(e){															  
				e.preventDefault();																
				$(this).toggleClass("dmt-active");
				if($(this).hasClass("dmt-active")){
  				$(document).on('keyup',function(evt){
                                    if(evt.key==="Escape"){
                                     droopmenu_close();
                                     droopmenu_main_toggler.removeClass("dmt-active");
                                    }
                                  });
					droopmenu_open();
				} else {
					droopmenu_close();
				}
			});	
		}		
		
		return this.each(function() {
			droopmenu_tabs();
			droopmenu_config();
			droopmenu_adjust();
			droopmenu_dmtoggler();
			var dmResizeTimer;
			$(window).on('resize.droopMenu orientationchange.droopMenu', function() {
				clearTimeout(dmResizeTimer);
				dmResizeTimer = setTimeout(function(){								
					droopmenu_ww = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
					droopmenu_adjust();
				}, 100);
			});
		});
		
	};
	
})(jQuery);