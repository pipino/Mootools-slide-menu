var SlideMenu = new Class({

    //implements
    Implements: [Options, Events],
    
    //options
    options: {
        opacityBackground: 0.5,
        thumbRatio: 0.5,
        thumbMargin: 0,
        sideMargin: 20,
        topMargin: 40,
        reflectHeight: 0.3,
        reflectOpacity: 0.5,
        buttonBack: '',
        buttonForward: ''
    },
    
    //initialization
    initialize: function(list, options){
        this.testo = [];
        this.mediabox_data = [];
        this.list = $(list);
        this.current = 0;
        this.cont_width = this.list.getParent('div').getStyle('width');
        this.cont_ref = (Browser.Engine.trident) ? 'img[rel=refle]' : 'canvas';
				this.fx_options = {duration: 200, transition: Fx.Transitions.Quad.easeIn, link: 'chain'};
        //set options
        this.setOptions(options);
        
        this.lis = this.list.getChildren('li');
        this.lis.each(function(el, ind){
            el.getElement('img').reflect({
                height: this.options.reflectHeight,
                opacity: this.options.reflectOpacity
            });
            el.store('img_effect', new Fx.Morph(el.getElement('img.reflected'), this.fx_options));
            el.store('ref_effect', new Fx.Morph(el.getElement(this.cont_ref), this.fx_options));
            el.store('cont_ref_effect', new Fx.Morph(el.getElement('span'), this.fx_options));
            el.store('img_width', el.getElement('img').getStyle('width'));
            el.store('img_height', el.getElement('img').getStyle('height'));
            el.getElement('img.reflected').setStyles({
                'height': el.retrieve('img_height').toInt() * this.options.thumbRatio,
                'width': el.retrieve('img_width').toInt() * this.options.thumbRatio
            });
            el.getElement(this.cont_ref).setStyles({
                'height': el.retrieve('img_height').toInt() * this.options.thumbRatio * this.options.reflectHeight,
                'width': el.retrieve('img_width').toInt() * this.options.thumbRatio
            });
            el.getElement('span').setStyles({
                'height': el.retrieve('img_height').toInt() * this.options.thumbRatio * (1 + this.options.reflectHeight),
                'width': el.retrieve('img_width').toInt() * this.options.thumbRatio,
                'display': 'block',
                'opacity': this.options.opacityBackground,
                'margin-right': this.options.thumbMargin,
                'margin-left': this.options.thumbMargin
            });
            el.getElement('a').addEvent('click', this.testo[ind] = this.to_front.bindWithEvent(this, ind));
            this.mediabox_data[ind] = [el.getElement('a').get('href'), ($defined(el.getElement('a').get('title'))) ? el.getElement('a').get('title') : '', el.retrieve('img_width') + ' ' + el.retrieve('img_height')];
        }, this);
        
        this.list_margin = (this.cont_width.toInt() / 2) - (this.lis[0].retrieve('img_width').toInt() / 2) - this.options.sideMargin;
        this.list.setStyle('margin-left', this.list_margin);
        
        this.lis[0].retrieve('img_effect').set({
            'height': this.lis[0].retrieve('img_height'),
            'width': this.lis[0].retrieve('img_width')
        });
        
        this.lis[0].retrieve('ref_effect').set({
            'height': this.lis[0].retrieve('img_height').toInt() * this.options.reflectHeight,
            'width': this.lis[0].retrieve('img_width')
        });
        
        this.lis[0].retrieve('cont_ref_effect').set({
            'height': this.lis[0].retrieve('img_height').toInt() * (1 + this.options.reflectHeight),
            'width': this.lis[0].retrieve('img_width').toInt(),
            'margin-top': this.options.topMargin,
            'margin-right': this.options.sideMargin,
            'margin-left': this.options.sideMargin,
            'opacity': 1
        });
        
        this.lis[0].getElement('a').removeEvent('click', this.testo[0]);
        
        this.lis[0].getElement('a').addEvent('click', this.mediabox_function = this.open_mediabox.bindWithEvent(this, 0));
        
        this.list_tween = new Fx.Tween(this.list, this.fx_options);
        if ($(this.options.buttonBack)) {
            $(this.options.buttonBack).addEvent('click', function(e){
                new Event(e).stop();
                this.move('back');
            }.bind(this));
        }
        if ($(this.options.buttonForward)) {
            $(this.options.buttonForward).addEvent('click', function(e){
                new Event(e).stop();
                this.move('forward');
            }.bind(this));
        }
    },
    
    /** move the menu back or forward
     *
     * @param {string} where  ('back' or 'forward')
     */
    move: function(where){
        var can_move = false;
        if (where == 'back' && this.current > 0) {
            var previous = this.current;
            this.current--;
            this.list_margin += this.lis[this.current].retrieve('img_width').toInt() * this.options.thumbRatio + this.options.thumbMargin * 2 - (this.lis[this.current].retrieve('img_width').toInt() - this.lis[previous].retrieve('img_width').toInt()) / 2;
            can_move = true;
        }
        if (where == 'forward' && this.current < (this.lis.length - 1)) {
            var previous = this.current;
            this.current++;
            this.list_margin -= this.lis[previous].retrieve('img_width').toInt() * this.options.thumbRatio + this.options.thumbMargin * 2 + (this.lis[this.current].retrieve('img_width').toInt() - this.lis[previous].retrieve('img_width').toInt()) / 2;
            can_move = true;
        }
        if (can_move) {
            this.list_tween.start('margin-left', this.list_margin);
            
            this.lis[previous].retrieve('img_effect').start({
                'height': this.lis[previous].retrieve('img_height').toInt() * this.options.thumbRatio,
                'width': this.lis[previous].retrieve('img_width').toInt() * this.options.thumbRatio
            });
            
            this.lis[previous].retrieve('ref_effect').start({
                'height': this.lis[previous].retrieve('img_height').toInt() * this.options.thumbRatio * this.options.reflectHeight,
                'width': this.lis[previous].retrieve('img_width').toInt() * this.options.thumbRatio
            });
            
            this.lis[previous].retrieve('cont_ref_effect').start({
                'height': this.lis[previous].retrieve('img_height').toInt() * this.options.thumbRatio * (1 + this.options.reflectHeight),
                'width': this.lis[previous].retrieve('img_width').toInt() * this.options.thumbRatio,
                'margin-top': 0,
                'margin-right': this.options.thumbMargin,
                'margin-left': this.options.thumbMargin,
                'opacity': this.options.opacityBackground
            });
            
            this.lis[this.current].retrieve('img_effect').start({
                'height': this.lis[this.current].retrieve('img_height'),
                'width': this.lis[this.current].retrieve('img_width')
            });
            
            this.lis[this.current].retrieve('ref_effect').start({
                'height': this.lis[this.current].retrieve('img_height').toInt() * this.options.reflectHeight,
                'width': this.lis[this.current].retrieve('img_width')
            });
            
            this.lis[this.current].retrieve('cont_ref_effect').start({
                'height': this.lis[this.current].retrieve('img_height').toInt() * (1 + this.options.reflectHeight),
                'width': this.lis[this.current].retrieve('img_width').toInt(),
                'margin-top': this.options.topMargin,
                'margin-right': this.options.sideMargin,
                'margin-left': this.options.sideMargin,
                'opacity': 1
            });
						
						this.fireEvent('tofront', this.lis[this.current]);
						
            this.lis[this.current].getElement('a').removeEvent('click', this.testo[this.current]);
            this.lis[previous].getElement('a').addEvent('click', this.testo[previous] = this.to_front.bindWithEvent(this, previous));
            
            this.lis[previous].getElement('a').removeEvent('click', this.mediabox_function);
            this.lis[this.current].getElement('a').addEvent('click', this.mediabox_function = this.open_mediabox.bindWithEvent(this, this.current));
        }
    },
    /**
     * Send the clicked thumb to the front
     * @param {Object} e (the event)
     * @param {Object} clicked_ind (
     */
    to_front: function(e, clicked_ind){
        e.stop();
        var safe = 0;
        if (clicked_ind != this.current) {
            var where = (clicked_ind < this.current) ? 'back' : 'forward';
            (function(){
                this.move(where);
                this.to_front(e, clicked_ind);
            }.bind(this)).delay(200);
        }
    },
    /**
     * Open the target in a lightbox window
     * @param {Object} e (the event)
     * @param {Object} ind (photo index)
     */
    open_mediabox: function(e, ind){
        e.stop();
        Mediabox.open(this.mediabox_data, ind);
    }
});

