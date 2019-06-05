import {AfterViewInit, Component, HostListener} from '@angular/core';

@Component({
  selector: 'min-sidebar',
  template: `
    <a class="navbar-minimalize minimalize-styl-2"
       (click)="miniNavigator()">
      <i class="fa fa-bars"></i>
    </a>
  `
})

export class MinSidebarComponent implements AfterViewInit {

  ngOnInit() {

  }

  ngAfterViewInit() {
    setTimeout(this.autoMinimize);
  }

  miniNavigator() {
    $("body").toggleClass("mini-navbar");
    if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
      $('#side-menu').hide();
      setTimeout(
        function () {
          $('#side-menu').fadeIn(500);
        }, 100);
    } else if ($('body').hasClass('fixed-sidebar')) {
      $('#side-menu').hide();
      setTimeout(() => {
        $('#side-menu').fadeIn(500);
      }, 300);
    } else {
      $('#side-menu').removeAttr('style');
    }
  }

  autoMinimize = () => {
    this.scaleMinimize();
    $(window).bind("load resize", this.scaleMinimize);
  };

  scaleMinimize = () => {
    if ($(window).width() < 769) {
      $('body').addClass('body-small')
    } else {
      $('body').removeClass('body-small')
    }
  };
}
