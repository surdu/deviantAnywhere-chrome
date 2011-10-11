$(document).ready(function(){
	$(document).contextPopup({
	  title: null,
	  items: [
	    {label:'Go to messages', bold: true, icon:null, action:function() { alert('hi'); }},
	    {label:'Check now', icon:null, action:function() { alert('yo'); }},
	    null,
	    {label:'Settings...', icon:null, action:function() { alert('bye'); }},
	    null,
	    {label:'Donate...', icon:null, action:function() { alert('bye'); }},
	    {label:'About...', icon:null, action:function() { alert('bye'); }},
	  ]
	});
});
