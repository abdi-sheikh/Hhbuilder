//change age form field to numbers and make both age and relation required
/////////////////////////////
//DOM manipulation of form
/////////////////////////////
document.getElementsByName("age")[0].type = "number";
document.getElementsByName("age")[0].required = true;
document.getElementsByName('rel')[0].required = true;
document.getElementsByName("age")[0].className = 'clear field';
document.getElementsByName("rel")[0].className = 'clear field';
/////////////////////////////
//The is where we set up data
/////////////////////////////
//Each member info is stored in object Member
var Member = function(id,age,rel,smoker){
		this.id = id;
		this.age = age;
		this.rel = rel;
		this.smoker = smoker;
};

//each household info
var houseHold = function(id,fam){
	this.id = id;
	this.fam = fam;
}

//store all family members in family and a household in families
var data = {
		family: [],
        families:[]
        //houseHolds: []
}
//create a new member object and add to family array
var addMember = function(a,r,s){
		var newMember, ID;
		//ID should equal last ID + 1
		//Creat new ID
		if(data.family.length > 0){
			ID = data.family[data.family.length - 1].id + 1;
		}else {
			ID = 0;
		}

		newMember = new Member(ID,a,r,s);
        data.family.push(newMember);
        //console.log('family [in function]', data.family);
		return newMember;
}

var addFamily = function(fam){
		var newFam,ID;
		if(data.families.length > 0){
			ID = data.families[data.families.length - 1].id + 1;
		}else {
			ID = 0;
		}

        newFam = new houseHold(ID,fam);
        data.families.push(newFam);
        //console.log('families', ID);
        //data.family = [];
		return newFam;
}

//Store values from the input
var getInput = function(){
		return{
				age :  document.getElementsByName("age")[0].value,
				relation : document.getElementsByName('rel')[0].value,
				smoker : document.getElementsByName('smoker')[0].checked
		};
}

////////////////////////////////////////////////////
//Event clicks, whether it is add,delete, or submit
///////////////////////////////////////////////////

//on click of add logic from validate data and clear fields
document.querySelector('.add').addEventListener('click',function(event){
		event.preventDefault();
        validateData();
        document.getElementsByName("age")[0].value = null;
        document.getElementsByName("rel")[0].value = '---';
        document.getElementsByName("smoker")[0].checked = false;
        
});

//on delete remove family member and on submit
document.querySelector('.builder').addEventListener('click',function(event){

		deleteMember(event);
		submitFamily(event);

});

////////////////////////////////////////////////////
//Logic of events
///////////////////////////////////////////////////

//checks to see if relationship and age greater than 0 has been entered
var validateData = function(){
		var input,newinput;
        input = getInput();
		if(input.age > 0 && input.age !== "" && input.relation !== "---"){
             

            if(data.families.length <1 && data.family.length <1){
                newinput = addMember(input.age,input.relation,input.smoker);
                displayFamMember(newinput);
                addFamily(data.family);
            }else{
                newinput = addMember(input.age,input.relation,input.smoker);
                displayFamMember(newinput);
                //data.families.fam[id].push(newinput);
            }
            console.log('fam member',newinput);
            console.log('family', data.family);
            console.log('household',data.families);

		}else{
				alert('please enter in correct information');
        }
}


//add item to UI
var displayFamMember = function(obj){
		var html,newHtml,element;
		element = '.builder';
		//create html string with place holder text
		if(obj.smoker){
			var html = '<div class="fmember" id="member-%id%"><li class="fmember_rel">%rel%<button class="delete" style="margin-left: 10px; border-radius: 4px;">delete</button><ul><li class = "fmember_age">Age: %age%<li class = fmember_smoker>Smoker: Yes</ul></div>';
		}else{
			var html = '<div class="fmember" id="member-%id%"><li class="fmember_rel">%rel%<button class="delete" style="margin-left: 10px; border-radius: 4px;">delete</button><ul><li class = "fmember_age">Age: %age%<li class = fmember_smoker>Smoker: No</ul></div>';
		}

		//replace placeholder text with real data
		newHtml = html.replace('%id%', obj.id);
		newHtml = newHtml.replace('%rel%', obj.rel);
		newHtml = newHtml.replace('%age%', obj.age);

		//add real data to dom
		document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
}

//delete item from UI and data structure
var deleteMember = function(event){
	var itemID = event.target.parentNode.parentNode.id;
	if(itemID){
			//Get the id of family member you want to delete
			var splitID = itemID.split('-');
			ID = splitID[1];

			//find the index in the array of that member
			var index = data.family.findIndex(function(family){
					return family.id == ID;
			})

			//remove tht member from array
			data.family.splice(index,1);

			//delete from UI
			var deleted = document.getElementById("member-" + ID);
			deleted.remove();

	}
}

//submit event
var submitFamily = function(event){
	var submitBtn = event.target.innerText;

	if(submitBtn === 'submit' && data.family.length > 0){
        var list = document.querySelector('.fmember');
        //prevent refresh of page
        event.preventDefault();

		//serialize the families array into a json
		var jsResponse = JSON.stringify(data.families,undefined,1);



        //put json in html
        document.querySelector('.debug').innerHTML = jsResponse;

        //display json
        document.querySelector('.debug').style.display = 'list-item';

    }
    
}