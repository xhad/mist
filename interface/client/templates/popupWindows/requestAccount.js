/**
Template Controllers

@module Templates
*/

/**
The request account popup window template

@class [template] popupWindows_requestAccount
@constructor
*/

Template['popupWindows_requestAccount'].onRendered(function(){
    this.$('input.password').focus();
});


Template['popupWindows_requestAccount'].events({
   'click .cancel': function(){
        ipc.send('uiAction_closePopupWindow');
   },
   'submit form': function(e, template){
        e.preventDefault();
        var pw = template.find('input.password').value;
        var pwRepeat =  template.find('input.password-repeat').value;

        // ask for password repeat
        if(!pwRepeat) {
            TemplateVar.set('password-repeat', true);
            template.$('input.password-repeat').focus();

            // stop here so we dont set the password repeat to false
            return;

        // check passwords
        } else if(pwRepeat === pw) {

            TemplateVar.set('creating', true);
            web3.personal.newAccount(pwRepeat, function(e, res){
                if(!e)
                    ipc.send('uiAction_sendToOwner', null, res);
                else
                    ipc.send('uiAction_sendToOwner', e);

                TemplateVar.set(template, 'creating', false);
                ipc.send('uiAction_closePopupWindow');
            });
        
        } else {
            template.$('.password').focus();

            GlobalNotification.warning({
                content: TAPi18n.__('mist.popupWindows.requestAccount.errors.passwordMismatch'),
                duration: 3
            });
        }

        TemplateVar.set('password-repeat', false);
        template.find('input.password-repeat').value = '';
        template.find('input.password').value = '';
        pw = pwRepeat = null;
   } 
});
