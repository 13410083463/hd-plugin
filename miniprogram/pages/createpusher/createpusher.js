var plugin = requirePlugin("myPlugin")
Page({
  data:{
   
  },
  onLoad: function() {
    plugin.api.fn().then((res)=>{
      console.log(res)
    }).catch((err)=>{
      console.log(err)
    })
  },
  onParentEvent(v){
    console.log(v)
  }
})