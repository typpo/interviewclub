define([], function() {
  var expert_util = {};

  expert_util.getImgUrl = function(expert) {
    var image = expert.get('image');
    var socialImage = expert.get('socialImage');
    return image ? image.url() : socialImage ? socialImage : ''
  };

  return expert_util;
});