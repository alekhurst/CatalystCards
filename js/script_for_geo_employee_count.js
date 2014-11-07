var emeacount = 0;
var apaccount = 0;
var americascount = 0;
var indiacount = 0;
for(i=0;i<window.catalyst_objects.regions.length;i++) {
    switch(window.catalyst_objects.regions[i].geo) {
       case 'EMEA': emeacount+=catalyst_objects.regions[i].employees;break;
       case 'APAC': apaccount+=catalyst_objects.regions[i].employees;break;
       case 'INDIA': indiacount+=catalyst_objects.regions[i].employees;break;
       case 'AMERICAS': americascount+=catalyst_objects.regions[i].employees;break;    
	}
}
console.log(emeacount + ' ' + apaccount + ' ' + indiacount + ' ' + americascount)
