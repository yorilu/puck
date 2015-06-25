/**
 * Created by anders on 15/6/15.
 */
define(['backbone', 'text!../templates/feedback.tpl.html', 'puck', 'modelFactory', 'utils'],
  function(backbone, tpl, puck, modelFactory, Util) {

    var addFeedbackModel = modelFactory.get("addFeedback");

    var view = backbone.View.extend({
      events: {
        'click .js_back': 'goBack',
        'click .js_submit': 'submit',
        'input #txt_content': 'change'
      },
      goBack: function() {
        puck.back();
      },
      change: function(e) {
        $dom = $(e.currentTarget);
        var $button = this.$el.find('.js_submit');
        this.$el.find('#js_count').html($dom.val().length);
        if ($.trim($dom.val()) != '' && !$button.hasClass('tink')) {
          $button.addClass('tink');
        } else if ($.trim($dom.val()) == '' && $button.hasClass('tink')) {
          $button.removeClass('tink');
        }
      },

      submit: function() {
        if (!this.validate()) {
          return;
        }
        if ($.trim($('#txt_content').val()) == 'SmartCourt_RD') {
          alert('隐藏场馆已开启');
          Util.Store.set('SMART_HIDE_MODE', true);
          puck.back();
          return;
        }
        addFeedbackModel.$post({
          data: {
            clientID: 'h5',
            mobileNumber: this.$el.find('#txt_mobile').val(),
            QQ: this.$el.find('#txt_qq').val(),
            content: $.trim($('#txt_content').val())
          },
          success: function(res) {
            if (res.code == 0) {
              alert('反馈提交成功');
              puck.back();
            }
          },
          error: function() {}
        });
      },

      validate: function() {
        if (!this.$el.find('.js_submit').hasClass('tink')) {
          return false;
        }
        if (!$.trim($('#txt_content').val())) {
          alert('反馈内容不能为空！');
          return false;
        }

        if ($.trim(this.$el.find('#txt_qq').val()) != '' && !/^[1-9]\d{4,}$/.test(this.$el.find('#txt_qq').val())) {
          alert('QQ号码格式不正确！');
          return false;
        }
        if ($.trim(this.$el.find('#txt_mobile').val()) != '' && !/^(1[1-9][0-9])\d{8}$/.test(this.$el.find('#txt_mobile').val())) {
          alert('手机号码不正确！');
          return false;
        }
        return true;
      },

      onInit: function() {

      },
      onShow: function() {
        this.$el.html(tpl);
      },
      onHide: function() {

      }
    });

    return view;
  });