/** 
 * Name:    Highslide JS
 * Version: 4.1.12 (2011-03-28)
 * Config:  default +slideshow +positioning +transitions +viewport +thumbstrip
 * Author:  Torstein Hønsi
 * Support: www.highslide.com/support
 * License: www.highslide.com/#license
 */
hs.graphicsDir = '/highslide/highslide/graphics/';
hs.align = 'center';
hs.transitions = ['expand', 'crossfade'];
hs.fadeInOut = true;
hs.outlineType = 'glossy-dark';
hs.wrapperClassName = 'dark';
hs.captionEval = 'this.a.title';
hs.numberPosition = 'caption';
hs.useBox = true;
hs.width = 600;
hs.height = 400;
//hs.dimmingOpacity = 0.8;

// Add the slideshow providing the controlbar and the thumbstrip
hs.addSlideshow({
	//slideshowGroup: 'group1',
	interval: 5000,
	repeat: false,
	useControls: true,
	fixedControls: 'fit',
	overlayOptions: {
		position: 'bottom center',
		opacity: 0.75,
		hideOnMouseOut: true
	},
	thumbstrip: {
		position: 'above',
		mode: 'horizontal',
		relativeTo: 'expander'
	}
});

// Make all images animate to the one visible thumbnail
var miniGalleryOptions1 = {
      thumbnailId: 'thumb1', slideshowGroup: 'group1'
   }
var miniGalleryOptions2 = {
      thumbnailId: 'thumb2', slideshowGroup: 'group2'
   }
var miniGalleryOptions3 = {
      thumbnailId: 'thumb3', slideshowGroup: 'group3'
   }
var miniGalleryOptions4 = {
      thumbnailId: 'thumb4', slideshowGroup: 'group4'
   }
var miniGalleryOptions5 = {
      thumbnailId: 'thumb5', slideshowGroup: 'group5'
   }
var miniGalleryOptions6 = {
      thumbnailId: 'thumb6', slideshowGroup: 'group6'
   }
var miniGalleryOptions7 = {
      thumbnailId: 'thumb7', slideshowGroup: 'group7'
   }
var miniGalleryOptions8 = {
      thumbnailId: 'thumb8', slideshowGroup: 'group8'
   }
var miniGalleryOptions9 = {
      thumbnailId: 'thumb9', slideshowGroup: 'group9'
   }
var miniGalleryOptions10 = {
      thumbnailId: 'thumb10', slideshowGroup: 'group10'
   }
var miniGalleryOptions11 = {
      thumbnailId: 'thumb11', slideshowGroup: 'group11'
   }
var miniGalleryOptions12 = {
      thumbnailId: 'thumb12', slideshowGroup: 'group12'
   }
var miniGalleryOptions13 = {
      thumbnailId: 'thumb13', slideshowGroup: 'group13'
   }
var miniGalleryOptions14 = {
      thumbnailId: 'thumb14', slideshowGroup: 'group14'
   }
var miniGalleryOptions15 = {
      thumbnailId: 'thumb15', slideshowGroup: 'group15'
   }

